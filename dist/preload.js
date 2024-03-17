"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let ethPrice;
let ethAddress;
const etherscanAPIkey = "41EJZUY9SEWICJFJPM7FD4M8YZNSWF1JYM";
const etherscanBaseUrl = "https://api.etherscan.io/api";
const coinGeckoEthQueryUrl = "https://api.coingecko.com/api/v3/simple";
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
