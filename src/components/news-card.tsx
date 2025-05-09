"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface NewsCardProps {
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  delay?: number
}

export default function NewsCard({ title, excerpt, date, category, image, delay = 0 }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/next.svg"}
          alt={title}
          fill
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{category}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{date}</div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{excerpt}</p>
        <Link
          href="/news"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}
