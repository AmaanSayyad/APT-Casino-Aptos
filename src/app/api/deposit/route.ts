import { NextRequest, NextResponse } from 'next/server';
import { Aptos, AptosConfig, Network, Ed25519PrivateKey, Account } from '@aptos-labs/ts-sdk';
import { TREASURY_ADDRESS as FRONT_TREASURY_ADDRESS } from '@/lib/aptos';

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, amount, transactionHash } = body;

    // Validate input
    if (!userAddress || !amount || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields: userAddress, amount, transactionHash' },
        { status: 400 }
      );
    }

    // Validate amount
    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid deposit amount' },
        { status: 400 }
      );
    }

    console.log('💰 PROCESSING DEPOSIT:');
    console.log('├── User Address:', userAddress);
    console.log('├── Amount:', depositAmount, 'APT');
    console.log('├── Transaction Hash:', transactionHash);
    console.log('└── Processing...');

    // Verify the transaction exists and is successful
    try {
      const transaction = await aptos.getTransactionByHash({
        transactionHash: transactionHash,
      });

      if (!transaction.success) {
        return NextResponse.json(
          { error: 'Transaction failed or not found' },
          { status: 400 }
        );
      }

      // Verify transaction is a transfer to treasury
      const normalize = (addr: string) => {
        try {
          if (!addr) return '';
          let hex = addr.toLowerCase();
          hex = hex.startsWith('0x') ? hex.slice(2) : hex;
          hex = hex.padStart(64, '0');
          return `0x${hex}`;
        } catch {
          return '';
        }
      };
      const treasuryEnv = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS || FRONT_TREASURY_ADDRESS;
      const treasuryAddress = normalize(treasuryEnv!);
      
      // Check if transaction involves treasury address
      let isValidTransfer = false;
      if (transaction.payload && transaction.payload.type === 'entry_function_payload') {
        const payload = transaction.payload as any;
        if (payload.function === '0x1::aptos_account::transfer' || 
            payload.function === '0x1::coin::transfer') {
          // Check if recipient is treasury
          const recipientRaw = payload.arguments?.[0];
          const recipient = normalize(recipientRaw);
          console.log('🔎 Deposit validation addresses:', { recipient, treasuryAddress, recipientRaw, function: payload.function });
          if (recipient === treasuryAddress) {
            isValidTransfer = true;
          }
        }
      }

      if (!isValidTransfer) {
        return NextResponse.json(
          { error: 'Invalid transaction: not a transfer to treasury' },
          { status: 400 }
        );
      }

    } catch (error) {
      console.error('Transaction verification failed:', error);
      return NextResponse.json(
        { error: 'Failed to verify transaction' },
        { status: 400 }
      );
    }

    // TEMP MODE: Accept successful transfer as a valid deposit without on-chain admin update
    // Frontend will update local balance immediately. This avoids requiring House/admin signer.
    return NextResponse.json({
      success: true,
      message: 'Transfer verified. Deposit accepted without on-chain balance update.',
      userAddress,
      amount: depositAmount,
      transactionHash,
    });

    // Ensure House resource exists and signer matches admin
    try {
      const moduleAddr = normalize(process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS!);
      const houseRes = await aptos.getAccountResource({
        accountAddress: moduleAddr,
        resourceType: `${process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS}::user_balance::House`
      });
      const adminOnChain = normalize((houseRes as any).data?.admin);
      const signerAddr = normalize((await (async () => String(treasuryAccount.accountAddress))()));
      if (!adminOnChain) {
        return NextResponse.json(
          { error: 'Contract not initialized: missing House resource. Run init.' },
          { status: 400 }
        );
      }
      if (adminOnChain !== signerAddr) {
        return NextResponse.json(
          { error: `Admin mismatch: House.admin ${adminOnChain} != signer ${signerAddr}. Use module admin key for TREASURY_PRIVATE_KEY.` },
          { status: 400 }
        );
      }
    } catch (e: any) {
      console.error('House resource check failed:', e);
      // Continue; Move will still fail if not set, but we return clearer error below.
    }

    // Create treasury account from private key
    const rawPk = process.env.TREASURY_PRIVATE_KEY;
    if (!rawPk) {
      return NextResponse.json(
        { error: 'Server misconfiguration: TREASURY_PRIVATE_KEY is missing' },
        { status: 500 }
      );
    }
    const normalizePk = (pk: string) => (pk.startsWith('0x') ? pk : `0x${pk}`);
    let treasuryAccount: Account;
    try {
      const privateKey = new Ed25519PrivateKey(normalizePk(rawPk));
      treasuryAccount = Account.fromPrivateKey({ privateKey });
    } catch (e: any) {
      console.error('Invalid TREASURY_PRIVATE_KEY:', e);
      return NextResponse.json(
        { error: 'Server misconfiguration: invalid TREASURY_PRIVATE_KEY' },
        { status: 500 }
      );
    }

    // Convert amount to octas (APT uses 8 decimal places)
    const amountOctas = Math.floor(depositAmount * 100000000);

    // Update user balance in contract
    const normalizeAddr = (input: unknown) => {
      try {
        let addr: string = '';
        if (typeof input === 'string') {
          addr = input;
        } else if (input && typeof (input as any).toString === 'function') {
          addr = (input as any).toString();
        } else if (input && typeof input === 'object' && 'address' in (input as any)) {
          addr = String((input as any).address);
        }
        addr = addr.trim();
        if (!addr) return '';
        let hex = addr.toLowerCase();
        hex = hex.startsWith('0x') ? hex.slice(2) : hex;
        if (!/^[0-9a-f]+$/.test(hex)) return '';
        if (hex.length > 64) return '';
        hex = hex.padStart(64, '0');
        return `0x${hex}`;
      } catch {
        return '';
      }
    };
    const userAddressNormalized = normalizeAddr(userAddress);
    if (!userAddressNormalized) {
      return NextResponse.json(
        { error: `Invalid user address` },
        { status: 400 }
      );
    }
    const transaction = await aptos.transaction.build.simple({
      sender: treasuryAccount.accountAddress,
      data: {
        function: `${process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS}::user_balance::admin_deposit`,
        functionArguments: [
          userAddressNormalized, // user_address
          amountOctas, // amount in octas
        ],
      },
      options: {
        maxGasAmount: 200000,
        gasUnitPrice: 100,
      },
    });

    let committedTxn;
    try {
      committedTxn = await aptos.signAndSubmitTransaction({
        signer: treasuryAccount,
        transaction,
      });
    } catch (e: any) {
      console.error('signAndSubmit admin_deposit failed:', e);
      return NextResponse.json(
        { error: `admin_deposit failed: ${e?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Wait for transaction confirmation
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: committedTxn.hash,
    });

    console.log('✅ DEPOSIT PROCESSED:');
    console.log('├── User:', userAddress);
    console.log('├── Amount:', depositAmount, 'APT');
    console.log('├── Balance Update TX:', committedTxn.hash);
    console.log('├── Gas Used:', executedTransaction.gas_used);
    console.log('└── Success!');

    return NextResponse.json({
      success: true,
      message: 'Deposit processed successfully',
      userAddress,
      amount: depositAmount,
      transactionHash: committedTxn.hash,
      explorerUrl: `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet`,
    });

  } catch (error: any) {
    console.error('❌ DEPOSIT FAILED:', error);
    return NextResponse.json(
      { error: `Failed to process deposit: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}