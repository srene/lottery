import { ethers } from 'ethers';
import lotteryJson from '../assets/Lottery.json';
import { useState } from 'react';
import dotenv from "dotenv";
import { useSigner, useNetwork, useBalance } from 'wagmi';

require('dotenv').config();

const REACT_APP_BET_CONTRACT_ADDRESS="0x4aA7bc013c9Dc1339181962A51dfDDEDC5b6Ad4c"

export function CheckState() {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const chainId1 = 80001; // This is the chainId for Mumbai Testnet
    // const chainId2 = 11155111


    const provider = new ethers.providers.AlchemyProvider(
        chainId1, 
        process.env.ALCHEMY_API_KEY);

    const lotteryContract = new ethers.Contract(
        REACT_APP_BET_CONTRACT_ADDRESS, 
        lotteryJson.abi, 
        provider);

    

    return (
        <div>
            <h2>Check State</h2>

            <button onClick={async () => await checkState(
                lotteryContract, 
                provider, 
                setLoading, 
                setData)}>
                Check State
            </button>
            {
                isLoading ? <p>Checking Lottery State...</p> : <p></p>
            }
            {
                data ? <p>{data}</p> : <p></p>
            }
        </div>

    )

}

async function checkState(
    contract, 
    provider, 
    setLoading, 
    setData
) {
  setLoading(true)
  const state = await contract.betsOpen();
  console.log(`The lottery is ${state ? "open" : "closed"}\n`);
  const currentBlock = await provider.getBlock("latest");
  const currentBlockDate = new Date(currentBlock.timestamp * 1000);
  console.log(`The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()} \n`);
  const closingTime = await contract.betsClosingTime();
  const closingTimeDate = new Date(closingTime.toNumber() * 1000);
  console.log(`Lottey should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()} \n`);
  setLoading(false)
}
