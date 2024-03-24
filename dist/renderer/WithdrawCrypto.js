"use strict";
//WalletCreation.ts
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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const Ethers = __importStar(require("ethers"));
const sepoliaProvider = new Ethers.JsonRpcProvider("https://rpc2.sepolia.org/");
const upperEthGasLimit = 0.00042;
let selectedCurrency;
function readFile(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function updateConfirmModalData() {
    //@ts-expect-error
    let sendingTo = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendingAmount = document.getElementById("send-amount").value;
    //@ts-expect-error
    document.getElementById("currency-text").textContent = `Currency: ${selectedCurrency}`;
    //@ts-expect-error
    document.getElementById("sending-to-text").textContent = `Sending to: ${sendingTo}`;
    //@ts-expect-error
    document.getElementById("sending-amount-text").textContent = `Send amount: ${sendingAmount}`;
}
function setCurrency(currency) {
    selectedCurrency = currency;
    //@ts-expect-error
    document.getElementById("selected-currency-text").textContent = `Selected currency: ${selectedCurrency}`;
}
function confirmSendCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "none";
        //@ts-expect-error
        let enteredPassword = document.getElementById("password-text").value;
        let hashedPassword = yield readFile(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"));
        //@ts-expect-error
        let destinationAddress = document.getElementById("destination-address").value;
        //@ts-expect-error
        let sendAmount = document.getElementById("send-amount").value;
        if (selectedCurrency === "" || selectedCurrency === "None") {
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Please select a currency.";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        else if (destinationAddress === "" || sendAmount == "") {
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Empty destination address or send amount.";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        else if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) === 0) {
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Invalid send amount (Check that it's a real number or non-zero)";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        if (crypto_js_1.default.SHA256(enteredPassword).toString() === hashedPassword) {
            //Passwords match
            if (selectedCurrency === "Ethereum") {
                let encryptedPriv = readFile(path_1.default.join(__dirname + "/../wallets/eth_private.key"));
                let decryptedPriv = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(encryptedPriv.replace(" (ENCRYPTED)", ""), enteredPassword));
                //@ts-expect-error
                let adjustedForGas = parseFloat(document.getElementById("send-amount").value.toString()) - upperEthGasLimit;
                //Ethers.js snippet for transaction creation
                let wallet = new Ethers.Wallet(decryptedPriv, Ethers.getDefaultProvider());
                let tx = {
                    //@ts-expect-error
                    to: document.getElementById("destination-address").value.toString(),
                    value: Ethers.parseEther(adjustedForGas.toString()),
                    gasPrice: Ethers.parseUnits("20", "gwei"),
                    gasLimit: 21000
                };
                let signedTX = yield wallet.sendTransaction(tx);
                decryptedPriv = "";
                console.log(`TX Hash: ${signedTX.hash}`);
                //Open the Etherscan window
                window.open(`https://etherscan.io/tx/${signedTX.hash}`);
            }
            if (selectedCurrency === "Sepolia Ethereum") {
                let encryptedPriv = readFile(path_1.default.join(__dirname + "/../wallets/eth_private.key"));
                let decryptedPriv = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(encryptedPriv.replace(" (ENCRYPTED)", ""), enteredPassword));
                //@ts-expect-error
                let adjustedForGas = parseFloat(document.getElementById("send-amount").value.toString()) - upperEthGasLimit;
                //Ethers.js snippet for transaction creation
                let wallet = new Ethers.Wallet(decryptedPriv, sepoliaProvider);
                let tx = {
                    //@ts-expect-error
                    to: document.getElementById("destination-address").value.toString(),
                    value: Ethers.parseEther(adjustedForGas.toString()),
                    gasPrice: Ethers.parseUnits("20", "gwei"),
                    gasLimit: 21000
                };
                let signedTX = yield wallet.sendTransaction(tx);
                decryptedPriv = "";
                console.log(`TX Hash: ${signedTX.hash}`);
                //Open the Etherscan window
                window.open(`https://sepolia.etherscan.io/tx/${signedTX.hash}`);
            }
        }
        else {
            //Passwords do not match
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Incorrect password.";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
        }
        enteredPassword = "";
        /*
        setTimeout(function() {
            window.location.href = "./wallets.html";
        }, 1000);
        */
    });
}
//Event listeners
//@ts-expect-error
document.getElementById("updateConfirmModalData").addEventListener("click", updateConfirmModalData());
