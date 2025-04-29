# CryptoTraderX

![CryptoTrader Pro Logo](https://via.placeholder.com/150)

A comprehensive cryptocurrency trading platform combining advanced trading features with AI-powered assistance.

## Features

### Trading Features

- Advanced Order Book Trading
- Multiple order types (Market, Limit, Stop)
- Take Profit and Stop Loss functionality
- Lot size controls (1x, 2x, 5x, 10x multipliers)
- Trading pairs (BTC/USDC, ETH/USDC, etc.)
- Real-time market depth visualization
- Order history tracking

### Token Swapping

- Uniswap integration for token swaps
- Support for multiple tokens beyond ETH
- Token search functionality
- Popular tokens grid for quick selection

### Wallet Integration

- Base blockchain wallet connection
- Social login options
- Protected trading pages requiring wallet connection
- Balance display and transaction capabilities

### AI Assistant

- Intelligent Chat Interface
- Market analysis and insights
- Latest crypto news summaries
- Price predictions with technical analysis
- Trading signal recommendations with TP/SL
- Natural language trading commands
- Conversation history with thread IDs

### Additional Features

- Crypto Catcher Game (interactive crypto-themed game)
- Light/Dark mode toggle
- Responsive design for all devices

## Technology Stack

### Frontend

- Next.js for server-side rendering and routing
- React for component-based UI
- Tailwind CSS for styling
- Canvas API for the interactive game

### Blockchain Integration

- OnchainKit for Base blockchain integration
- Uniswap SDK for token swapping
- Web3 libraries for wallet connection

### AI Integration

- OpenAI API for the intelligent assistant
- Custom price prediction algorithms
- Trading signal generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm
- A Base blockchain wallet (for trading features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/PatrickKish1/traderX.git
   cd traderX
   ```
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Set up environment variables
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_COINBASE_CLIENT_API_KEY=your_api_key
   OPENAI_API_KEY=your_openai_api_key
   BASE_PROJECT_ID=base-project-id
   ```
4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open http://localhost:3000 in your browser

## Built with Ohara AI

This project was built with the assistance of Ohara AI during the Base Buildathon. Ohara helped with:

- Generating the initial application structure
- Creating the advanced trading components
- Implementing the AI assistant functionality
- Developing the interactive game
- Integrating Base blockchain features

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Base Blockchain for the infrastructure
- Coinbase for developer tools
- Uniswap for swap functionality
- OpenAI for AI capabilities
- Ohara AI for development assistance
