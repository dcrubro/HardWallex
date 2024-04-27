"use strict";
//WalletManager.ts
//Written by DcruBro @ https://dcrubro.com/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bootstrap_1 = require("bootstrap");
const QRCode = __importStar(require("qrcode"));
const Solana = __importStar(require("@solana/web3.js"));
let ethBalance;
let sepEthBalance;
let btcBalance;
let solBalance;
//Functions segment
function getETHWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${localStorage.getItem("etherscanBaseUrl")}/?module=account&action=balance&address=${address}&tag=latest&apikey=${localStorage.getItem("etherscanAPIkey")}`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.status === "1") {
                const balanceInWei = parseInt(data.result);
                const balanceInEth = balanceInWei / 1e18; //Convert wei to Ether
                return balanceInEth;
            }
            else {
                console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw error;
        }
    });
}
function getSOLWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = yield response.json();
            if (data) {
                const solBal = data.result.value / 1e9; // Convert lamports to SOL
                return solBal;
            }
            else {
                console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw error;
        }
    });
}
function getSepETHWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${localStorage.getItem("sepEtherscanBaseUrl")}/?module=account&action=balance&address=${address}&tag=latest&apikey=${localStorage.getItem("etherscanAPIkey")}`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.status === "1") {
                const balanceInWei = parseInt(data.result);
                const balanceInEth = balanceInWei / 1e18; //Convert wei to Ether
                return balanceInEth;
            }
            else {
                console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw error;
        }
    });
}
function getBTCWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${localStorage.getItem("bitcoinexplorerBaseUrl")}/api/address/${address}`;
        let balance = 0;
        try {
            const headers = {
                "Content-Type": "application/json"
            };
            // Send the HTTP request
            yield fetch(url, { method: 'GET', headers: headers })
                .then(response => response.json())
                .then(data => {
                if (data) {
                    if (data.txHistory.balanceSat) {
                        balance = data.txHistory.balanceSat / (10 ** 8); //adjust for blockchain.com's display method;
                    }
                    else {
                        balance = 0;
                    }
                }
                else {
                    console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
                }
            })
                .catch(error => {
                console.error("Error occurred:", error);
                console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
            });
        }
        catch (error) {
            console.log("Error occurred while fetching balance. Please check the Bitcoin address or try again later.");
            throw error;
        }
        return balance;
    });
}
function getUSDValue(ownedAmount, currencyValue) {
    return ownedAmount * currencyValue;
}
function getWalletData(path) {
    if (fs_1.default.existsSync(path)) {
        const data = fs_1.default.readFileSync(path);
        return data.toString();
    }
    else {
        console.log("Error when reading wallet data (path may be invalid)");
        return "NULL";
    }
}
function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: { dark: "#ffffff", light: "#212529" }, width: 128, height: 128 }, function (err) {
        if (err) {
            throw err;
        }
    });
}
localStorage.setItem("ethAddress", getWalletData(path_1.default.join(__dirname + "/../wallets/eth_address.pem")));
localStorage.setItem("btcAddress", getWalletData(path_1.default.join(__dirname + "/../wallets/btc_address.pem")));
localStorage.setItem("solAddress", getWalletData(path_1.default.join(__dirname + "/../wallets/sol_address.pem")));
//HTML code segment
function setHTMLObjects() {
    return __awaiter(this, void 0, void 0, function* () {
        //On Content Load
        ethBalance = yield getETHWalletBalance(localStorage.getItem("ethAddress").toString());
        //sepEthBalance = await getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
        btcBalance = yield getBTCWalletBalance(localStorage.getItem("btcAddress").toString());
        solBalance = yield getSOLWalletBalance(localStorage.getItem("solAddress").toString());
        /*ETHEREUM*/
        let ethAddr = yield localStorage.getItem("ethAddress");
        document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${ethAddr}`;
        document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
        //@ts-expect-error
        document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
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
        let btcAddr = yield localStorage.getItem("btcAddress");
        document.getElementById("btcWalletAddress").textContent = `Wallet Address: ${btcAddr}`;
        document.getElementById("btcWalletBalance").textContent = `BTC Balance: ${btcBalance} BTC`;
        //@ts-expect-error
        document.getElementById("btcWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(btcBalance, localStorage.getItem("btcPrice")).toFixed(2)}`;
        drawQRCode(btcAddr, "btc-address-qrcode");
        /*SOLANA*/
        let solAddr = yield localStorage.getItem("solAddress");
        document.getElementById("solWalletAddress").textContent = `Wallet Address: ${solAddr}`;
        document.getElementById("solWalletBalance").textContent = `SOL Balance: ${solBalance} SOL`;
        //@ts-expect-error
        document.getElementById("solWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(solBalance, localStorage.getItem("solPrice")).toFixed(2)}`;
        drawQRCode(solAddr, "sol-address-qrcode");
    });
}
function checkWalletExistance() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield !fs_1.default.existsSync(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"))) {
            yield window.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
                let modalElementMain = new bootstrap_1.Modal(document.getElementById("walletNoExistanceModal"));
                modalElementMain.show();
            }));
        }
    });
}
function goToImportWallet() { window.location.href = "./walletimport.html"; }
function goToCreateWallet() { window.location.href = "./walletcreation.html"; }
checkWalletExistance();
setHTMLObjects();
