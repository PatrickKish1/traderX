
'use client';
import { executeTrade } from '@/lib/apiUtls';
import { CryptoData, TradeRequest } from '@/lib/types/crypto';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface TradingInterfaceProps {
  cryptoData: CryptoData;
  allCryptos: CryptoData[];
  onSelectCrypto: (symbol: string) => void;
}
const TradingInterface: React.FC<TradingInterfaceProps> = ({ 
  cryptoData, 
  allCryptos,
  onSelectCrypto
}) => {
  const { address, isConnected } = useAccount();
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tradeResult, setTradeResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [blockchain, setBlockchain] = useState<string>('BASE');
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimals
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  const calculateTotal = (): string => {
    if (!amount || isNaN(parseFloat(amount))) return '0.00';
    return (parseFloat(amount) * cryptoData.current_price).toFixed(2);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!isConnected || !address) {
      setError('Please connect your wallet to trade');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const tradeRequest: TradeRequest = {
        type: tradeType,
        token: cryptoData.symbol.toUpperCase(),
        token_amount: amount,
        pair_token: 'USDC',
        slippage_bips: 50,
        blockchain: blockchain,
        user_address: address,
      };
      
      const result = await executeTrade(tradeRequest);
      setTradeResult(result);
      setAmount('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'Failed to execute trade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Trade {cryptoData.name}</h2>
      
      <div className="mb-4">
        <label htmlFor="cryptoSelect" className="block text-sm font-medium text-gray-400 mb-1">
          Select Cryptocurrency
        </label>
        <select
          id="cryptoSelect"
          className="w-full bg-gray-700 text-white rounded p-2"
          value={cryptoData.symbol}
          onChange={(e) => onSelectCrypto(e.target.value)}
        >
          {allCryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.symbol}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          className={`flex-1 py-2 rounded-lg ${
            tradeType === 'BUY' ? 'bg-green-600' : 'bg-gray-700'
          }`}
          onClick={() => setTradeType('BUY')}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-2 rounded-lg ${
            tradeType === 'SELL' ? 'bg-red-600' : 'bg-gray-700'
          }`}
          onClick={() => setTradeType('SELL')}
        >
          Sell
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount ({cryptoData.symbol.toUpperCase()})
          </label>
          <input
            type="text"
            id="amount"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Enter ${cryptoData.symbol.toUpperCase()} amount`}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="blockchain" className="block text-sm font-medium text-gray-400 mb-1">
            Blockchain
          </label>
          <select
            id="blockchain"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={blockchain}
            onChange={(e) => setBlockchain(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="BASE">Base</option>
            <option value="POLYGON">Polygon</option>
            <option value="ARBITRUM">Arbitrum</option>
            <option value="WORLD">World</option>
          </select>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg mb-4">
          <div className="flex justify-between">
            <span>Price per {cryptoData.symbol.toUpperCase()}</span>
            <span>${cryptoData.current_price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Total ({tradeType === 'BUY' ? 'USDC' : cryptoData.symbol.toUpperCase()})</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {tradeResult && (
          <div className="bg-green-900/50 text-green-200 p-3 rounded-lg mb-4">
            <h3 className="font-bold">Trade Executed Successfully!</h3>
            <p>Quote ID: {tradeResult.quoteId}</p>
            <p>Input Amount: {tradeResult.inputAmount}</p>
            <p>Output Amount: {tradeResult.outputAmount}</p>
            <p>Price: {tradeResult.price}</p>
            <p>Fee: {tradeResult.fee}</p>
            <p>Expires At: {new Date(tradeResult.expiresAt).toLocaleString()}</p>
          </div>
        )}
        
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold ${
            tradeType === 'BUY'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          disabled={isSubmitting || !isConnected}
        >
          {!isConnected 
            ? 'Connect Wallet to Trade'
            : isSubmitting
              ? 'Processing...'
              : `${tradeType} ${cryptoData.symbol.toUpperCase()}`}
        </button>
      </form>
    </div>
  );
};
export default TradingInterface;