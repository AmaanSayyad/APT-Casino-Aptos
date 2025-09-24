Module address (apt_casino): 0x421055ba162a1f697532e79ea9a6852422d311f0993eb880c75110218d7f52c0
Roulette: 0x4210...f52c0::roulette
Mines: 0x4210...f52c0::mines
Wheel: 0x4210...f52c0::wheel
Frontend entegrasyonu için fonksiyon imzaları:
Roulette:
0x...::roulette::deposit(user: &signer, amount: u64, house_addr: address)
0x...::roulette::request_withdraw(user: &signer, amount: u64)
0x...::roulette::admin_payout(admin: &signer, to: address, amount: u64)
0x...::roulette::user_place_bet(user: &signer, amount: u64, bet_kind: u8, bet_value: u8)
0x...::roulette::house_place_bet(admin: &signer, player: address, amount: u64, bet_kind: u8, bet_value: u8)
Mines:
0x...::mines::deposit(user: &signer, amount: u64, house_addr: address)
0x...::mines::request_withdraw(user: &signer, amount: u64)
0x...::mines::admin_payout(admin: &signer, to: address, amount: u64)
0x...::mines::user_play(user: &signer, amount: u64, pick: u8)
0x...::mines::house_play(admin: &signer, player: address, amount: u64, pick: u8)
Wheel:
0x...::wheel::deposit(user: &signer, amount: u64, house_addr: address)
0x...::wheel::request_withdraw(user: &signer, amount: u64)
0x...::wheel::admin_payout(admin: &signer, to: address, amount: u64)
0x...::wheel::user_spin(user: &signer, amount: u64, sectors: u8)
0x...::wheel::house_spin(admin: &signer, player: address, amount: u64, sectors: u8)
User_Balance
demo liquidity provider
Plinko:
0x...::plinko::deposit(user: &signer, amount: u64, house_addr: address)
0x...::plinko::request_withdraw(user: &signer, amount: u64)
0x...::plinko::admin_payout(admin: &signer, to: address, amount: u64)
0x...::plinko::user_plinko(user: &signer, amount: u64, sectors: u8)
0x...::plinko::house_plinko(admin: &signer, player: address, amount: u64, sectors: u8)