'use client';

import { Suspense } from 'react';
import CryptoGame from '@/components/crypto-game';
import LoadingSpinner from '@/components/loader-spinner';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Crypto Catcher Game</h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Welcome to Crypto Catcher! Control your wallet to collect Bitcoin tokens while avoiding obstacles. 
            The more coins you collect, the higher your score. Watch out for special golden coins worth extra points!
          </p>
          
          <Suspense fallback={<LoadingSpinner />}>
            <CryptoGame />
          </Suspense>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Use the <strong>arrow keys</strong> or <strong>A/D keys</strong> to move your wallet left and right</li>
              <li>On mobile devices, use the on-screen controls or tap and drag to move</li>
              <li>Collect Bitcoin tokens to increase your score</li>
              <li>Golden coins are worth 5x more points</li>
              <li>Avoid red obstacles - hitting one ends the game</li>
              <li>The game gets faster as your level increases</li>
            </ul>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">CryptoKing</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">1,250</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">2023-06-15</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">BitcoinBaron</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">980</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">4</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">2023-06-14</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">CryptoQueen</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">820</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">2023-06-12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
