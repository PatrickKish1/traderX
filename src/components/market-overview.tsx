'use client';

import { CryptoData } from "@/lib/types/crypto";
import Image from "next/image";

interface MarketOverviewProps {
  cryptoData: CryptoData[];
  onSelectCrypto: (symbol: string) => void;
  selectedCrypto: string;
}
const MarketOverview: React.FC<MarketOverviewProps> = ({ 
  cryptoData, 
  onSelectCrypto,
  selectedCrypto
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Market Overview</h2>
      
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                Coin
              </th>
              <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                Price
              </th>
              <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                24h
              </th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr 
                key={crypto.id}
                className={`hover:bg-gray-700 cursor-pointer ${
                  selectedCrypto === crypto.symbol ? 'bg-gray-700' : ''
                }`}
                onClick={() => onSelectCrypto(crypto.symbol)}
              >
                <td className="py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      className="w-6 h-6 mr-2"
                    />
                    <div>
                      <div className="font-medium">{crypto.symbol.toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{crypto.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  ${crypto.current_price.toLocaleString()}
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span
                    className={
                      crypto.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MarketOverview;