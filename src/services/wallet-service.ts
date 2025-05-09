// import { getAgentInstance } from '@/lib/agentkit/config';
// import { WalletData } from '@/lib/agentkit/types';

// const agent = getAgentInstance();

// export class WalletService {
//   static async createSmartWallet(ownerAddress: string): Promise<WalletData> {
//     const wallet = await agent.wallet.createSmartWallet({
//       ownerAddress,
//       chain: agent.config.chain,
//     });

//     return {
//       address: wallet.address,
//       privateKey: process.env.AGENT_PRIVATE_KEY!,
//       isDeployed: wallet.isDeployed,
//       network: agent.config.chain,
//       balance: '0',
//     };
//   }

//   static async getWalletData(address: string): Promise<WalletData> {
//     const [balance, isDeployed] = await Promise.all([
//       agent.wallet.getBalance({ address }),
//       agent.wallet.isDeployed({ address }),
//     ]);

//     return {
//       address,
//       privateKey: process.env.AGENT_PRIVATE_KEY!,
//       isDeployed,
//       network: agent.config.chain,
//       balance: balance.toString(),
//     };
//   }

//   static async fundWallet(address: string, amount: string = '0.05'): Promise<string> {
//     if (agent.config.chain === 'base') {
//       throw new Error('Cannot fund wallets on mainnet automatically');
//     }

//     const result = await agent.wallet.fundWallet({
//       address,
//       amount,
//       chain: agent.config.chain,
//     });

//     return result.txHash;
//   }
// }