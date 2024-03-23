//SettingsPage.ts
//Written by DcruBro @ https://dcrubro.com/

import * as fs from "fs";
import * as path from "path";
import CryptoJS from "crypto-js";

function readFile(filePath: string): any {
    //Pretty self-explanatory
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function writeFile(destinationFolder: string, fileName: string, data: string) {
    //Pretty self-explanatory
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
        let decryptedMnemonic: string = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(readFile(path.join(__dirname + "/../wallets/mnemonic.txt")).replace(" (ENCRYPTED)", ""), enteredPassword));
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
                    let decryptedData: string = CryptoJS.AES.decrypt(encryptedData, enteredPassword).toString(CryptoJS.enc.Utf8);

                    writeFile(path.join(__dirname + "/../exports/"), `${file.replace(".key", "")}_decrypted_${timeString}.txt`, decryptedData);

                    decryptedData = "";
                }
            });
        } catch (error) {
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

    } else {
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
    let enteredPassword: string = document.getElementById("password-text-delete-wallet").value;
    let hashedPassword: string = readFile(path.join(__dirname + "/../wallets/hashed_password.txt"));

    if (hashedPassword === null) {
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").textContent = "No wallet data found! It has most likely already been deleted!";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        //@ts-expect-error
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }

    if (CryptoJS.SHA256(enteredPassword).toString() === hashedPassword) {
        try {
            fs.rmSync(path.join(__dirname + "/../wallets/"), { recursive: true });
            fs.mkdir(path.join(__dirname + "/../wallets/"), () => {});
        } catch (error) {
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

    } else {
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