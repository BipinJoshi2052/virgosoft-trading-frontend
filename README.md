# Trading Platform - Frontend (Vue 3 + Vite + Tailwind CSS)

A modern cryptocurrency trading platform frontend built with **Vue 3**, **Vite**, **Tailwind CSS**, **Pinia**, and real-time updates via **Pusher + Laravel Echo**.

## Features

- Fully responsive UI with Tailwind CSS
- Real-time order matching and trade execution
- Instant balance, asset, and order updates without page refresh
- Beautiful toast notifications on successful trades
- Admin panel for manual match order execution
- Private Pusher channels for secure user-specific broadcasts
- Clean, modular code with Pinia state management

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (fast development server)
- **Tailwind CSS** (utility-first styling)
- **Pinia** (state management)
- **Laravel Echo + Pusher** (real-time broadcasting)
- **Vue Toastification** (v2 - Vue 3 compatible notifications)
- **Axios** (API requests)

## Project Structure
src/
├── assets/                 # Images, icons
├── components/             # Reusable components
├── composables/            # usePusherListener.js
├── plugins/
│   └── echo.js             # Laravel Echo configuration
├── router/                 # Vue Router
├── stores/
│   └── user.js             # Pinia store for user data
│   └── auth.js             # Pinia store for authentication
├── views/                  # Page components
│   ├── Dashboard.vue   # Admin dashboard
│   ├── Login.vue       # Login page
│   ├── LimitOrderForm.vue  # Form to place limit order
│   ├── MatchOrders.vue # Admin match execution
│   ├── MyWallet.vue    # User balance & assets
│   ├── MyOrders.vue    # User order history
│   └── OrderBook.vue   # Order book
├── App.vue
└── main.js


## Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A running Laravel backend with Pusher configured
- Laravel Echo broadcasting routes enabled

### Steps

1. **Clone the repository** (or navigate to your frontend folder)

```bash
git clone https://github.com/BipinJoshi2052/virgosoft-trading-frontend
cd virgosoft-trading-frontend

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file in the root (Vite uses VITE_ prefix)**

```bash
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_APP_CLUSTER=ap2
```

4. **Run the development server**

```bash
npm run dev
```

Open http://localhost:5173 to view the app.
