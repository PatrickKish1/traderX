"use client"

import Link from "next/link"
import { Suspense, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp, ChevronDown, ChevronUp, BarChart3, Zap, Shield, Globe } from "lucide-react"
import LoadingSpinner from "@/components/loader-spinner"
import PriceTickerBanner from "@/components/price-ticker-banner"
import TradingViewChart from "@/components/trading-view-chart"
import TestimonialCarousel from "@/components/testimonial-carousel"
import MarketStatCard from "@/components/market-stats-card"
import NewsCard from "@/components/news-card"
import Footer from "@/components/footer"


export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("trending")
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Price Ticker Banner */}
      <PriceTickerBanner />

      {/* Hero Section with Parallax Effect */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/next.svg?height=800&width=1600")',
            backgroundSize: "cover",
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Trade Smarter.</span>
                <span className="block">
                  Trade <span className="text-blue-300">Faster.</span>
                </span>
                <span className="block">
                  Trade <span className="text-indigo-300">Confidently.</span>
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Experience next-generation crypto trading with AI-powered insights, professional tools, and
                lightning-fast execution.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/trade"
                    className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    Start Trading <ArrowUpRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => setShowDemo(true)}
                    className="px-8 py-4 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 border border-blue-600"
                  >
                    Watch Demo <TrendingUp size={18} />
                  </button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
                <TradingViewChart symbol="BTCUSDT" height={350} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="container mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketStatCard title="24h Trading Volume" value="$2.4B" change="+12.5%" isPositive={true} delay={0.3} />
            <MarketStatCard title="Active Traders" value="24,891" change="+5.2%" isPositive={true} delay={0.4} />
            <MarketStatCard title="Avg. Execution Time" value="0.08s" change="-15.3%" isPositive={true} delay={0.5} />
          </div>
        </div>
      </section>

      {/* Features Section with Interactive Cards */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Trading Tools That <span className="text-blue-600">Empower You</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design to give you the edge in crypto
              markets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 size={28} />,
                title: "Advanced Trading",
                description:
                  "Professional-grade interface with order books, limit orders, and advanced charting tools.",
                color: "blue",
              },
              {
                icon: <Zap size={28} />,
                title: "AI Assistant",
                description:
                  "Get market insights, price predictions, and trading signals from our AI-powered assistant.",
                color: "indigo",
              },
              {
                icon: <Shield size={28} />,
                title: "Secure Storage",
                description: "Industry-leading security protocols to keep your assets safe and protected.",
                color: "purple",
              },
              {
                icon: <Globe size={28} />,
                title: "Global Markets",
                description: "Access to thousands of markets across major exchanges worldwide.",
                color: "green",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className={`bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg border-b-4 border-${feature.color}-500 hover:shadow-xl transition-all duration-300`}
              >
                <div
                  className={`w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-full flex items-center justify-center mb-6 text-${feature.color}-600 dark:text-${feature.color}-400`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Market Overview Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Live Market <span className="text-blue-600">Insights</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Stay ahead with real-time data and market analysis.
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("trending")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "trending"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveTab("gainers")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "gainers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setActiveTab("losers")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "losers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                Top Losers
              </button>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Coin
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Change
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        24h Volume
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Market Cap
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Bitcoin */}
                    <motion.tr
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 text-yellow-600">
                            ₿
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Bitcoin</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">BTC</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900 dark:text-white">$65,432.10</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">0.00 USDT</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ChevronUp size={16} className="mr-1" />
                          <span>+2.45%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$28.5B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$1.24T</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href="/trade/btc"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Trade
                        </Link>
                      </td>
                    </motion.tr>

                    {/* Ethereum */}
                    <motion.tr
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">
                            Ξ
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Ethereum</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">ETH</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900 dark:text-white">$3,456.78</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">0.00 USDT</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end text-red-600">
                          <ChevronDown size={16} className="mr-1" />
                          <span>-1.23%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$12.7B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$415.7B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href="/trade/eth"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Trade
                        </Link>
                      </td>
                    </motion.tr>

                    {/* Solana */}
                    <motion.tr
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-600">
                            S
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Solana</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">SOL</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900 dark:text-white">$123.45</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">0.00 USDT</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ChevronUp size={16} className="mr-1" />
                          <span>+5.67%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$4.2B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">$52.8B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href="/trade/sol"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Trade
                        </Link>
                      </td>
                    </motion.tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-center">
                <Link
                  href="/markets"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                >
                  View All Markets <ArrowUpRight size={16} className="ml-1" />
                </Link>
              </div>
            </Suspense>
          </div>
        </div>
      </section>

      {/* News and Updates Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Latest <span className="text-blue-600">Crypto News</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Stay informed with the latest developments in the crypto world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NewsCard
              title="Bitcoin Reaches New All-Time High Above $70,000"
              excerpt="The world's largest cryptocurrency has broken its previous record, reaching new heights amid increased institutional adoption."
              date="2 hours ago"
              category="Market"
              image="/next.svg?height=200&width=400"
              delay={0.1}
            />
            <NewsCard
              title="Major Bank Announces Crypto Custody Services"
              excerpt="In a significant move for mainstream adoption, one of the world's largest banks will now offer cryptocurrency custody services to institutional clients."
              date="5 hours ago"
              category="Adoption"
              image="/next.svg?height=200&width=400"
              delay={0.2}
            />
            <NewsCard
              title="New Regulatory Framework Proposed for DeFi"
              excerpt="Regulators have proposed a new framework specifically designed to address the unique challenges posed by decentralized finance protocols."
              date="1 day ago"
              category="Regulation"
              image="/next.svg?height=200&width=400"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              What Our <span className="text-blue-600">Traders Say</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied traders using our platform every day.
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {/* Animated background pattern */}
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of traders using our platform for their cryptocurrency trading needs. Get started in
              minutes with our intuitive interface.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/signup"
                className="px-10 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2"
              >
                Create Free Account <ArrowUpRight size={18} />
              </Link>
            </motion.div>
            <p className="mt-6 text-blue-200">No credit card required • Free plan available • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Platform Demo</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Demo Video</h3>
                <p className="text-gray-600 dark:text-gray-400">This is where your platform demo video would play.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
