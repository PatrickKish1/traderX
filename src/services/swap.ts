// import { getAgentInstance } from '@/lib/agentkit/config';
// import { SwapParams, SwapResult } from '@/lib/agentkit/types';

// const agent = getAgentInstance();

// export class SwapService {
//   static async getSwapQuote(params: Omit<SwapParams, 'walletAddress'>): Promise<{
//     expectedAmount: string;
//     minAmount: string;
//     priceImpact: string;
//   }> {
//     const quote = await agent.actions.getSwapQuote({
//       fromToken: params.fromToken,
//       toToken: params.toToken,
//       amount: params.amount,
//       slippage: params.slippage || '0.5',
//     });

//     return {
//       expectedAmount: quote.expectedAmount,
//       minAmount: quote.minAmount,
//       priceImpact: quote.priceImpact,
//     };
//   }

//   static async executeSwap(params: SwapParams): Promise<SwapResult> {
//     const result = await agent.actions.swapTokens({
//       fromToken: params.fromToken,
//       toToken: params.toToken,
//       amount: params.amount,
//       slippage: params.slippage || '0.5',
//       walletAddress: params.walletAddress,
//     });

//     return {
//       txHash: result.txHash,
//       expectedAmount: result.expectedAmount,
//       minAmount: result.minAmount,
//       gasUsed: result.gasUsed,
//     };
//   }
// }