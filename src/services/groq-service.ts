/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatGroq } from "@langchain/groq";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
  Annotation,
} from "@langchain/langgraph";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { v4 as uuidv4 } from 'uuid';
import polygonService from "./polygon-service";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TradeSignal {
  type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
  token: string;
  amount: string;
  lotSize: number;
  price?: string;
  takeProfitPrice?: string;
  stopLossPrice?: string;
  pair: string;
}

export interface RunnableConfig {
  configurable: {
    thread_id: string;
  };
}

// export interface MemorySaver {
//   get(threadId: string): Promise<any>;
//   removeCheckpoint(threadId: string): Promise<void>;
//   // Add other methods as needed
// }

class GroqService {
  private llm: ChatGroq;
  private memorySaver: MemorySaver;
  private app: any;
  private basePrompt: any;
  private technicalPrompt: any;
  private GraphAnnotation: any;
  private workflow: any;

  constructor() {
    this.llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      maxTokens: 2048,
      apiKey: process.env.GROQ_API_KEY,
    });

    this.memorySaver = new MemorySaver();
    this.initializePrompts();
    this.initializeGraph();
  }

  private initializePrompts() {
    // Base system prompt
    this.basePrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are a professional financial analyst and trading assistant helping users manage their trading portfolio. 
        They understand it is inherently risky to trade cryptocurrency, and they want to make sure they are making informed decisions. 
        Think carefully through all scenarios and please provide your best guidance and reasoning for this decision.
        Use the provided market data to offer insights and analysis.
        Market Data: {marketData}`
      ),
      new MessagesPlaceholder("messages"),
    ]);

    // Technical analysis prompt
    this.technicalPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are analyzing technical market data for {symbol}.
         Use this data to provide technical analysis:
         {marketData}
         
         Focus on:
         1. Price action and trends
         2. Support/resistance levels
         3. Volume analysis
         4. Technical indicators
         5. Risk assessment
        `
      ),
      new MessagesPlaceholder("messages"),
    ]);
  }

  private initializeGraph() {
    // Define state annotation
    this.GraphAnnotation = Annotation.Root({
      ...MessagesAnnotation.spec,
      marketData: Annotation(),
      symbol: Annotation(),
      analysisType: Annotation()
    });

    // Define model call function
    const callModel = async (state: any) => {
      try {
        const prompt = this.selectPrompt(state.analysisType);
        const chain = prompt.pipe(this.llm);
        
        const response = await chain.invoke({
          messages: state.messages,
          marketData: state.marketData,
          symbol: state.symbol || "the asset"
        });

        return { messages: [response] };
      } catch (error) {
        console.error('Error in model call:', error);
        throw error;
      }
    };

    // Create workflow
    this.workflow = new StateGraph(this.GraphAnnotation)
      .addNode("model", callModel)
      .addEdge(START, "model")
      .addEdge("model", END);

    // Compile application with memory
    this.app = this.workflow.compile({ checkpointer: this.memorySaver });
  }

  private selectPrompt(analysisType: string) {
    switch (analysisType?.toLowerCase()) {
      case 'technical':
        return this.technicalPrompt;
      default:
        return this.basePrompt;
    }
  }

  private extractQueryDetails(message: string) {
    // Extract symbols
    const symbolPattern = /\((X|S|C):([^)]+)\)/g;
    const symbols = [...message.matchAll(symbolPattern)].map(match => ({
        type: match[1],
        symbol: match[2],
        marketType: this.getMarketType(match[1])
    }));

    // Extract date - look for common date formats
    const datePattern = /\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b/;
    const dateMatch = message.match(datePattern);
    const date = dateMatch ? dateMatch[0] : null;

    return {
        symbols,
        date
    };
  }

  private getMarketType(prefix: string): string {
    const types: Record<string, string> = {
      'X': 'crypto',
      'S': 'stocks',
      'C': 'forex'
    };
    return types[prefix] || 'unknown';
  }

  private formatMarketData(data: any): string {
    if (!data) {
      return "No market data available";
    }

    return `Current Price: $${data.currentPrice}
            Open: $${data.open}
            High: $${data.high}
            Low: $${data.low}
            Close: $${data.close}
            Volume: ${data.volume}
            Timestamp: ${data.timestamp}`;
  }

  private async fetchMarketData(symbols: Array<{symbol: string, marketType: string}>, date: string | null = null) {
    try {
        const marketData = await Promise.all(
            symbols.map(async ({ symbol, marketType }) => {
                let data;
                if (date) {
                    data = await polygonService.getDayData(symbol, marketType, date);
                } else {
                    data = await polygonService.getCurrentData(symbol, marketType);
                }
                return {
                    symbol,
                    marketType,
                    data
                };
            })
        );
        return marketData;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
  }

  private determineAnalysisType(message: string): string {
    const messageLower = message.toLowerCase();
    if (messageLower.includes('technical') || 
        messageLower.includes('chart') || 
        messageLower.includes('indicator')) {
      return 'technical';
    }
    return 'general';
  }

  public async chatWithAssistant(message: string, threadId: string | null = null) {
    try {
      // Extract symbols from message
      const {symbols, date} = this.extractQueryDetails(message);
      
      // If no symbols found, process as general query
      if (symbols.length === 0) {
        return this.processGeneralQuery(message, threadId);
      }

      // Fetch market data for all symbols
      const marketData = await this.fetchMarketData(symbols, date);
      const formattedMarketData = marketData.map(m => ({
        symbol: m.symbol,
        data: this.formatMarketData(m.data)
      }));

      // Determine analysis type from message
      const analysisType = this.determineAnalysisType(message);

      // Prepare input state
      const input = {
        messages: [{ role: 'user', content: message }],
        marketData: JSON.stringify(formattedMarketData),
        symbol: symbols[0].symbol,
        analysisType
      };

      // Generate config with thread ID
      const config = {
        configurable: {
          thread_id: threadId || uuidv4()
        }
      };

      // Get response from model
      const response = await this.app.invoke(input, config);

      return {
        response: response.messages[response.messages.length - 1],
        marketData: formattedMarketData,
        threadId: config.configurable.thread_id,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }

  private async processGeneralQuery(message: string, threadId: string | null) {
    const input = {
      messages: [{ role: 'user', content: message }],
      marketData: "No specific market data requested",
      symbol: "general",
      analysisType: 'general'
    };

    const config = {
      configurable: {
        thread_id: threadId || uuidv4()
      }
    };

    const response = await this.app.invoke(input, config);

    return {
      response: response.messages[response.messages.length - 1],
      marketData: null,
      threadId: config.configurable.thread_id,
      timestamp: new Date().toISOString()
    };
  }

  public async getConversationHistory(threadId: string): Promise<RunnableConfig> {
    try {
      return {
        configurable: {
          thread_id: threadId
        }
      };
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  // public async clearConversationHistory(threadId: string) {
  //   try {
  //     await this.memorySaver.delete(threadId);
  //     return { success: true, message: 'Conversation history cleared' };
  //   } catch (error) {
  //     console.error('Error clearing conversation history:', error);
  //     throw error;
  //   }
  // }
}

// Create singleton instance
const groqService = new GroqService();
export default groqService;