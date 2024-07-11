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
const path_1 = __importDefault(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const Ethers = __importStar(require("ethers"));
const BIP39 = __importStar(require("bip39"));
const BitcoinJS = __importStar(require("bitcoinjs-lib"));
const ECPair = __importStar(require("ecpair"));
const ecc = __importStar(require("tiny-secp256k1"));
const Solana = __importStar(require("@solana/web3.js"));
//@ts-expect-error
const CommonFunctions_1 = require("../dist/renderer/CommonFunctions");
const sepoliaProvider = new Ethers.JsonRpcProvider("https://rpc2.sepolia.org/");
const upperEthGasLimit = 0.00042;
let selectedCurrency;
function updateConfirmModalData() {
    //@ts-expect-error
    let sendingTo = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendingAmount = document.getElementById("send-amount").value;
    document.getElementById("currency-text").textContent = `Currency: ${selectedCurrency}`;
    document.getElementById("sending-to-text").textContent = `Sending to: ${sendingTo}`;
    document.getElementById("sending-amount-text").textContent = `Send amount: ${sendingAmount}`;
}
function setCurrency(currency) {
    selectedCurrency = currency;
    document.getElementById("selected-currency-text").textContent = `Selected currency: ${selectedCurrency}`;
}
function fetchBTCTransactionHex(txId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.blockcypher.com/v1/btc/main/txs/${txId}?includeHex=true`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            // The raw transaction hex is returned in the 'hex' field.
            return data.hex; // Ensure this matches the actual response structure from BlockCypher.
        }
        catch (error) {
            console.error("Failed to fetch transaction hex from BlockCypher:", error);
            return null;
        }
    });
}
function confirmSendCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        document.getElementById("feedback-text").style.display = "none";
        //@ts-expect-error
        let enteredPassword = document.getElementById("password-text").value;
        let hashedPassword = yield (0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"));
        //@ts-expect-error
        let destinationAddress = document.getElementById("destination-address").value;
        //@ts-expect-error
        let sendAmount = document.getElementById("send-amount").value;
        if (selectedCurrency === "" || selectedCurrency === "None") {
            document.getElementById("feedback-text").textContent = "Please select a currency.";
            document.getElementById("feedback-text").style.color = "red";
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        else if (destinationAddress === "" || sendAmount == "") {
            document.getElementById("feedback-text").textContent = "Empty destination address or send amount.";
            document.getElementById("feedback-text").style.color = "red";
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        else if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) === 0) {
            document.getElementById("feedback-text").textContent = "Invalid send amount (Check that it's a real number or non-zero)";
            document.getElementById("feedback-text").style.color = "red";
            document.getElementById("feedback-text").style.display = "block";
            enteredPassword = "";
            return;
        }
        if (crypto_js_1.default.SHA256(enteredPassword).toString() === hashedPassword) {
            //Passwords match
            if (selectedCurrency === "Ethereum") {
                let encryptedPriv = (0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/eth_private.key"));
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
                try {
                    let signedTX = yield wallet.sendTransaction(tx);
                    decryptedPriv = "";
                    console.log(`TX Hash: ${signedTX.hash}`);
                    document.getElementById("feedback-text").textContent = "Transaction sent successfully!";
                    document.getElementById("feedback-text").style.color = "green";
                    document.getElementById("feedback-text").style.display = "block";
                    //Open the Etherscan window
                    window.open(`https://etherscan.io/tx/${signedTX.hash}`);
                }
                catch (error) {
                    console.error(`Error sending transaction: ${error}`);
                    document.getElementById("feedback-text").textContent = "Error sending transaction. Check that you have sufficent funds, otherwise try again later.";
                    document.getElementById("feedback-text").style.color = "red";
                    document.getElementById("feedback-text").style.display = "block";
                }
            }
            //Uncomment to reenable sepolia ethereum
            /*if (selectedCurrency === "Sepolia Ethereum") {
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
            }*/
            if (selectedCurrency === "Bitcoin") {
                let encryptedWIF = (0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/btc_private.key"));
                let decryptedWIF = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(encryptedWIF.replace(" (ENCRYPTED)", ""), enteredPassword));
                let sourceAddress = (0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/btc_address.pem"));
                const NETWORK = BitcoinJS.networks.bitcoin;
                //Get the UTXOs
                let utxos = [];
                let totalAmountAvailable = 0; //Total amount available in Satoshi
                {
                    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${sourceAddress}?unspentOnly=true`;
                    try {
                        const response = yield fetch(url);
                        const data = yield response.json();
                        totalAmountAvailable = data.balance;
                        utxos = data.txrefs || [];
                    }
                    catch (err) {
                        console.error("Failed to fetch UTXOs: ", err);
                        utxos = [];
                        return;
                    }
                }
                //Construct and send the transaction
                {
                    if (utxos.length === 0) {
                        console.log("No UTXOs available to spend.");
                        return;
                    }
                    const psbt = new BitcoinJS.Psbt({ network: NETWORK });
                    for (const utxo of utxos) {
                        const txHex = yield fetchBTCTransactionHex(utxo.tx_hash);
                        if (!txHex) {
                            console.log(`Could not fetch transaction hex for UTXO ${utxo.tx_hash}`);
                            return;
                        }
                        psbt.addInput({
                            hash: utxo.tx_hash,
                            index: utxo.tx_output_n,
                            nonWitnessUtxo: Buffer.from(txHex, 'hex'),
                        });
                    }
                    const feeRate = 15; //NOTE: This will need improving (See 3. point in TODO.txt)
                    const estimatedTxSize = 10 + utxos.length * 148 + 2 * 34 + 10; //2 outputs: actual recipient + change address (sender address)
                    const transactionFee = feeRate * estimatedTxSize; //Transaction fee is in Satoshi
                    if (totalAmountAvailable < (parseFloat(sendAmount) * 100000000)) {
                        document.getElementById("feedback-text").textContent = "Not enough funds to send transaction.";
                        document.getElementById("feedback-text").style.color = "red";
                        document.getElementById("feedback-text").style.display = "block";
                        console.log("Not enough funds to send transaction.");
                        return;
                    }
                    //@ts-expect-error
                    const recipientAddress = document.getElementById("destination-address").value.toString();
                    //Add the recipient output
                    psbt.addOutput({
                        address: recipientAddress,
                        value: (parseFloat(sendAmount) * 100000000) - transactionFee,
                    });
                    //Calculate and add the change output back to the sneder's address
                    const change = totalAmountAvailable - parseFloat(sendAmount) * 100000000 - transactionFee;
                    if (change > 0) {
                        psbt.addOutput({
                            address: sourceAddress,
                            value: change,
                        });
                    }
                    //Create a temporary keypair using WIF
                    let keyPair = ECPair.ECPairFactory(ecc).fromWIF(decryptedWIF, BitcoinJS.networks.bitcoin);
                    psbt.signAllInputs(keyPair);
                    psbt.finalizeAllInputs();
                    const tx = psbt.extractTransaction();
                    //Send the transaction
                    const url = "https://api.blockcypher.com/v1/btc/main/txs/push";
                    const data = {
                        tx: tx.toHex(),
                    };
                    try {
                        const response = yield fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });
                        const responseData = yield response.json();
                        //Open the BlockCypher window
                        window.open(`https://live.blockcypher.com/btc/tx/${responseData.tx.hash}`);
                        console.log(responseData);
                    }
                    catch (error) {
                        console.error("Error broadcasting transaction:", error);
                    }
                }
            }
            if (selectedCurrency === "Solana") {
                let encryptedMnemonic = (0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/mnemonic.txt"));
                let decryptedMnemonic = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(encryptedMnemonic.replace(" (ENCRYPTED)", ""), enteredPassword));
                //Connect to the Solana network/cluster
                let connection = new Solana.Connection(Solana.clusterApiUrl("mainnet-beta"), "confirmed");
                let minimumBalanceForRentExemption = yield connection.getMinimumBalanceForRentExemption(0);
                //Create a keypair from secret key
                let keypair = Solana.Keypair.fromSeed(BIP39.mnemonicToSeedSync(decryptedMnemonic).subarray(0, 32));
                //Create a public key for the recipient
                let recipientPubKey = new Solana.PublicKey(destinationAddress);
                //Create a transaction instruction to send SOL
                let instruction = Solana.SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: recipientPubKey,
                    lamports: Math.ceil((parseFloat(sendAmount) - 0.000006) * Solana.LAMPORTS_PER_SOL - minimumBalanceForRentExemption) //We subtract 0.000006 as a constant to pay fees (will improve later)
                });
                //Create a transaction object
                let tx = new Solana.Transaction().add(instruction);
                //Sign and send the transaction
                try {
                    let sig = yield Solana.sendAndConfirmTransaction(connection, tx, [keypair]);
                    console.log(`Sent SOL transaction with signature: ${sig}`);
                    document.getElementById("feedback-text").textContent = "Transaction sent successfully!";
                    document.getElementById("feedback-text").style.color = "green";
                    document.getElementById("feedback-text").style.display = "block";
                    //Open the SolScan window
                    window.open(`https://solscan.io/tx/${sig}`);
                }
                catch (error) {
                    document.getElementById("feedback-text").textContent = "Error sending transaction. Check that you have sufficent funds, otherwise try again later.";
                    document.getElementById("feedback-text").style.color = "red";
                    document.getElementById("feedback-text").style.display = "block";
                    console.error("Error broadcasting transaction:", error);
                }
            }
        }
        else {
            //Passwords do not match
            document.getElementById("feedback-text").textContent = "Incorrect password.";
            document.getElementById("feedback-text").style.color = "red";
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
