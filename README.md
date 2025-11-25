# Monopoly Game - Frontend

A blockchain-integrated Monopoly game frontend built with Next.js, React, and Thirdweb for Celo blockchain integration.

## 🎯 Overview

This is the frontend application for a multiplayer blockchain-based Monopoly game. Players connect their Celo wallets, deposit 0.01 CELO to join games, and play in real-time through WebSocket connections.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TailwindCSS
- **Blockchain**: Thirdweb SDK for Celo Mainnet
- **WebSocket**: Native WebSocket for real-time game updates
- **State Management**: React Context API
- **Wallet**: Thirdweb Connect for wallet integration

## 🔧 Features

- **Wallet Connection**: Connect any wallet via Thirdweb (MetaMask, WalletConnect, etc.)
- **Celo Mainnet Integration**: Deposit 0.01 CELO to join games
- **Real-time Gameplay**: WebSocket connection for live game updates
- **3D Board**: Interactive Monopoly board with animations
- **Property Management**: Buy, sell, and track property ownership
- **Player UI**: See all players, their balances, and owned properties
- **Smart Contract Integration**: Direct interaction with deployed escrow contract

## 📁 Project Structure

```
gooz/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Landing page (create/join game)
│   │   └── game/[id]/         # Game board page
│   ├── components/            # React components
│   │   ├── Board.tsx          # 3D Monopoly board
│   │   ├── Player.tsx         # Player card UI
│   │   ├── CardModal.tsx      # Property purchase modal
│   │   ├── RentPaymentModal.tsx # Rent payment notification
│   │   └── ConnectWalletButton.tsx # Thirdweb wallet button
│   ├── context/               # React Context
│   │   └── GameContext.tsx    # WebSocket and game state management
│   ├── utils/                 # Utilities
│   │   └── contract.ts        # Smart contract interaction functions
│   └── styles/                # CSS styles
└── public/                    # Static assets
```

## 🛠 Setup Instructions

### **1. Install Dependencies**

```bash
npm install
# or
yarn install
```

### **2. Environment Configuration**

Create `.env.local` file:

```bash
# Thirdweb Client ID (get from https://thirdweb.com/dashboard)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# WebSocket Server URL
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Optional: Celo RPC URL (uses public RPC by default)
NEXT_PUBLIC_CELO_RPC=https://forno.celo.org
```

### **3. Start Development Server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

### 1. **Connect Wallet**
- Click "Connect Wallet" button
- Select your wallet provider (MetaMask, WalletConnect, etc.)
- Ensure you're on **Celo Mainnet** (Chain ID: 42220)

### 2. **Deposit Entry Fee**
- Entry fee: **0.01 CELO**
- Click "Create Room" or "Join Room"
- Approve the transaction in your wallet
- Wait for confirmation

### 3. **Start Game**
- Wait for 2-4 players to join
- Game starts automatically when enough players joined
- Your starting balance: 500 CELO (in-game currency)

### 4. **Play**
- Click "Roll Dice" on your turn
- Land on properties and choose to buy or pass
- Pay rent when landing on owned properties
- Manage your properties through the dropdown menu

### 5. **Win Prizes**
- Game ends when players go bankrupt
- Rankings calculated based on net worth
- Prizes distributed automatically:
  - Winner: 0.02 CELO (50%)
  - 1st Runner: 0.01 CELO (25%)
  - 2nd Runner: 0.005 CELO (12.5%)
  - Last Place: 0.0025 CELO (6.25%)

## 🌐 Smart Contract Integration

### Contract Details
- **Network**: Celo Mainnet
- **Chain ID**: 42220
- **Contract Address**: `0x2A9caFEDFc91d55E00B6d1514E39BeB940832b5D`
- **Entry Fee**: 0.01 CELO per player
- **Block Explorer**: [View on Celoscan](https://celoscan.io/address/0x2A9caFEDFc91d55E00B6d1514E39BeB940832b5D)

### Key Functions (`utils/contract.ts`)

```typescript
// Get entry fee from contract
await getEntryFee()

// Deposit entry fee to join game
await depositToGame(gameId, account)

// Check if player already deposited
await hasPlayerDeposited(gameId, playerAddress)

// Get game details from contract
await getGameDetails(gameId)
```

## 📡 WebSocket Messages

### Client → Server
- `CREATE_GAME` - Create new game room
- `JOIN_GAME` - Join existing game
- `ROLL_DICE` - Roll dice on your turn
- `BUY_PROPERTY` - Purchase property
- `PASS_PROPERTY` - Skip purchase
- `SELL_PROPERTY` - Sell property

### Server → Client
- `GAME_CREATED` - Game room created
- `PLAYER_JOINED` - Player joined game
- `GAME_STARTED` - Game started
- `DICE_ROLLED` - Dice result
- `PROPERTY_BOUGHT` - Property purchased
- `RENT_PAID` - Rent paid
- `GAME_ENDED` - Game finished with results

## 🎨 Components

### **GameContext** (`context/GameContext.tsx`)
- Manages WebSocket connection
- Handles game state
- Provides wallet integration
- Sends/receives game messages

### **Board** (`components/Board.tsx`)
- 3D Monopoly board rendering
- Player piece animations
- Property ownership display
- Interactive property cards

### **Player** (`components/Player.tsx`)
- Player card with balance
- Owned properties dropdown
- Current position indicator
- Turn status

### **CardModal** (`components/CardModal.tsx`)
- Property purchase interface
- Balance validation
- Buy/Pass options

### **ConnectWalletButton** (`components/ConnectWalletButton.tsx`)
- Thirdweb wallet connection
- Network validation (Celo Mainnet)
- Account display

## 🔐 Security Features

- **Network Validation**: Ensures users are on Celo Mainnet
- **Balance Checks**: Validates sufficient funds before transactions
- **Smart Contract Escrow**: All funds held in audited contract
- **WebSocket Security**: Validates all messages from server

## 🚀 Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
   NEXT_PUBLIC_WS_URL=wss://your-server.com
   ```
4. Deploy!

### Build for Production

```bash
npm run build
npm run start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID for wallet integration | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | Yes |
| `NEXT_PUBLIC_CELO_RPC` | Celo RPC URL (optional) | No |

## 🎯 Key Features

- ✅ **Wallet Integration**: Connect any wallet via Thirdweb
- ✅ **Celo Mainnet**: Fast, low-cost transactions
- ✅ **Real-time Gameplay**: WebSocket for instant updates
- ✅ **3D Board**: Immersive game experience
- ✅ **Smart Contract**: Trustless prize distribution
- ✅ **Mobile Responsive**: Play on any device
- ✅ **Property Management**: Full property system

## 🐛 Troubleshooting

### Wrong Network Error
- Solution: Switch to Celo Mainnet in your wallet
- Chain ID: 42220
- RPC: https://forno.celo.org

### WebSocket Connection Failed
- Check if server is running on correct port
- Verify `NEXT_PUBLIC_WS_URL` in `.env.local`
- Ensure firewall allows WebSocket connections

### Transaction Failed
- Ensure you have at least 0.01 CELO for entry fee
- Check gas balance for transaction fees
- Verify you're on Celo Mainnet

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Celo Documentation](https://docs.celo.org/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Contributing

Contributions welcome! Please check existing issues and PRs before submitting.

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, React, and Celo blockchain.
