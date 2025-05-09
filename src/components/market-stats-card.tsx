"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MarketStatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  delay?: number
}

export default function MarketStatCard({ title, value, change, isPositive, delay = 0 }: MarketStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
    >
      <h3 className="text-white/70 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-white text-2xl font-bold">{value}</p>
        <div className={`flex items-center ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp size={18} className="mr-1" /> : <TrendingDown size={18} className="mr-1" />}
          <span className="font-medium">{change}</span>
        </div>
      </div>
    </motion.div>
  )
}
