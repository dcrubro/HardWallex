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
Object.defineProperty(exports, "__esModule", { value: true });
//index.ts
//Written by DcruBro @ https://dcrubro.com/
const electron_1 = require("electron");
const path = __importStar(require("path"));
process.env.NODE_ENV = "production"; //Set this to "production" for prod. build and "development" for dev mode
let mainWindow;
const isMacPlatform = process.platform === 'darwin';
const isDevMode = process.env.NODE_ENV !== "production";
electron_1.app.on("ready", createWindows);
function createWindows() {
    mainWindow = new electron_1.BrowserWindow({
        title: "HardWallex",
        width: isDevMode ? 1200 : 1200,
        height: 700,
        backgroundColor: "#212428",
        autoHideMenuBar: isDevMode ? false : true,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            webSecurity: true,
            devTools: isDevMode ? true : false
        },
        icon: path.join(__dirname + "icon.ico"),
        show: false,
        resizable: false,
    });
    mainWindow.loadFile("./html/index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("etherscanAPIkey", "41EJZUY9SEWICJFJPM7FD4M8YZNSWF1JYM")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("etherscanBaseUrl", "https://api.etherscan.io/api")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("solscanBaseUrl", "https://api.mainnet-beta.solana.com")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("sepEtherscanBaseUrl", "https://api-sepolia.etherscan.io/api")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("bitcoinexplorerBaseUrl", "https://bitcoinexplorer.org")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("testnetBitcoinexplorerBaseUrl", "https://blockstream.info/testnet/api")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("coinGeckoQueryUrl", "https://api.coingecko.com/api/v3/simple")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("ethPrice", 0)`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("btcPrice", 0)`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("solPrice", 0)`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("ethAddress", "")`, true);
    mainWindow.reload(); //Force a reload so the ethPrice localStorage variable is up-to-date
}
electron_1.app.on('window-all-closed', () => {
    if (!isMacPlatform) {
        electron_1.app.quit();
    }
});
