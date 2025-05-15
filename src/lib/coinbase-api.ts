/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeCoinbaseRequest } from "./coinbase-auth"

interface OrderConfig {
  client_order_id: string
  product_id: string
  side: "BUY" | "SELL"
  order_configuration: any
}

interface OrderBookData {
  bids: Array<{ price: string; size: string }>
  asks: Array<{ price: string; size: string }>
}

export class CoinbaseAPI {
  // Get account information
  async getAccounts() {
    return makeCoinbaseRequest("GET", "/api/v3/brokerage/accounts")
  }

  // Get specific account by ID
  async getAccount(accountId: string) {
    return makeCoinbaseRequest("GET", `/api/v3/brokerage/accounts/${accountId}`)
  }

  // Get order book for a product
  async getOrderBook(productId: string, limit = 50): Promise<OrderBookData> {
    const response = await makeCoinbaseRequest(
      "GET",
      `/api/v3/brokerage/product_book?product_id=${productId}&limit=${limit}`,
    )
    return {
      bids: response.pricebook.bids,
      asks: response.pricebook.asks,
    }
  }

  // Fix getBestBidAsk method
  async getBestBidAsk(productIds: string[]) {
    const queryParams = productIds.map((id) => `product_ids=${id}`).join("&")
    const response = await makeCoinbaseRequest("GET", `/api/v3/brokerage/best_bid_ask?${queryParams}`, undefined, {
      headers: {
        'Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'Accept': 'application/json',
      },
      credentials: 'include'
    })
    return response
  }

  // Get product information
  async getProduct(productId: string) {
    return makeCoinbaseRequest("GET", `/api/v3/brokerage/products/${productId}`)
  }

  // List available products
  async listProducts(productType?: string) {
    let path = "/api/v3/brokerage/products"
    if (productType) {
      path += `?product_type=${productType}`
    }
    return makeCoinbaseRequest("GET", path)
  }

  // Create a market order
  async createMarketOrder(
    productId: string,
    side: "BUY" | "SELL",
    size: string,
    clientOrderId = `order-${Date.now()}`,
  ) {
    const orderConfig: OrderConfig = {
      client_order_id: clientOrderId,
      product_id: productId,
      side,
      order_configuration: {
        market_market_ioc: {
          base_size: size,
        },
      },
    }

    return makeCoinbaseRequest("POST", "/api/v3/brokerage/orders", orderConfig)
  }

  // Create a limit order
  async createLimitOrder(
    productId: string,
    side: "BUY" | "SELL",
    size: string,
    limitPrice: string,
    timeInForce: "GTC" | "GTD" | "FOK" = "GTC",
    clientOrderId = `order-${Date.now()}`,
  ) {
    const orderConfig: OrderConfig = {
      client_order_id: clientOrderId,
      product_id: productId,
      side,
      order_configuration: {},
    }

    if (timeInForce === "GTC") {
      orderConfig.order_configuration = {
        limit_limit_gtc: {
          base_size: size,
          limit_price: limitPrice,
          post_only: false,
        },
      }
    } else if (timeInForce === "GTD") {
      // Set expiry to 24 hours from now
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      orderConfig.order_configuration = {
        limit_limit_gtd: {
          base_size: size,
          limit_price: limitPrice,
          end_time: endTime,
          post_only: false,
        },
      }
    } else if (timeInForce === "FOK") {
      orderConfig.order_configuration = {
        limit_limit_fok: {
          base_size: size,
          limit_price: limitPrice,
        },
      }
    }

    return makeCoinbaseRequest("POST", "/api/v3/brokerage/orders", orderConfig)
  }

  // Create a stop limit order
  async createStopLimitOrder(
    productId: string,
    side: "BUY" | "SELL",
    size: string,
    limitPrice: string,
    stopPrice: string,
    stopDirection: "STOP_DIRECTION_STOP_UP" | "STOP_DIRECTION_STOP_DOWN",
    clientOrderId = `order-${Date.now()}`,
  ) {
    const orderConfig: OrderConfig = {
      client_order_id: clientOrderId,
      product_id: productId,
      side,
      order_configuration: {
        stop_limit_stop_limit_gtc: {
          base_size: size,
          limit_price: limitPrice,
          stop_price: stopPrice,
          stop_direction: stopDirection,
        },
      },
    }

    return makeCoinbaseRequest("POST", "/api/v3/brokerage/orders", orderConfig)
  }

  // Create a bracket order (entry with take profit and stop loss)
  async createBracketOrder(
    productId: string,
    side: "BUY" | "SELL",
    size: string,
    limitPrice: string,
    stopTriggerPrice: string,
    clientOrderId = `order-${Date.now()}`,
  ) {
    const orderConfig: OrderConfig = {
      client_order_id: clientOrderId,
      product_id: productId,
      side,
      order_configuration: {
        trigger_bracket_gtc: {
          base_size: size,
          limit_price: limitPrice,
          stop_trigger_price: stopTriggerPrice,
        },
      },
    }

    return makeCoinbaseRequest("POST", "/api/v3/brokerage/orders", orderConfig)
  }

  // Cancel an order
  async cancelOrder(orderId: string) {
    return makeCoinbaseRequest("POST", "/api/v3/brokerage/orders/batch_cancel", {
      order_ids: [orderId],
    })
  }

  // Get order details
  async getOrder(orderId: string) {
    return makeCoinbaseRequest("GET", `/api/v3/brokerage/orders/historical/${orderId}`)
  }

  // List orders
  async listOrders(productId?: string, orderStatus?: string[]) {
    let path = "/api/v3/brokerage/orders/historical/batch"
    const queryParams = []

    if (productId) {
      queryParams.push(`product_ids=${productId}`)
    }

    if (orderStatus && orderStatus.length > 0) {
      queryParams.push(`order_status=${orderStatus.join(",")}`)
    }

    if (queryParams.length > 0) {
      path += `?${queryParams.join("&")}`
    }

    return makeCoinbaseRequest("GET", path)
  }

  // Get fills (executed trades)
  async getFills(productId?: string, orderId?: string) {
    let path = "/api/v3/brokerage/orders/historical/fills"
    const queryParams = []

    if (productId) {
      queryParams.push(`product_ids=${productId}`)
    }

    if (orderId) {
      queryParams.push(`order_ids=${orderId}`)
    }

    if (queryParams.length > 0) {
      path += `?${queryParams.join("&")}`
    }

    return makeCoinbaseRequest("GET", path)
  }
}

// Create a singleton instance
export const coinbaseApi = new CoinbaseAPI()
