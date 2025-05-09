'use client';

import Link from 'next/link';

export default function NotFound() {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</div>
          <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {`Oops! The crypto asset you're looking for seems to have vanished from the blockchain.`}
          </p>
        </div>
        
        <div className="mb-8">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="120" 
              height="120" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mx-auto text-blue-600 dark:text-blue-400"
            >
              <path d="M11.767 12.452c-1.059-.706-1.767-1.907-1.767-3.272 0-2.169 1.786-3.93 3.985-3.93 1.365 0 2.566.708 3.272 1.767"></path>
              <path d="M11.767 11.548c1.059.706 1.767 1.907 1.767 3.272 0 2.169-1.786 3.93-3.985 3.93-1.365 0-2.566-.708-3.272-1.767"></path>
              <path d="M13.985 12h1.993c.552 0 1 .448 1 1s-.448 1-1 1h-1.993"></path>
              <path d="M13.985 10h1.993c.552 0 1 .448 1 1s-.448 1-1 1h-1.993"></path>
              <path d="M9.99 14h-1.993c-.552 0-1-.448-1-1s.448-1 1-1h1.993"></path>
              <path d="M9.99 12h-1.993c-.552 0-1-.448-1-1s.448-1 1-1h1.993"></path>
              <line x1="7.5" y1="10.5" x2="16.5" y2="10.5" stroke="red" strokeWidth="1" strokeDasharray="1 2"></line>
              <circle cx="12" cy="12" r="11" strokeWidth="1" strokeDasharray="2 2"></circle>
            </svg>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {`Don't worry, you can return to our trading platform or explore other sections of our site.`}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <Link 
            href="/trade" 
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-bold rounded-lg transition-colors"
          >
            Go to Trading
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>
            If you believe this is an error, please contact our support team at{' '}
            <a href="mailto:support@cryptotraderpro.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@cryptotraderpro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
      