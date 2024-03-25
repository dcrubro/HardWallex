//WalletCreation.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";
import Crypto from "crypto";
import * as Ethers from "ethers";
import * as BIP39 from "bip39";

let mnemonic: string;

function generateMnemonicPhrase(): string {
    const mnemonic: string = BIP39.generateMnemonic();
    return mnemonic;
}

function generateETHWallet(mnemonic: string) {
    let wallet = Ethers.Wallet.fromPhrase(mnemonic);

    let data = {
        "address": wallet.address,
        "private": wallet.privateKey
    }

    return data;
}

function writeFile(destinationFolder: string, fileName: string, data: string) {
    if (fs.existsSync(destinationFolder)) {
        fs.writeFile(`${destinationFolder}${fileName}`, data, function(err) {
            if (err) throw err;
        });
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function getWalletInfo() {
    //@ts-expect-error
    document.getElementById("walletInfoDiv").style.display = "block";

    mnemonic = generateMnemonicPhrase();
    let mnemonicArray = mnemonic.split(" ");
    //@ts-expect-error
    document.getElementById("mnemonicLine1").textContent = `1. ${mnemonicArray[0]} 2. ${mnemonicArray[1]} 3. ${mnemonicArray[2]} 4. ${mnemonicArray[3]} 5. ${mnemonicArray[4]} 6. ${mnemonicArray[5]}`;
    //@ts-expect-error
    document.getElementById("mnemonicLine2").textContent = `7. ${mnemonicArray[6]} 8. ${mnemonicArray[7]} 9. ${mnemonicArray[8]} 10. ${mnemonicArray[9]} 11. ${mnemonicArray[10]} 12. ${mnemonicArray[11]}`;
}

function confirmCreateWallet() {
    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text").value;
    //@ts-expect-error
    let enteredConfirmPassword: string = document.getElementById("password-confirm-text").value;

    if (/\s/.test(enteredPassword) || enteredPassword === "") {
        //Invalid password
        //@ts-expect-error
        document.getElementById("feedback-text").textContent = "The password is invalid.";
        //@ts-expect-error
        document.getElementById("feedback-text").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "block";
    } else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
        } else {
            //All validities passed
            let data = generateETHWallet(mnemonic);
            
            //Encrypt secret data
            let hashedPassword: string = CryptoJS.SHA256(enteredPassword).toString();
            let encryptedMnemonic: string = `${CryptoJS.AES.encrypt(mnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey: string = `${CryptoJS.AES.encrypt(data.private, enteredPassword)} (ENCRYPTED)`;

            writeFile(path.join(__dirname + "/../wallets/"), "eth_address.pem", data.address);
            writeFile(path.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);

            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Wallet creation successful!";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "green";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
            
            setTimeout(function() {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}

function confirmImportWallet() {
    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text").value;
    //@ts-expect-error
    let enteredConfirmPassword: string = document.getElementById("password-confirm-text").value;

    if (/\s/.test(enteredPassword) || enteredPassword === "") {
        //Invalid password
        //@ts-expect-error
        document.getElementById("feedback-text").textContent = "The password is invalid.";
        //@ts-expect-error
        document.getElementById("feedback-text").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "block";
    } else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
        } else {
            //@ts-expect-error
            let readMnemonic: string = document.getElementById("mnemonic-phrase-text").value;

            //All validities passed
            let data = generateETHWallet(readMnemonic);
            
            //Encrypt secret data
            let hashedPassword: string = CryptoJS.SHA256(enteredPassword).toString();
            let encryptedMnemonic: string = `${CryptoJS.AES.encrypt(mnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey: string = `${CryptoJS.AES.encrypt(data.private, enteredPassword)} (ENCRYPTED)`;

            writeFile(path.join(__dirname + "/../wallets/"), "eth_address.pem", data.address);
            writeFile(path.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);

            //@ts-expect-error
            document.getElementById("feedback-text").textContent = "Wallet import successful!";
            //@ts-expect-error
            document.getElementById("feedback-text").style.color = "green";
            //@ts-expect-error
            document.getElementById("feedback-text").style.display = "block";
            
            setTimeout(function() {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}