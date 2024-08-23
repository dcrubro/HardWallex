"use strict";
//WalletManager.ts
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bootstrap_1 = require("bootstrap");
const QRCode = __importStar(require("qrcode"));
//@ts-expect-error
const CommonFunctions_1 = require("../dist/renderer/CommonFunctions");
//@ts-expect-error
const BalanceReader_1 = require("../dist/renderer/BalanceReader");
let ethBalance;
let sepEthBalance;
let btcBalance;
let solBalance;
//Functions segment
function getUSDValue(ownedAmount, currencyValue) {
    return ownedAmount * currencyValue;
}
function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: { dark: "#ffffff", light: "#212529" }, width: 128, height: 128 }, function (err) {
        if (err) {
            throw err;
        }
    });
}
localStorage.setItem("ethAddress", (0, BalanceReader_1.getWalletData)(path_1.default.join(__dirname + "/../wallets/eth_address.pem")));
localStorage.setItem("btcAddress", (0, BalanceReader_1.getWalletData)(path_1.default.join(__dirname + "/../wallets/btc_address.pem")));
localStorage.setItem("solAddress", (0, BalanceReader_1.getWalletData)(path_1.default.join(__dirname + "/../wallets/sol_address.pem")));
//HTML code segment
function setHTMLObjects() {
    return __awaiter(this, void 0, void 0, function* () {
        let totalBalance = 0;
        //On Content Load
        ethBalance = yield (0, BalanceReader_1.getETHWalletBalance)(localStorage.getItem("ethAddress").toString());
        //sepEthBalance = await getSepETHWalletBalance(localStorage.getItem("ethAddress").toString());
        btcBalance = yield (0, BalanceReader_1.getBTCWalletBalance)(localStorage.getItem("btcAddress").toString());
        solBalance = yield (0, BalanceReader_1.getSOLWalletBalance)(localStorage.getItem("solAddress").toString());
        /*ETHEREUM*/
        let ethAddr = yield localStorage.getItem("ethAddress");
        document.getElementById("ethWalletAddress").textContent = `Wallet Address: ${ethAddr}`;
        document.getElementById("ethWalletBalance").textContent = `ETH Balance: ${ethBalance} ETH`;
        //@ts-expect-error
        document.getElementById("ethWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2)}`;
        //@ts-expect-error
        totalBalance += parseFloat(yield getUSDValue(ethBalance, localStorage.getItem("ethPrice")).toFixed(2));
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
        let btcAddr = yield localStorage.getItem("btcAddress");
        document.getElementById("btcWalletAddress").textContent = `Wallet Address: ${btcAddr}`;
        document.getElementById("btcWalletBalance").textContent = `BTC Balance: ${btcBalance} BTC`;
        //@ts-expect-error
        document.getElementById("btcWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(btcBalance, localStorage.getItem("btcPrice")).toFixed(2)}`;
        //@ts-expect-error
        totalBalance += parseFloat(yield getUSDValue(btcBalance, localStorage.getItem("btcPrice")).toFixed(2));
        drawQRCode(btcAddr, "btc-address-qrcode");
        /*SOLANA*/
        let solAddr = yield localStorage.getItem("solAddress");
        document.getElementById("solWalletAddress").textContent = `Wallet Address: ${solAddr}`;
        document.getElementById("solWalletBalance").textContent = `SOL Balance: ${solBalance} SOL`;
        //@ts-expect-error
        document.getElementById("solWalletBalanceValue").textContent = `USD Value: $${yield getUSDValue(solBalance, localStorage.getItem("solPrice")).toFixed(2)}`;
        //@ts-expect-error
        totalBalance += parseFloat(yield getUSDValue(solBalance, localStorage.getItem("solPrice")).toFixed(2));
        drawQRCode(solAddr, "sol-address-qrcode");
        return { "totalBalance": totalBalance };
    });
}
function checkWalletExistance() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield !fs_1.default.existsSync(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"))) {
            yield window.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
                let modalElementMain = new bootstrap_1.Modal(document.getElementById("walletNoExistanceModal"));
                modalElementMain.show();
            }));
        }
    });
}
//Context boundary: custom assets
let customAssetNetwork = "";
function setAssetNetwork(network) {
    customAssetNetwork = network;
    document.getElementById("add-custom-asset-selected-network-text").textContent = `Selected network: ${network}`;
}
function confirmAddCustomAsset() {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-expect-error
        let assetContractAddress = document.getElementById("input-custom-asset-contract-address").value;
        if (customAssetNetwork === "Ethereum") {
            //Retrieve asset data from Etherscan
            const url = `${localStorage.getItem("etherscanBaseUrl")}/?module=account&action=tokentx&contractaddress=${assetContractAddress}&page=1&offset=5&apikey=${localStorage.getItem("etherscanAPIkey")}`;
            let symbol;
            let name;
            let decimal;
            try {
                const response = yield fetch(url);
                const data = yield response.json();
                if (data.status === "1") {
                    symbol = data.result[0].tokenSymbol;
                    name = data.result[0].tokenName;
                    decimal = parseInt(data.result[0].tokenDecimal);
                }
                else {
                    console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
                    document.getElementById("add-custom-asset-feedback-text").textContent = "Error getting asset data. Please check the contract address.";
                    document.getElementById("add-custom-asset-feedback-text").style.color = "red";
                    document.getElementById("add-custom-asset-feedback-text").style.display = "block";
                    throw new Error(data.message);
                }
            }
            catch (error) {
                console.log("Error occurred while fetching balance. Please check the Ethereum address or try again later.");
                document.getElementById("add-custom-asset-feedback-text").textContent = "Error getting asset data. Please check the contract address.";
                document.getElementById("add-custom-asset-feedback-text").style.color = "red";
                document.getElementById("add-custom-asset-feedback-text").style.display = "block";
                throw error;
            }
            //Right here we hope to God that the asset data was actually successfully fetched, and that TypeScript isn't screwing us over with false information.
            //We read the current custom assets stored in a json file. This should we parsed into a JS list object (hopefully).
            let jsonCustomAssets = JSON.parse((0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/customassets.json")));
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
            (0, CommonFunctions_1.writeFile)(path_1.default.join(__dirname + "/../wallets/"), "customassets.json", JSON.stringify(jsonCustomAssets));
            document.getElementById("add-custom-asset-feedback-text").textContent = "Successfully added the custom asset!";
            document.getElementById("add-custom-asset-feedback-text").style.color = "green";
            document.getElementById("add-custom-asset-feedback-text").style.display = "block";
            setTimeout(function () {
                window.location.href = "./wallets.html";
            }, 1000);
        }
    });
}
function getCustomAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        let totalBalance = 0;
        let jsonCustomAssets = JSON.parse((0, CommonFunctions_1.readFile)(path_1.default.join(__dirname + "/../wallets/customassets.json")));
        let customAssetWalletsHTMLDiv = document.getElementById("custom-assets");
        //Fetch all asset data
        const assetEthplorerData = yield (0, BalanceReader_1.getEthplorerWalletBalance)(yield localStorage.getItem("ethAddress"));
        const tokensOwned = assetEthplorerData.tokens ? assetEthplorerData.tokens : null;
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
            }
            else {
                assetObject = {
                    "balance": 0,
                    "tokenInfo": {
                        "decimals": "1",
                        "price": {
                            "rate": 0.00
                        }
                    }
                };
            }
            //Construct the HTML
            let htmlToAppend = `<div class="card">
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
                  USD Value: $${assetObject.tokenInfo.price !== false ? getUSDValue((assetObject.balance / (10 ** parseInt(assetObject.tokenInfo.decimals))), assetObject.tokenInfo.price.rate) : "Unknown"}
                </p>
              </div>
            </div>
        </div>
        <br />`;
            totalBalance += assetObject.tokenInfo.price !== false ? getUSDValue((assetObject.balance / (10 ** parseInt(assetObject.tokenInfo.decimals))), assetObject.tokenInfo.price.rate) : 0;
            //Append the HTML to the "custom-assets" div
            customAssetWalletsHTMLDiv.innerHTML += htmlToAppend;
        });
        return { "totalBalance": totalBalance };
    });
}
function goToImportWallet() { window.location.href = "./walletimport.html"; }
function goToCreateWallet() { window.location.href = "./walletcreation.html"; }
checkWalletExistance();
let balance1 = getCustomAssets();
let balance2 = setHTMLObjects();
let finalBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalWalletBalanceObject = document.getElementById("total-wallet-usd-value-text");
    let final = (yield balance1).totalBalance + (yield balance2).totalBalance;
    document.getElementById("data-loading-spinner").style.visibility = "hidden";
    totalWalletBalanceObject.textContent = `Total Wallet Balance: $${final}`;
});
finalBalance();
