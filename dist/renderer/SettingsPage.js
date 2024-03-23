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
const path = __importStar(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js"));
function readFile(filePath) {
    //Pretty self-explanatory
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function writeFile(destinationFolder, fileName, data) {
    //Pretty self-explanatory
    if (fs.existsSync(destinationFolder)) {
        fs.writeFile(`${destinationFolder}${fileName}`, data, function (err) {
            if (err)
                throw err;
        });
    }
    else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}
function confirmExportWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text-export-wallet").value;
    let hashedPassword = readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));
    if (crypto_js_1.default.SHA256(enteredPassword).toString() === hashedPassword) {
        //Password is correct
        //Get the current date and time for identification
        let date = new Date();
        let timeString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        //Manual files
        let decryptedMnemonic = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt(readFile(path.join(__dirname + "/../wallets/mnemonic.txt")).replace(" (ENCRYPTED)", ""), enteredPassword));
        writeFile(path.join(__dirname + "/../exports/"), `mnemonic_decrypted_${timeString}.txt`, decryptedMnemonic);
        //Automatic files (for future-proofing)
        try {
            const files = fs.readdirSync(path.join(__dirname + "/../wallets/"));
            files.forEach(file => {
                if (file.endsWith('.key')) {
                    let filePath = path.join(__dirname + `/../wallets/${file}`);
                    let data = fs.readFileSync(filePath, 'utf8');
                    // Remove " (ENCRYPTED)" from the end of the string
                    let encryptedData = data.replace(/\s+\(ENCRYPTED\)$/g, '');
                    // Decrypt using the passed key
                    let decryptedData = crypto_js_1.default.AES.decrypt(encryptedData, enteredPassword).toString(crypto_js_1.default.enc.Utf8);
                    writeFile(path.join(__dirname + "/../exports/"), `${file.replace(".key", "")}_decrypted_${timeString}.txt`, decryptedData);
                    decryptedData = "";
                }
            });
        }
        catch (error) {
            console.error('Error reading directory:', error);
            //@ts-expect-error
            document.getElementById("feedback-text-export-wallet").textContent = "Error reading directory.";
            //@ts-expect-error
            document.getElementById("feedback-text-export-wallet").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text-export-wallet").style.display = "block";
            return;
        }
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").textContent = "Wallet data exported successfully!";
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").style.color = "green";
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").style.display = "block";
    }
    else {
        //Password isn't corrent
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").textContent = "Incorrect password.";
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text-export-wallet").style.display = "block";
    }
    enteredPassword = "";
}
function confirmDeleteWallet() {
    //@ts-expect-error
    let enteredPassword = document.getElementById("password-text-delete-wallet").value;
    let hashedPassword = readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));
    if (crypto_js_1.default.SHA256(enteredPassword).toString() === hashedPassword) {
        try {
            fs.rmSync(path.join(__dirname + "/../wallets/"), { recursive: true });
            fs.mkdir(path.join(__dirname + "/../wallets/"), () => { });
        }
        catch (error) {
            console.error('Error deleting/recreating directory:', error);
            //@ts-expect-error
            document.getElementById("feedback-text-delete-wallet").textContent = "Error reading directory.";
            //@ts-expect-error
            document.getElementById("feedback-text-delete-wallet").style.color = "red";
            //@ts-expect-error
            document.getElementById("feedback-text-delete-wallet").style.display = "block";
            return;
        }
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").textContent = "Wallet data deleted successfully!";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.color = "green";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }
    else {
        //Password isn't corrent
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").textContent = "Incorrect password.";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }
    enteredPassword = "";
}
