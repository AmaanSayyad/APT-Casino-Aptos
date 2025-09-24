# APT Casino - Mainnet Deployment Guide

## 🚀 Pre-Deployment Preparations

### 1. Security Checks
- [ ] Smart contract audit completed?
- [ ] All functions working correctly on testnet?
- [ ] Emergency pause mechanism tested?
- [ ] Admin key rotation plan ready?

### 2. Technical Preparations
- [ ] Mainnet RPC endpoints updated?
- [ ] Environment variables configured for mainnet?
- [ ] Frontend build optimized for production?
- [ ] CDN and hosting services ready?

### 3. Legal and Regulatory Compliance
- [ ] KYC/AML compliance verified?
- [ ] License requirements met?
- [ ] Tax obligations determined?
- [ ] User agreements prepared?

## 📋 Deployment Steps

### Step 1: Environment Setup
```bash
# Update .env.local file for mainnet
NEXT_PUBLIC_APTOS_NETWORK=mainnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.mainnet.aptoslabs.com
NEXT_PUBLIC_APTOS_EXPLORER_URL=https://explorer.aptoslabs.com
```

### Step 2: Smart Contract Deployment
```bash
# Update network settings in Move.toml for mainnet
cd move-contracts
aptos init --profile mainnet --network mainnet

# Deploy contracts
aptos move publish --profile mainnet --named-addresses apt_casino=<YOUR_MAINNET_ADDRESS>
```

### Step 3: Frontend Build and Deploy
```bash
# Production build
npm run build

# Vercel deployment
vercel --prod

# Or manual hosting
npm run export
# Upload dist/ folder to hosting service
```

### Step 4: DNS and SSL Setup
- [ ] Domain name redirected to mainnet URL?
- [ ] SSL certificate active?
- [ ] CDN settings optimized?

## 🔐 Security Measures

### 1. Multi-Sig Wallet Setup
```move
// Multi-sig required for admin operations
public entry fun admin_payout(
    admin1: &signer,
    admin2: &signer,
    to: address,
    amount: u64
) {
    // At least 2 admin signatures required
    assert!(admin1.address() != admin2.address(), ERROR_DUPLICATE_ADMIN);
    // ... payout logic
}
```

### 2. Emergency Pause
```move
// Stop games in emergency situations
public entry fun emergency_pause(admin: &signer) {
    assert!(is_admin(admin), ERROR_NOT_ADMIN);
    global_pause = true;
}
```

### 3. Rate Limiting
```move
// Spam protection
public entry fun user_place_bet(user: &signer, amount: u64, bet_kind: u8, bet_value: u8) {
    let current_time = timestamp::now_seconds();
    let last_bet_time = get_last_bet_time(user.address());
    
    assert!(current_time - last_bet_time >= MIN_BET_INTERVAL, ERROR_TOO_FREQUENT);
    // ... bet logic
}
```

## 📊 Monitoring and Analytics

### 1. Blockchain Monitoring
- [ ] Aptos Explorer integration
- [ ] Transaction monitoring
- [ ] Gas fee tracking
- [ ] Error rate monitoring

### 2. Application Monitoring
- [ ] User activity tracking
- [ ] Game performance metrics
- [ ] Error logging and alerting
- [ ] Uptime monitoring

### 3. Financial Monitoring
- [ ] House edge tracking
- [ ] Payout ratio monitoring
- [ ] Liquidity pool health
- [ ] Revenue analytics

## 🚨 Post-Deployment Checklist

### 1. First 24 Hours
- [ ] All games working?
- [ ] Wallet connection smooth?
- [ ] Transaction fees reasonable?
- [ ] Error rate acceptable?

### 2. First Week
- [ ] User feedback collected?
- [ ] Performance bottlenecks identified?
- [ ] Security audit results evaluated?
- [ ] Backup and recovery plans tested?

### 3. First Month
- [ ] User acquisition metrics analyzed?
- [ ] Revenue projections updated?
- [ ] Scaling plans prepared?
- [ ] Community feedback integrated?

## 💰 Mainnet Deployment Costs

### 1. Smart Contract Deployment
- Module deployment: ~100-500 APT
- Resource creation: ~10-50 APT
- Gas fees: ~50-200 APT

### 2. Infrastructure
- Hosting: $50-500/month
- CDN: $20-200/month
- Monitoring: $50-300/month
- Security tools: $100-500/month

### 3. Legal and Compliance
- Legal consultation: $2,000-10,000
- Compliance audit: $5,000-20,000
- License fees: $1,000-5,000/month

## 🔄 Rollback Plan

### 1. Emergency Rollback Triggers
- Critical security vulnerability
- Major financial loss
- Regulatory compliance issues
- Technical infrastructure failure

### 2. Rollback Procedure
```bash
# 1. Emergency pause
aptos move run --function-id '0x...::casino::emergency_pause'

# 2. Frontend maintenance mode
# 3. User notification
# 4. Issue resolution
# 5. Gradual rollout
```


**Note:** This document should be updated before mainnet deployment. All steps should be tested and discussed with necessary experts.
