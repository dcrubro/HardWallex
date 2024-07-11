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
Object.defineProperty(exports, "__esModule", { value: true });
//This are named differently from their counterparts in other scripts as a quick and dirty way to bypass the declaration safety check
const FS = __importStar(require("fs"));
const Path = __importStar(require("path"));
const CRYPTO_js_2 = __importStar(require("crypto-js"));
//@ts-expect-error
const CommonFunctions_1 = require("../dist/renderer/CommonFunctions");
function confirmExportWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text-export-wallet").value;
    let hashedPassword = (0, CommonFunctions_1.readFile)(Path.join(__dirname + "/../wallets/hashed_password.txt"));
    if (CRYPTO_js_2.SHA256(enteredPassword).toString() === hashedPassword) {
        //Password is correct
        //Get the current date and time for identification
        let date = new Date();
        let timeString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        //Manual files
        let decryptedMnemonic = CRYPTO_js_2.enc.Utf8.stringify(CRYPTO_js_2.AES.decrypt((0, CommonFunctions_1.readFile)(Path.join(__dirname + "/../wallets/mnemonic.txt")).replace(" (ENCRYPTED)", ""), enteredPassword));
        (0, CommonFunctions_1.writeFile)(Path.join(__dirname + "/../exports/"), `mnemonic_decrypted_${timeString}.txt`, decryptedMnemonic);
        //Automatic files (for future-proofing)
        try {
            const files = FS.readdirSync(Path.join(__dirname + "/../wallets/"));
            files.forEach(file => {
                if (file.endsWith('.key')) {
                    let filePath = Path.join(__dirname + `/../wallets/${file}`);
                    let data = FS.readFileSync(filePath, 'utf8');
                    // Remove " (ENCRYPTED)" from the end of the string
                    let encryptedData = data.replace(/\s+\(ENCRYPTED\)$/g, '');
                    // Decrypt using the passed key
                    let decryptedData = CRYPTO_js_2.AES.decrypt(encryptedData, enteredPassword).toString(CRYPTO_js_2.enc.Utf8);
                    (0, CommonFunctions_1.writeFile)(Path.join(__dirname + "/../exports/"), `${file.replace(".key", "")}_decrypted_${timeString}.txt`, decryptedData);
                    decryptedData = "";
                }
            });
        }
        catch (error) {
            console.error('Error reading directory:', error);
            document.getElementById("feedback-text-export-wallet").textContent = "Error reading directory.";
            document.getElementById("feedback-text-export-wallet").style.color = "red";
            document.getElementById("feedback-text-export-wallet").style.display = "block";
            return;
        }
        document.getElementById("feedback-text-export-wallet").textContent = "Wallet data exported successfully!";
        document.getElementById("feedback-text-export-wallet").style.color = "green";
        document.getElementById("feedback-text-export-wallet").style.display = "block";
    }
    else {
        //Password isn't corrent
        document.getElementById("feedback-text-export-wallet").textContent = "Incorrect password.";
        document.getElementById("feedback-text-export-wallet").style.color = "red";
        document.getElementById("feedback-text-export-wallet").style.display = "block";
    }
    enteredPassword = "";
}
function confirmDeleteWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text-delete-wallet").value;
    let hashedPassword = (0, CommonFunctions_1.readFile)(Path.join(__dirname + "/../wallets/hashed_password.txt"));
    if (hashedPassword === null) {
        document.getElementById("feedback-text-delete-wallet").textContent = "No wallet data found! It has most likely already been deleted!";
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }
    if (CRYPTO_js_2.SHA256(enteredPassword).toString() === hashedPassword) {
        try {
            FS.rmSync(Path.join(__dirname + "/../wallets/"), { recursive: true });
            FS.mkdir(Path.join(__dirname + "/../wallets/"), () => { });
        }
        catch (error) {
            console.error('Error deleting/recreating directory:', error);
            document.getElementById("feedback-text-delete-wallet").textContent = "Error reading directory.";
            document.getElementById("feedback-text-delete-wallet").style.color = "red";
            document.getElementById("feedback-text-delete-wallet").style.display = "block";
            return;
        }
        document.getElementById("feedback-text-delete-wallet").textContent = "Wallet data deleted successfully!";
        document.getElementById("feedback-text-delete-wallet").style.color = "green";
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }
    else {
        //Password isn't corrent
        document.getElementById("feedback-text-delete-wallet").textContent = "Incorrect password.";
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }
    enteredPassword = "";
}
