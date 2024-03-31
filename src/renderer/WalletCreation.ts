//WalletCreation.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";
import Crypto from "crypto";
import * as Ethers from "ethers";
import * as BIP39 from "bip39";
import * as BIP32 from "bip32";
import * as BitcoinJS from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

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

function generateBTCWallet(mnemonic: string) {
    let seed: Buffer = BIP39.mnemonicToSeedSync(mnemonic);

    let rootKey: BIP32.BIP32Interface = BIP32.BIP32Factory(ecc).fromSeed(seed, BitcoinJS.networks.bitcoin);
    let receivingNode: BIP32.BIP32Interface = rootKey.derivePath("m/44'/0'/0'/0/0");
    
    let receivingAddress: string = BitcoinJS.payments.p2pkh({ pubkey: receivingNode.publicKey, network: BitcoinJS.networks.bitcoin }).address;
    let receivingWIF: string = receivingNode.toWIF()

    let data = {
        "address": receivingAddress,
        "private": receivingWIF
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

function readFile(filePath: string): any {
    //Pretty self-explanatory
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    } else {
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
    let enteredPassword: string = document.getElementById("password-text").value;
    //@ts-expect-error
    let enteredConfirmPassword: string = document.getElementById("password-confirm-text").value;

    if (/\s/.test(enteredPassword) || enteredPassword === "") {
        //Invalid password
        
        document.getElementById("feedback-text").textContent = "The password is invalid.";
        
        document.getElementById("feedback-text").style.color = "red";
        
        document.getElementById("feedback-text").style.display = "block";
    } else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            
            document.getElementById("feedback-text").style.color = "red";
            
            document.getElementById("feedback-text").style.display = "block";
        } else {
            //All validities passed
            let ethData = generateETHWallet(mnemonic);
            
            //Encrypt secret data
            let hashedPassword: string = CryptoJS.SHA256(enteredPassword).toString();
            let encryptedMnemonic: string = `${CryptoJS.AES.encrypt(mnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey: string = `${CryptoJS.AES.encrypt(ethData.private, enteredPassword)} (ENCRYPTED)`;

            writeFile(path.join(__dirname + "/../wallets/"), "eth_address.pem", ethData.address);
            writeFile(path.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);

            let btcData = generateBTCWallet(mnemonic);
            encryptedPrivateKey = `${CryptoJS.AES.encrypt(btcData.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path.join(__dirname + "/../wallets/"), "btc_address.pem", btcData.address);
            writeFile(path.join(__dirname + "/../wallets/"), "btc_private.key", encryptedPrivateKey);

            
            document.getElementById("feedback-text").textContent = "Wallet creation successful!";
            
            document.getElementById("feedback-text").style.color = "green";
            
            document.getElementById("feedback-text").style.display = "block";
            
            setTimeout(function() {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}

function confirmImportWallet(readFromSettingsPage: boolean) {
    let enteredPassword: string;
    let enteredConfirmPassword: string;

    if (!readFromSettingsPage) {
        //@ts-expect-error
        enteredPassword = document.getElementById("password-text").value;
        //@ts-expect-error
        enteredConfirmPassword = document.getElementById("password-confirm-text").value;
    } else {
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
    } else {
        //Valid password
        if (enteredPassword !== enteredConfirmPassword) {
            //Passwords do not match
            
            document.getElementById("feedback-text").textContent = "Passwords do not match.";
            
            document.getElementById("feedback-text").style.color = "red";
            
            document.getElementById("feedback-text").style.display = "block";
        } else {
            let readMnemonic: string;

            if (!readFromSettingsPage) {
                //@ts-expect-error
                readMnemonic = document.getElementById("mnemonic-phrase-text").value;
            } else {
                let temp: string = readFile(path.join(__dirname + "/../wallets/mnemonic.txt"));
                readMnemonic = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(temp.replace(" (ENCRYPTED)", ""), enteredPassword));
            }

            //All validities passed
            let data = generateETHWallet(readMnemonic);
            
            //Encrypt secret data
            let hashedPassword: string = CryptoJS.SHA256(enteredPassword).toString();
            let encryptedMnemonic: string = `${CryptoJS.AES.encrypt(readMnemonic, enteredPassword)} (ENCRYPTED)`;
            let encryptedPrivateKey: string = `${CryptoJS.AES.encrypt(data.private, enteredPassword)} (ENCRYPTED)`;

            writeFile(path.join(__dirname + "/../wallets/"), "eth_address.pem", data.address);
            writeFile(path.join(__dirname + "/../wallets/"), "eth_private.key", encryptedPrivateKey);
            writeFile(path.join(__dirname + "/../wallets/"), "hashed_password.txt", hashedPassword);
            writeFile(path.join(__dirname + "/../wallets/"), "mnemonic.txt", encryptedMnemonic);

            let btcData = generateBTCWallet(readMnemonic);
            encryptedPrivateKey = `${CryptoJS.AES.encrypt(btcData.private, enteredPassword)} (ENCRYPTED)`;
            writeFile(path.join(__dirname + "/../wallets/"), "btc_address.pem", btcData.address);
            writeFile(path.join(__dirname + "/../wallets/"), "btc_private.key", encryptedPrivateKey);

            if (!readFromSettingsPage) {
                document.getElementById("feedback-text").textContent = "Wallet import successful!";
                document.getElementById("feedback-text").style.color = "green";
                document.getElementById("feedback-text").style.display = "block";
            } else {
                document.getElementById("feedback-text-reimport-wallet").textContent = "Wallet import successful!";
                document.getElementById("feedback-text-reimport-wallet").style.color = "green";
                document.getElementById("feedback-text-reimport-wallet").style.display = "block";
            }
            
            setTimeout(function() {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    }
}