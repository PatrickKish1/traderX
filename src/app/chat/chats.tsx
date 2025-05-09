'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { TokenSearch } from '@/components/token-search';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatThread {
  id: string;
  title: string;
  lastMessage: Date;
  messages: ChatMessage[];
}

interface TradeSignal {
  type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
  token: string;
  amount: string;
  lotSize: number;
  price?: string;
  takeProfitPrice?: string;
  stopLossPrice?: string;
  pair: string;
}

interface SavedThread extends Omit<ChatThread, 'messages'> {
  messages: Array<Omit<ChatMessage, 'timestamp'> & { timestamp: Date }>;
}

export default function ChatPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tradeSignal, setTradeSignal] = useState<TradeSignal | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Load chat threads from localStorage on component mount
  address?.toString()
  isConnected.valueOf.toString()
  useEffect(() => {
    const savedThreads = localStorage.getItem('chatThreads');
    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads) as SavedThread[];
        // Convert string dates back to Date objects
        parsedThreads.forEach((thread: SavedThread) => {
          thread.lastMessage = new Date(thread.lastMessage);
          thread.messages.forEach((msg) => {
            msg.timestamp = new Date(msg.timestamp);
          });
        });
        setThreads(parsedThreads as unknown as ChatThread[]);
      } catch (error) {
        console.error('Error parsing saved threads:', error);
      }
    }
  }, []);
  
  // Save threads to localStorage whenever they change
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem('chatThreads', JSON.stringify(threads));
    }
  }, [threads]);
  
  const createNewThread = () => {
    const newThreadId = uuidv4();
    const newThread: ChatThread = {
      id: newThreadId,
      title: 'New Conversation',
      lastMessage: new Date(),
      messages: [
        {
          id: uuidv4(),
          role: 'assistant',
          content: "Hello! I'm your crypto assistant. I can help you with market information, news, price predictions, and even execute trades for you. How can I help you today?",
          timestamp: new Date(),
        }
      ]
    };
    
    setThreads(prev => [newThread, ...prev]);
    setActiveThread(newThreadId);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !activeThread) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    // Update the thread with the user message
    setThreads(prev => 
      prev.map(thread => 
        thread.id === activeThread 
          ? {
              ...thread,
              messages: [...thread.messages, userMessage],
              lastMessage: new Date()
            }
          : thread
      )
    );
    
    setInput('');
    setIsLoading(true);
    
    try {
      // Send the message to the AI assistant
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          threadId: activeThread
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message to AI assistant');
      }
      
      const data = await response.json();
      
      // Check if the response contains a trade signal
      const signalMatch = data.response.match(/TRADE_SIGNAL_START([\s\S]*?)TRADE_SIGNAL_END/);
      
      if (signalMatch && signalMatch[1]) {
        try {
          const signalData = JSON.parse(signalMatch[1]);
          setTradeSignal(signalData);
          
          // Remove the signal data from the response
          data.response = data.response.replace(/TRADE_SIGNAL_START[\s\S]*?TRADE_SIGNAL_END/, '');
        } catch (error) {
          console.error('Error parsing trade signal:', error);
        }
      }
      
      // Update thread title if it's a new thread with only the welcome message
      const currentThread = threads.find(t => t.id === activeThread);
      let updatedTitle = currentThread?.title || 'New Conversation';
      
      if (currentThread?.messages.length === 1 && currentThread.title === 'New Conversation') {
        // Generate a title from the first user message
        updatedTitle = input.length > 30 ? `${input.substring(0, 30)}...` : input;
      }
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      // Update the thread with the assistant message
      setThreads(prev => 
        prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                title: updatedTitle,
                messages: [...thread.messages, assistantMessage],
                lastMessage: new Date()
              }
            : thread
        )
      );
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add an error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setThreads(prev => 
        prev.map(thread => 
          thread.id === activeThread 
            ? {
                ...thread,
                messages: [...thread.messages, errorMessage],
                lastMessage: new Date()
              }
            : thread
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    if (activeThread === threadId) {
      setActiveThread(null);
    }
  };
  
  const executeTradeSignal = () => {
    if (!tradeSignal) return;
    
    // Store the signal in localStorage to be used in the trade page
    localStorage.setItem('pendingTradeSignal', JSON.stringify(tradeSignal));
    
    // Navigate to the trade page
    router.push('/trade');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  const activeThreadData = activeThread 
    ? threads.find(thread => thread.id === activeThread) 
    : null;
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Conversations</h2>
              <button 
                onClick={createNewThread}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                aria-label="New conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            
            {threads.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No conversations yet</p>
                <button 
                  onClick={createNewThread}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start a new conversation
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map(thread => (
                  <div 
                    key={thread.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      activeThread === thread.id 
                        ? 'bg-blue-100 dark:bg-blue-900' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveThread(thread.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{thread.title}</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThread(thread.id);
                        }}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        aria-label="Delete conversation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(thread.lastMessage)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chat Area */}
          <div className="w-full md:w-3/4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col h-[calc(100vh-12rem)]">
            {activeThreadData ? (
              <>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {activeThreadData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <p className="text-xs mt-1 opacity-70">
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="mb-4 text-left">
                      <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Trade Signal Card */}
                {tradeSignal && (
                  <div className="mx-4 mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
                    <h3 className="font-bold text-lg mb-2">Trade Signal Detected</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Type:</span> 
                        <span className={`font-bold ml-1 ${
                          tradeSignal.type.includes('BUY') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {tradeSignal.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Token:</span> 
                        <span className="font-bold ml-1">{tradeSignal.token}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Amount:</span> 
                        <span className="font-bold ml-1">{tradeSignal.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Lot Size:</span> 
                        <span className="font-bold ml-1">{tradeSignal.lotSize}x</span>
                      </div>
                      {tradeSignal.price && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Price:</span> 
                          <span className="font-bold ml-1">${tradeSignal.price}</span>
                        </div>
                      )}
                      {tradeSignal.takeProfitPrice && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Take Profit:</span> 
                          <span className="font-bold ml-1">${tradeSignal.takeProfitPrice}</span>
                        </div>
                      )}
                      {tradeSignal.stopLossPrice && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Stop Loss:</span> 
                          <span className="font-bold ml-1">${tradeSignal.stopLossPrice}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Pair:</span> 
                        <span className="font-bold ml-1">{tradeSignal.pair}</span>
                      </div>
                    </div>
                    <button
                      onClick={executeTradeSignal}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Execute This Trade
                    </button>
                  </div>
                )}
                
                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="absolute right-14 top-2 z-10 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {isSearchOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    
                    {isSearchOpen && (
                      <div className="absolute bottom-full w-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <TokenSearch
                          onSelect={(token) => {
                            setInput(prev => `${prev} token:${token.id} `);
                            setIsSearchOpen(false);
                          }}
                        />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about crypto markets, news, or predictions..."
                        className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                        disabled={isLoading || !input.trim()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span>Pro tip:</span>
                      <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={() => setInput("Give me a trading signal for BTC")}
                      >
                        Get BTC signal
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={() => setInput("What's your prediction for ETH in the next 24 hours?")}
                      >
                        ETH prediction
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h2 className="text-xl font-bold mb-2">No Conversation Selected</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select an existing conversation or start a new one.
                </p>
                <button 
                  onClick={createNewThread}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start a new conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





// 'use client';

// import { useState, useEffect } from 'react';
// import { useAccount } from 'wagmi';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'next/navigation';
// import { TokenSearch } from '@/components/token-search';
// import { ChevronUp, ChevronDown } from 'lucide-react';
// import { groqService } from '@/services/groq-service';

// interface ChatMessage {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// interface ChatThread {
//   id: string;
//   title: string;
//   lastMessage: Date;
//   messages: ChatMessage[];
// }

// interface TradeSignal {
//   type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
//   token: string;
//   amount: string;
//   lotSize: number;
//   price?: string;
//   takeProfitPrice?: string;
//   stopLossPrice?: string;
//   pair: string;
// }

// interface SavedThread extends Omit<ChatThread, 'messages'> {
//   messages: Array<Omit<ChatMessage, 'timestamp'> & { timestamp: Date }>;
// }

// export default function ChatPage() {
//   const { address, isConnected } = useAccount();
//   const router = useRouter();
  
//   const [threads, setThreads] = useState<ChatThread[]>([]);
//   const [activeThread, setActiveThread] = useState<string | null>(null);
//   const [input, setInput] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [tradeSignal, setTradeSignal] = useState<TradeSignal | null>(null);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
  
//   // Load chat threads from localStorage on component mount
//   address?.toString()
//   isConnected.valueOf.toString()
//   useEffect(() => {
//     const savedThreads = localStorage.getItem('chatThreads');
//     if (savedThreads) {
//       try {
//         const parsedThreads = JSON.parse(savedThreads) as SavedThread[];
//         // Convert string dates back to Date objects
//         parsedThreads.forEach((thread: SavedThread) => {
//           thread.lastMessage = new Date(thread.lastMessage);
//           thread.messages.forEach((msg) => {
//             msg.timestamp = new Date(msg.timestamp);
//           });
//         });
//         setThreads(parsedThreads as unknown as ChatThread[]);
//       } catch (error) {
//         console.error('Error parsing saved threads:', error);
//       }
//     }
//   }, []);
  
//   // Save threads to localStorage whenever they change
//   useEffect(() => {
//     if (threads.length > 0) {
//       localStorage.setItem('chatThreads', JSON.stringify(threads));
//     }
//   }, [threads]);
  
//   const createNewThread = () => {
//     const newThreadId = uuidv4();
//     const newThread: ChatThread = {
//       id: newThreadId,
//       title: 'New Conversation',
//       lastMessage: new Date(),
//       messages: [
//         {
//           id: uuidv4(),
//           role: 'assistant',
//           content: "Hello! I'm your crypto assistant. I can help you with market information, news, price predictions, and even execute trades for you. How can I help you today?",
//           timestamp: new Date(),
//         }
//       ]
//     };
    
//     setThreads(prev => [newThread, ...prev]);
//     setActiveThread(newThreadId);
//     // Save to localStorage
//     const updatedThreads = [newThread, ...threads];
//     localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
//   };
  
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || !activeThread) return;
    
//     setIsLoading(true);
    
//     // First update UI with user message
//     const userMessage = {
//       id: uuidv4(),
//       role: 'user' as const,
//       content: input,
//       timestamp: new Date(),
//     };

//     const updatedThreads = threads.map(thread => {
//       if (thread.id === activeThread) {
//         return {
//           ...thread,
//           messages: [...thread.messages, userMessage],
//           lastMessage: new Date(),
//         };
//       }
//       return thread;
//     });

//     setThreads(updatedThreads);
//     localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
    
//     try {
//       const marketData = JSON.stringify({
//         summary: "Current market data",
//         updated_at: new Date().toISOString()
//       });
      
//       const { response, tradeSignal } = await groqService.chat(
//         input,
//         marketData,
//         'BTC',
//         activeThread
//       );
      
//       // Update UI with assistant's response
//       const assistantMessage = {
//         id: uuidv4(),
//         role: 'assistant' as const,
//         content: response,
//         timestamp: new Date(),
//       };

//       const finalThreads = updatedThreads.map(thread => {
//         if (thread.id === activeThread) {
//           return {
//             ...thread,
//             messages: [...thread.messages, assistantMessage],
//             lastMessage: new Date(),
//           };
//         }
//         return thread;
//       });

//       setThreads(finalThreads);
//       localStorage.setItem('chatThreads', JSON.stringify(finalThreads));
      
//       if (tradeSignal) {
//         setTradeSignal(tradeSignal);
//         localStorage.setItem('tradeSignal', JSON.stringify(tradeSignal));
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     } finally {
//       setIsLoading(false);
//       setInput('');
//     }
//   };

//   const handleDeleteThread = (threadId: string) => {
//     setThreads(prev => prev.filter(thread => thread.id !== threadId));
//     if (activeThread === threadId) {
//       setActiveThread(null);
//     }
//     const updatedThreads = threads.filter(thread => thread.id !== threadId);
//     localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
//   };

//   // Find active thread data directly from threads state
//   const activeThreadData = threads.find(thread => thread.id === activeThread);

//   const executeTradeSignal = () => {
//     if (!tradeSignal) return;
//     router.push('/trade');
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleString();
//   };
  
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Sidebar */}
//           <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Conversations</h2>
//               <button 
//                 onClick={createNewThread}
//                 className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
//                 aria-label="New conversation"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <line x1="12" y1="5" x2="12" y2="19"></line>
//                   <line x1="5" y1="12" x2="19" y2="12"></line>
//                 </svg>
//               </button>
//             </div>
            
//             {threads.length === 0 ? (
//               <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                 <p>No conversations yet</p>
//                 <button 
//                   onClick={createNewThread}
//                   className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Start a new conversation
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {threads.map(thread => (
//                   <div 
//                     key={thread.id}
//                     className={`p-3 rounded-lg cursor-pointer ${
//                       activeThread === thread.id 
//                         ? 'bg-blue-100 dark:bg-blue-900' 
//                         : 'hover:bg-gray-200 dark:hover:bg-gray-700'
//                     }`}
//                     onClick={() => setActiveThread(thread.id)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-medium truncate">{thread.title}</h3>
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteThread(thread.id);
//                         }}
//                         className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
//                         aria-label="Delete conversation"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <polyline points="3 6 5 6 21 6"></polyline>
//                           <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//                         </svg>
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       {formatDate(thread.lastMessage)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Chat Area */}
//           <div className="w-full md:w-3/4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col h-[calc(100vh-12rem)]">
//             {activeThreadData ? (
//               <>
//                 {/* Chat Messages */}
//                 <div className="flex-1 p-4 overflow-y-auto">
//                   {activeThreadData.messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`mb-4 ${
//                         message.role === 'user' ? 'text-right' : 'text-left'
//                       }`}
//                     >
//                       <div
//                         className={`inline-block p-3 rounded-lg max-w-[80%] ${
//                           message.role === 'user'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                         }`}
//                       >
//                         <div className="whitespace-pre-wrap break-words">
//                           {message.content}
//                         </div>
//                         <p className="text-xs mt-1 opacity-70">
//                           {formatDate(message.timestamp)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
                  
//                   {isLoading && (
//                     <div className="mb-4 text-left">
//                       <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Trade Signal Card - Moved here */}
//                 {tradeSignal && (
//                   <div className="mx-4 mb-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
//                     <h3 className="font-bold text-lg mb-2">Trade Signal Detected</h3>
//                     <div className="grid grid-cols-2 gap-2 mb-3">
//                       <div>
//                         <span className="text-gray-600 dark:text-gray-400">Type:</span> 
//                         <span className={`font-bold ml-1 ${
//                           tradeSignal.type.includes('BUY') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
//                         }`}>
//                           {tradeSignal.type.replace('_', ' ')}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600 dark:text-gray-400">Token:</span> 
//                         <span className="font-bold ml-1">{tradeSignal.token}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600 dark:text-gray-400">Amount:</span> 
//                         <span className="font-bold ml-1">{tradeSignal.amount}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600 dark:text-gray-400">Lot Size:</span> 
//                         <span className="font-bold ml-1">{tradeSignal.lotSize}x</span>
//                       </div>
//                       {tradeSignal.price && (
//                         <div>
//                           <span className="text-gray-600 dark:text-gray-400">Price:</span> 
//                           <span className="font-bold ml-1">${tradeSignal.price}</span>
//                         </div>
//                       )}
//                       {tradeSignal.takeProfitPrice && (
//                         <div>
//                           <span className="text-gray-600 dark:text-gray-400">Take Profit:</span> 
//                           <span className="font-bold ml-1">${tradeSignal.takeProfitPrice}</span>
//                         </div>
//                       )}
//                       {tradeSignal.stopLossPrice && (
//                         <div>
//                           <span className="text-gray-600 dark:text-gray-400">Stop Loss:</span> 
//                           <span className="font-bold ml-1">${tradeSignal.stopLossPrice}</span>
//                         </div>
//                       )}
//                       <div>
//                         <span className="text-gray-600 dark:text-gray-400">Pair:</span> 
//                         <span className="font-bold ml-1">{tradeSignal.pair}</span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={executeTradeSignal}
//                       className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//                     >
//                       Execute This Trade
//                     </button>
//                   </div>
//                 )}
                
//                 {/* Input Form - Always show when there's an active thread */}
//                 <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex flex-col space-y-2 relative">
//                     <button
//                       type="button"
//                       onClick={() => setIsSearchOpen(!isSearchOpen)}
//                       className="absolute right-14 top-2 z-10 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                     >
//                       {isSearchOpen ? (
//                         <ChevronUp className="h-5 w-5" />
//                       ) : (
//                         <ChevronDown className="h-5 w-5" />
//                       )}
//                     </button>
                    
//                     {isSearchOpen && (
//                       <div className="absolute bottom-full w-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
//                         <TokenSearch
//                           onSelect={(token) => {
//                             setInput(prev => `${prev} token:${token.id} `);
//                             setIsSearchOpen(false);
//                           }}
//                         />
//                       </div>
//                     )}

//                     <div className="flex space-x-2">
//                       <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Ask about crypto markets, news, or predictions..."
//                         className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={isLoading}
//                       />
//                       <button
//                         type="submit"
//                         className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
//                         disabled={isLoading || !input.trim()}
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <line x1="22" y1="2" x2="11" y2="13"></line>
//                           <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                         </svg>
//                       </button>
//                     </div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
//                       <span>Pro tip:</span>
//                       <button
//                         type="button"
//                         className="text-blue-500 hover:underline"
//                         onClick={() => setInput("Give me a trading signal for BTC")}
//                       >
//                         Get BTC signal
//                       </button>
//                       <span>•</span>
//                       <button
//                         type="button"
//                         className="text-blue-500 hover:underline"
//                         onClick={() => setInput("What's your prediction for ETH in the next 24 hours?")}
//                       >
//                         ETH prediction
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-center p-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-400">
//                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//                 </svg>
//                 <h2 className="text-xl font-bold mb-2">No Conversation Selected</h2>
//                 <p className="text-gray-500 dark:text-gray-400 mb-4">
//                   Select an existing conversation or start a new one.
//                 </p>
//                 <button 
//                   onClick={createNewThread}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Start a new conversation
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }