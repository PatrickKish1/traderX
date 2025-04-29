'use client';
import { useState, useEffect } from 'react';
import { fetchCryptoPrices } from '@/lib/apiUtls';
import { CryptoData } from '@/lib/types/crypto';
import ChatAssistant from './chat-assistant';
import CryptoChart from './crypto-chart';
import CryptoGame from './crypto-game';
import MarketOverview from './market-overview';
import NewsWidget from './news-widget';
import OrderBookTrading from './order-book-trading';
import TokenSwap from './token-swap';
import TradingInterface from './trading-interfafe';
import { useTheme } from '@/lib/context/theme-context';

const Dashboard = () => {
  const {  } = useTheme();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced' | 'swap' | 'game'>('simple');
  
  useEffect(() => {
    const pendingSignal = localStorage.getItem('pendingTradeSignal');
    if (pendingSignal) {
      try {
        const signal = JSON.parse(pendingSignal);
        // Set active tab to advanced trading
        setActiveTab('advanced');
        
        // Find the crypto that matches the signal token
        const matchingCrypto = cryptoData.find(
          crypto => crypto.symbol.toUpperCase() === signal.token.toUpperCase()
        );
        
        if (matchingCrypto) {
          setSelectedCrypto(matchingCrypto.symbol);
        }
        
        // Clear the pending signal
        localStorage.removeItem('pendingTradeSignal');
      } catch (error) {
        console.error('Error parsing pending trade signal:', error);
      }
    }
  }, [cryptoData]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchCryptoPrices();
        setCryptoData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        setIsLoading(false);
      }
    };
    loadInitialData();
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const data = await fetchCryptoPrices();
        setCryptoData(data);
      } catch (error) {
        console.error('Failed to update crypto data:', error);
      }
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectCrypto = (symbol: string) => {
    setSelectedCrypto(symbol);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading market data...</div>;
  }

  const selectedCryptoData = cryptoData.find(crypto => crypto.symbol === selectedCrypto) || cryptoData[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <span className="mr-2">AI Assistant</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-md">
            <CryptoChart 
              cryptoData={selectedCryptoData} 
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-md">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
              <button
                className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'simple' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('simple')}
              >
                Simple Trade
              </button>
              <button
                className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'advanced' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced Trading
              </button>
              <button
                className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'swap' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('swap')}
              >
                Swap Tokens
              </button>
              <button
                className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'game' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('game')}
              >
                Crypto Game
              </button>
            </div>
            
            {activeTab === 'simple' && (
              <TradingInterface 
                cryptoData={selectedCryptoData}
                allCryptos={cryptoData}
                onSelectCrypto={handleSelectCrypto}
              />
            )}
            
            {activeTab === 'advanced' && (
              <OrderBookTrading 
                cryptoData={selectedCryptoData}
                allCryptos={cryptoData}
                onSelectCrypto={handleSelectCrypto}
              />
            )}
            
            {activeTab === 'swap' && (
              <TokenSwap />
            )}
            
            {activeTab === 'game' && (
              <CryptoGame />
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <MarketOverview 
              cryptoData={cryptoData} 
              onSelectCrypto={handleSelectCrypto}
              selectedCrypto={selectedCrypto}
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <NewsWidget />
          </div>
        </div>
      </div>
      {chatOpen && (
        <ChatAssistant 
          onClose={toggleChat} 
          cryptoData={cryptoData}
          selectedCrypto={selectedCryptoData}
        />
      )}
    </div>
  );
};

export default Dashboard;





// 'use client';
// import { fetchCryptoPrices } from '@/lib/apiUtls';
// import { CryptoData } from '@/lib/types/crypto';
// import { useState, useEffect } from 'react';
// import ChatAssistant from './chat-assistant';
// import CryptoChart from './crypto-chart';
// import CryptoGame from './crypto-game';
// import MarketOverview from './market-overview';
// import NewsWidget from './news-widget';
// import OrderBookTrading from './order-book-trading';
// import TokenSwap from './token-swap';
// import TradingInterface from './trading-interfafe';
// import WalletConnection from './wallet-connection';


// const Dashboard = () => {
//   const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
//   const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [chatOpen, setChatOpen] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<'simple' | 'advanced' | 'swap' | 'game'>('simple');
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const data = await fetchCryptoPrices();
//         setCryptoData(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch crypto data:', error);
//         setIsLoading(false);
//       }
//     };
//     loadInitialData();
//     // Set up interval to refresh data every 30 seconds
//     const intervalId = setInterval(async () => {
//       try {
//         const data = await fetchCryptoPrices();
//         setCryptoData(data);
//       } catch (error) {
//         console.error('Failed to update crypto data:', error);
//       }
//     }, 30000);
//     return () => clearInterval(intervalId);
//   }, []);
//   const handleSelectCrypto = (symbol: string) => {
//     setSelectedCrypto(symbol);
//   };
//   const toggleChat = () => {
//     setChatOpen(!chatOpen);
//   };
//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading market data...</div>;
//   }
//   const selectedCryptoData = cryptoData.find(crypto => crypto.symbol === selectedCrypto) || cryptoData[0];
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <header className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">CryptoTrader Pro</h1>
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={toggleChat}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//           >
//             <span className="mr-2">AI Assistant</span>
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//             </svg>
//           </button>
//           <WalletConnection />
//         </div>
//       </header>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-gray-800 rounded-lg p-4 mb-6">
//             <CryptoChart 
//               cryptoData={selectedCryptoData} 
//             />
//           </div>
          
//           <div className="bg-gray-800 rounded-lg p-4 mb-6">
//             <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
//               <button
//                 className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'simple' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('simple')}
//               >
//                 Simple Trade
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'advanced' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('advanced')}
//               >
//                 Advanced Trading
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'swap' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('swap')}
//               >
//                 Swap Tokens
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'game' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
//                 onClick={() => setActiveTab('game')}
//               >
//                 Crypto Game
//               </button>
//             </div>
            
//             {activeTab === 'simple' && (
//               <TradingInterface 
//                 cryptoData={selectedCryptoData}
//                 allCryptos={cryptoData}
//                 onSelectCrypto={handleSelectCrypto}
//               />
//             )}
            
//             {activeTab === 'advanced' && (
//               <OrderBookTrading 
//                 cryptoData={selectedCryptoData}
//                 allCryptos={cryptoData}
//                 onSelectCrypto={handleSelectCrypto}
//               />
//             )}
            
//             {activeTab === 'swap' && (
//               <TokenSwap />
//             )}
            
//             {activeTab === 'game' && (
//               <CryptoGame />
//             )}
//           </div>
//         </div>
        
//         <div className="space-y-6">
//           <MarketOverview 
//             cryptoData={cryptoData} 
//             onSelectCrypto={handleSelectCrypto}
//             selectedCrypto={selectedCrypto}
//           />
          
//           <NewsWidget />
//         </div>
//       </div>
//       {chatOpen && (
//         <ChatAssistant 
//           onClose={toggleChat} 
//           cryptoData={cryptoData}
//           selectedCrypto={selectedCryptoData}
//         />
//       )}
//     </div>
//   );
// };
// export default Dashboard;