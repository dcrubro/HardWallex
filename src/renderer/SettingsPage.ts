//SettingsPage.ts
//Written by DcruBro @ https://dcrubro.com/

//This are named differently from their counterparts in other scripts as a quick and dirty way to bypass the declaration safety check
import * as FS from "fs";
import * as Path from "path";
import * as CRYPTO_js_2 from "crypto-js";

function readFile(filePath: string): any {
    //Pretty self-explanatory
    if (FS.existsSync(filePath)) {
        return FS.readFileSync(`${filePath}`).toString();
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

function writeFile(destinationFolder: string, fileName: string, data: string) {
    //Pretty self-explanatory
    if (FS.existsSync(destinationFolder)) {
        FS.writeFile(`${destinationFolder}${fileName}`, data, function(err) {
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
    let hashedPassword: string = readFile(Path.join(__dirname + "/../wallets/hashed_password.txt"));

    if (CRYPTO_js_2.SHA256(enteredPassword).toString() === hashedPassword) {
        //Password is correct

        //Get the current date and time for identification
        let date = new Date();
        let timeString: string = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        //Manual files
        let decryptedMnemonic: string = CRYPTO_js_2.enc.Utf8.stringify(CRYPTO_js_2.AES.decrypt(readFile(Path.join(__dirname + "/../wallets/mnemonic.txt")).replace(" (ENCRYPTED)", ""), enteredPassword));
        writeFile(Path.join(__dirname + "/../exports/"), `mnemonic_decrypted_${timeString}.txt`, decryptedMnemonic);

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
                    let decryptedData: string = CRYPTO_js_2.AES.decrypt(encryptedData, enteredPassword).toString(CRYPTO_js_2.enc.Utf8);

                    writeFile(Path.join(__dirname + "/../exports/"), `${file.replace(".key", "")}_decrypted_${timeString}.txt`, decryptedData);

                    decryptedData = "";
                }
            });
        } catch (error) {
            console.error('Error reading directory:', error);

            document.getElementById("feedback-text-export-wallet").textContent = "Error reading directory.";
            
            document.getElementById("feedback-text-export-wallet").style.color = "red";
            
            document.getElementById("feedback-text-export-wallet").style.display = "block";

            return;
        }

        
        document.getElementById("feedback-text-export-wallet").textContent = "Wallet data exported successfully!";
        
        document.getElementById("feedback-text-export-wallet").style.color = "green";
        
        document.getElementById("feedback-text-export-wallet").style.display = "block";

    } else {
        //Password isn't corrent
        document.getElementById("feedback-text-export-wallet").textContent = "Incorrect password.";
        
        document.getElementById("feedback-text-export-wallet").style.color = "red";
        
        document.getElementById("feedback-text-export-wallet").style.display = "block";
    }

    enteredPassword = "";
}

function confirmDeleteWallet() {
    //@ts-expect-error
    let enteredPassword: string = document.getElementById("password-text-delete-wallet").value;
    let hashedPassword: string = readFile(Path.join(__dirname + "/../wallets/hashed_password.txt"));

    if (hashedPassword === null) {
        
        document.getElementById("feedback-text-delete-wallet").textContent = "No wallet data found! It has most likely already been deleted!";
        
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }

    if (CRYPTO_js_2.SHA256(enteredPassword).toString() === hashedPassword) {
        try {
            FS.rmSync(Path.join(__dirname + "/../wallets/"), { recursive: true });
            FS.mkdir(Path.join(__dirname + "/../wallets/"), () => {});
        } catch (error) {
            console.error('Error deleting/recreating directory:', error);

            
            document.getElementById("feedback-text-delete-wallet").textContent = "Error reading directory.";
            
            document.getElementById("feedback-text-delete-wallet").style.color = "red";
            
            document.getElementById("feedback-text-delete-wallet").style.display = "block";

            return;
        }

        
        document.getElementById("feedback-text-delete-wallet").textContent = "Wallet data deleted successfully!";
        
        document.getElementById("feedback-text-delete-wallet").style.color = "green";
        
        document.getElementById("feedback-text-delete-wallet").style.display = "block";

    } else {
        //Password isn't corrent
        
        document.getElementById("feedback-text-delete-wallet").textContent = "Incorrect password.";
        
        document.getElementById("feedback-text-delete-wallet").style.color = "red";
        
        document.getElementById("feedback-text-delete-wallet").style.display = "block";
    }

    enteredPassword = "";
}