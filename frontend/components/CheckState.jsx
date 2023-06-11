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


    // const provider = new ethers.providers.InfuraProvider(
    //     chainId2, 
    //     process.env.INFURA_API_KEY);

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

