/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAgentInstance } from './config';
import { Address } from 'viem';
import { AgentKit } from '@coinbase/agentkit';

let agentInstance: AgentKit;

const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await getAgentInstance();
  }
  return agentInstance;
};

export const WalletActions = {
  async getBalances(walletAddress: Address) {
    const agent = await getAgent();
    const actions = agent.getActions();
    const balanceAction = actions.find(a => a.name === 'getBalances');
    if (!balanceAction) throw new Error('Balance action not found');

    const result = await balanceAction.invoke({
      address: walletAddress,
      tokens: ['eth', 'usdc', 'dai', 'wbtc'],
    });

    const balances = JSON.parse(result);
    return balances.map((balance: { token: { symbol: string; }; amount: any; valueUSD: any; }) => ({
      symbol: balance.token.symbol.toUpperCase(),
      amount: Number(balance.amount).toFixed(4),
      value: Number(balance.valueUSD).toFixed(2),
    }));
  },

  async createSmartWallet(ownerAddress: Address) {
    const agent = await getAgent();
    const actions = agent.getActions();
    const createWalletAction = actions.find(a => a.name === 'createSmartWallet');
    if (!createWalletAction) throw new Error('Create wallet action not found');

    const result = await createWalletAction.invoke({
      ownerAddress,
    });

    return JSON.parse(result);
  },

  async fundWallet(walletAddress: Address, amount: string = '0.05') {
    const agent = await getAgent();
    const actions = agent.getActions();
    const fundWalletAction = actions.find(a => a.name === 'fundWallet');
    if (!fundWalletAction) throw new Error('Fund wallet action not found');

    const result = await fundWalletAction.invoke({
      address: walletAddress,
      amount,
    });

    return JSON.parse(result);
  },

  async swapTokens(params: {
    fromToken: string;
    toToken: string;
    amount: string;
    walletAddress: Address;
    slippage?: string;
  }) {
    const agent = await getAgent();
    const actions = agent.getActions();
    const swapAction = actions.find(a => a.name === 'swapTokens');
    if (!swapAction) throw new Error('Swap action not found');

    const result = await swapAction.invoke({
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
      slippage: params.slippage || '0.5',
      walletAddress: params.walletAddress,
    });

    return JSON.parse(result);
  },
};