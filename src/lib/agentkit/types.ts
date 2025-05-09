import { Address } from 'viem';

export type WalletData = {
  address: Address;
  privateKey: string;
  isDeployed: boolean;
  network: string;
  balance: string;
};

export type TokenBalance = {
  symbol: string;
  amount: string;
  valueUSD: string;
  contractAddress: Address;
};

export type SwapParams = {
  fromToken: string;
  toToken: string;
  amount: string;
  walletAddress: Address;
  slippage?: string;
};

export type SwapResult = {
  txHash: string;
  expectedAmount: string;
  minAmount: string;
  gasUsed: string;
};

export type AgentConfig = {
  chain: 'base' | 'base-sepolia';
  apiKey: string;
  privateKey: string;
  walletSecret: string;
  openSeaApiKey?: string;
};