"use strict";
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
exports.readFile = exports.writeFile = void 0;
const fs = __importStar(require("fs"));
function writeFile(destinationFolder, fileName, data) {
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
exports.writeFile = writeFile;
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
exports.readFile = readFile;
