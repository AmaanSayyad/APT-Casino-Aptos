# APT Casino - Liquidity Management & Treasury System

## 🎯 Current System Analysis

### What We Have Now (Test Phase)
- **Artificial Balance Manager**: Local state management with Redux
- **Simulated Winnings**: Frontend-only balance updates
- **No Real Liquidity**: Users play with their own APT, but winnings are just numbers

### Problems with Current System
- No actual casino treasury
- Winnings are not real APT
- No house edge implementation
- No revenue generation mechanism
- Users can't withdraw real winnings

## 🏦 Real Treasury System Architecture

### 1. Multi-Layer Treasury Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    APT Casino Treasury                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Game Pools    │  │  House Edge     │  │  Reserves   │ │
│  │                 │  │                 │  │             │ │
│  │ • Roulette Pool│  │ • 2.7% Edge     │  │ • Emergency │ │
│  │ • Wheel Pool   │  │ • Mines Edge    │  │ • Growth    │ │
│  │ • Mines Pool   │  │ • Wheel Edge    │  │ • Marketing │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. Smart Contract Treasury Module
```move
module apt_casino::treasury {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::account;
    
    struct Treasury has key {
        roulette_pool: Coin<AptosCoin>,
        wheel_pool: Coin<AptosCoin>,
        mines_pool: Coin<AptosCoin>,
        house_edge: Coin<AptosCoin>,
        reserves: Coin<AptosCoin>,
        total_revenue: u64,
        admin: address,
    }
    
    // Initialize treasury with initial liquidity
    public entry fun initialize_treasury(
        admin: &signer,
        initial_liquidity: u64
    ) {
        let admin_addr = signer::address_of(admin);
        let treasury = Treasury {
            roulette_pool: coin::zero<AptosCoin>(),
            wheel_pool: coin::zero<AptosCoin>(),
            mines_pool: coin::zero<AptosCoin>(),
            house_edge: coin::zero<AptosCoin>(),
            reserves: coin::zero<AptosCoin>(),
            total_revenue: 0,
            admin: admin_addr,
        };
        
        // Fund initial liquidity
        let admin_coins = coin::withdraw<AptosCoin>(admin, initial_liquidity);
        coin::deposit<AptosCoin>(&signer::create_signer(&admin_addr), admin_coins);
        
        move_to(admin, treasury);
    }
}
```

## 💰 Revenue Generation Strategy

### 1. House Edge Implementation
```move
// Calculate house edge for each game
public fun calculate_house_edge(bet_amount: u64, game_type: u8): u64 {
    match game_type {
        1 => bet_amount * 27 / 1000,  // Roulette: 2.7%
        2 => bet_amount * 30 / 1000,  // Wheel: 3.0%
        3 => bet_amount * 40 / 1000,  // Mines: 4.0%
        _ => 0
    }
}

// Distribute winnings and collect house edge
public entry fun settle_game(
    admin: &signer,
    player: address,
    game_type: u8,
    bet_amount: u64,
    win_amount: u64
) {
    let house_edge = calculate_house_edge(bet_amount, game_type);
    let net_win = win_amount - house_edge;
    
    // Transfer winnings to player
    if (net_win > 0) {
        transfer_apt_to_player(player, net_win);
    }
    
    // Add house edge to treasury
    add_to_treasury(game_type, house_edge);
}
```

### 2. Dynamic Pricing Model
```move
// Adjust house edge based on treasury health
public fun get_dynamic_edge(base_edge: u64, treasury_health: u8): u64 {
    match treasury_health {
        0 => base_edge * 120 / 100,  // High risk: +20%
        1 => base_edge * 110 / 100,  // Medium risk: +10%
        2 => base_edge,               // Normal: base rate
        3 => base_edge * 90 / 100,   // Low risk: -10%
        _ => base_edge
    }
}
```

## 🔄 Liquidity Flow Management

### 1. Game Pool Management
```move
// Manage individual game pools
public entry fun add_to_game_pool(
    admin: &signer,
    game_type: u8,
    amount: u64
) {
    let treasury = borrow_global_mut<Treasury>(@apt_casino);
    
    match game_type {
        1 => coin::merge(&mut treasury.roulette_pool, coin::withdraw<AptosCoin>(admin, amount)),
        2 => coin::merge(&mut treasury.wheel_pool, coin::withdraw<AptosCoin>(admin, amount)),
        3 => coin::merge(&mut treasury.mines_pool, coin::withdraw<AptosCoin>(admin, amount)),
        _ => abort EINVALID_GAME_TYPE
    };
}

// Rebalance pools based on demand
public entry fun rebalance_pools(admin: &signer) {
    let treasury = borrow_global_mut<Treasury>(@apt_casino);
    
    // Move excess from overfunded pools to underfunded ones
    let total_pools = coin::value(&treasury.roulette_pool) + 
                      coin::value(&treasury.wheel_pool) + 
                      coin::value(&treasury.mines_pool);
    
    let target_per_pool = total_pools / 3;
    
    // Rebalancing logic here...
}
```

