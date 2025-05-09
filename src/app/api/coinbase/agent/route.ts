import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}



// import { NextRequest, NextResponse } from 'next/server';
// import { WalletService, BalanceService, SwapService } from '@/services';
// import { parseAgentRequest } from '@/lib/agentkit/utils';
// import { getAgentInstance } from '@/lib/agentkit/config';

// export const runtime = 'edge';

// export async function POST(request: NextRequest) {
//   try {
//     const { message, walletAddress, action } = await parseAgentRequest(request);
//     const agent = getAgentInstance();

//     if (!walletAddress) {
//       return NextResponse.json(
//         { error: 'Wallet address is required' },
//         { status: 400 }
//       );
//     }

//     let response: any;

//     switch (action) {
//       case 'check_balances':
//         const balances = await BalanceService.getTokenBalances(walletAddress);
//         response = { action, data: balances };
//         break;

//       case 'swap_tokens':
//         const swapParams = extractSwapParams(message);
//         const swapResult = await SwapService.executeSwap({
//           ...swapParams,
//           walletAddress,
//         });
//         response = { action, data: swapResult };
//         break;

//       case 'create_wallet':
//         const wallet = await WalletService.createSmartWallet(walletAddress);
//         response = { action, data: wallet };
//         break;

//       case 'fund_wallet':
//         const txHash = await WalletService.fundWallet(walletAddress);
//         response = { action, data: { txHash } };
//         break;

//       case 'market_data':
//         const marketData = await agent.actions.getMarketData({
//           tokens: ['eth', 'btc', 'sol'],
//         });
//         response = { action, data: marketData };
//         break;

//       default:
//         const aiResponse = await agent.processMessage({
//           message,
//           walletAddress,
//         });
//         response = { action: 'ai_response', data: aiResponse };
//     }

//     return NextResponse.json(response);

//   } catch (error: any) {
//     console.error('Agent error:', error);
//     return NextResponse.json(
//       { 
//         error: error.message || 'Failed to process request',
//         details: error.details || null,
//       },
//       { status: 500 }
//     );
//   }
// }

// // Helper functions
// function extractSwapParams(message: string): any {
//   // Implement actual NLP parsing here
//   return {
//     fromToken: 'eth',
//     toToken: 'usdc',
//     amount: '0.01',
//   };
// }


// import { NextRequest, NextResponse } from 'next/server';
// import { WalletActions } from '@/lib/agentkit/actions';
// import { parseAgentRequest } from '@/lib/agentkit/utils';

// export const runtime = 'edge'; // For Vercel Edge runtime

// export async function POST(request: NextRequest) {
//   try {
//     const { message, walletAddress, action } = await parseAgentRequest(request);

//     if (!walletAddress) {
//       return NextResponse.json(
//         { error: 'Wallet address is required' },
//         { status: 400 }
//       );
//     }

//     let response: any;

//     switch (action) {
//       case 'check_balances':
//         const balances = await WalletActions.getBalances(walletAddress);
//         response = { action, data: balances };
//         break;

//       case 'swap_tokens':
//         const swapParams = extractSwapParams(message);
//         const swapResult = await WalletActions.swapTokens({
//           ...swapParams,
//           walletAddress,
//         });
//         response = { action, data: swapResult };
//         break;

//       case 'create_wallet':
//         const wallet = await WalletActions.createSmartWallet(walletAddress);
//         response = { action, data: wallet };
//         break;

//       case 'fund_wallet':
//         const fundResult = await WalletActions.fundWallet(walletAddress);
//         response = { action, data: fundResult };
//         break;

//       default:
//         response = await handleGeneralMessage(message, walletAddress);
//     }

//     return NextResponse.json(response);

//   } catch (error: any) {
//     console.error('Agent error:', error);
//     return NextResponse.json(
//       { 
//         error: error.message || 'Failed to process request',
//         details: error.details || null,
//       },
//       { status: 500 }
//     );
//   }
// }

// // Helper functions
// async function handleGeneralMessage(message: string, walletAddress: string) {
//   // Implement NLP processing or intent detection here
//   return {
//     action: 'general_response',
//     data: {
//       message: `Received your message: "${message}". I can help with wallet balances, token swaps, and more.`,
//       walletAddress,
//     },
//   };
// }

// function extractSwapParams(message: string) {
//   // Implement actual NLP parsing here
//   return {
//     fromToken: 'eth',
//     toToken: 'usdc',
//     amount: '0.01',
//   };
// }



// // import { NextRequest, NextResponse } from 'next/server';
// // import { AgentKit, SmartWalletProvider, walletActionProvider, erc20ActionProvider } from '@coinbase/agentkit';
// // import { getLangChainTools } from '@coinbase/agentkit-langchain';
// // import { HumanMessage } from '@langchain/core/messages';
// // import { createReactAgent } from '@langchain/langgraph/prebuilt';
// // import { ChatOpenAI } from '@langchain/openai';
// // import { MemorySaver } from '@langchain/langgraph';
// // import { privateKeyToAccount } from 'viem/accounts';
// // // In-memory storage for agent sessions
// // const agentSessions: Record<string, any> = {};
// // export async function POST(request: NextRequest) {
// //   try {
// //     const { message, walletAddress, action } = await request.json();
    
