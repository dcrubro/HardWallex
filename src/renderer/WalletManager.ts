//WalletManager.ts
//Written by DcruBro @ https://dcrubro.com/

import fs from "fs";
import path from "path";
import { Modal } from "bootstrap";
import * as QRCode from "qrcode";
import * as Solana from "@solana/web3.js";
//@ts-expect-error
import { writeFile, readFile } from "../dist/renderer/CommonFunctions";

let ethBalance: number;
let sepEthBalance: number;
let btcBalance: number;
let solBalance: number;

//Functions segment
async function getEthplorerWalletBalance(address: string): Promise<any> {
    //I know you're not supposed to leak API keys like this, but I don't really care about this one, since I got it for free.
    const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=EK-kyBsC-yEYfC55-31WJm`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            return data;
        } else {
            console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching ETH Wallet balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

async function getETHWalletBalance(address: string): Promise<number> {
    const data = await getEthplorerWalletBalance(address);

    return data.ETH.balance;
}

async function getSOLWalletBalance(address: string): Promise<number> {
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
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const data = await response.json();

        if (data) {
            const solBal = data.result.value / 1e9; // Convert lamports to SOL
            return solBal;
        } else {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

async function getSepETHWalletBalance(address: string): Promise<number> {
    const url = `${localStorage.getItem("sepEtherscanBaseUrl")}/?module=account&action=balance&address=${address}&tag=latest&apikey=${localStorage.getItem("etherscanAPIkey")}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1") {
            const balanceInWei = parseInt(data.result);
            const balanceInEth = balanceInWei / 1e18; //Convert wei to Ether
            return balanceInEth;
        } else {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
            throw new Error(data.message);
        }
    } catch (error) {
        console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
        throw error;
    }
}

async function getBTCWalletBalance(address: string): Promise<number> {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;

    let balance: number = 0;

    try {
        const response = await fetch(url);
        const data = await response.json();

        balance = data.balance / (10**8);
    } catch (err) {
        console.error("Error occurred while fetching balance. Please check the Bitcoin address or try again later.", err);

        return;
    }

    return balance;
}

function getUSDValue(ownedAmount: number, currencyValue: number) {
    return ownedAmount * currencyValue;
}

function getWalletData(path: string): string {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return data.toString();
    } else {
        console.log("Error when reading wallet data (path may be invalid)");
        return "NULL";
    }
}

function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: {dark: "#ffffff", light: "#212529"}, width: 128, height: 128 }, function (err) {
        if (err) { throw err; }
    });
}

localStorage.setItem("ethAddress", getWalletData(path.join(__dirname + "/../wallets/eth_address.pem")));
localStorage.setItem("btcAddress", getWalletData(path.join(__dirname + "/../wallets/btc_address.pem")));
localStorage.setItem("solAddress", getWalletData(path.join(__dirname + "/../wallets/sol_address.pem")));

//HTML code segment

async function setHTMLObjects() {
    //On Content Load
    
    ethBalance = await getETHWalletBalance(localStorage.getItem("ethAddress").toString());
    //sepEthBalance = await getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
    btcBalance = await getBTCWalletBalance(localStorage.getItem("btcAddress").toString());
    solBalance = await getSOLWalletBalance(localStorage.getItem("solAddress").toString());
    
    /*ETHEREUM*/
    let ethAddr = await localStorage.getItem("ethAddress");

    document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${ethAddr}`;
    
    document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
    //@ts-expect-error
    document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
    
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
    let btcAddr = await localStorage.getItem("btcAddress");

    document.getElementById("btcWalletAddress").textContent = `Wallet Address: ${btcAddr}`;
    
    document.getElementById("btcWalletBalance").textContent = `BTC Balance: ${btcBalance} BTC`;
    //@ts-expect-error
    document.getElementById("btcWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(btcBalance, localStorage.getItem("btcPrice")).toFixed(2)}`;
    
    drawQRCode(btcAddr, "btc-address-qrcode");

    /*SOLANA*/
    let solAddr = await localStorage.getItem("solAddress");

    document.getElementById("solWalletAddress").textContent = `Wallet Address: ${solAddr}`;
    
    document.getElementById("solWalletBalance").textContent = `SOL Balance: ${solBalance} SOL`;
    //@ts-expect-error
    document.getElementById("solWalletBalanceValue").textContent = `USD Value: $${await getUSDValue(solBalance, localStorage.getItem("solPrice")).toFixed(2)}`;
    
    drawQRCode(solAddr, "sol-address-qrcode");
}

async function checkWalletExistance() {
    if (await !fs.existsSync(path.join(__dirname + "/../wallets/hashed_password.txt"))) {
        await window.addEventListener("DOMContentLoaded", async () => {
            
            let modalElementMain = new Modal(document.getElementById("walletNoExistanceModal"));
            modalElementMain.show();
        });
    }
}

//Context boundary: custom assets
let customAssetNetwork: string = "";

function setAssetNetwork(network: string) {
    customAssetNetwork = network;

    document.getElementById("add-custom-asset-selected-network-text").textContent = `Selected network: ${network}`;
}

async function confirmAddCustomAsset() {
    //@ts-expect-error
    let assetContractAddress = document.getElementById("input-custom-asset-contract-address").value;

    if (customAssetNetwork === "Ethereum") {
        //Retrieve asset data from Etherscan
        const url = `${localStorage.getItem("etherscanBaseUrl")}/?module=account&action=tokentx&contractaddress=${assetContractAddress}&page=1&offset=5&apikey=${localStorage.getItem("etherscanAPIkey")}`;
        
        let symbol: string;
        let name: string;
        let decimal: number;

        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.status === "1") {
                symbol = data.result[0].tokenSymbol;
                name = data.result[0].tokenName;
                decimal = parseInt(data.result[0].tokenDecimal);
            } else {
                console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");

                document.getElementById("add-custom-asset-feedback-text").textContent = "Error getting asset data. Please check the contract address.";
                document.getElementById("add-custom-asset-feedback-text").style.color = "red";
                document.getElementById("add-custom-asset-feedback-text").style.display = "block";
                
                throw new Error(data.message);
            }
        } catch (error) {
            console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");

            document.getElementById("add-custom-asset-feedback-text").textContent = "Error getting asset data. Please check the contract address.";
            document.getElementById("add-custom-asset-feedback-text").style.color = "red";
            document.getElementById("add-custom-asset-feedback-text").style.display = "block";
            
            throw error;
        }

        //Right here we hope to God that the asset data was actually successfully fetched, and that TypeScript isn't screwing us over with false information.

        //We read the current custom assets stored in a json file. This should we parsed into a JS list object (hopefully).
        let jsonCustomAssets: any[] = JSON.parse(readFile(path.join(__dirname + "/../wallets/customassets.json")));

        //Construct and append the data to the JSON object
        let constructedTokenObject = {
            "TokenNetwork": customAssetNetwork,
            "TokenName": name,
            "TokenSymbol": symbol,
            "TokenDecimals": decimal,
            "TokenContractAddress": assetContractAddress
        };

        //@ts-expect-error
        jsonCustomAssets.Assets.push(constructedTokenObject);

        //TODO: When adding a custom asset, make sure that the asset is not already in the customassets.json file,
        //as that will result in repeat assets being added, which might cause issues down the line.

        console.log(jsonCustomAssets);

        //Push changes to the customassets.json file
        writeFile(path.join(__dirname + "/../wallets/"), "customassets.json", JSON.stringify(jsonCustomAssets));

        document.getElementById("add-custom-asset-feedback-text").textContent = "Successfully added the custom asset!";
        document.getElementById("add-custom-asset-feedback-text").style.color = "green";
        document.getElementById("add-custom-asset-feedback-text").style.display = "block";
    }
}

async function getCustomAssets() {
    let jsonCustomAssets: any[] = JSON.parse(readFile(path.join(__dirname + "/../wallets/customassets.json")));
    let customAssetWalletsHTMLDiv = document.getElementById("custom-assets");

    //Fetch all asset data
    const assetEthplorerData = await getEthplorerWalletBalance(await localStorage.getItem("ethAddress")); 
    const tokensOwned: any[] = assetEthplorerData.tokens ? assetEthplorerData.tokens : null;
    
    //@ts-expect-error
    jsonCustomAssets.Assets.forEach(asset => {
        //NOTE: I spent wayyyyy too long on this part. For some reason my code wasn't detecting the contract address and I thought 
        //I wasn't parsing the data correctly or something. Turns out I just needed to convert my contract address to lower case. Oh well.
        let contractAddress = asset.TokenContractAddress.toLowerCase();

        //Find the correct asset in said data
        let assetObject;
        
        if (tokensOwned != null) {
            for (let i = 0; i < tokensOwned.length; i++) {
                const t = tokensOwned[i];
                if (t.tokenInfo.address.toLowerCase() === contractAddress) {
                    assetObject = t;
                }
            }
        } else {
            assetObject = {
                "balance": 0,
                "tokenInfo": {
                    "decimals": "1",
                    "price": {
                        "rate": 0.00
                    }
                }
            }
        }

        //Construct the HTML
        let htmlToAppend = 
        `<div class="card">
            <div class="card-body row">
              <div class="col-md-8">
                <h5 class="card-title">${asset.TokenName} Wallet</h5>
                <p class="card-text" id="${asset.TokenSymbol}WalletAddress">
                  Asset Contract Address: ${asset.TokenContractAddress} (${asset.TokenNetwork})
                </p>
                <p class="card-text" id="${asset.TokenSymbol}WalletBalance">
                  ${asset.TokenSymbol} Balance: ${(assetObject.balance / (10 ** parseInt(assetObject.tokenInfo.decimals)))} ${asset.TokenSymbol}
                </p>
                <p class="card-text" id="${asset.TokenSymbol}WalletBalanceValue">
                  USD Value: $${
                    assetObject.tokenInfo.price !== false ? getUSDValue((assetObject.balance / (10 ** parseInt(assetObject.tokenInfo.decimals))), assetObject.tokenInfo.price.rate) : "Unknown"
                  }
                </p>
              </div>
            </div>
        </div>
        <br />`;

        //Append the HTML to the "custom-assets" div
        customAssetWalletsHTMLDiv.innerHTML += htmlToAppend;
    });
}

function goToImportWallet() { window.location.href = "./walletimport.html"; }
function goToCreateWallet() { window.location.href = "./walletcreation.html"; }

checkWalletExistance();
getCustomAssets();
setHTMLObjects();