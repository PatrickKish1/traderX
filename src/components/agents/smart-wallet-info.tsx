// 'use client';
// import { useState, useEffect } from 'react';
// import { useAccount, useChainId } from 'wagmi';
// import { WalletService } from '@/services/walletService';
// import { BalanceService } from '@/services/balanceService';

// export default function SmartWalletInfo() {
//   const { address } = useAccount();
//   const chainId = useChainId();
//   const [walletData, setWalletData] = useState<any>(null);
//   const [balances, setBalances] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     if (!address) return;
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const [wallet, balances] = await Promise.all([
//         WalletService.getWalletData(address),
//         BalanceService.getTokenBalances(address),
//       ]);
      
//       setWalletData(wallet);
//       setBalances(balances);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateWallet = async () => {
//     if (!address) return;
    
//     setIsLoading(true);
    
//     try {
//       const wallet = await WalletService.createSmartWallet(address);
//       setWalletData(wallet);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRequestFunds = async () => {
//     if (!walletData?.address) return;
    
//     setIsLoading(true);
    
//     try {
//       await WalletService.fundWallet(walletData.address);
//       // Refresh data
//       await fetchData();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [address, chainId]);

//   if (isLoading && !walletData) {
//     return <div className="p-4">Loading wallet data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-500">
//         Error: {error}
//         <button 
//           onClick={handleCreateWallet}
//           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!walletData?.isDeployed) {
//     return (
//       <div className="p-4">
//         <p className="mb-4">No smart wallet detected</p>
//         <button
//           onClick={handleCreateWallet}
//           disabled={isLoading}
//           className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {isLoading ? 'Creating...' : 'Create Smart Wallet'}
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 border rounded-lg">
//       <h3 className="text-lg font-bold mb-4">Smart Wallet</h3>
      
//       <div className="space-y-2 mb-4">
//         <p>
//           <span className="font-semibold">Address:</span> 
//           <span className="block truncate">{walletData.address}</span>
//         </p>
//         <p>
//           <span className="font-semibold">Network:</span> {walletData.network}
//         </p>
//         <p>
//           <span className="font-semibold">ETH Balance:</span> {walletData.balance}
//         </p>
        
//         <div className="mt-4">
//           <h4 className="font-semibold mb-2">Token Balances:</h4>
//           <ul className="space-y-1">
//             {balances.map(balance => (
//               <li key={balance.symbol}>
//                 {balance.symbol}: {balance.amount} (${balance.valueUSD})
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
      
//       {parseFloat(walletData.balance) < 0.01 && (
//         <button
//           onClick={handleRequestFunds}
//           disabled={isLoading}
//           className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {isLoading ? 'Requesting...' : 'Request Testnet Funds'}
//         </button>
//       )}
//     </div>
//   );
// }