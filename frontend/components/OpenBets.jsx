import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';


export function OpenBets() {
    const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    if (txData) return (
        <>
            <p>Bet Opened!</p>
            <a href={"https://mumbai.polygonscan.com/tx/" + TxData.transactionHash} target="_blank">{txData.hash}</a>
        </>
    )
    if (isLoading) return (
        <>
            <>Bet wait to be open...
            </>
        </>
    );
    return (
        <>
            <p>Open Bet</p>
            <button onClick={() => openBets(duration, setTxData)}>Open bets</button>
        </>
    );
}

// function requestTokens(signer, signature, setLoading, setTxData) {
//     setLoading(true);

//     console.log(JSON.stringify({ address: signer._address, mintValue: "1", signature: signature }))
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ address: signer._address, mintValue: "1", signature: signature })
//     };

//     fetch('http://localhost:3001/request-tokens', requestOptions)
//         .then(response => response.json())
//         .then((data) => {
//             setTxData(data);
//             setLoading(false);
//         });
// }

async function openBets(duration, setTxData) {
    setLoading(true);
	const currentBlock = await provider.getBlock("latest");
	const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
	const TxData = await tx.wait();
	console.log(`Bets opened (${TxData.transactionHash}) `);
    setTxData(TxData)
}
