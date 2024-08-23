import fs from "fs";
import path from "path";
import * as Solana from "@solana/web3.js";

export async function getEthplorerWalletBalance(address: string): Promise<any> {
    //I know you're not supposed to leak API keys like this, but I don't really care about this one, since I got it for free.
    const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-kyBsC-yEYfC55-31WJm`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            return data;
        } else {
            console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

export async function getETHWalletBalance(address: string): Promise<number> {
    const data = await getEthplorerWalletBalance(address);

    return data.ETH.balance;
}

export async function getSOLWalletBalance(address: string): Promise<number> {
    const url = `${Solana.clusterApiUrl("mainnet-beta")}`;
    const body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [
            address,
            {
                "commitment": "confirmed"
            }
        ]
    };
    
    try {
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await response.json();

        if (data) {
            const solBal = data.result.value / 1e9; // Convert lamports to SOL
            return solBal;
        } else {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

export async function getSepETHWalletBalance(address: string): Promise<number> {
    const url = `${localStorage.getItem("sepEtherscanBaseUrl")}/?module=account&action=balance&address=${address}&tag=latest&apikey=${localStorage.getItem("etherscanAPIkey")}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1") {
            const balanceInWei = parseInt(data.result);
            const balanceInEth = balanceInWei / 1e18; //Convert wei to Ether
            return balanceInEth;
        } else {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

export async function getBTCWalletBalance(address: string): Promise<number> {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;

    let balance: number = 0;

    try {
        const response = await fetch(url);
        const data = await response.json();

        balance = data.balance / (10**8);
    } catch (err) {
        console.error("Error occurred while fetching balance. Please check the Bitcoin address or try again later.", err);

        return;
    }

    return balance;
}

export function getWalletData(path: string): string {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return data.toString();
    } else {
        console.log("Error when reading wallet data (path may be invalid)");
        return "NULL";
    }
}