"use strict";
//WalletManager.ts
//Written by DcruBro @ https://dcrubro.com/
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
let ethBalance;
let sepEthBalance;
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
localStorage.setItem("ethAddress", getWalletData(path_1.default.join(__dirname + "/../wallets/eth_address.pem")));
//HTML code segment
function setHTMLObjects() {
    return __awaiter(this, void 0, void 0, function* () {
        //On Content Load
        //@ts-expect-error
        ethBalance = yield getETHWalletBalance(localStorage.getItem("ethAddress").toString());
        //@ts-expect-error
        sepEthBalance = yield getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
        /*ETHEREUM*/
        //@ts-expect-error
        document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${yield localStorage.getItem("ethAddress")}`;
        //@ts-expect-error
        document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
        //@ts-expect-error
        document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
        /*SEPOLIA ETHEREUM*/
        //@ts-expect-error
        document.getElementById("ethSepWalletAddress").textContent = `Wallet Address: ${yield localStorage.getItem("ethAddress")}`;
        //@ts-expect-error
        document.getElementById("ethSepWalletBalance").textContent = `Sep. ETH Balance: ${sepEthBalance} ETH`;
        //@ts-expect-error
        document.getElementById("ethSepWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(sepEthBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
    });
}
function checkWalletExistance() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield !fs_1.default.existsSync(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"))) {
            yield window.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
                //@ts-expect-error
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
