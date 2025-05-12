/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address, createPublicClient, createWalletClient, http, type Hash } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const CLAIMS_CONTRACT = process.env.NEXT_PUBLIC_CLAIMS_CONTRACT_ADDRESS as `0x${string}`; // Deploy and add contract address
const USDC_CONTRACT = ''; // Base Sepolia USDC address

const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      }
    ],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const claimRewards = async (points: number, walletAddress: Address) => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });

  const hash = await publicClient.readContract({
    address: CLAIMS_CONTRACT,
    abi: ['function claimRewards(uint256 points)'],
    functionName: 'claimRewards',
    args: [points],
    account: walletAddress
  });

  return hash;
};

export const executeClaimTransaction = async (
  points: number,
  walletClient: any
): Promise<Hash> => {
  const txHash = await walletClient.writeContract({
    address: CLAIMS_CONTRACT,
    abi: ABI,
    functionName: 'claimRewards',
    args: [points],
  });

  return txHash;
};
