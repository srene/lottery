import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useSigner, useNetwork, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';


export function BuyingToken() {
    return (
        <>
                <h2>Buy Token</h2>
                <BuyToken></BuyToken>
        </>
    )
}

function BuyToken() {
    const { data: signer } = useSigner();
    const [txData, setTxData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    if (txData) return (
        <>
            <p>Transaction completed!</p>
            <a href={"https://mumbai.polygonscan.com/tx/" + txData.hash} target="_blank">{txData.hash}</a>
        </>
    )
    if (isLoading) return (
        <>
            <>Requesting tokens to be minted...
            </>
        </>
    );
    return (
        <>
            <p>Request tokens to be minted</p>
            <button onClick={() => buyToken(signer, "anything", setLoading, setTxData)}>Request tokens</button>
        </>
    );
}

function buyToken(signer, signature, setLoading, setTxData) {
    setLoading(true);

    console.log(JSON.stringify({ address: signer._address, mintValue: "1", signature: signature }))
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: signer._address, mintValue: "100", signature: signature })
    };

    fetch('http://localhost:3001/request-tokens', requestOptions)
        .then(response => response.json())
        .then((data) => {
            setTxData(data);
            setLoading(false);
        });
}
