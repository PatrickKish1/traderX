/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid"

// Execute a trade order
export const executeOrder = async (order: any) => {
  try {
    // For development, simulate a successful order
    if (process.env.NODE_ENV === "development") {
      return mockOrderResponse(order)
    }

    // In production, make API call to Coinbase
    const response = await fetch("/api/trading/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to execute order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error executing order:", error)
    throw error
  }
}

// Mock order response for development
const mockOrderResponse = (order: any) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        order_id: uuidv4(),
        client_order_id: uuidv4(),
        product_id: order.market,
        side: order.side,
        type: order.type,
        size: order.size,
        price: order.price,
        status: "pending",
        created_at: new Date().toISOString(),
      })
    }, 1000)
  })
}

// Get order history
export const fetchOrderHistory = async (status = "all") => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV === "development") {
      return mockOrderHistory()
    }

    const response = await fetch(`/api/trading/orders?status=${status}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch order history")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching order history:", error)
    throw error
  }
}

// Mock order history for development
const mockOrderHistory = () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orders: [],
      })
    }, 500)
  })
}

// Cancel an order
export const cancelOrder = async (orderId: string) => {
  try {
    // For development, simulate a successful cancellation
    if (process.env.NODE_ENV === "development") {
      return mockCancelOrder()
    }

    const response = await fetch(`/api/trading/orders/${orderId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to cancel order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling order:", error)
    throw error
  }
}

// Mock cancel order response for development
const mockCancelOrder = () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      })
    }, 500)
  })
}
