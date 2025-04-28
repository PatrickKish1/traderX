import Link from 'next/link';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/loader-spinner';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Next-Gen Crypto Trading Platform
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Trade cryptocurrencies with advanced tools, AI-powered insights, and professional-grade features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/trade" 
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Trading
            </Link>
            <Link 
              href="/chat" 
              className="px-8 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Trading Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Advanced Trading</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Professional-grade trading interface with order books, limit orders, take profit, and stop loss functionality.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get market insights, price predictions, and trading signals from our AI-powered assistant.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Token Swapping</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Easily swap tokens with our integrated DEX interface, supporting multiple tokens on Base blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Live Market Overview
          </h2>
          
          <Suspense fallback={<LoadingSpinner />}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coin</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* This would be populated with real data in a production app */}
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">₿</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Bitcoin</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">BTC</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$65,432.10</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-green-600">+2.45%</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$1.24T</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">Ξ</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Ethereum</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">ETH</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$3,456.78</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-red-600">-1.23%</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$415.7B</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">S</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Solana</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">SOL</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$123.45</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-green-600">+5.67%</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$52.8B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Link href="/trade" className="text-blue-600 dark:text-blue-400 hover:underline">
                  View All Markets →
                </Link>
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of traders using CryptoTrader Pro for their cryptocurrency trading needs.
          </p>
          <Link 
            href="/trade" 
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
