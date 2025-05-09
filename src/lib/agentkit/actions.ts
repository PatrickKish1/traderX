// import { getAgentInstance } from './config';
// import { Address } from 'viem';

// const agent = getAgentInstance();

// export const WalletActions = {
//   async getBalances(walletAddress: Address) {
//     const balances = await agent.wallet.getBalances({
//       address: walletAddress,
//       tokens: ['eth', 'usdc', 'dai', 'wbtc'],
//     });

//     return balances.map(balance => ({
//       symbol: balance.token.symbol.toUpperCase(),
//       amount: Number(balance.amount).toFixed(4),
//       value: Number(balance.valueUSD).toFixed(2),
//     }));
//   },

//   async createSmartWallet(ownerAddress: Address) {
//     const wallet = await agent.wallet.createSmartWallet({
//       ownerAddress,
//       chain: agent.config.chain,
//     });

//     return {
//       address: wallet.address,
//       isDeployed: wallet.isDeployed,
//       deploymentTxHash: wallet.deploymentTxHash,
//     };
//   },

//   async fundWallet(walletAddress: Address, amount: string = '0.05') {
//     if (agent.config.chain === 'base') {
//       throw new Error('Cannot fund wallets on mainnet automatically');
//     }

//     const txHash = await agent.wallet.fundWallet({
//       address: walletAddress,
//       amount,
//       chain: agent.config.chain,
//     });

//     return {
//       txHash,
//       amount,
//     };
//   },

//   async swapTokens(params: {
//     fromToken: string;
//     toToken: string;
//     amount: string;
//     walletAddress: Address;
//     slippage?: string;
//   }) {
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
//   },
// };