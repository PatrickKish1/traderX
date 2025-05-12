import { getAgentInstance } from '@/lib/agentkit/config';
import { SwapParams, SwapResult } from '@/lib/agentkit/types';
import { AgentKit } from '@coinbase/agentkit';

let agentInstance: AgentKit;

const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await getAgentInstance();
  }
  return agentInstance;
};

export class SwapService {
  static async getSwapQuote(params: Omit<SwapParams, 'walletAddress'>): Promise<{
    expectedAmount: string;
    minAmount: string;
    priceImpact: string;
  }> {
    const agent = await getAgent();
    const actions = agent.getActions();
    const swapQuoteAction = actions.find(a => a.name === 'getSwapQuote');
    if (!swapQuoteAction) throw new Error('Swap quote action not found');
    
    const quote = await swapQuoteAction.invoke({
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
      slippage: params.slippage || '0.5',
    });

    return JSON.parse(quote);
  }

  static async executeSwap(params: SwapParams): Promise<SwapResult> {
    const agent = await getAgent();
    const actions = agent.getActions();
    const swapAction = actions.find(a => a.name === 'swapTokens');
    if (!swapAction) throw new Error('Swap action not found');

    const result = await swapAction.invoke({
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
      slippage: params.slippage || '0.5',
      walletAddress: params.walletAddress,
    });

    return JSON.parse(result);
  }
}