// //     if (!message) {
// //       return NextResponse.json(
// //         { error: 'Message is required' },
// //         { status: 400 }
// //       );
// //     }
    
// //     // Mock response for development/demo purposes
// //     // In a real implementation, you would use the AgentKit to process the message
// //     let response = '';
    
// //     if (action === 'check_balances') {
// //       response = "I've checked your wallet balances:\n\n" +
// //         "• ETH: 0.05 ETH ($125.45)\n" +
// //         "• USDC: 100 USDC ($100.00)\n" +
// //         "• DAI: 50 DAI ($50.03)\n\n" +
// //         "Your total wallet value is approximately $275.48. Would you like to swap any of these tokens?";
// //     } else if (action === 'swap_tokens') {
// //       response = "I can help you swap tokens. Here are the current rates:\n\n" +
// //         "• 1 ETH = 2,510.90 USDC\n" +
// //         "• 1 ETH = 2,509.45 DAI\n\n" +
// //         "How much would you like to swap and which tokens? For example, you can say 'Swap 0.01 ETH to USDC'.";
// //     } else if (action === 'market_analysis') {
// //       response = "Based on my analysis of the current market conditions:\n\n" +
// //         "• BTC: $51,245 (↑2.3% 24h) - Bullish momentum with strong support at $50K\n" +
// //         "• ETH: $2,510 (↑1.7% 24h) - Consolidating after recent gains, resistance at $2,600\n" +
// //         "• SOL: $103 (↓0.8% 24h) - Minor correction after strong rally, support at $95\n\n" +
// //         "Overall market sentiment is cautiously optimistic with improving on-chain metrics. Would you like more detailed analysis on a specific token?";
// //     } else if (action === 'trading_strategy') {
// //       response = "Based on current market conditions, here's a suggested trading strategy:\n\n" +
// //         "1. Consider DCA (Dollar Cost Averaging) into BTC and ETH over the next 4 weeks\n" +
// //         "2. Set limit orders for SOL at $95 and AVAX at $32 as potential entry points\n" +
// //         "3. Take partial profits on any positions that are up >20%\n" +
// //         "4. Maintain at least 30% of your portfolio in stablecoins for upcoming opportunities\n\n" +
// //         "This is a moderate risk strategy focused on capital preservation with upside exposure. Would you like me to suggest specific entry and exit points?";
// //     } else {
// //       // Process general messages
// //       if (message.toLowerCase().includes('swap') && message.toLowerCase().includes('eth') && message.toLowerCase().includes('usdc')) {
// //         response = "I'll help you swap ETH to USDC. Based on current rates, you'll receive approximately 2,510 USDC per ETH.\n\n" +
// //           "To proceed with this swap, I'll need to:\n" +
// //           "1. Check your ETH balance\n" +
// //           "2. Prepare the swap transaction\n" +
// //           "3. Execute the swap through a DEX\n\n" +
// //           "Would you like me to proceed with this swap?";
// //       } else if (message.toLowerCase().includes('market') && message.toLowerCase().includes('analysis')) {
// //         response = "Here's my analysis of the current market:\n\n" +
// //           "• BTC: $51,245 (↑2.3% 24h) - Bullish momentum with strong support at $50K\n" +
// //           "• ETH: $2,510 (↑1.7% 24h) - Consolidating after recent gains, resistance at $2,600\n" +
// //           "• SOL: $103 (↓0.8% 24h) - Minor correction after strong rally, support at $95\n\n" +
// //           "Overall market sentiment is cautiously optimistic with improving on-chain metrics. Would you like more detailed analysis on a specific token?";
// //       } else if (message.toLowerCase().includes('deploy') && message.toLowerCase().includes('contract')) {
// //         response = "I can help you deploy a smart contract on Base Testnet. What type of contract would you like to deploy? I can assist with:\n\n" +
// //           "• ERC20 Token\n" +
// //           "• NFT Collection (ERC721)\n" +
// //           "• Simple DEX\n" +
// //           "• Staking Contract\n\n" +
// //           "Let me know which one you're interested in, and I'll guide you through the process.";
// //       } else {
// //         response = "I'm your AI trading assistant powered by Base AgentKit. I can help you with:\n\n" +
// //           "• Checking token balances\n" +
// //           "• Swapping tokens on Base Testnet\n" +
// //           "• Market analysis and trading strategies\n" +
// //           "• Deploying and interacting with smart contracts\n\n" +
// //           "What would you like to do today?";
// //       }
// //     }
    
// //     return NextResponse.json({ response });
    
// //   } catch (error) {
// //     console.error('Error processing agent message:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to process message' },
// //       { status: 500 }
// //     );
// //   }
// // }