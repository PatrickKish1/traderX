// import { getAgentInstance } from '@/lib/agentkit/config';
// import { TokenBalance } from '@/lib/agentkit/types';

// const agent = getAgentInstance();

// export class BalanceService {
//   static async getTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
//     const balances = await agent.wallet.getBalances({
//       address: walletAddress,
//       tokens: ['eth', 'usdc', 'dai', 'wbtc'],
//     });

//     return balances.map(balance => ({
//       symbol: balance.token.symbol.toUpperCase(),
//       amount: balance.amount,
//       valueUSD: balance.valueUSD,
//       contractAddress: balance.token.address,
//     }));
//   }

//   static async getTokenPrice(token: string): Promise<string> {
//     const price = await agent.actions.getTokenPrice({
//       token,
//       currency: 'usd',
//     });

//     return price.toString();
//   }
// }