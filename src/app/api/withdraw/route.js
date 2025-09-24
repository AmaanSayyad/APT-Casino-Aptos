import { NextResponse } from 'next/server';
import { AptosAccount, AptosClient, CoinClient } from 'aptos';

// Kasa cüzdan private key'i - environment variable'dan al
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || "0x0e5070144da800e1528a09e39ee0f589a4feafb880968de6f0d5479f7258bd82";
const APTOS_NODE_URL = process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' 
  ? 'https://fullnode.mainnet.aptoslabs.com/v1'
  : 'https://fullnode.testnet.aptoslabs.com/v1';

const client = new AptosClient(APTOS_NODE_URL);
const FEE_RECIPIENT = (process.env.NEXT_PUBLIC_FEE_RECIPIENT || '0xbfd4cae37a399079687652a29f06d0f42924accc3d4c5f1d5fdc4f75d9233744').toLowerCase();
const FEE_BPS = Number(process.env.WITHDRAW_PROFIT_FEE_BPS || 100); // 1% = 100 bps

export async function POST(request) {
  try {
    const { userAddress, amount, principal } = await request.json();
    
    console.log('📥 Received withdrawal request:', { userAddress, amount, type: typeof userAddress });
    
    // Validate input
    if (!userAddress || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    if (!TREASURY_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Treasury not configured' },
        { status: 500 }
      );
    }

    // Create treasury account from private key
    const treasuryAccount = new AptosAccount(
      new Uint8Array(Buffer.from(TREASURY_PRIVATE_KEY.slice(2), 'hex'))
    );
    
    const coinClient = new CoinClient(client);
    
    // Convert amounts to octas (APT has 8 decimal places)
    const toOctas = (v) => Math.floor(Number(v) * 100000000);
    const amountOctas = toOctas(amount);
    const principalOctas = typeof principal === 'number' ? toOctas(principal) : 0;
    const grossProfitOctas = Math.max(0, amountOctas - principalOctas);
    const feeOctas = Math.floor((grossProfitOctas * FEE_BPS) / 10000);
    const userPayoutOctas = Math.max(0, amountOctas - feeOctas);
    
    console.log(`🏦 Processing withdrawal: ${amount} APT to ${userAddress}`);
    console.log(`📍 Treasury: ${treasuryAccount.address().hex()}`);
    
    // Check treasury balance
    let treasuryBalance = 0;
    try {
      treasuryBalance = await coinClient.checkBalance(treasuryAccount);
      console.log(`💰 Treasury balance: ${treasuryBalance / 100000000} APT`);
    } catch (balanceError) {
      console.log('⚠️ Could not check treasury balance, proceeding with transfer attempt...');
      console.log('Balance error:', balanceError.message);
    }
    
    if (treasuryBalance > 0 && treasuryBalance < amountOctas) {
      return NextResponse.json(
        { error: `Insufficient treasury funds. Available: ${treasuryBalance / 100000000} APT, Requested: ${amount} APT` },
        { status: 400 }
      );
    }
    
    // Transfer APT from treasury to user
    // Convert userAddress to hex string if it's an object
    let formattedUserAddress;
    if (typeof userAddress === 'object' && userAddress.data) {
      // Convert Uint8Array-like object to hex string
      const bytes = Object.values(userAddress.data);
      formattedUserAddress = '0x' + bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    } else if (typeof userAddress === 'string') {
      formattedUserAddress = userAddress.startsWith('0x') ? userAddress : `0x${userAddress}`;
    } else {
      throw new Error(`Invalid userAddress format: ${typeof userAddress}`);
    }
    
    console.log('🔧 Formatted user address:', formattedUserAddress);
    console.log('🔧 Treasury account:', treasuryAccount.address().hex());
    console.log('🔧 Amount in octas:', amountOctas);
    console.log('🔧 Principal in octas:', principalOctas);
    console.log('🔧 Profit in octas:', grossProfitOctas);
    console.log('🔧 Fee (bps:', FEE_BPS, ') in octas:', feeOctas, '→ recipient:', FEE_RECIPIENT);
    console.log('🔧 User payout in octas:', userPayoutOctas);
    
    // Ensure treasury has enough for both transfers
    const totalRequired = userPayoutOctas + feeOctas;
    if (treasuryBalance > 0 && treasuryBalance < totalRequired) {
      return NextResponse.json(
        { error: `Insufficient treasury funds. Available: ${treasuryBalance / 100000000} APT, Required: ${totalRequired / 100000000} APT` },
        { status: 400 }
      );
    }

    // Perform transfers: fee first (if any), then user payout
    let feeTxHash = null;
    if (feeOctas > 0) {
      const feeRecipient = FEE_RECIPIENT.startsWith('0x') ? FEE_RECIPIENT : `0x${FEE_RECIPIENT}`;
      feeTxHash = await coinClient.transfer(
        treasuryAccount,
        feeRecipient,
        feeOctas
      );
      await client.waitForTransaction(feeTxHash);
      console.log(`✅ Fee transfer: ${feeOctas / 100000000} APT to ${feeRecipient}, TX: ${feeTxHash}`);
    }

    const userTxHash = await coinClient.transfer(
      treasuryAccount,
      formattedUserAddress,
      userPayoutOctas
    );
    await client.waitForTransaction(userTxHash);
    console.log(`✅ Withdrawal successful: ${userPayoutOctas / 100000000} APT to ${userAddress}, TX: ${userTxHash}`);

    return NextResponse.json({
      success: true,
      amountRequested: amount,
      principal: principal || 0,
      fee: feeOctas / 100000000,
      userPayout: userPayoutOctas / 100000000,
      feeTxHash,
      userTxHash,
      userAddress: formattedUserAddress,
      treasuryAddress: treasuryAccount.address().hex()
    });
    
  } catch (error) {
    console.error('Withdraw API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Withdrawal failed: ' + error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check treasury balance
export async function GET() {
  try {
    if (!TREASURY_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Treasury not configured' },
        { status: 500 }
      );
    }

    const treasuryAccount = new AptosAccount(
      new Uint8Array(Buffer.from(TREASURY_PRIVATE_KEY.slice(2), 'hex'))
    );
    
    const coinClient = new CoinClient(client);
    
    try {
      const balance = await coinClient.checkBalance(treasuryAccount);
      
      return NextResponse.json({
        treasuryAddress: treasuryAccount.address().hex(),
        balance: balance / 100000000, // Convert to APT
        balanceOctas: balance.toString(),
        status: 'active'
      });
    } catch (balanceError) {
      return NextResponse.json({
        treasuryAddress: treasuryAccount.address().hex(),
        balance: 0,
        balanceOctas: '0',
        status: 'initializing',
        note: 'Treasury wallet is being initialized. Please wait a few minutes.'
      });
    }
    
  } catch (error) {
    console.error('Treasury balance check error:', error);
    return NextResponse.json(
      { error: 'Failed to check treasury balance: ' + error.message },
      { status: 500 }
    );
  }
}