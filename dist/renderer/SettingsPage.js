"use strict";
//SettingsPage.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
function readFile(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function confirmExportWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text-export-wallet").value;
    let hashedPassword = readFile(path_1.default.join(__dirname + "/../wallets/hashed_password.txt"));
    if (crypto_js_1.default.SHA256(enteredPassword).toString() === hashedPassword) {
        //Password is correct
        let decryptedMnemonic = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(readFile(path_1.default.join(__dirname + "/../wallets/mnemonic.txt").replace(" (ENCRYPTED)", "")), enteredPassword));
    }
    else {
        //Password isn't corrent
    }
}
function confirmDeleteWallet() {
}
