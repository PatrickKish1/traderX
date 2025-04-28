
'use client';
import { fetchCryptoNews } from '@/lib/apiUtls';
import { NewsItem } from '@/lib/types/crypto';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchCryptoNews();
        setNews(newsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load news:', error);
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Crypto News</h2>
        <div className="animate-pulse">
          {[1, 2, 3].map((item) => (
            <div key={item} className="mb-4">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Crypto News</h2>
      
      {news.length === 0 ? (
        <p className="text-gray-400">No news available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <div className="flex">
                {item.imageUrl && (
                  <div className="flex-shrink-0 mr-3">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{item.summary}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{item.source}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsWidget;