//WalletCreation.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";
import * as Ethers from "ethers";
import * as BIP39 from "bip39";
import * as BIP32 from "bip32";
import * as BitcoinJS from "bitcoinjs-lib";
import * as ECPair from "ecpair";
import * as Bitcore from "bitcore-lib";
import * as ecc from "tiny-secp256k1";
import * as Solana from "@solana/web3.js";
//@ts-expect-error
import { writeFile, readFile } from "../dist/renderer/CommonFunctions";

const sepoliaProvider: any = new Ethers.JsonRpcProvider("https://rpc2.sepolia.org/");
const upperEthGasLimit: number = 0.00042;

let selectedCurrency: string;

function updateConfirmModalData() {
    //@ts-expect-error
    let sendingTo: string = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendingAmount: string = document.getElementById("send-amount").value;

    
    document.getElementById("currency-text").textContent = `Currency: ${selectedCurrency}`;
    
    document.getElementById("sending-to-text").textContent = `Sending to: ${sendingTo}`;
    
    document.getElementById("sending-amount-text").textContent = `Send amount: ${sendingAmount}`;
}

function setCurrency(currency: string) {
    selectedCurrency = currency;
    
    document.getElementById("selected-currency-text").textContent = `Selected currency: ${selectedCurrency}`;
}

async function fetchBTCTransactionHex(txId: string) {
    const url = `https://api.blockcypher.com/v1/btc/main/txs/${txId}?includeHex=true`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        // The raw transaction hex is returned in the 'hex' field.
        return data.hex; // Ensure this matches the actual response structure from BlockCypher.
    } catch (error) {
        console.error("Failed to fetch transaction hex from BlockCypher:", error);
        return null;
    }
}

async function confirmSendCrypto() {
    
    document.getElementById("feedback-text").style.display = "none";

    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text").value;
    let hashedPassword: string = await readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));
    
    //@ts-expect-error
    let destinationAddress: string = document.getElementById("destination-address").value;
    //@ts-expect-error
    let sendAmount: string = document.getElementById("send-amount").value;

    if (selectedCurrency === "" || selectedCurrency === "None") {
        
        document.getElementById("feedback-text").textContent = "Please select a currency.";
        
        document.getElementById("feedback-text").style.color = "red";
        
        document.getElementById("feedback-text").style.display = "block";

        enteredPassword = "";
        return;
    } else if (destinationAddress === "" || sendAmount == "") {
        
        document.getElementById("feedback-text").textContent = "Empty destination address or send amount.";
        
        document.getElementById("feedback-text").style.color = "red";
        
        document.getElementById("feedback-text").style.display = "block";

        enteredPassword = "";
        return;
    } else if (isNaN(parseFloat(sendAmount)) || parseFloat(sendAmount) === 0) {
        
        document.getElementById("feedback-text").textContent = "Invalid send amount (Check that it's a real number or non-zero)";
        
        document.getElementById("feedback-text").style.color = "red";
        
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

            try {
                let signedTX = await wallet.sendTransaction(tx);

                decryptedPriv = "";

                console.log(`TX Hash: ${signedTX.hash}`);

                document.getElementById("feedback-text").textContent = "Transaction sent successfully!";
                
                document.getElementById("feedback-text").style.color = "green";
                
                document.getElementById("feedback-text").style.display = "block";

                //Open the Etherscan window
                window.open(`https://etherscan.io/tx/${signedTX.hash}`);
            } catch (error) {
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
            let encryptedWIF: string = readFile(path.join(__dirname + "/../wallets/btc_private.key"));
            let decryptedWIF: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedWIF.replace(" (ENCRYPTED)", ""), enteredPassword));

            let sourceAddress: string = readFile(path.join(__dirname + "/../wallets/btc_address.pem"));
            
            const NETWORK = BitcoinJS.networks.bitcoin;

            //Get the UTXOs
            let utxos = []
            let totalAmountAvailable: number = 0; //Total amount available in Satoshi

            {
                const url = `https://api.blockcypher.com/v1/btc/main/addrs/${sourceAddress}?unspentOnly=true`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    totalAmountAvailable = data.balance;
                    utxos = data.txrefs || [];
                } catch (err) {
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
                    const txHex = await fetchBTCTransactionHex(utxo.tx_hash);
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
                const recipientAddress: string = document.getElementById("destination-address").value.toString();

                //Add the recipient output
                psbt.addOutput({
                    address: recipientAddress,
                    value: (parseFloat(sendAmount) * 100000000) - transactionFee,
                });

                //Calculate and add the change output back to the sneder's address
                const change: number = totalAmountAvailable - parseFloat(sendAmount) * 100000000 - transactionFee;
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
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    const responseData = await response.json();

                    //Open the BlockCypher window
                    window.open(`https://live.blockcypher.com/btc/tx/${responseData.tx.hash}`);

                    console.log(responseData);
                } catch (error) {
                    console.error("Error broadcasting transaction:", error);
                }
            }
        }

        if (selectedCurrency === "Solana") {
            let encryptedMnemonic: string = readFile(path.join(__dirname + "/../wallets/mnemonic.txt"));
            let decryptedMnemonic: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedMnemonic.replace(" (ENCRYPTED)", ""), enteredPassword));

            //Connect to the Solana network/cluster
            let connection = new Solana.Connection(Solana.clusterApiUrl("mainnet-beta"), "confirmed");
            let minimumBalanceForRentExemption = await connection.getMinimumBalanceForRentExemption(0);

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
                let sig = await Solana.sendAndConfirmTransaction(connection, tx, [keypair]);
                console.log(`Sent SOL transaction with signature: ${sig}`);

                document.getElementById("feedback-text").textContent = "Transaction sent successfully!";
                
                document.getElementById("feedback-text").style.color = "green";
                
                document.getElementById("feedback-text").style.display = "block";

                //Open the SolScan window
                window.open(`https://solscan.io/tx/${sig}`);
            } catch (error) {
                document.getElementById("feedback-text").textContent = "Error sending transaction. Check that you have sufficent funds, otherwise try again later.";
                
                document.getElementById("feedback-text").style.color = "red";
                
                document.getElementById("feedback-text").style.display = "block";

                console.error("Error broadcasting transaction:", error);
            }
        }
    } else {
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
}

//Event listeners
//@ts-expect-error
document.getElementById("updateConfirmModalData").addEventListener("click", updateConfirmModalData());