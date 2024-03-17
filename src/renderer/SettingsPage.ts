//SettingsPage.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";

function readFile(filePath: string): any {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function writeFile(destinationFolder: string, fileName: string, data: string) {
    if (fs.existsSync(destinationFolder)) {
        fs.writeFile(`${destinationFolder}${fileName}`, data, function(err) {
            if (err) throw err;
        });
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function confirmExportWallet() {
    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text-export-wallet").value;
    let hashedPassword: string = readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));

    if (CryptoJS.SHA256(enteredPassword).toString() === hashedPassword) {
        //Password is correct

        //Get the current date and time for identification
        let date = new Date();
        let timeString: string = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        //Manual files
        let decryptedMnemonic: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(readFile(path.join(__dirname + "/../wallets/mnemonic.txt").replace(" (ENCRYPTED)", "")), enteredPassword));
        writeFile(path.join(__dirname + "/../exports/"), `mnemonic_decrypted_${timeString}.txt`, decryptedMnemonic);

        //Automatic files (for future-proofing)
        fs.readdir(path.join(__dirname + "/../wallets/"), (err, files) => {
            if (err) { throw err; }

            let keyFiles = files.filter(file => path.extname(file) === ".key");

            keyFiles.forEach(file => {
                //Decrypt
            });
        });
    } else {
        //Password isn't corrent
    }
}

function confirmDeleteWallet() {

}