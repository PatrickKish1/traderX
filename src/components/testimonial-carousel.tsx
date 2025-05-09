"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Professional Trader",
    content:
      "The AI-powered insights have completely transformed my trading strategy. I've seen a 32% increase in my portfolio since I started using this platform.",
    avatar: "/vercel.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Crypto Investor",
    content:
      "As someone new to crypto trading, this platform has been incredibly intuitive. The real-time data and educational resources have helped me make informed decisions.",
    avatar: "/vercel.svg?height=80&width=80",
    rating: 4,
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Day Trader",
    content:
      "The execution speed is unmatched. I've tried several platforms, and this one consistently provides the fastest trades with minimal slippage.",
    avatar: "/vercel.svg?height=80&width=80",
    rating: 5,
  },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 md:p-12"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-6">
              <Image
                src={testimonials[current].avatar || "/vercel.svg"}
                alt={testimonials[current].name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < testimonials[current].rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl italic text-gray-700 dark:text-gray-300 mb-8">
              {`${testimonials[current].content}`}
            </blockquote>

            <div className="mt-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{testimonials[current].name}</h4>
              <p className="text-gray-600 dark:text-gray-400">{testimonials[current].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoplay(false)
                setCurrent(index)
              }}
              className={`w-3 h-3 rounded-full ${
                index === current
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              } transition-colors`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
