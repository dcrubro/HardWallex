//index.ts
//Written by DcruBro @ https://dcrubro.com/
import { app, ipcMain, BrowserWindow } from "electron";
import * as path from "path";

process.env.NODE_ENV = "production"; //Set this to "production" for prod. build and "development" for dev mode

let mainWindow: BrowserWindow;

const isMacPlatform: boolean = process.platform === 'darwin';
const isDevMode: boolean = process.env.NODE_ENV !== "production";

app.on("ready", createWindows);

function createWindows(): void {
    mainWindow = new BrowserWindow({
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

app.on('window-all-closed', () => {
    if (!isMacPlatform) {
        app.quit();
    }
});