'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Suspense } from 'react';
import Dashboard from '@/components/dashboard';
import LoadingSpinner from '@/components/loader-spinner';

export default function TradePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if wallet is not connected
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Wallet Connection Required</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">Please connect your wallet to access the trading platform.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
