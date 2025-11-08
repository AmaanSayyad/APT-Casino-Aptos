import { NextRequest, NextResponse } from 'next/server';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey, Account } from '@aptos-labs/ts-sdk';

// Use environment variable to determine network, default to testnet
const network = process.env.NEXT_PUBLIC_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.TESTNET;
const config = new AptosConfig({ network });
const aptos = new Aptos(config);

// Game types mapping
const GAME_TYPES = {
  plinko: 1,
  mines: 2,
  roulette: 3,
  wheel: 4,
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameType, playerAddress, betAmount, result, payout } = body;

    // Validate input
    if (!gameType || !playerAddress || !betAmount || !result || payout === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!GAME_TYPES[gameType as keyof typeof GAME_TYPES]) {
      return NextResponse.json(
        { error: 'Invalid game type' },
        { status: 400 }
      );
    }

    // Create treasury account from private key
    const rawPk = process.env.TREASURY_PRIVATE_KEY;
    if (!rawPk) {
      return NextResponse.json({ error: 'TREASURY_PRIVATE_KEY missing' }, { status: 500 });
    }
    const privateKey = new Ed25519PrivateKey(rawPk.startsWith('0x') ? rawPk : `0x${rawPk}`);
    const treasuryAccount = Account.fromPrivateKey({ privateKey });

    // Ensure GameLog resource exists for treasury; if not, initialize
    const moduleAddr = process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS!;
    try {
      await aptos.getAccountResource({
        accountAddress: String(treasuryAccount.accountAddress),
        resourceType: `${moduleAddr}::game_logger::GameLog`,
      });
    } catch {
      // Initialize logger
      const initTx = await aptos.transaction.build.simple({
        sender: treasuryAccount.accountAddress,
        data: {
          function: `${moduleAddr}::game_logger::initialize`,
          functionArguments: [],
        },
        options: { maxGasAmount: 200000, gasUnitPrice: 100 },
      });
      await aptos.signAndSubmitTransaction({ signer: treasuryAccount, transaction: initTx });
    }

    // Normalize amounts to octas (u64) and player address to string
    const toOctas = (n: number) => Math.floor(Number(n) * 100000000);
    const betAmountOctas = toOctas(betAmount);
    const payoutOctas = toOctas(payout);
    const playerStr = String(playerAddress);

    // Build transaction
    const transaction = await aptos.transaction.build.simple({
      sender: treasuryAccount.accountAddress,
      data: {
        function: `${process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS}::game_logger::log_game`,
        functionArguments: [
          GAME_TYPES[gameType as keyof typeof GAME_TYPES], // game_type
          playerStr, // player_address
          betAmountOctas, // bet_amount
          result, // result
          payoutOctas, // payout
        ],
      },
      options: {
        maxGasAmount: 200000,
        gasUnitPrice: 100,
      },
    });

    // Sign and submit transaction
    const committedTxn = await aptos.signAndSubmitTransaction({
      signer: treasuryAccount,
      transaction,
    });

    // Extract transaction hash - handle different possible formats
    let txHash: string;
    if (typeof committedTxn.hash === 'string') {
      txHash = committedTxn.hash;
    } else if (committedTxn.hash && typeof committedTxn.hash === 'object' && 'hash' in committedTxn.hash) {
      txHash = String(committedTxn.hash.hash);
    } else if (committedTxn.hash) {
      txHash = String(committedTxn.hash);
    } else {
      throw new Error('Transaction hash not returned from signAndSubmitTransaction');
    }

    // Ensure hash is a valid string
    if (!txHash || txHash.length === 0) {
      throw new Error('Invalid transaction hash returned');
    }

    // Wait for transaction confirmation
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: txHash,
    });

    // Verify transaction was successful
    if (!executedTransaction.success) {
      throw new Error(`Transaction failed: ${executedTransaction.vm_status || 'Unknown error'}`);
    }

    // Console log for debugging
    console.log('🎮 GAME LOGGED TO BLOCKCHAIN:');
    console.log('├── Game Type:', gameType);
    console.log('├── Player:', playerAddress);
    console.log('├── Bet Amount:', betAmount, 'APT');
    console.log('├── Result:', result);
    console.log('├── Payout:', payout, 'APT');
    console.log('├── Transaction Hash:', txHash);
    console.log('├── Treasury Address:', treasuryAccount.accountAddress.toString());
    console.log('├── Gas Used:', executedTransaction.gas_used);
    console.log('├── Gas Price:', executedTransaction.gas_unit_price);
    console.log('├── Sequence Number:', executedTransaction.sequence_number);
    console.log('├── VM Status:', executedTransaction.vm_status);
    console.log('├── Success:', executedTransaction.success);
    console.log('├── Timestamp:', new Date(Number(executedTransaction.timestamp) / 1000).toISOString());
    console.log('├── 🎲 Randomness generated on-chain by Aptos');
    console.log('├── 🔐 Transaction signed by Treasury wallet');
    console.log('└── 🌐 Explorer URL:', `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`);

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      gameLogged: true,
      explorerUrl: `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`,
    });

  } catch (error: any) {
    console.error('Error logging game:', error);
    return NextResponse.json(
      { error: `Failed to log game to blockchain: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}