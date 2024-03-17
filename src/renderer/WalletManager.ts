//WalletManager.ts
//Written by DcruBro @ https://dcrubro.com/

import fs from "fs";
import path from "path";
import { Modal } from "bootstrap";

let ethBalance: number;
let sepEthBalance: number;

//Functions segment
async function getETHWalletBalance(address: string): Promise<number> {
    const url = `${localStorage.getItem("etherscanBaseUrl")}/?module=account&action=balance&address=${address}&tag=latest&apikey=${localStorage.getItem("etherscanAPIkey")}`;
    
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

async function getSepETHWalletBalance(address: string): Promise<number> {
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

function getUSDValue(ownedAmount: number, currencyValue: number) {
    return ownedAmount * currencyValue;
}

function getWalletData(path: string): string {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return data.toString();
    } else {
        console.log("Error when reading wallet data (path may be invalid)");
        return "NULL";
    }
}

localStorage.setItem("ethAddress", getWalletData(path.join(__dirname + "/../wallets/eth_address.pem")));

//HTML code segment

async function setHTMLObjects() {
    //On Content Load
    //@ts-expect-error
    ethBalance = await getETHWalletBalance(localStorage.getItem("ethAddress").toString());
    //@ts-expect-error
    sepEthBalance = await getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
    
    /*ETHEREUM*/
    //@ts-expect-error
    document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${await localStorage.getItem("ethAddress")}`;
    //@ts-expect-error
    document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
    //@ts-expect-error
    document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;

    /*SEPOLIA ETHEREUM*/
    //@ts-expect-error
    document.getElementById("ethSepWalletAddress").textContent = `Wallet Address: ${await localStorage.getItem("ethAddress")}`;
    //@ts-expect-error
    document.getElementById("ethSepWalletBalance").textContent = `Sep. ETH Balance: ${sepEthBalance} ETH`;
    //@ts-expect-error
    document.getElementById("ethSepWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(sepEthBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
}

async function checkWalletExistance() {
    if (await !fs.existsSync(path.join(__dirname + "/../wallets/hashed_password.txt"))) {
        await window.addEventListener("DOMContentLoaded", async () => {
            //@ts-expect-error
            let modalElementMain = new Modal(document.getElementById("walletNoExistanceModal"));
            modalElementMain.show();
        });
    }
}

function goToCreateWallet() { window.location.href = "./walletcreation.html"; }

checkWalletExistance();
setHTMLObjects();
