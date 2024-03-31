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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const Ethers = __importStar(require("ethers"));
const BIP39 = __importStar(require("bip39"));
const BIP32 = __importStar(require("bip32"));
const BitcoinJS = __importStar(require("bitcoinjs-lib"));
const ecc = __importStar(require("tiny-secp256k1"));
let mnemonic;
function generateMnemonicPhrase() {
    const mnemonic = BIP39.generateMnemonic();
    return mnemonic;
}
function generateETHWallet(mnemonic) {
    let wallet = Ethers.Wallet.fromPhrase(mnemonic);
    let data = {
        "address": wallet.address,
        "private": wallet.privateKey
    };
    return data;
}
function generateBTCWallet(mnemonic) {
    let seed = BIP39.mnemonicToSeedSync(mnemonic);
    let rootKey = BIP32.BIP32Factory(ecc).fromSeed(seed, BitcoinJS.networks.bitcoin);
    let receivingNode = rootKey.derivePath("m/44'/0'/0'/0/0");
    let receivingAddress = BitcoinJS.payments.p2pkh({ pubkey: receivingNode.publicKey, network: BitcoinJS.networks.bitcoin }).address;
    let receivingWIF = receivingNode.toWIF();
    let data = {
        "address": receivingAddress,
        "private": receivingWIF
    };
    return data;
}
function writeFile(destinationFolder, fileName, data) {
    if (fs.existsSync(destinationFolder)) {
        fs.writeFile(`${destinationFolder}${fileName}`, data, function (err) {
            if (err)
                throw err;
        });
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function readFile(filePath) {
    //Pretty self-explanatory
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function getWalletInfo() {
    document.getElementById("walletInfoDiv").style.display = "block";
    mnemonic = generateMnemonicPhrase();
    let mnemonicArray = mnemonic.split(" ");
    document.getElementById("mnemonicLine1").textContent = `1. ${mnemonicArray[0]} 2. ${mnemonicArray[1]} 3. ${mnemonicArray[2]} 4. ${mnemonicArray[3]} 5. ${mnemonicArray[4]} 6. ${mnemonicArray[5]}`;
    document.getElementById("mnemonicLine2").textContent = `7. ${mnemonicArray[6]} 8. ${mnemonicArray[7]} 9. ${mnemonicArray[8]} 10. ${mnemonicArray[9]} 11. ${mnemonicArray[10]} 12. ${mnemonicArray[11]}`;
}
function confirmCreateWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text").value;
    //@ts-expect-error
    let enteredConfirmPassword = document.getElementById("password-confirm-text").value;
    if (/\s/.test(enteredPassword) || enteredPassword === "") {
        //Invalid password
        document.getElementById("feedback-text").textContent = "The password is invalid.";
        document.getElementById("feedback-text").style.color = "red";
        document.getElementById("feedback-text").style.display = "block";
    }
    else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            document.getElementById("feedback-text").style.color = "red";
            document.getElementById("feedback-text").style.display = "block";
        }
        else {
            //All validities passed
            let ethData = generateETHWallet(mnemonic);
            //Encrypt secret data
            let hashedPassword = crypto_js_1.default.SHA256(enteredPassword).toString();
            let encryptedMnemonic = `${crypto_js_1.default.AES.encrypt(mnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey = `${crypto_js_1.default.AES.encrypt(ethData.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "eth_address.pem", ethData.address);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);
            let btcData = generateBTCWallet(mnemonic);
            encryptedPrivateKey = `${crypto_js_1.default.AES.encrypt(btcData.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "btc_address.pem", btcData.address);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "btc_private.key", encryptedPrivateKey);
            document.getElementById("feedback-text").textContent = "Wallet creation successful!";
            document.getElementById("feedback-text").style.color = "green";
            document.getElementById("feedback-text").style.display = "block";
            setTimeout(function () {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}
function confirmImportWallet(readFromSettingsPage) {
    let enteredPassword;
    let enteredConfirmPassword;
    if (!readFromSettingsPage) {
        //@ts-expect-error
        enteredPassword = document.getElementById("password-text").value;
        //@ts-expect-error
        enteredConfirmPassword = document.getElementById("password-confirm-text").value;
    }
    else {
        //We are probably reimporting via the settings page
        //@ts-expect-error
        enteredPassword = document.getElementById("password-text-reimport-wallet").value;
        //@ts-expect-error
        enteredConfirmPassword = document.getElementById("password-text-reimport-wallet").value;
    }
    if (/\s/.test(enteredPassword) || enteredPassword === "") {
        //Invalid password
        document.getElementById("feedback-text").textContent = "The password is invalid.";
        document.getElementById("feedback-text").style.color = "red";
        document.getElementById("feedback-text").style.display = "block";
    }
    else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            document.getElementById("feedback-text").style.color = "red";
            document.getElementById("feedback-text").style.display = "block";
        }
        else {
            let readMnemonic;
            if (!readFromSettingsPage) {
                //@ts-expect-error
                readMnemonic = document.getElementById("mnemonic-phrase-text").value;
            }
            else {
                let temp = readFile(path_1.default.join(__dirname + "/../wallets/mnemonic.txt"));
                readMnemonic = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(temp.replace(" (ENCRYPTED)", ""), enteredPassword));
            }
            //All validities passed
            let data = generateETHWallet(readMnemonic);
            //Encrypt secret data
            let hashedPassword = crypto_js_1.default.SHA256(enteredPassword).toString();
            let encryptedMnemonic = `${crypto_js_1.default.AES.encrypt(readMnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey = `${crypto_js_1.default.AES.encrypt(data.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "eth_address.pem", data.address);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);
            let btcData = generateBTCWallet(readMnemonic);
            encryptedPrivateKey = `${crypto_js_1.default.AES.encrypt(btcData.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "btc_address.pem", btcData.address);
            writeFile(path_1.default.join(__dirname + "/../wallets/"), "btc_private.key", encryptedPrivateKey);
            if (!readFromSettingsPage) {
                document.getElementById("feedback-text").textContent = "Wallet import successful!";
                document.getElementById("feedback-text").style.color = "green";
                document.getElementById("feedback-text").style.display = "block";
            }
            else {
                document.getElementById("feedback-text-reimport-wallet").textContent = "Wallet import successful!";
                document.getElementById("feedback-text-reimport-wallet").style.color = "green";
                document.getElementById("feedback-text-reimport-wallet").style.display = "block";
            }
            setTimeout(function () {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}
