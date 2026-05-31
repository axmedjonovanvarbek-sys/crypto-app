# CryptoVision

CryptoVision is a full-stack modern web platform for real-time cryptocurrency monitoring, visualization, and analytical insights. Built with a beautiful dark fintech aesthetic, it integrates real-time price feeds with AI-driven market trend analysis.

## Features

- **Real-Time Data**: Live cryptocurrency prices, market caps, and volumes streamed via WebSockets.
- **Advanced UI/UX**: Dark mode, glassmorphism, responsive mobile-first design, and Framer Motion animations.
- **AI Analytics**: Intelligent market predictions, Bullish/Bearish indicators, and specialized comparison labels (Previous vs. Present vs. Predicted prices).
- **Interactive Charts**: Beautiful price history charts using Recharts.
- **Full-Stack Architecture**: Next.js App Router on the frontend, Express.js & MongoDB on the backend.

## Tech Stack

- **Frontend**: React, Next.js 14, Tailwind CSS, Framer Motion, Recharts, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io, Mongoose (MongoDB)
- **APIs**: CoinGecko API (with server-side caching to prevent rate-limiting)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas URI or Local MongoDB instance

### Environment Configuration

#### Backend (`/backend/.env`)
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=supersecretjwtkey_for_cryptovision
FRONTEND_URL=http://localhost:3000
```
*(Note: Since you mentioned you have a MongoDB Atlas URI, place it in the `MONGO_URI` variable).*

### Installation & Execution

#### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
*The backend will run on `http://localhost:5000` and immediately start polling CoinGecko for data.*

#### 2. Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:3000`. Open this in your browser.*

## Example API Responses

### `GET /api/crypto` (Cached CoinGecko Data with AI Analysis)
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 65432.10,
    "market_cap": 1289000000000,
    "price_change_percentage_24h": 2.45,
    "ai_analysis": {
      "trend": "Bullish",
      "suggestion": "Accumulate",
      "previous_price": 63867.35,
      "present_price": 65432.10,
      "predicted_future_price": 66740.74,
      "volatility": "Normal"
    }
  }
]
```

## Architecture Notes
- To bypass strict free-tier rate limits on CoinGecko, the backend `coinGeckoService` fetches data every 60 seconds and caches it in memory.
- The `cryptoSocket` service streams this cached data to connected clients, simulating slight real-time fluctuations every 3 seconds to provide a true "live ticker" feel for the presentation layer.
