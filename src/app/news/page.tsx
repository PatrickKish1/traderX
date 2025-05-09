"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { NewsItem } from "@/lib/types/crypto"
import { CalendarIcon, Clock, ExternalLink } from "lucide-react"
import { fetchCryptoNews } from "@/lib/apiUtls"  // Add this import

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true)
        const news = await fetchCryptoNews() // Changed from fetchCryptoNews to fetchCryptoNewsUpdated
        setNewsArticles(news)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch news:", err)
        setError("Failed to load news. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

  // Extract unique categories from news items
  const categories =
    newsArticles.length > 0
      ? [
          "All",
          ...new Set(
            newsArticles.map((article) =>
              article.currencies && article.currencies.length > 0 ? article.currencies[0] : "General",
            ),
          ),
        ]
      : ["All", "Market Analysis", "Technology", "Regulation", "DeFi", "NFTs"]

  // Filter articles by category
  const filteredArticles =
    activeCategory === "All"
      ? newsArticles
      : newsArticles.filter((article) => article.currencies && article.currencies.includes(activeCategory))

  // Featured article (first in the list)
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null

  // Rest of the articles
  const regularArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : []

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Estimate read time (1 min per 200 words)
  const getReadTime = (text: string) => {
    const wordCount = text?.split(/\s+/).length || 0
    const readTime = Math.ceil(wordCount / 200)
    return `${readTime} min read`
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Crypto News</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading latest crypto news...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="bg-card rounded-lg overflow-hidden shadow-md mb-12">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="relative w-full h-64 md:h-full">
                      <Image
                        src={featuredArticle.imageUrl || "/next.svg?height=600&width=800"}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center mb-2">
                      {featuredArticle.currencies && featuredArticle.currencies.length > 0 && (
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                          {featuredArticle.currencies[0]}
                        </span>
                      )}
                      <span className="text-muted-foreground text-sm flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDate(featuredArticle.publishedAt)}
                      </span>
                      {featuredArticle.summary && (
                        <span className="text-muted-foreground text-sm ml-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getReadTime(featuredArticle.summary)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{featuredArticle.title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {featuredArticle.summary || "Click to read the full article on the source website."}
                    </p>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-muted rounded-full mr-3 flex items-center justify-center">
                        <span className="text-xs font-bold">{featuredArticle.source?.name}</span>
                      </div>
                      <span className="text-muted-foreground">{featuredArticle.source.name}</span>
                    </div>
                    <Link
                      href={featuredArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Read Full Article
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* News Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Regular Articles Grid */}
            {regularArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularArticles.map((article) => (
                  <div key={article.id} className="bg-card rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={article.imageUrl || "/next.svg?height=400&width=600"}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-2">
                        {article.currencies && article.currencies.length > 0 && (
                          <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                            {article.currencies[0]}
                          </span>
                        )}
                        <span className="text-muted-foreground text-sm">{formatDate(article.publishedAt)}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      {article.summary && (
                        <p className="text-muted-foreground mb-4 flex-1">
                          {article.summary.length > 120 ? `${article.summary.substring(0, 120)}...` : article.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-muted rounded-full mr-2 flex items-center justify-center">
                            <span className="text-xs font-bold">{article.source?.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{article.source.name}</span>
                        </div>
                        {article.summary && (
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getReadTime(article.summary)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-4 text-primary hover:underline"
                      >
                        Read More
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-lg text-muted-foreground">No articles found for this category.</p>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-primary/90 rounded-lg p-8 mt-12 text-primary-foreground">
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
                      className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-foreground bg-background"
                    />
                    <button className="px-4 py-2 bg-background text-foreground rounded-r-lg hover:bg-background/90 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
