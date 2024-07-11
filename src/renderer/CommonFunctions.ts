import * as fs from "fs";

export function writeFile(destinationFolder: string, fileName: string, data: string) {
    if (fs.existsSync(destinationFolder)) {
        fs.writeFile(`${destinationFolder}${fileName}`, data, function(err) {
            if (err) throw err;
        });
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}

export function readFile(filePath: string): any {
    //Pretty self-explanatory
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(`${filePath}`).toString();
    } else {
        console.error("Error: Destination folder does not exist.");
        return;
    }
}