### 2. Reserve Management
```move
// Emergency fund for large payouts
public entry fun use_reserves(
    admin: &signer,
    amount: u64,
    reason: vector<u8>
) {
    assert!(signer::address_of(admin) == @apt_casino, ERROR_NOT_ADMIN);
    
    let treasury = borrow_global_mut<Treasury>(@apt_casino);
    let reserves = &mut treasury.reserves;
    
    assert!(coin::value(reserves) >= amount, ERROR_INSUFFICIENT_RESERVES);
    
    // Log reserve usage
    // Transfer to admin for distribution
    coin::withdraw<AptosCoin>(admin, amount);
}
```

## 📊 Treasury Analytics & Monitoring

### 1. Real-Time Metrics
```move
// Treasury health indicators
public fun get_treasury_health(): TreasuryHealth {
    let treasury = borrow_global<Treasury>(@apt_casino);
    
    let total_liquidity = coin::value(&treasury.roulette_pool) +
                          coin::value(&treasury.wheel_pool) +
                          coin::value(&treasury.mines_pool);
    
    let reserve_ratio = coin::value(&treasury.reserves) * 100 / total_liquidity;
    
    if (reserve_ratio >= 30) {
        TreasuryHealth { level: 3, ratio: reserve_ratio }  // Excellent
    } else if (reserve_ratio >= 20) {
        TreasuryHealth { level: 2, ratio: reserve_ratio }  // Good
    } else if (reserve_ratio >= 10) {
        TreasuryHealth { level: 1, ratio: reserve_ratio }  // Warning
    } else {
        TreasuryHealth { level: 0, ratio: reserve_ratio }  // Critical
    }
}
```

### 2. Revenue Tracking
```move
// Track revenue by game type
public fun track_revenue(game_type: u8, amount: u64) {
    let treasury = borrow_global_mut<Treasury>(@apt_casino);
    treasury.total_revenue = treasury.total_revenue + amount;
    
    // Add to specific game pool
    match game_type {
        1 => coin::merge(&mut treasury.roulette_pool, coin::mint<AptosCoin>(amount)),
        2 => coin::merge(&mut treasury.wheel_pool, coin::mint<AptosCoin>(amount)),
        3 => coin::merge(&mut treasury.mines_pool, coin::mint<AptosCoin>(amount)),
        _ => {}
    };
}
```

## 🚀 Implementation Roadmap

### Phase 1: Treasury Foundation (Week 1-2)
- [ ] Deploy treasury smart contract
- [ ] Initialize with seed liquidity (e.g., 1000 APT)
- [ ] Set up admin controls and multi-sig
- [ ] Test basic treasury operations

### Phase 2: Game Integration (Week 3-4)
- [ ] Modify existing games to use treasury
- [ ] Implement house edge collection
- [ ] Update payout mechanisms
- [ ] Test with real APT transactions

### Phase 3: Advanced Features (Week 5-6)
- [ ] Dynamic pricing implementation
- [ ] Pool rebalancing automation
- [ ] Advanced analytics dashboard
- [ ] Risk management systems

### Phase 4: Production Launch (Week 7-8)
- [ ] Security audit completion
- [ ] Mainnet deployment
- [ ] Liquidity provider onboarding
- [ ] Marketing and user acquisition

## 💡 Revenue Optimization Strategies

### 1. Dynamic House Edge
- **Low Volume**: Increase edge to maintain profitability
- **High Volume**: Decrease edge to attract more players
- **Market Conditions**: Adjust based on APT price volatility

### 2. Liquidity Mining
```move
// Incentivize liquidity providers
public entry fun stake_liquidity(
    provider: &signer,
    amount: u64,
    lock_period: u64
) {
    // Stake APT in treasury
    // Earn rewards based on lock period
    // Share in house edge revenue
}
```

### 3. Tournament & Promotions
- **Weekly Tournaments**: Increase volume during specific periods
- **VIP Programs**: Higher limits for high-volume players
- **Referral Bonuses**: User acquisition incentives

## 🔒 Security & Risk Management

### 1. Multi-Sig Administration
```move
// Require multiple admin signatures for large operations
public entry fun large_withdrawal(
    admin1: &signer,
    admin2: &signer,
    admin3: &signer,
    amount: u64
) {
    assert!(is_admin(admin1) && is_admin(admin2) && is_admin(admin3), ERROR_NOT_ADMIN);
    assert!(amount <= MAX_WITHDRAWAL_AMOUNT, ERROR_AMOUNT_TOO_LARGE);
    
    // Process withdrawal
}
```

### 2. Circuit Breakers
```move
// Automatic pause when treasury health is critical
public fun check_circuit_breaker() {
    let health = get_treasury_health();
    
    if (health.level == 0) {
        // Pause all games
        // Notify admins
        // Enable emergency mode
    }
}
```

### 3. Insurance Mechanisms
- **Reserve Requirements**: Minimum 20% of total liquidity
- **Stop-Loss Limits**: Maximum daily loss limits
- **External Audits**: Regular security assessments


---

**Note**: This liquidity management system replaces the current artificial balance manager with a real, revenue-generating treasury. Implementation should be done gradually with extensive testing at each phase.
