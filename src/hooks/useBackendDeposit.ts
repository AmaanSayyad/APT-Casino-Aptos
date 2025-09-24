import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'react-toastify';

interface DepositResult {
  success: boolean;
  transactionHash?: string;
  explorerUrl?: string;
  message?: string;
}

interface UseBackendDepositProps {
  signAndSubmitTransaction?: any;
}

export const useBackendDeposit = (props?: UseBackendDepositProps) => {
  const [isDepositing, setIsDepositing] = useState(false);
  const { account, signAndSubmitTransaction: walletSignAndSubmit } = useWallet();
  
  const signAndSubmitTransaction = props?.signAndSubmitTransaction || walletSignAndSubmit;

  const deposit = async (amount: number): Promise<DepositResult> => {
    console.log('🔍 WALLET DEBUG:', {
      account: account?.address,
      signAndSubmitTransaction: typeof signAndSubmitTransaction,
      hasFunction: !!signAndSubmitTransaction
    });

    if (!account?.address || !signAndSubmitTransaction) {
      toast.error('Please connect your wallet first');
      return { success: false, message: 'Wallet not connected' };
    }

    if (amount <= 0) {
      toast.error('Please enter a valid deposit amount');
      return { success: false, message: 'Invalid amount' };
    }

    setIsDepositing(true);

    try {
      console.log('🏦 STARTING BACKEND DEPOSIT:');
      console.log('├── User Address:', account.address);
      console.log('├── Amount:', amount, 'APT');
      console.log('└── Step 1: Sending APT to Treasury...');

      // Step 1: Send APT to treasury address
      const treasuryAddress = process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS!;
      const amountOctas = Math.floor(amount * 100000000);

      // Try different payload formats
      let transferResponse;
      
      try {
        // Format 1: Standard entry function
        const payload1 = {
          function: "0x1::aptos_account::transfer",
          type_arguments: [],
          arguments: [treasuryAddress, amountOctas.toString()],
        };
        
        console.log('📤 Trying payload format 1:', payload1);
        transferResponse = await signAndSubmitTransaction(payload1);
        
      } catch (error1) {
        console.log('❌ Format 1 failed, trying format 2...');
        
        try {
          // Format 2: With type specified
          const payload2 = {
            type: "entry_function_payload",
            function: "0x1::aptos_account::transfer",
            type_arguments: [],
            arguments: [treasuryAddress, amountOctas.toString()],
          };
          
          console.log('📤 Trying payload format 2:', payload2);
          transferResponse = await signAndSubmitTransaction(payload2);
          
        } catch (error2) {
          console.log('❌ Format 2 failed, trying format 3...');
          
          // Format 3: Coin transfer
          const payload3 = {
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [treasuryAddress, amountOctas.toString()],
          };
          
          console.log('📤 Trying payload format 3:', payload3);
          transferResponse = await signAndSubmitTransaction(payload3);
        }
      }

      if (!transferResponse?.hash) {
        throw new Error('Transfer transaction failed');
      }

      console.log('✅ Transfer successful:', transferResponse.hash);
      console.log('└── Step 2: Updating balance via backend...');

      // Step 2: Call backend to update user balance
      const backendResponse = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: account.address,
          amount: amount,
          transactionHash: transferResponse.hash,
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendData.success) {
        throw new Error(backendData.error || 'Backend deposit failed');
      }

      console.log('🎉 DEPOSIT COMPLETED:');
      console.log('├── Transfer TX:', transferResponse.hash);
      console.log('├── Balance Update TX:', backendData.transactionHash);
      console.log('├── Explorer URL:', backendData.explorerUrl);
      console.log('└── Success!');

      toast.success(`Successfully deposited ${amount} APT! Balance updated.`);

      return {
        success: true,
        transactionHash: backendData.transactionHash,
        explorerUrl: backendData.explorerUrl,
        message: 'Deposit completed successfully',
      };

    } catch (error: any) {
      console.error('❌ DEPOSIT FAILED:', error);
      toast.error(`Deposit failed: ${error.message}`);
      
      return {
        success: false,
        message: error.message || 'Deposit failed',
      };
    } finally {
      setIsDepositing(false);
    }
  };

  return {
    deposit,
    isDepositing,
  };
};