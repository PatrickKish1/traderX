/* eslint-disable @typescript-eslint/no-unused-vars */
import { AgentKit, cdpApiActionProvider, erc721ActionProvider, pythActionProvider, SmartWalletProvider, walletActionProvider } from '@coinbase/agentkit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { getProviders } from './providers';
import { AgentConfig } from './types';
import * as fs from "fs";
import { Address, Hex } from 'viem';


const ENV = process.env.NODE_ENV || 'development';
const IS_PROD = ENV === 'production';

type WalletData = {
    privateKey: Hex;
    smartWalletAddress: Address;
  };

export const getAgentConfig = (): AgentConfig => {
  const requiredVars = [
    'AGENT_PRIVATE_KEY',
    'COINBASE_API_KEY',
    'CDP_API_KEY_NAME',
    'CDP_API_KEY_PRIVATE_KEY',
    'CDP_WALLET_SECRET'
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  return {
    chain: IS_PROD ? 'base' : 'base-sepolia',
    apiKey: process.env.COINBASE_API_KEY!,
    privateKey: process.env.AGENT_PRIVATE_KEY!,
    walletSecret: process.env.CDP_WALLET_SECRET!,
    openSeaApiKey: process.env.OPENSEA_API_KEY,
  };
};

let agentInstance: AgentKit;

export const getAgentInstance = async (): Promise<AgentKit> => {
  if (!agentInstance) {
    const config = getAgentConfig();
    const signer = privateKeyToAccount(config.privateKey as `0x${string}`);
    const networkId = process.env.NETWORK_ID || "base-sepolia";
    const walletDataFile = `wallet_data_${networkId.replace(/-/g, "_")}.txt`;

    let walletData: WalletData | null = null;
    let privateKey: Hex | null = null;

    if (fs.existsSync(walletDataFile)) {
        try {
            walletData = JSON.parse(fs.readFileSync(walletDataFile, "utf8")) as WalletData;
            privateKey = walletData.privateKey;
        } catch (error) {
            console.error(`Error reading wallet data for ${networkId}:`, error);
            // Continue without wallet data
        }
    }
    if (!privateKey) {
        if (walletData?.smartWalletAddress) {
            throw new Error(
            `Smart wallet found but no private key provided. Either provide the private key, or delete ${walletDataFile} and try again.`,
            );
        }
        privateKey = (process.env.PRIVATE_KEY || generatePrivateKey()) as Hex;
    }
    
    const walletProvider = await SmartWalletProvider.configureWithWallet({
        networkId,
        signer,
        smartWalletAddress: walletData?.smartWalletAddress,
        paymasterUrl: undefined, // Sponsor transactions: https://docs.cdp.coinbase.com/paymaster/docs/welcome
    });
    
    agentInstance = await AgentKit.from({
        actionProviders: [
            cdpApiActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
            }),
            erc721ActionProvider(),
            pythActionProvider(),
            walletActionProvider(),
        ],
      walletProvider: (await getProviders(config))[0],
    });
  }
  return agentInstance;
};