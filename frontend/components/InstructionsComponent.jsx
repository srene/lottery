import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import { CheckState } from "./CheckState";
import { BuyingToken, MinterToken } from "./BuyTokens";
import { OpenBets } from "./OpenBets";
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
				<BuyingToken></BuyingToken>
				<CheckState></CheckState>
				<OpenBets></OpenBets>
			</div>
			<div className={styles.footer}>
				Footer
			</div>
		</div>
	);
}


// async function openBets(duration) {
// 	const currentBlock = await provider.getBlock("latest");
// 	const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
// 	const receipt = await tx.wait();
// 	console.log(`Bets opened (${receipt.transactionHash}) `);
// }

async function displayBalance(index) {
	// const balanceBN = await provider.getBalance(accounts[Number(index)].getAddress());
	const balanceBN = await accounts[Number(index)].getBalance();
	const balance = ethers.utils.formatEther(balanceBN);
	console.log(
		`The account address ${accounts[Number(index)].getAddress()} has ${balance} ETH\n`
	);
}

async function buyTokens(index, amount) {
	// TODO
	await contract.connect(accounts[Number(index)]).purchaseTokens({ value: ethers.utils.parseUnits(amount) });


}

async function displayTokenBalance(index) {
	const balanceBN = await token.balanceOf(accounts[Number(index)].getAddress());
	const balance = ethers.utils.formatEther(balanceBN);
	console.log(
		`The account address ${accounts[Number(index)].getAddress()} has ${balance} ETH\n`
	);
}

async function bet(index, amount) {

	const allowTx = await token
		.connect(accounts[Number(index)])
		.approve(contract.address, ethers.constants.MaxUint256);
	await allowTx.wait();
	const tx = await contract.connect(accounts[Number(index)]).betMany(amount);
	const receipt = await tx.wait();
	console.log(`Bets placed (${receipt.transactionHash})\n`);
}

async function closeLottery() {
	const tx = await contract.closeLottery();
	const receipt = await tx.wait();
	console.log(`Bets closed (${receipt.transactionHash})\n`);
}

async function displayPrize(index) {
	const prizeBN = await contract.prize(accounts[Number(index)].getAddress());
	const prize = ethers.utils.formatEther(prizeBN);
	console.log(
		`The account of address ${accounts[Number(index)].getAddress()
		} has earned a prize of ${prize} Tokens\n`
	);
	return prize;
}

async function claimPrize(index, amount) {
	const tx = await contract
		.connect(accounts[Number(index)])
		.prizeWithdraw(ethers.utils.parseEther(amount));
	const receipt = await tx.wait();
	console.log(`Prize claimed (${receipt.transactionHash})\n`);
}

async function displayOwnerPool() {
	const balanceBN = await contract.ownerPool();
	const balance = ethers.utils.formatEther(balanceBN);
	console.log(`The owner pool has (${balance}) Tokens \n`);
}

async function withdrawTokens(amount) {
	const tx = await contract.ownerWithdraw(ethers.utils.parseEther(amount));
	const receipt = await tx.wait();
	console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
}

async function burnTokens(index, amount) {
	const allowTx = await token
		.connect(accounts[Number(index)])
		.approve(contract.address, ethers.constants.MaxUint256);
	const receiptAllow = await allowTx.wait();
	console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
	const tx = await contract
		.connect(accounts[Number(index)])
		.returnTokens(ethers.utils.parseEther(amount));
	const receipt = await tx.wait();
	console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}