/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
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
  tradeSignal?: any;
}

interface ChatThread {
  id: string;
  title: string;
  lastMessage: Date;
  messages: ChatMessage[];
}

interface SavedThread extends Omit<ChatThread, 'messages'> {
  messages: Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
}

interface AIResponse {
  response: {
    kwargs: {
      content: string;
    };
    tradeSignal?: any;
  };
  threadId: string;
}

export default function ChatPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tradeSignal, setTradeSignal] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('bitcoin');
  
  // Load chat threads from localStorage on component mount
  useEffect(() => {
    const savedThreads = localStorage.getItem('chatThreads');
    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads) as SavedThread[];
        // Convert string dates back to Date objects
        const convertedThreads = parsedThreads.map(thread => {
          return {
            ...thread,
            lastMessage: new Date(thread.lastMessage),
            messages: thread.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          };
        });
        setThreads(convertedThreads as unknown as ChatThread[]);
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

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThread]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
          content: "Hello! I'm BASE TRADER, your crypto assistant. I can help you with market information, price predictions, and trading signals. How can I help you today?",
          timestamp: new Date(),
        }
      ]
    };
    
    setThreads(prev => [newThread, ...prev]);
    setActiveThread(newThreadId);
    // Save to localStorage
    const updatedThreads = [newThread, ...threads];
    localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeThread) return;
    
    setIsLoading(true);
    setTradeSignal(null); // Clear previous trade signal
    
    // Check if the message includes a token selection
    const tokenPattern = /token:([a-z0-9-]+)/i;
    const tokenMatch = input.match(tokenPattern);
    const messageTokenId = tokenMatch ? tokenMatch[1].toLowerCase() : selectedToken;
    
    // First update UI with user message
    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    const updatedThreads = threads.map(thread => {
      if (thread.id === activeThread) {
        return {
          ...thread,
          messages: [...thread.messages, userMessage],
          lastMessage: new Date(),
        };
      }
      return thread;
    });

    setThreads(updatedThreads);
    localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
    
    try {
      // Get the active thread data to fetch the threadId if it exists
      const activeThreadData = threads.find(thread => thread.id === activeThread);
      const threadId = activeThreadData?.id || null;
      
      // Call the API with the token ID
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          threadId: threadId,
          tokenId: messageTokenId // Use extracted token or default
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data: AIResponse = await response.json();
      
      // Update UI with assistant's response
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant' as const,
        content: data.response.kwargs.content,
        timestamp: new Date(),
        tradeSignal: data.response.tradeSignal || null,
      };

      const finalThreads = updatedThreads.map(thread => {
        if (thread.id === activeThread) {
          // Update the thread title if it's a new thread
          const updatedThread = {
            ...thread,
            messages: [...thread.messages, assistantMessage],
            lastMessage: new Date(),
          };
          
          // Set thread title based on first message if it's "New Conversation"
          if (updatedThread.title === 'New Conversation' && updatedThread.messages.length >= 2) {
            const firstUserMessage = updatedThread.messages.find(m => m.role === 'user');
            if (firstUserMessage) {
              // Create a title from the first message (max 40 chars)
              const title = firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '');
              updatedThread.title = title;
            }
          }
          
          return updatedThread;
        }
        return thread;
      });

      setThreads(finalThreads);
      localStorage.setItem('chatThreads', JSON.stringify(finalThreads));
      
      // Extract trade signal (if present)
      if (data.response.tradeSignal) {
        setTradeSignal(data.response.tradeSignal);
      }
      
      // Set the selected token if it was changed in this message
      if (tokenMatch) {
        setSelectedToken(messageTokenId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to thread
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant' as const,
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      
      const errorThreads = updatedThreads.map(thread => {
        if (thread.id === activeThread) {
          return {
            ...thread,
            messages: [...thread.messages, errorMessage],
            lastMessage: new Date(),
          };
        }
        return thread;
      });
      
      setThreads(errorThreads);
      localStorage.setItem('chatThreads', JSON.stringify(errorThreads));
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      // Call the API to delete the thread
      await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
        }),
      });
    } catch (error) {
      console.error('Error deleting thread from API:', error);
    }

    // Always update local state regardless of API result
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    if (activeThread === threadId) {
      setActiveThread(null);
      setTradeSignal(null); // Clear trade signal when thread is deleted
    }
    const updatedThreads = threads.filter(thread => thread.id !== threadId);
    localStorage.setItem('chatThreads', JSON.stringify(updatedThreads));
  };

  // Find active thread data directly from threads state
  const activeThreadData = threads.find(thread => thread.id === activeThread);

  const executeTradeSignal = () => {
    if (!tradeSignal) return;
    
    // For now, just alert with the trade details
    alert(`Executing ${tradeSignal.type} order for ${tradeSignal.amount} ${tradeSignal.token} at ${tradeSignal.price || 'market price'}`);
    
    // In a real application, this would route to a trade execution page
    // router.push('/trade');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
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
                  
                  <div ref={messagesEndRef} />
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
                          {tradeSignal.type}
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
                
                {/* Input Form - Always show when there's an active thread */}
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
                            setSelectedToken(token.id);
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
                        placeholder="Ask about crypto markets, token information, or trade signals..."
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
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
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
                        onClick={() => setInput("token:ethereum Tell me about ETH price potential")}
                      >
                        ETH analysis
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={() => setInput("What's your price prediction for SOL?")}
                      >
                        SOL prediction
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
