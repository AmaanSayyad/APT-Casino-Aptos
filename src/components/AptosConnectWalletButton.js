"use client";
import React from 'react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';

export default function AptosConnectWalletButton() {
	return (
		<div className="relative">
			<WalletSelector />
		</div>
	);
} 