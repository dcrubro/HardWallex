//preload.ts
//Written by DcruBro @ https://dcrubro.com/
import { ipcRenderer, contextBridge } from "electron";

let ethPrice: any;
let ethAddress: any;

const etherscanAPIkey: string = "41EJZUY9SEWICJFJPM7FD4M8YZNSWF1JYM";
const etherscanBaseUrl: string = "https://api.etherscan.io/api";
const coinGeckoEthQueryUrl: string = "https://api.coingecko.com/api/v3/simple";

/*contextBridge.exposeInMainWorld("api", {
    //Getters and setters
    getEthPrice: () => { return ethPrice; },
    setEthPrice: (newValue: any) => { ethPrice = newValue; },

    getEthAddress: () => { return ethAddress; },
    setEthAddress: (newValue: any) => { ethAddress = newValue; },

    //Read-Only vars
    etherscanAPIkey: "41EJZUY9SEWICJFJPM7FD4M8YZNSWF1JYM",
    etherscanBaseUrl: "https://api.etherscan.io/api",
    coinGeckoEthQueryUrl: "https://api.coingecko.com/api/v3/simple"
});*/