/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
    SmartWalletProvider,
    walletActionProvider,
    erc20ActionProvider,
    // erc721ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
    openseaActionProvider,
    // alloraActionProvider,
    wethActionProvider,
    AgentKit,
    CdpWalletProvider
  } from '@coinbase/agentkit';
import { AgentConfig } from './types';
import { Address, Hex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
// import * as dotenv from "dotenv";
import * as fs from "fs";
// import * as readline from "readline";


  
type WalletData = {
    privateKey: Hex;
    smartWalletAddress: Address;
  };

  export const getProviders = async (config: AgentConfig) => {
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

    const signer = privateKeyToAccount(privateKey);

    const baseProviders: any[] = [
          SmartWalletProvider.configureWithWallet({
            // chain: config.chain,
            // apiKey: config.apiKey,
            networkId,
            signer,
            smartWalletAddress: walletData?.smartWalletAddress,
            paymasterUrl: undefined
          }),
          walletActionProvider,
          erc20ActionProvider,
          wethActionProvider,
          cdpApiActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME!,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!,
          }),
          cdpWalletActionProvider({
            apiKeyName: process.env.CDP_API_KEY_NAME!,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!,
          }),
    //   pythActionProvider(),
    //   pythActionProvider({
    //     // priceServiceUrl: process.env.PYTH_PRICE_SERVICE_URL || 'https://xc-mainnet.pyth.network',
    //   }),
    ];

    const configOne = {
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
        cdpWalletData: walletData ? JSON.stringify(walletData) : undefined,
        networkId: process.env.NETWORK_ID || "base-sepolia",
      };

    const walletProvider = await CdpWalletProvider.configureWithWallet(configOne);
  
    if (config.openSeaApiKey) {
      const provider = openseaActionProvider({
        apiKey: config.openSeaApiKey,
        networkId: config.chain,
        privateKey: (await walletProvider.getWallet().getDefaultAddress()).export(),
      });
      baseProviders.push(provider);
    }
  
    return baseProviders;
  };