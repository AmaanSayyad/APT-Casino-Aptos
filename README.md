# APT-Casino -  Real-Time GambleFi as a Decentralized Probabilistic Compute Layer on Aptos

A couple of days back, I was was on etherscan exploring some transactions and saw an advertisement of [https://stake.com/](url) which was giving 200% bonus on first deposit, I deposited 120 USDT into stake.com they gave 360 USDT as total balance in their controlled custodial wallet and when I started playing casino games I was shocked to see that I was only able to play with $1 per game and was unable to increase the betting amount beyond $1 coz and when I tried to explore and play other games on the platform the issue was persisting, I reached the customer support and got to know that this platform has cheated him under the name of wager limits as I was using the bonus scheme of 200%.

When I asked the customer support to withdraw money they showed a rule list of wager limit, which said that if I wanted to withdraw the deposited amount, then I have to play $12,300 worth of gameplay and this was a big shock for me, as I was explained a maths logic by their live support. Thereby, In the hope of getting the deposited money back, I played the different games of stake.com like roulette, mines, spin wheel, etc, the entire night and lost all the money.

I was very annoyed of that's how APT-Casino was born, which is a combination of gamefi and defi all in one platform where new web3 users can play games, perform gambling, but have a safe, secure, transparent platform that does not scam any of their users. Also, I wanted to address common issues in traditional gambling platforms.

## Problems

The traditional online gambling industry is plagued by several issues, including:
- **Unfair Game Outcomes:** 99% of platforms manipulate game results, leading to unfair play.

- **High Fees:** Users face exorbitant fees for deposits, withdrawals, and gameplay.

- **Restrictive Withdrawal Policies:** Withdrawal limits and conditions often prevent users from accessing their funds.

- **Bonus Drawbacks:** Misleading bonus schemes trap users with unrealistic wagering requirements.

- **Lack of True Asset Ownership:** Centralised platforms retain control over user assets, limiting their freedom and security.

- **User Adoption of Web2 users:** Bringing users to web3 and complexity of using wallet first time is kinda difficult for web2 users.

- **No Social Layer** → No live streaming, no community chat, no collaborative experience.  

## Solution

APT-Casino addresses these problems by offering:
- **Provably Fair Gaming:** Utilising the Aptos on-chain randomness module, my platform ensures all game outcomes are 100% transparent and verifiably fair.

![APT-Casino - Analog pptx (3)](https://github.com/user-attachments/assets/6880e1cb-769c-4272-8b66-686a90abf3be)


- **Low Fees:** Leveraging the efficiency of the Aptos blockchain to minimise transaction costs.

- **Flexible Withdrawal Policies:** Providing users with unrestricted access to their funds.

- **Transparent Bonus Schemes:** Clear and Clean bonus terms without hidden traps.

- **True Asset Ownership:** Decentralised asset management ensures users have full control over their assets.

- **Seamless wallet creation** Login via our keyless login wallet which offers sign in option with GOOGLE and APPLE option + Petra Wallet.

- **Fully Gasless and Zero Requirement of Confirming Transactions:** Our Users does not require the user to pay gas fees, it's paid by our treasury address to approve a single transaction we do it all, they can just play as of they are playing in their web2 platforms.

- **Live Streaming Integration** → Built with **Livepeer**, enabling real-time game streams, tournaments, and live dealer interaction.  

- **On-Chain Chat** → Socket.IO + wallet-signed messages ensure verifiable, real-time communication between players.  

- **ROI Share Links** → Every withdrawal (profit or loss) generates a **shareable proof-link** that renders a dynamic card (similar to Binance Futures PnL cards) when posted on X.  


<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/6c6b3f5b-60f3-4e52-ac60-a71af09a682b" />


## Key Features

1. **On-Chain Randomness:** Utilizing aptos on-chain randomness module to ensure provably fair game outcomes.
2. **Decentralized Asset Management:** Users retain full control over their funds through secure and transparent blockchain transactions.
3. **User-Friendly Interface:** An intuitive and secure interface for managing funds, placing bets, and interacting with games.
4. **Diverse Game Selection:** A variety of fully on-chain games, including roulette, mines, plinko, and spin wheel. As a (POC) Proof of Concept, developed fully on-chain 4 games but similar model can be applied to introduce the new casino games to the platform.
5. **Seamless wallet creation** Login via our keyless login wallet which offers sign in option with GOOGLE and APPLE option + Petra Wallet.
6. **Fully Gasless and Zero Requirement of Confirming Transactions:** Our Users does not require the user to pay gas fees, it's paid by our treasury address to approve a single transaction we do it all, they can just play as of they are playing in their web2 platforms.
7. **Real-Time Updates**: Live game state and balance updates
8. **Event System**: Comprehensive event tracking for all game actions
9. **Social Layer** → Live streaming, on-chain chat, and NFT-based player profiles.  

## Technical Architecture

<img width="1657" height="731" alt="Screenshot 2025-09-25 at 1 51 21 AM" src="https://github.com/user-attachments/assets/5380ce03-c176-42c4-9698-ef08d2eca5a4" />


## Technology Stack

- **Aptos Blockchain:** Ensures transparency, security, and efficiency in all transactions and game outcomes.

- **Aptos On-Chain Randomness Module:** Guarantees fair and unbiased game results.

- **Decentralized Wallet Integration:** Allows users to manage their assets securely.

- **Frontend** → Next.js + TailwindCSS for smooth, responsive UI.  

- **Relayers** → Gasless UX powered by treasury-funded relayer infrastructure.  

- **Livepeer** → Live video streaming integrated for casino games & tournaments.  

- **Socket.IO** → Real-time on-chain chat with cryptographic message signing.  

- Next.js, Javascript, Tailwind CSS, Move, Keyless login Wallet Aptos SDK, Petra Wallet.


![APT-Casino - Analog pptx (2)](https://github.com/user-attachments/assets/ec900128-0414-4311-b7a1-46ac75d39288)



## Future Plans

All though started as a idea but now we are thinking to carry forward as a business model and expand further.

- **Mainnet Launch:** Deploying on the aptos mainnet for real-world use.

- **User Testing:** Conducting extensive user testing to refine the platform.

- **Promoting the Product:** Marketing to attract a wider audience.

- **Mobile compatability:** Launching Android and iOS compatible screen size mode.

- Introducing new games to the platform

- Integrate the AI capabilities used for generating NFT profiles to provide even more personalized and engaging user experiences.

- Explore additional DeFi features like staking, farming, yield strategies to offer more financial services within the platform.

- Enabling Developers to build more transparent games in our platform.

- Bringing in new monetization to compensate the casino games/ game creators.

**Be the biggest gamefi/ gambling / games hub centre of the gaming industry.**

### Games
- **Roulette**: Classic roulette with multiple bet types (numbers, colors, odds/evens, etc.)
- **Plinko**: Dropping balls to multipliers
- **Mines**: Reveal tiles to find gems while avoiding mines
- **Spin Wheel**: Risk-based wheel spinning with different multiplier segments

## 🎯 Game Mechanics

### Roulette
- **Bet Types**: Numbers (0-36), Colors (Red/Black), Odds/Evens, High/Low, Dozens, Columns, Split, Street, Corner, Line
- **Payouts**: 1:1 to 35:1 depending on bet type
- **Randomness**: On-chain SHA3-256 with timestamp and transaction data

### Mines
- **Grid**: 5x5 grid (25 tiles)
- **Mines**: 1-24 mines per game
- **Reveal**: Click tiles to reveal gems or mines
- **Multiplier**: Increases as you reveal more tiles safely
- **Cashout**: Collect winnings at any time

### Spin Wheel
- **Risk Levels**: Low, Medium, High
- **Segments**: 6-10 segments based on risk
- **Multipliers**: 1.2x to 10x depending on risk level
- **Instant Results**: Immediate win/loss determination

### Plinko
- **High Multipliers:** Drop the balls in the pyramid and wait
- **Risk Levels**: Low, Medium, High
- **Instant Results**: Immediate win/loss determination

## 🔧 Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Contract Development
```bash
cd move-contracts

# Compile contracts
aptos move compile

# Run tests
aptos move test

# Deploy to testnet
node scripts/deploy.js testnet
```

### Environment Variables
```env
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet|mainnet
NEXT_PUBLIC_CASINO_MODULE_ADDRESS=your_module_address

TREASURY_PRIVATE_KEY=
NEXT_PUBLIC_LIVEPEER_API_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=

# Deployment
DEPLOYER_PRIVATE_KEY=your_private_key

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set Environment Variables**
In Vercel dashboard, set:
- `NEXT_PUBLIC_APTOS_NETWORK`
- `NEXT_PUBLIC_CASINO_MODULE_ADDRESS`

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy to your hosting provider**
Upload the `.next` folder and `public` folder to your hosting provider.

## 🔐 Security

### On-Chain Randomness
All games use on-chain randomness generated from:
- Block timestamp
- Transaction hash
- Player address
- Nonce values

### Provably Fair
- All game logic is on-chain
- Randomness is verifiable
- No server-side manipulation possible

### Smart Contract Security
- Reentrancy protection
- Input validation
- Proper error handling
- Event logging for transparency
