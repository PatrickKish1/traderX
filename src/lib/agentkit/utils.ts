// import { NextRequest } from 'next/server';
// import { Address } from 'viem';

// export async function parseAgentRequest(request: NextRequest) {
//   const data = await request.json();
  
//   if (!data.message) {
//     throw new Error('Message is required');
//   }

//   return {
//     message: data.message as string,
//     walletAddress: data.walletAddress as Address,
//     action: data.action as string | undefined,
//   };
// }

// export function formatBalance(balance: number, decimals: number = 4) {
//   return balance.toFixed(decimals);
// }

// export function formatUSD(value: number) {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(value);
// }

// export async function simulateTransaction(txParams: any) {
//   const agent = getAgentInstance();
//   return agent.simulateTransaction(txParams);
// }