
'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';
import { CryptoData } from '@/lib/types/crypto';
interface OrderBookTradingProps {
  cryptoData: CryptoData;
  allCryptos: CryptoData[];
  onSelectCrypto: (symbol: string) => void;
}
interface Order {
  id: string;
  type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
  price: number;
  amount: number;
  lotSize: number;
  total: number;
  filled: number;
  status: 'open' | 'partial' | 'filled' | 'canceled' | 'triggered';
  timestamp: Date;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  pair: string;
}
interface OrderBook {
  bids: {price: number, amount: number}[];
  asks: {price: number, amount: number}[];
}
interface TradingPair {
  base: string;
  quote: string;
  displayName: string;
}
const OrderBookTrading: React.FC<OrderBookTradingProps> = ({ 
  cryptoData, 
  allCryptos,
  onSelectCrypto
}) => {
  const { address, isConnected } = useAccount();
  
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('LIMIT');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [lotSize, setLotSize] = useState<number>(1);
  const [total, setTotal] = useState<string>('0.00');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [useTakeProfit, setUseTakeProfit] = useState<boolean>(false);
  const [useStopLoss, setUseStopLoss] = useState<boolean>(false);
  
  // Trading pairs state
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPair>({
    base: 'BTC',
    quote: 'USDC',
    displayName: 'BTC/USDC'
  });
  
  // Order book state
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: []
  });
  
  // User orders state
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  
  // Market depth chart state
  const [showDepthChart, setShowDepthChart] = useState<boolean>(false);
  
  // AI signals state
  const [aiSignals, setAiSignals] = useState<{
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    price: number;
    targetPrice: number;
    stopPrice: number;
    reasoning: string;
    roi: number;
    timestamp: Date;
  } | null>(null);
  
  // Initialize trading pairs
  useEffect(() => {
    const pairs: TradingPair[] = [];
    
    // Create trading pairs from available cryptos
    allCryptos.forEach(crypto => {
      pairs.push({
        base: crypto.symbol.toUpperCase(),
        quote: 'USDC',
        displayName: `${crypto.symbol.toUpperCase()}/USDC`
      });
      
      // Add BTC pairs for major coins
      if (['ETH', 'SOL', 'XRP', 'ADA'].includes(crypto.symbol.toUpperCase())) {
        pairs.push({
          base: crypto.symbol.toUpperCase(),
          quote: 'BTC',
          displayName: `${crypto.symbol.toUpperCase()}/BTC`
        });
      }
    });
    
    setTradingPairs(pairs);
    
    // Set initial pair based on selected crypto
    const initialPair = pairs.find(pair => pair.base === cryptoData.symbol.toUpperCase() && pair.quote === 'USDC');
    if (initialPair) {
      setSelectedPair(initialPair);
    }
  }, [allCryptos, cryptoData]);
  
  // Initialize price when crypto changes
  useEffect(() => {
    if (cryptoData) {
      setPrice(cryptoData.current_price.toString());
      
      // Set default take profit and stop loss values
      const currentPrice = cryptoData.current_price;
      setTakeProfit((currentPrice * 1.05).toFixed(2)); // 5% above current price
      setStopLoss((currentPrice * 0.95).toFixed(2)); // 5% below current price
    }
  }, [cryptoData]);
  
  // Calculate total when price or amount changes
  useEffect(() => {
    if (price && amount) {
      const calculatedTotal = parseFloat(price) * parseFloat(amount) * lotSize;
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal('0.00');
    }
  }, [price, amount, lotSize]);
  
  // Generate mock order book data
  useEffect(() => {
    if (!cryptoData) return;
    
    const currentPrice = cryptoData.current_price;
    const mockOrderBook: OrderBook = {
      bids: [],
      asks: []
    };
    
    // Generate 10 bid orders (buy orders below current price)
    for (let i = 0; i < 10; i++) {
      const priceDelta = (Math.random() * 0.02) * currentPrice; // Up to 2% below current price
      const price = currentPrice - priceDelta;
      const amount = Math.random() * 2 + 0.1; // Random amount between 0.1 and 2.1
      
      mockOrderBook.bids.push({
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(4))
      });
    }
    
    // Generate 10 ask orders (sell orders above current price)
    for (let i = 0; i < 10; i++) {
      const priceDelta = (Math.random() * 0.02) * currentPrice; // Up to 2% above current price
      const price = currentPrice + priceDelta;
      const amount = Math.random() * 2 + 0.1; // Random amount between 0.1 and 2.1
      
      mockOrderBook.asks.push({
        price: parseFloat(price.toFixed(2)),
        amount: parseFloat(amount.toFixed(4))
      });
    }
    
    // Sort bids in descending order (highest price first)
    mockOrderBook.bids.sort((a, b) => b.price - a.price);
    
    // Sort asks in ascending order (lowest price first)
    mockOrderBook.asks.sort((a, b) => a.price - b.price);
    
    setOrderBook(mockOrderBook);
    
    // Generate AI signal recommendation
    generateAiSignal(currentPrice);
  }, [cryptoData]);
  
  const generateAiSignal = (currentPrice: number) => {
    // Randomly generate a BUY, SELL, or HOLD recommendation
    const recommendations: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    
    // Generate random confidence between 60% and 95%
    const confidence = 60 + Math.floor(Math.random() * 35);
    
    // Generate target prices based on recommendation
    let targetPrice = currentPrice;
    let stopPrice = currentPrice;
    let roi = 0;
    
    if (recommendation === 'BUY') {
      // For BUY, target is higher than current price
      targetPrice = currentPrice * (1 + (Math.random() * 0.15 + 0.05)); // 5-20% higher
      stopPrice = currentPrice * (1 - (Math.random() * 0.05 + 0.02)); // 2-7% lower
      roi = ((targetPrice - currentPrice) / currentPrice) * 100;
    } else if (recommendation === 'SELL') {
      // For SELL, target is lower than current price
      targetPrice = currentPrice * (1 - (Math.random() * 0.15 + 0.05)); // 5-20% lower
      stopPrice = currentPrice * (1 + (Math.random() * 0.05 + 0.02)); // 2-7% higher
      roi = ((currentPrice - targetPrice) / currentPrice) * 100;
    }
    
    // Generate reasoning based on recommendation
    let reasoning = '';
    if (recommendation === 'BUY') {
      reasoning = 'Technical indicators show bullish momentum with increasing volume. RSI indicates oversold conditions and MACD shows a bullish crossover. Support levels are holding strong.';
    } else if (recommendation === 'SELL') {
      reasoning = 'Price is approaching resistance levels with declining volume. RSI indicates overbought conditions and bearish divergence is forming. Consider taking profits at current levels.';
    } else {
      reasoning = 'Market conditions are neutral with mixed signals. Wait for clearer price action before entering a position. Monitor key support and resistance levels for breakouts.';
      roi = 0;
    }
    
    setAiSignals({
      recommendation,
      confidence,
      price: currentPrice,
      targetPrice,
      stopPrice,
      reasoning,
      roi,
      timestamp: new Date()
    });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleTakeProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTakeProfit(value);
    }
  };
  
  const handleStopLossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStopLoss(value);
    }
  };
  
  const handleOrderTypeChange = (type: 'MARKET' | 'LIMIT' | 'STOP') => {
    setOrderType(type);
    if (type === 'MARKET') {
      setPrice(cryptoData.current_price.toString());
    }
  };
  
  const handleSideChange = (newSide: 'BUY' | 'SELL') => {
    setSide(newSide);
  };
  
  const handleOrderBookItemClick = (price: number) => {
    setPrice(price.toString());
  };
  
  const handleLotSizeChange = (newLotSize: number) => {
    setLotSize(newLotSize);
  };
  
  const handlePairChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pairString = e.target.value;
    const selectedPair = tradingPairs.find(pair => pair.displayName === pairString);
    
    if (selectedPair) {
      setSelectedPair(selectedPair);
      
      // Find and select the base crypto
      const baseCrypto = allCryptos.find(crypto => 
        crypto.symbol.toUpperCase() === selectedPair.base
      );
      
      if (baseCrypto) {
        onSelectCrypto(baseCrypto.symbol);
      }
    }
  };
  
  const handleUseAiSignal = () => {
    if (!aiSignals) return;
    
    // Set order form based on AI recommendation
    setSide(aiSignals.recommendation === 'BUY' ? 'BUY' : 'SELL');
    setPrice(aiSignals.price.toFixed(2));
    setTakeProfit(aiSignals.targetPrice.toFixed(2));
    setStopLoss(aiSignals.stopPrice.toFixed(2));
    setUseTakeProfit(true);
    setUseStopLoss(true);
    
    // Set a default amount
    setAmount('0.1');
  };
  
  const handleSubmitOrder = () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to trade');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (orderType !== 'MARKET' && (!price || parseFloat(price) <= 0)) {
      alert('Please enter a valid price');
      return;
    }
    
    if (useTakeProfit && (!takeProfit || parseFloat(takeProfit) <= 0)) {
      alert('Please enter a valid take profit price');
      return;
    }
    
    if (useStopLoss && (!stopLoss || parseFloat(stopLoss) <= 0)) {
      alert('Please enter a valid stop loss price');
      return;
    }
    
    // Validate take profit and stop loss based on order side
    if (side === 'BUY') {
      if (useTakeProfit && parseFloat(takeProfit) <= parseFloat(price)) {
        alert('Take profit price must be higher than entry price for BUY orders');
        return;
      }
      
      if (useStopLoss && parseFloat(stopLoss) >= parseFloat(price)) {
        alert('Stop loss price must be lower than entry price for BUY orders');
        return;
      }
    } else {
      if (useTakeProfit && parseFloat(takeProfit) >= parseFloat(price)) {
        alert('Take profit price must be lower than entry price for SELL orders');
        return;
      }
      
      if (useStopLoss && parseFloat(stopLoss) <= parseFloat(price)) {
        alert('Stop loss price must be higher than entry price for SELL orders');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    // Determine the full order type based on side and order type
    let fullOrderType: Order['type'];
    
    if (orderType === 'MARKET') {
      fullOrderType = side === 'BUY' ? 'BUY' : 'SELL';
    } else if (orderType === 'LIMIT') {
      fullOrderType = side === 'BUY' ? 'BUY_LIMIT' : 'SELL_LIMIT';
    } else {
      fullOrderType = side === 'BUY' ? 'BUY_STOP' : 'SELL_STOP';
    }
    
    // Create a new order
    const newOrder: Order = {
      id: uuidv4(),
      type: fullOrderType,
      price: orderType === 'MARKET' ? cryptoData.current_price : parseFloat(price),
      amount: parseFloat(amount),
      lotSize: lotSize,
      total: parseFloat(total),
      filled: 0,
      status: 'open',
      timestamp: new Date(),
      pair: selectedPair.displayName
    };
    
    // Add take profit and stop loss if enabled
    if (useTakeProfit) {
      newOrder.takeProfitPrice = parseFloat(takeProfit);
    }
    
    if (useStopLoss) {
      newOrder.stopLossPrice = parseFloat(stopLoss);
    }
    
    // Add the order to user orders
    setUserOrders(prev => [newOrder, ...prev]);
    
    // Simulate order matching (in a real app, this would be done by the exchange)
    setTimeout(() => {
      // For demo purposes, randomly fill the order
      const fillPercentage = Math.random();
      const filledAmount = newOrder.amount * fillPercentage;
      
      setUserOrders(prev => 
        prev.map(order => 
          order.id === newOrder.id 
            ? {
                ...order,
                filled: filledAmount,
                status: fillPercentage === 1 ? 'filled' : fillPercentage > 0 ? 'partial' : 'open'
              }
            : order
        )
      );
      
      setIsSubmitting(false);
      setAmount('');
      
      // Reset take profit and stop loss toggles
      setUseTakeProfit(false);
      setUseStopLoss(false);
    }, 2000);
  };
  
  const handleCancelOrder = (orderId: string) => {
    setUserOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'canceled' }
          : order
      )
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left column - Order Book */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Order Book</h3>
          
          <select
            className="bg-gray-700 text-white rounded p-1 text-sm"
            value={selectedPair.displayName}
            onChange={handlePairChange}
          >
            {tradingPairs.map((pair) => (
              <option key={pair.displayName} value={pair.displayName}>
                {pair.displayName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <div className="grid grid-cols-3 text-xs text-gray-400 mb-1">
            <div>Price ({selectedPair.quote})</div>
            <div className="text-right">Amount ({selectedPair.base})</div>
            <div className="text-right">Total</div>
          </div>
          
          {/* Asks (Sell Orders) */}
          <div className="mb-2">
            {orderBook.asks.map((ask, index) => (
              <div 
                key={`ask-${index}`}
                className="grid grid-cols-3 text-xs py-1 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleOrderBookItemClick(ask.price)}
              >
                <div className="text-red-500">{ask.price.toFixed(2)}</div>
                <div className="text-right">{ask.amount.toFixed(4)}</div>
                <div className="text-right">{(ask.price * ask.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* Current Price */}
          <div className="border-y border-gray-600 py-2 my-2">
            <div className="text-center font-bold">
              <span className={cryptoData.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {cryptoData.current_price.toFixed(2)} {selectedPair.quote}
              </span>
            </div>
          </div>
          
          {/* Bids (Buy Orders) */}
          <div>
            {orderBook.bids.map((bid, index) => (
              <div 
                key={`bid-${index}`}
                className="grid grid-cols-3 text-xs py-1 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleOrderBookItemClick(bid.price)}
              >
                <div className="text-green-500">{bid.price.toFixed(2)}</div>
                <div className="text-right">{bid.amount.toFixed(4)}</div>
                <div className="text-right">{(bid.price * bid.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            className="text-xs text-blue-400 hover:text-blue-300"
            onClick={() => setShowDepthChart(!showDepthChart)}
          >
            {showDepthChart ? 'Hide Depth Chart' : 'Show Depth Chart'}
          </button>
          
          <div className="text-xs text-gray-400">
            Spread: {(orderBook.asks[0]?.price - orderBook.bids[0]?.price).toFixed(2)} {selectedPair.quote}
          </div>
        </div>
        
        {showDepthChart && (
          <div className="mt-4 h-40 bg-gray-900 rounded-lg p-2">
            <div className="text-center text-xs text-gray-400 mb-2">Market Depth Chart</div>
            <div className="h-32 flex items-end">
              {/* Simple visual representation of market depth */}
              <div className="flex-1 flex items-end justify-end">
                {orderBook.bids.map((bid, index) => (
                  <div 
                    key={`depth-bid-${index}`}
                    className="w-2 bg-green-500 opacity-70 mx-px"
                    style={{ height: `${(bid.amount / 2) * 100}%` }}
                    title={`${bid.price.toFixed(2)} ${selectedPair.quote} - ${bid.amount.toFixed(4)} ${selectedPair.base}`}
                  ></div>
                ))}
              </div>
              <div className="h-full w-px bg-gray-600"></div>
              <div className="flex-1 flex items-end">
                {orderBook.asks.map((ask, index) => (
                  <div 
                    key={`depth-ask-${index}`}
                    className="w-2 bg-red-500 opacity-70 mx-px"
                    style={{ height: `${(ask.amount / 2) * 100}%` }}
                    title={`${ask.price.toFixed(2)} ${selectedPair.quote} - ${ask.amount.toFixed(4)} ${selectedPair.base}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* AI Signal Recommendation */}
        {aiSignals && (
          <div className="mt-4 bg-gray-900 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-sm">AI Signal</h4>
              <span className="text-xs text-gray-400">
                {aiSignals.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex items-center mb-2">
              <div 
                className={`px-2 py-1 rounded text-xs font-bold mr-2 ${
                  aiSignals.recommendation === 'BUY' ? 'bg-green-900 text-green-300' :
                  aiSignals.recommendation === 'SELL' ? 'bg-red-900 text-red-300' :
                  'bg-gray-700 text-gray-300'
                }`}
              >
                {aiSignals.recommendation}
              </div>
              <div className="text-xs">
                Confidence: <span className="font-bold">{aiSignals.confidence}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
              <div>Entry: <span className="font-bold">{aiSignals.price.toFixed(2)}</span></div>
              <div>Target: <span className="font-bold">{aiSignals.targetPrice.toFixed(2)}</span></div>
              <div>Stop: <span className="font-bold">{aiSignals.stopPrice.toFixed(2)}</span></div>
              <div>ROI: <span className={`font-bold ${aiSignals.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aiSignals.roi.toFixed(2)}%
              </span></div>
            </div>
            
            <p className="text-xs text-gray-400 mb-2">{aiSignals.reasoning}</p>
            
            <button
              onClick={handleUseAiSignal}
              className="w-full py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
            >
              Use This Signal
            </button>
          </div>
        )}
      </div>
      
      {/* Middle column - Order Form */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">Place Order</h3>
        
        <div className="mb-4">
          <label htmlFor="cryptoSelect" className="block text-sm font-medium text-gray-400 mb-1">
            Trading Pair
          </label>
          <select
            id="pairSelect"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={selectedPair.displayName}
            onChange={handlePairChange}
          >
            {tradingPairs.map((pair) => (
              <option key={pair.displayName} value={pair.displayName}>
                {pair.displayName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg ${
              orderType === 'LIMIT' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => handleOrderTypeChange('LIMIT')}
          >
            Limit
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${
              orderType === 'MARKET' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => handleOrderTypeChange('MARKET')}
          >
            Market
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${
              orderType === 'STOP' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => handleOrderTypeChange('STOP')}
          >
            Stop
          </button>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-lg ${
              side === 'BUY' ? 'bg-green-600' : 'bg-gray-700'
            }`}
            onClick={() => handleSideChange('BUY')}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 rounded-lg ${
              side === 'SELL' ? 'bg-red-600' : 'bg-gray-700'
            }`}
            onClick={() => handleSideChange('SELL')}
          >
            Sell
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">
            Price ({selectedPair.quote})
          </label>
          <input
            type="text"
            id="price"
            className={`w-full bg-gray-700 text-white rounded p-2 ${
              orderType === 'MARKET' ? 'opacity-50' : ''
            }`}
            value={orderType === 'MARKET' ? 'Market Price' : price}
            onChange={handlePriceChange}
            disabled={orderType === 'MARKET' || isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">
            Amount ({selectedPair.base})
          </label>
          <input
            type="text"
            id="amount"
            className="w-full bg-gray-700 text-white rounded p-2"
            value={amount}
            onChange={handleAmountChange}
            disabled={isSubmitting}
          />
          <div className="flex justify-between mt-1">
            <button 
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setAmount((parseFloat(price) > 0 ? (10 / parseFloat(price)).toFixed(4) : '0'))}
            >
              10 {selectedPair.quote}
            </button>
            <button 
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setAmount((parseFloat(price) > 0 ? (50 / parseFloat(price)).toFixed(4) : '0'))}
            >
              50 {selectedPair.quote}
            </button>
            <button 
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setAmount((parseFloat(price) > 0 ? (100 / parseFloat(price)).toFixed(4) : '0'))}
            >
              100 {selectedPair.quote}
            </button>
            <button 
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setAmount((parseFloat(price) > 0 ? (500 / parseFloat(price)).toFixed(4) : '0'))}
            >
              500 {selectedPair.quote}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Lot Size
          </label>
          <div className="flex space-x-2">
            {[1, 2, 5, 10].map(size => (
              <button
                key={size}
                className={`flex-1 py-1 rounded ${
                  lotSize === size ? 'bg-blue-600' : 'bg-gray-700'
                }`}
                onClick={() => handleLotSizeChange(size)}
              >
                {size}x
              </button>
            ))}
          </div>
        </div>
        
        {/* Take Profit */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="useTakeProfit"
              className="mr-2"
              checked={useTakeProfit}
              onChange={() => setUseTakeProfit(!useTakeProfit)}
            />
            <label htmlFor="useTakeProfit" className="text-sm font-medium text-gray-400">
              Take Profit
            </label>
          </div>
          {useTakeProfit && (
            <input
              type="text"
              className="w-full bg-gray-700 text-white rounded p-2"
              value={takeProfit}
              onChange={handleTakeProfitChange}
              disabled={isSubmitting}
              placeholder={`Take profit price (${selectedPair.quote})`}
            />
          )}
        </div>
        
        {/* Stop Loss */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="useStopLoss"
              className="mr-2"
              checked={useStopLoss}
              onChange={() => setUseStopLoss(!useStopLoss)}
            />
            <label htmlFor="useStopLoss" className="text-sm font-medium text-gray-400">
              Stop Loss
            </label>
          </div>
          {useStopLoss && (
            <input
              type="text"
              className="w-full bg-gray-700 text-white rounded p-2"
              value={stopLoss}
              onChange={handleStopLossChange}
              disabled={isSubmitting}
              placeholder={`Stop loss price (${selectedPair.quote})`}
            />
          )}
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg mb-4">
          <div className="flex justify-between">
            <span>Total ({selectedPair.quote})</span>
            <span>{total}</span>
          </div>
        </div>
        
        <button
          onClick={handleSubmitOrder}
          className={`w-full py-3 rounded-lg font-bold ${
            side === 'BUY'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          disabled={isSubmitting || !isConnected}
        >
          {!isConnected 
            ? 'Connect Wallet to Trade'
            : isSubmitting
              ? 'Processing...'
              : `${side} ${selectedPair.base}`}
        </button>
      </div>
      
      {/* Right column - User Orders */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">Your Orders</h3>
        
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'open' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('open')}
          >
            Open Orders
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('history')}
          >
            Order History
          </button>
        </div>
        
        {!isConnected ? (
          <div className="text-center py-8 text-gray-400">
            Connect your wallet to view your orders
          </div>
        ) : userOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-xs text-gray-400">
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Amount</th>
                  <th className="text-right py-2">Filled</th>
                  <th className="text-right py-2">Status</th>
                  {activeTab === 'open' && <th className="text-right py-2">Action</th>}
                </tr>
              </thead>
              <tbody>
                {userOrders
                  .filter(order => 
                    activeTab === 'open' 
                      ? ['open', 'partial'].includes(order.status)
                      : ['filled', 'canceled', 'triggered'].includes(order.status)
                  )
                  .map(order => (
                    <tr key={order.id} className="text-xs border-t border-gray-700">
                      <td className={`py-2 ${
                        order.type.includes('BUY') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {order.type.replace('_', ' ')}
                      </td>
                      <td className="text-right py-2">{order.price.toFixed(2)}</td>
                      <td className="text-right py-2">
                        {order.amount.toFixed(4)}
                        <span className="text-gray-400 ml-1">
                          ({order.lotSize}x)
                        </span>
                      </td>
                      <td className="text-right py-2">
                        {order.filled.toFixed(4)}
                        <span className="text-gray-400 ml-1">
                          ({((order.filled / order.amount) * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td className="text-right py-2">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${order.status === 'open' ? 'bg-blue-900 text-blue-300' : ''}
                          ${order.status === 'partial' ? 'bg-yellow-900 text-yellow-300' : ''}
                          ${order.status === 'filled' ? 'bg-green-900 text-green-300' : ''}
                          ${order.status === 'canceled' ? 'bg-gray-700 text-gray-300' : ''}
                          ${order.status === 'triggered' ? 'bg-purple-900 text-purple-300' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      {activeTab === 'open' && (
                        <td className="text-right py-2">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderBookTrading;
