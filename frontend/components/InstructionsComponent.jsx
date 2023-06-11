import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { CheckState } from "./CheckState";
import { MinterToken } from "./BuyTokens";
import WalletInfo from "./walletInfo";

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Lottery Dapp
				</h1>
			</header>
			<div className={styles.buttons_container}>
				<h2 className={styles.header_container}>What do you want to do ?</h2>
				<WalletInfo></WalletInfo>
				<MinterToken></MinterToken>
				<CheckState></CheckState>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
}
