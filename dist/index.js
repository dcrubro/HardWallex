"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//index.ts
//Written by DcruBro @ https://dcrubro.com/
const electron_1 = require("electron");
process.env.NODE_ENV = "development"; //Set this to "production" for prod. build
let mainWindow;
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
        show: false,
        resizable: false,
    });
    mainWindow.loadFile("./html/index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("etherscanAPIkey", "41EJZUY9SEWICJFJPM7FD4M8YZNSWF1JYM")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("etherscanBaseUrl", "https://api.etherscan.io/api")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("sepEtherscanBaseUrl", "https://api-sepolia.etherscan.io/api")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("coinGeckoEthQueryUrl", "https://api.coingecko.com/api/v3/simple")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("ethPrice", 0)`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("ethAddress", "")`, true);
    mainWindow.reload(); //Force a reload so the ethPrice localStorage variable is up-to-date
}
