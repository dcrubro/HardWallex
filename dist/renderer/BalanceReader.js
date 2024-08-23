"use strict";
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
exports.getWalletData = exports.getBTCWalletBalance = exports.getSepETHWalletBalance = exports.getSOLWalletBalance = exports.getETHWalletBalance = exports.getEthplorerWalletBalance = void 0;
const fs_1 = __importDefault(require("fs"));
const Solana = __importStar(require("@solana/web3.js"));
function getEthplorerWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        //I know you're not supposed to leak API keys like this, but I don't really care about this one, since I got it for free.
        const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-kyBsC-yEYfC55-31WJm`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data) {
                return data;
            }
            else {
                console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
                throw new Error(data.message);
            }
        }
        catch (error) {
            console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
            throw error;
        }
    });
}
exports.getEthplorerWalletBalance = getEthplorerWalletBalance;
function getETHWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getEthplorerWalletBalance(address);
        return data.ETH.balance;
    });
}
exports.getETHWalletBalance = getETHWalletBalance;
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
exports.getSOLWalletBalance = getSOLWalletBalance;
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
exports.getSepETHWalletBalance = getSepETHWalletBalance;
function getBTCWalletBalance(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;
        let balance = 0;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            balance = data.balance / (10 ** 8);
        }
        catch (err) {
            console.error("Error occurred while fetching balance. Please check the Bitcoin address or try again later.", err);
            return;
        }
        return balance;
    });
}
exports.getBTCWalletBalance = getBTCWalletBalance;
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
exports.getWalletData = getWalletData;
