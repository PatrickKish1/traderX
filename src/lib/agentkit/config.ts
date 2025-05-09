// import { AgentKit, Chain } from '@coinbase/agentkit';
// import { privateKeyToAccount } from 'viem/accounts';
// import { getProviders } from './providers';
// import { AgentConfig } from './types';

// const ENV = process.env.NODE_ENV || 'development';
// const IS_PROD = ENV === 'production';

// export const getAgentConfig = (): AgentConfig => {
//   const requiredVars = [
//     'AGENT_PRIVATE_KEY',
//     'COINBASE_API_KEY',
//     'CDP_API_KEY_NAME',
//     'CDP_API_KEY_PRIVATE_KEY',
//     'CDP_WALLET_SECRET'
//   ];

//   for (const varName of requiredVars) {
//     if (!process.env[varName]) {
//       throw new Error(`Missing required environment variable: ${varName}`);
//     }
//   }

//   return {
//     chain: IS_PROD ? 'base' : 'base-sepolia',
//     apiKey: process.env.COINBASE_API_KEY!,
//     privateKey: process.env.AGENT_PRIVATE_KEY!,
//     walletSecret: process.env.CDP_WALLET_SECRET!,
//     openSeaApiKey: process.env.OPENSEA_API_KEY,
//   };
// };

// let agentInstance: AgentKit;

// export const getAgentInstance = async (): Promise<AgentKit> => {
//   if (!agentInstance) {
//     const config = getAgentConfig();
//     const signer = privateKeyToAccount(config.privateKey as `0x${string}`);
    
//     agentInstance = await AgentKit.from({
//       chain: config.chain,
//       apiKey: config.apiKey,
//       signer,
//       walletProvider: getProviders(config),
//     });
//   }
//   return agentInstance;
// };