//WalletManager.ts
//Written by DcruBro @ https://dcrubro.com/

import fs from "fs";
import path from "path";
import { Modal } from "bootstrap";
import * as QRCode from "qrcode";

let ethBalance: number;
let sepEthBalance: number;
let btcBalance: number;

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

async function getBTCWalletBalance(address: string): Promise<number> {
    const url = `${localStorage.getItem("bitcoinexplorerBaseUrl")}/api/address/${address}`;

    let balance: number = 0;

    try {
        const headers = {
            "Content-Type": "application/json"
        };
        // Send the HTTP request
        await fetch(url, { method: 'GET', headers: headers })
          .then(response => response.json())
          .then(data => {
            if (data) {
                if (data.txHistory.balanceSat) {
                    balance = data.txHistory.balanceSat / (10**8); //adjust for blockchain.com's display method;
                } else {
                    balance = 0;
                }
            } else {
                console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
            }
        })
        .catch(error => {
            console.error("Error occurred:", error);
            console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
        });
    } catch (error) {
        console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
        throw error;
    }

    return balance;
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

function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: {dark: "#ffffff", light: "#212529"}, width: 128, height: 128 }, function (err) {
        if (err) { throw err; }
    });
}

localStorage.setItem("ethAddress", getWalletData(path.join(__dirname + "/../wallets/eth_address.pem")));
localStorage.setItem("btcAddress", getWalletData(path.join(__dirname + "/../wallets/btc_address.pem")));

//HTML code segment

async function setHTMLObjects() {
    //On Content Load
    
    ethBalance = await getETHWalletBalance(localStorage.getItem("ethAddress").toString());
    
    sepEthBalance = await getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
    
    btcBalance = await getBTCWalletBalance(localStorage.getItem("btcAddress").toString());
    
    /*ETHEREUM*/
    let ethAddr = await localStorage.getItem("ethAddress");

    document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${ethAddr}`;
    
    document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
    //@ts-expect-error
    document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
    
    drawQRCode(ethAddr, "eth-address-qrcode");


    //Uncomment to reenable sepolia ethereum
    ///*SEPOLIA ETHEREUM*/
    //@/ts-expect-error
    //document.getElementById("ethSepWalletAddress").textContent = `Wallet Address: ${await localStorage.getItem("ethAddress")}`;
    //@/ts-expect-error
    //document.getElementById("ethSepWalletBalance").textContent = `Sep. ETH Balance: ${sepEthBalance} ETH`;
    //@/ts-expect-error
    //document.getElementById("ethSepWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(sepEthBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;

    /*BITCOIN*/
    let btcAddr = await localStorage.getItem("btcAddress");

    document.getElementById("btcWalletAddress").textContent = `Wallet Address: ${btcAddr}`;
    
    document.getElementById("btcWalletBalance").textContent = `BTC Balance: ${btcBalance} BTC`;
    //@ts-expect-error
    document.getElementById("btcWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(btcBalance, localStorage.getItem("btcPrice")).toFixed(2)}`;
    
    drawQRCode(btcAddr, "btc-address-qrcode");
}

async function checkWalletExistance() {
    if (await !fs.existsSync(path.join(__dirname + "/../wallets/hashed_password.txt"))) {
        await window.addEventListener("DOMContentLoaded", async () => {
            
            let modalElementMain = new Modal(document.getElementById("walletNoExistanceModal"));
            modalElementMain.show();
        });
    }
}

function goToImportWallet() { window.location.href = "./walletimport.html"; }
function goToCreateWallet() { window.location.href = "./walletcreation.html"; }

checkWalletExistance();
setHTMLObjects();
