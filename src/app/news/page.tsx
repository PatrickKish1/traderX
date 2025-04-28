import Image from 'next/image';
import Link from 'next/link';
export default function NewsPage() {
  // Mock news data
  const newsArticles = [
    {
      id: 1,
      title: 'Bitcoin Surges Past $70,000 as Institutional Adoption Grows',
      summary: 'Bitcoin has reached a new all-time high above $70,000 as major financial institutions continue to increase their cryptocurrency holdings.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 15, 2024',
      author: 'Jane Smith',
      category: 'Market Analysis',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Ethereum 2.0 Upgrade Completes Final Testnet Phase',
      summary: 'The long-awaited Ethereum 2.0 upgrade has successfully completed its final testnet phase, paving the way for the mainnet launch next month.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 12, 2024',
      author: 'Michael Johnson',
      category: 'Technology',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Regulatory Clarity Coming for Crypto Markets, Says SEC Chair',
      summary: 'The SEC Chair has indicated that regulatory clarity is coming for cryptocurrency markets, potentially paving the way for greater institutional adoption.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 10, 2024',
      author: 'Robert Chen',
      category: 'Regulation',
      readTime: '4 min read'
    },
    {
      id: 4,
      title: 'DeFi Market Cap Exceeds $100 Billion for First Time',
      summary: 'The total market capitalization of DeFi tokens has exceeded $100 billion for the first time, highlighting the growing importance of decentralized finance.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 8, 2024',
      author: 'Sarah Williams',
      category: 'DeFi',
      readTime: '6 min read'
    },
    {
      id: 5,
      title: 'Major Bank Launches Cryptocurrency Custody Service',
      summary: 'One of the world\'s largest banks has announced the launch of a cryptocurrency custody service for institutional clients, marking a significant milestone for the industry.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 5, 2024',
      author: 'David Thompson',
      category: 'Banking',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'NFT Sales Reach New Heights as Digital Art Market Expands',
      summary: 'NFT sales have reached new heights as the digital art market continues to expand, with several pieces selling for millions of dollars in recent auctions.',
      image: 'https://via.placeholder.com/800x450',
      date: 'May 3, 2024',
      author: 'Emily Davis',
      category: 'NFTs',
      readTime: '8 min read'
    }
  ];
  // Featured article (first in the list)
  const featuredArticle = newsArticles[0];
  
  // Rest of the articles
  const regularArticles = newsArticles.slice(1);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Crypto News</h1>
        
        {/* Featured Article */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                  {featuredArticle.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                  {featuredArticle.date} • {featuredArticle.readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{featuredArticle.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{featuredArticle.summary}</p>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                <span className="text-gray-700 dark:text-gray-300">{featuredArticle.author}</span>
              </div>
              <Link 
                href={`/news/${featuredArticle.id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
        
        {/* News Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">All</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Market Analysis</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Technology</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Regulation</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">DeFi</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">NFTs</button>
        </div>
        
        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map(article => (
            <div key={article.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <Image
                src={article.image} 
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                    {article.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{article.author}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
                </div>
                <Link 
                  href={`/news/${article.id}`}
                  className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-blue-600 dark:bg-blue-800 rounded-lg p-8 mt-12 text-white">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p>Subscribe to our newsletter for the latest crypto news, market analysis, and trading insights.</p>
            </div>
            <div className="md:w-1/3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-gray-900"
                />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-r-lg hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
