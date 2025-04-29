'use client';
import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, CryptoData, PredictionResult } from '@/lib/types/crypto';
import { sendChatMessage, getPricePrediction, executeTrade } from '@/lib/apiUtls';
interface ChatAssistantProps {
  onClose: () => void;
  cryptoData: CryptoData[];
  selectedCrypto: CryptoData;
}
const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  onClose, 
  cryptoData,
//   selectedCrypto 
}) => {
  const { address, isConnected } = useAccount();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: `Hello! I'm your crypto assistant. I can help you with market information, news, price predictions, and even execute trades for you. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showTradeConfirmation, setShowTradeConfirmation] = useState<boolean>(false);
  const [tradeDetails, setTradeDetails] = useState<{
    type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
    token: string;
    amount: string;
    lotSize: number;
    price?: string;
    takeProfitPrice?: string;
    stopLossPrice?: string;
    pair: string;
  } | null>(null);
  
  // Track AI signal performance
  const [aiSignals, setAiSignals] = useState<{
    id: string;
    token: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    targetPrice: number;
    stopPrice: number;
    timestamp: Date;
    status: 'active' | 'completed' | 'stopped';
    roi?: number;
  }[]>([]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Check for prediction requests
      if (input.toLowerCase().includes('predict') || input.toLowerCase().includes('forecast')) {
        await handlePredictionRequest(input);
      } 
      // Check for trade requests
      else if (
        (input.toLowerCase().includes('buy') || input.toLowerCase().includes('sell')) && 
        (
          input.toLowerCase().includes('bitcoin') || input.toLowerCase().includes('btc') || 
          input.toLowerCase().includes('ethereum') || input.toLowerCase().includes('eth') ||
          input.toLowerCase().includes('solana') || input.toLowerCase().includes('sol')
        )
      ) {
        await handleTradeRequest(input);
      } 
      // Check for AI signal requests
      else if (input.toLowerCase().includes('signal') || input.toLowerCase().includes('recommendation')) {
        await handleSignalRequest(input);
      }
      // Check for signal performance request
      else if (input.toLowerCase().includes('performance') || input.toLowerCase().includes('roi')) {
        await handlePerformanceRequest();
      }
      // Regular chat message
      else {
        const response = await sendChatMessage(input);
        
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  const handlePredictionRequest = async (message: string) => {
    // Extract the cryptocurrency from the message
    let token = 'BTC'; // Default to Bitcoin
    
    if (message.toLowerCase().includes('ethereum') || message.toLowerCase().includes('eth')) {
      token = 'ETH';
    } else if (message.toLowerCase().includes('solana') || message.toLowerCase().includes('sol')) {
      token = 'SOL';
    } else if (message.toLowerCase().includes('cardano') || message.toLowerCase().includes('ada')) {
      token = 'ADA';
    }
    
    // Extract the timeframe from the message
    let timeframe = '24h'; // Default to 24 hours
    
    if (message.toLowerCase().includes('week') || message.toLowerCase().includes('7 day')) {
      timeframe = '7d';
    } else if (message.toLowerCase().includes('month') || message.toLowerCase().includes('30 day')) {
      timeframe = '30d';
    }
    
    try {
      // Get the prediction
      const predictionResult = await getPricePrediction(token, timeframe);
      setPrediction(predictionResult);
      
      // Format the prediction message
      const direction = predictionResult.predictedPrice > predictionResult.currentPrice ? 'increase' : 'decrease';
      const percentChange = Math.abs(
        ((predictionResult.predictedPrice - predictionResult.currentPrice) / predictionResult.currentPrice) * 100
      ).toFixed(2);
      
      const predictionMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Based on my analysis, I predict that ${predictionResult.token} will ${direction} by approximately ${percentChange}% in the next ${predictionResult.timeframe}. The current price is $${predictionResult.currentPrice.toLocaleString()} and I predict it will reach $${predictionResult.predictedPrice.toLocaleString()}.\n\nConfidence level: ${predictionResult.confidence.toFixed(2)}%\n\nReasoning: ${predictionResult.reasoning}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, predictionMessage]);
    } catch (error) {
      console.error('Error getting prediction:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error generating a price prediction. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  const handleTradeRequest = async (message: string) => {
    // Check if wallet is connected
    if (!isConnected || !address) {
      const walletMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'To execute trades, you need to connect your wallet first. Please connect your wallet using the button in the top right corner.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, walletMessage]);
      return;
    }
    
    // Determine if it's a buy or sell request
    const isBuy = message.toLowerCase().includes('buy');
    const side: 'BUY' | 'SELL' = isBuy ? 'BUY' : 'SELL';
    
    // Determine order type
    let orderType: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
    
    if (message.toLowerCase().includes('limit')) {
      orderType = isBuy ? 'BUY_LIMIT' : 'SELL_LIMIT';
    } else if (message.toLowerCase().includes('stop')) {
      orderType = isBuy ? 'BUY_STOP' : 'SELL_STOP';
    } else {
      orderType = isBuy ? 'BUY' : 'SELL';
    }
    
    // Extract the cryptocurrency from the message
    let token = 'BTC'; // Default to Bitcoin
    
    if (message.toLowerCase().includes('ethereum') || message.toLowerCase().includes('eth')) {
      token = 'ETH';
    } else if (message.toLowerCase().includes('solana') || message.toLowerCase().includes('sol')) {
      token = 'SOL';
    } else if (message.toLowerCase().includes('cardano') || message.toLowerCase().includes('ada')) {
      token = 'ADA';
    }
    
    // Extract the amount from the message using regex
    const amountRegex = /(\d+(\.\d+)?)/;
    const amountMatch = message.match(amountRegex);
    const amount = amountMatch ? amountMatch[0] : '0.1'; // Default to 0.1 if no amount specified
    
    // Extract lot size from message
    let lotSize = 1;
    if (message.toLowerCase().includes('lot') || message.toLowerCase().includes('size')) {
      const lotRegex = /lot\s*(?:size)?\s*(\d+)/i;
      const lotMatch = message.match(lotRegex);
      if (lotMatch && lotMatch[1]) {
        lotSize = parseInt(lotMatch[1]);
      }
    }
    
    // Extract price for limit/stop orders
    let price: string | undefined;
    if (orderType.includes('LIMIT') || orderType.includes('STOP')) {
      const priceRegex = /at\s+(\d+(\.\d+)?)/i;
      const priceMatch = message.match(priceRegex);
      price = priceMatch ? priceMatch[1] : undefined;
      
      if (!price) {
        // If no price specified for limit/stop order, ask for price
        const priceRequestMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: `For a ${orderType.toLowerCase().replace('_', ' ')} order, I need to know the price. At what price would you like to ${side.toLowerCase()} ${amount} ${token}?`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, priceRequestMessage]);
        return;
      }
    }
    
    // Extract take profit and stop loss
    let takeProfitPrice: string | undefined;
    let stopLossPrice: string | undefined;
    
    if (message.toLowerCase().includes('take profit') || message.toLowerCase().includes('tp')) {
      const tpRegex = /(?:take profit|tp)\s+(?:at)?\s*(\d+(\.\d+)?)/i;
      const tpMatch = message.match(tpRegex);
      takeProfitPrice = tpMatch ? tpMatch[1] : undefined;
    }
    
    if (message.toLowerCase().includes('stop loss') || message.toLowerCase().includes('sl')) {
      const slRegex = /(?:stop loss|sl)\s+(?:at)?\s*(\d+(\.\d+)?)/i;
      const slMatch = message.match(slRegex);
      stopLossPrice = slMatch ? slMatch[1] : undefined;
    }
    
    // Determine trading pair
    let pair = `${token}/USDC`;
    if (message.toLowerCase().includes('btc pair') || message.toLowerCase().includes('bitcoin pair')) {
      pair = `${token}/BTC`;
    }
    
    // Store the trade details
    setTradeDetails({
      type: orderType,
      token,
      amount,
      lotSize,
      price,
      takeProfitPrice,
      stopLossPrice,
      pair
    });
    
    // Show the trade confirmation dialog
    setShowTradeConfirmation(true);
    
    // Add a message asking for confirmation
    const confirmationMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: `I'll help you ${orderType.replace('_', ' ')} ${amount} ${token} ${
        orderType.includes('LIMIT') || orderType.includes('STOP') 
          ? `at a price of $${price}` 
          : 'at market price'
      }${lotSize > 1 ? ` with lot size ${lotSize}` : ''}${
        takeProfitPrice ? ` with take profit at $${takeProfitPrice}` : ''
      }${
        stopLossPrice ? ` and stop loss at $${stopLossPrice}` : ''
      }. Please confirm this trade by clicking the "Confirm" button below, or cancel if you've changed your mind.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };
  const handleSignalRequest = async (message: string) => {
    // Extract the cryptocurrency from the message
    let token = 'BTC'; // Default to Bitcoin
    
    if (message.toLowerCase().includes('ethereum') || message.toLowerCase().includes('eth')) {
      token = 'ETH';
    } else if (message.toLowerCase().includes('solana') || message.toLowerCase().includes('sol')) {
      token = 'SOL';
    } else if (message.toLowerCase().includes('cardano') || message.toLowerCase().includes('ada')) {
      token = 'ADA';
    }
    
    // Get the current price for the token
    const tokenData = cryptoData.find(crypto => crypto.symbol.toUpperCase() === token.toUpperCase());
    if (!tokenData) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Sorry, I couldn't find price data for ${token}. Please try another cryptocurrency.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    const currentPrice = tokenData.current_price;
    
    // Randomly generate a BUY or SELL signal
    const signalType: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';
    
    // Generate target and stop prices based on signal type
    let targetPrice: number;
    let stopPrice: number;
    
    if (signalType === 'BUY') {
      // For BUY, target is higher than current price
      targetPrice = currentPrice * (1 + (Math.random() * 0.15 + 0.05)); // 5-20% higher
      stopPrice = currentPrice * (1 - (Math.random() * 0.05 + 0.02)); // 2-7% lower
    } else {
      // For SELL, target is lower than current price
      targetPrice = currentPrice * (1 - (Math.random() * 0.15 + 0.05)); // 5-20% lower
      stopPrice = currentPrice * (1 + (Math.random() * 0.05 + 0.02)); // 2-7% higher
    }
    
    // Calculate potential ROI
    const potentialRoi = signalType === 'BUY' 
      ? ((targetPrice - currentPrice) / currentPrice) * 100
      : ((currentPrice - targetPrice) / currentPrice) * 100;
    
    // Generate signal ID
    const signalId = uuidv4();
    
    // Add signal to tracking list
    setAiSignals(prev => [
      ...prev,
      {
        id: signalId,
        token,
        type: signalType,
        entryPrice: currentPrice,
        targetPrice,
        stopPrice,
        timestamp: new Date(),
        status: 'active'
      }
    ]);
    
    // Generate technical analysis reasoning
    let technicalAnalysis = '';
    if (signalType === 'BUY') {
      technicalAnalysis = `
• RSI(14): 32.5 - Oversold conditions indicating potential reversal
• MACD: Bullish crossover forming
• Moving Averages: Price approaching 50-day MA support
• Volume: Increasing on recent price action
• Bollinger Bands: Price near lower band suggesting oversold conditions
• Support/Resistance: Strong support level at $${(currentPrice * 0.95).toFixed(2)}`;
    } else {
      technicalAnalysis = `
• RSI(14): 72.8 - Overbought conditions indicating potential reversal
• MACD: Bearish divergence forming
• Moving Averages: Price breaking below 20-day MA
• Volume: Decreasing on recent rally
• Bollinger Bands: Price near upper band suggesting overbought conditions
• Support/Resistance: Strong resistance level at $${(currentPrice * 1.05).toFixed(2)}`;
    }
    
    // Create signal message
    const signalMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: `
## 🔔 AI Signal for ${token} - ${signalType}
**Current Price:** $${currentPrice.toLocaleString()}
**Signal Type:** ${signalType}
**Entry Zone:** $${(currentPrice * 0.99).toFixed(2)} - $${(currentPrice * 1.01).toFixed(2)}
**Target Price:** $${targetPrice.toFixed(2)} (${potentialRoi.toFixed(2)}% ROI)
**Stop Loss:** $${stopPrice.toFixed(2)} (${((Math.abs(stopPrice - currentPrice) / currentPrice) * 100).toFixed(2)}% risk)
**Risk/Reward Ratio:** 1:${(potentialRoi / ((Math.abs(stopPrice - currentPrice) / currentPrice) * 100)).toFixed(1)}
### Technical Analysis:
${technicalAnalysis}
### Market Context:
${token} is showing ${signalType === 'BUY' ? 'bullish' : 'bearish'} momentum based on multiple indicators. The ${signalType === 'BUY' ? 'support' : 'resistance'} level at $${signalType === 'BUY' ? (currentPrice * 0.95).toFixed(2) : (currentPrice * 1.05).toFixed(2)} is ${signalType === 'BUY' ? 'holding strong' : 'being tested'}, and volume patterns suggest a potential ${signalType === 'BUY' ? 'upward' : 'downward'} movement.
Would you like me to set up this trade for you?
`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, signalMessage]);
  };
  const handlePerformanceRequest = async () => {
    // If no signals, return message
    if (aiSignals.length === 0) {
      const noSignalsMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'You haven\'t received any AI trading signals yet. Ask me for a signal recommendation for a specific cryptocurrency to get started!',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, noSignalsMessage]);
      return;
    }
    
    // Update signal performance with current prices
    const updatedSignals = [...aiSignals];
    let totalRoi = 0;
    let winCount = 0;
    let lossCount = 0;
    
    for (let i = 0; i < updatedSignals.length; i++) {
      const signal = updatedSignals[i];
      
      // Find current price for the token
      const tokenData = cryptoData.find(crypto => crypto.symbol.toUpperCase() === signal.token.toUpperCase());
      if (!tokenData) continue;
      
      const currentPrice = tokenData.current_price;
      
      // Calculate ROI based on signal type
      let roi = 0;
      if (signal.type === 'BUY') {
        roi = ((currentPrice - signal.entryPrice) / signal.entryPrice) * 100;
      } else {
        roi = ((signal.entryPrice - currentPrice) / signal.entryPrice) * 100;
      }
      
      // Update signal status if target or stop hit
      let status = signal.status;
      if (status === 'active') {
        if (signal.type === 'BUY') {
          if (currentPrice >= signal.targetPrice) {
            status = 'completed';
            roi = ((signal.targetPrice - signal.entryPrice) / signal.entryPrice) * 100;
            winCount++;
          } else if (currentPrice <= signal.stopPrice) {
            status = 'stopped';
            roi = ((signal.stopPrice - signal.entryPrice) / signal.entryPrice) * 100;
            lossCount++;
          }
        } else {
          if (currentPrice <= signal.targetPrice) {
            status = 'completed';
            roi = ((signal.entryPrice - signal.targetPrice) / signal.entryPrice) * 100;
            winCount++;
          } else if (currentPrice >= signal.stopPrice) {
            status = 'stopped';
            roi = ((signal.entryPrice - signal.stopPrice) / signal.entryPrice) * 100;
            lossCount++;
          }
        }
      }
      
      // Update signal
      updatedSignals[i] = {
        ...signal,
        status,
        roi
      };
      
      // Add to total ROI
      totalRoi += roi;
    }
    
    // Update signals state
    setAiSignals(updatedSignals);
    
    // Calculate win rate
    const winRate = updatedSignals.length > 0 
      ? (winCount / (winCount + lossCount)) * 100 
      : 0;
    
    // Create performance message
    let performanceContent = `
## 📊 AI Signal Performance
**Total Signals:** ${updatedSignals.length}
**Completed:** ${winCount}
**Stopped Out:** ${lossCount}
**Active:** ${updatedSignals.length - winCount - lossCount}
**Win Rate:** ${winRate.toFixed(1)}%
**Total ROI:** ${totalRoi.toFixed(2)}%
### Signal Details:
`;
    
    // Add details for each signal
    updatedSignals.forEach(signal => {
      const statusEmoji = signal.status === 'completed' ? '✅' : signal.status === 'stopped' ? '❌' : '⏳';
      const roiFormatted = signal.roi ? signal.roi.toFixed(2) + '%' : 'N/A';
      
      performanceContent += `
${statusEmoji} **${signal.token} ${signal.type}** (${new Date(signal.timestamp).toLocaleDateString()})
   Entry: $${signal.entryPrice.toFixed(2)} | Target: $${signal.targetPrice.toFixed(2)} | Stop: $${signal.stopPrice.toFixed(2)}
   Status: ${signal.status.charAt(0).toUpperCase() + signal.status.slice(1)} | ROI: ${roiFormatted}
`;
    });
    
    const performanceMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: performanceContent,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, performanceMessage]);
  };
  const confirmTrade = async () => {
    if (!tradeDetails || !address) return;
    
    setShowTradeConfirmation(false);
    setIsTyping(true);
    
    try {
      // Extract base token and quote token from pair
      const [baseToken, quoteToken] = tradeDetails.pair.split('/');
      
      // Map complex order types to basic BUY/SELL - explicitly casting to the literal type
      const baseType: 'BUY' | 'SELL' = tradeDetails.type.includes('BUY') ? 'BUY' : 'SELL';
      
      const tradeRequest = {
        type: baseType,
        token: baseToken,
        token_amount: tradeDetails.amount,
        pair_token: quoteToken,
        slippage_bips: 50,
        blockchain: 'BASE',
        user_address: address,
        order_type: (tradeDetails.type.includes('LIMIT') ? 'LIMIT' : 
                   tradeDetails.type.includes('STOP') ? 'STOP' : 'MARKET') as 'LIMIT' | 'STOP' | 'MARKET',
        price: tradeDetails.price,
        take_profit: tradeDetails.takeProfitPrice,
        stop_loss: tradeDetails.stopLossPrice,
        lot_size: tradeDetails.lotSize
      };
      
      const result = await executeTrade(tradeRequest);
      
      // Add a success message
      const successMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `✅ Trade executed successfully!\n\nDetails:\n- ${tradeDetails.type.replace('_', ' ')} ${tradeDetails.amount} ${baseToken}\n- Pair: ${tradeDetails.pair}\n- Order Type: ${tradeDetails.type.includes('MARKET') ? 'MARKET' : 'LIMIT'}\n${tradeDetails.price ? `- Price: $${tradeDetails.price}\n` : ''}- Total: ${result.outputAmount} ${quoteToken}\n- Fee: ${result.fee} ${quoteToken}\n${tradeDetails.takeProfitPrice ? `- Take Profit: $${tradeDetails.takeProfitPrice}\n` : ''}${tradeDetails.stopLossPrice ? `- Stop Loss: $${tradeDetails.stopLossPrice}\n` : ''}${tradeDetails.lotSize > 1 ? `- Lot Size: ${tradeDetails.lotSize}x\n` : ''}\nYour trade will be processed shortly.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      console.error('Error executing trade:', error);
      
      // Add an error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error executing your trade. Please try again later or use the trading interface.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setTradeDetails(null);
    }
  };
  const cancelTrade = () => {
    setShowTradeConfirmation(false);
    setTradeDetails(null);
    
    // Add a cancellation message
    const cancellationMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: 'Trade cancelled. Is there anything else I can help you with?',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, cancellationMessage]);
  };
  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-[600px] bg-gray-800 rounded-t-lg shadow-lg flex flex-col z-50">
      <div className="bg-gray-700 p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-bold">Crypto AI Assistant</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <div className="whitespace-pre-wrap markdown">
                {message.content}
              </div>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-4 text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-700 text-white">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {showTradeConfirmation && tradeDetails && (
        <div className="p-4 bg-gray-700 border-t border-gray-600">
          <h4 className="font-bold mb-2">Confirm Trade</h4>
          <p>
            {tradeDetails.type.replace('_', ' ')} {tradeDetails.amount} {tradeDetails.token} 
            {tradeDetails.type.includes('LIMIT') || tradeDetails.type.includes('STOP')
              ? ` at price $${tradeDetails.price}` 
              : ` at market price (~$${
                  (cryptoData.find(c => c.symbol.toLowerCase() === tradeDetails.token.toLowerCase())?.current_price || 0).toFixed(2)
                })`
            }
            {tradeDetails.lotSize > 1 ? ` with lot size ${tradeDetails.lotSize}x` : ''}
          </p>
          {tradeDetails.takeProfitPrice && `TP: $${tradeDetails.takeProfitPrice}`}
          {tradeDetails.takeProfitPrice && tradeDetails.stopLossPrice && ' | '}
          {tradeDetails.stopLossPrice && `SL: $${tradeDetails.stopLossPrice}`}
          <p className="mt-1 text-sm text-gray-300">
            Total: ~${(parseFloat(tradeDetails.amount) * tradeDetails.lotSize * 
              (cryptoData.find(c => c.symbol.toLowerCase() === tradeDetails.token.toLowerCase())?.current_price || 0)
            ).toFixed(2)} USDC
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={confirmTrade}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Confirm
            </button>
            <button
              onClick={cancelTrade}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crypto markets, news, or predictions..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
            disabled={isTyping || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          {`Try: "Give me a signal for ETH" or "Buy 0.1 BTC with TP at 70000 and SL at 60000" or "Show me signal performance"`}
        </div>
      </form>
    </div>
  );
};
export default ChatAssistant;