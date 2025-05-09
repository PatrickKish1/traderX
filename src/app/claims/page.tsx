/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { getTokenScores, type TokenScore } from '@/lib/cookies'
import { tokens } from '@/config/tokens'
import Image from 'next/image'

const CONVERSION_RATES = {
  '1000': 0.1,    // 1000 points = 0.1 USDC
  '5000': 0.5,    // 5000 points = 0.5 USDC
  '10000': 1.0,   // 10000 points = 1 USDC
  '50000': 6.0,   // 50000 points = 6 USDC
  '100000': 15.0  // 100000 points = 15 USDC
}

export default function ClaimsPage() {
  const [scores, setScores] = useState<TokenScore>(getTokenScores())
  const [selectedToken, setSelectedToken] = useState<string>('total')

  const getUSDCValue = (points: number) => {
    const thresholds = Object.keys(CONVERSION_RATES).map(Number).sort((a, b) => b - a)
    for (const threshold of thresholds) {
      if (points >= threshold) {
        return CONVERSION_RATES[threshold as unknown as keyof typeof CONVERSION_RATES]
      }
    }
    return 0
  }

  const currentPoints = selectedToken === 'total' ? scores.total : scores[selectedToken as keyof TokenScore]
  const usdcValue = getUSDCValue(currentPoints)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Claim Your Rewards</h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Your Token Scores</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {tokens.filter(t => !t.isObstacle).map(token => (
                <button
                  key={token.symbol}
                  onClick={() => setSelectedToken(token.symbol)}
                  className={`p-4 rounded-lg ${
                    selectedToken === token.symbol 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Image
                      src={token.imageUrl}
                      alt={token.name}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{token.symbol}</div>
                    <div>{scores[token.symbol as keyof TokenScore]} points</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setSelectedToken('total')}
                className={`p-4 rounded-lg ${
                  selectedToken === 'total' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-center">
                  <div className="font-bold">TOTAL</div>
                  <div>{scores.total} points</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Conversion Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(CONVERSION_RATES).map(([points, usdc]) => (
                <div
                  key={points}
                  className={`p-4 rounded-lg ${
                    currentPoints >= Number(points)
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <div className="font-bold">{points} points</div>
                  <div>{usdc} USDC</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Your Potential Claim</h2>
            <div className="text-3xl font-bold mb-4">
              {usdcValue.toFixed(2)} USDC
            </div>
            <button
              className={`w-full py-3 rounded-lg font-bold ${
                usdcValue > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              }`}
              disabled={usdcValue === 0}
            >
              Claim Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
