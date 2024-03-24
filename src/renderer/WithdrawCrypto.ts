//WalletCreation.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";
import * as Ethers from "ethers";
import * as BIP39 from "bip39";

const sepoliaProvider: any = new Ethers.JsonRpcProvider("https://rpc2.sepolia.org/");
const upperEthGasLimit: number = 0.00042;

let selectedCurrency: string;

function readFile(filePath: string): any {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function updateConfirmModalData() {
    //@ts-expect-error
    let sendingTo: string = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendingAmount: string = document.getElementById("send-amount").value;

    //@ts-expect-error
    document.getElementById("currency-text").textContent = `Currency: ${selectedCurrency}`;
    //@ts-expect-error
    document.getElementById("sending-to-text").textContent = `Sending to: ${sendingTo}`;
    //@ts-expect-error
    document.getElementById("sending-amount-text").textContent = `Send amount: ${sendingAmount}`;
}

function setCurrency(currency: string) {
    selectedCurrency = currency;
    //@ts-expect-error
    document.getElementById("selected-currency-text").textContent = `Selected currency: ${selectedCurrency}`;
}

async function confirmSendCrypto() {
    //@ts-expect-error
    document.getElementById("feedback-text").style.display = "none";

    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text").value;
    let hashedPassword: string = await readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));
    
    //@ts-expect-error
    let destinationAddress: string = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendAmount: string = document.getElementById("send-amount").value;

    if (selectedCurrency === "" || selectedCurrency === "None") {
        //@ts-expect-error
        document.getElementById("feedback-text").textContent = "Please select a currency.";
        //@ts-expect-error
        document.getElementById("feedback-text").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "block";

        enteredPassword = "";
        return;
    } else if (destinationAddress === "" || sendAmount == "") {
        //@ts-expect-error
        document.getElementById("feedback-text").textContent = "Empty destination address or send amount.";
        //@ts-expect-error
        document.getElementById("feedback-text").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "block";

        enteredPassword = "";
        return;
    } else if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) === 0) {
        //@ts-expect-error
        document.getElementById("feedback-text").textContent = "Invalid send amount (Check that it's a real number or non-zero)";
        //@ts-expect-error
        document.getElementById("feedback-text").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text").style.display = "block";

        enteredPassword = "";
        return;
    }

    if (CryptoJS.SHA256(enteredPassword).toString() === hashedPassword) {
        //Passwords match
        if (selectedCurrency === "Ethereum") {
            let encryptedPriv: string = readFile(path.join(__dirname + "/../wallets/eth_private.key"));
            let decryptedPriv: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedPriv.replace(" (ENCRYPTED)", ""), enteredPassword));

            //@ts-expect-error
            let adjustedForGas: number = parseFloat(document.getElementById("send-amount").value.toString()) - upperEthGasLimit;

            //Ethers.js snippet for transaction creation
            let wallet = new Ethers.Wallet(decryptedPriv, Ethers.getDefaultProvider());
            let tx = {
                //@ts-expect-error
                to: document.getElementById("destination-address").value.toString(),
                value: Ethers.parseEther(adjustedForGas.toString()),
                gasPrice: Ethers.parseUnits("20", "gwei"),
                gasLimit: 21000
            };

            let signedTX = await wallet.sendTransaction(tx);

            decryptedPriv = "";

            console.log(`TX Hash: ${signedTX.hash}`);
            
            //Open the Etherscan window
            window.open(`https://etherscan.io/tx/${signedTX.hash}`);
        }

        if (selectedCurrency === "Sepolia Ethereum") {
            let encryptedPriv: string = readFile(path.join(__dirname + "/../wallets/eth_private.key"));
            let decryptedPriv: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedPriv.replace(" (ENCRYPTED)", ""), enteredPassword));

            //@ts-expect-error
            let adjustedForGas: number = parseFloat(document.getElementById("send-amount").value.toString()) - upperEthGasLimit;

            //Ethers.js snippet for transaction creation
            let wallet = new Ethers.Wallet(decryptedPriv, sepoliaProvider);
            let tx = {
                //@ts-expect-error
                to: document.getElementById("destination-address").value.toString(),
                value: Ethers.parseEther(adjustedForGas.toString()),
                gasPrice: Ethers.parseUnits("20", "gwei"),
                gasLimit: 21000
            };

            let signedTX = await wallet.sendTransaction(tx);

            decryptedPriv = "";

            console.log(`TX Hash: ${signedTX.hash}`);

            //Open the Etherscan window
            window.open(`https://sepolia.etherscan.io/tx/${signedTX.hash}`);
        }
    } else {
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
}

//Event listeners
//@ts-expect-error
document.getElementById("updateConfirmModalData").addEventListener("click", updateConfirmModalData());