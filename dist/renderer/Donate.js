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
const QRCode = __importStar(require("qrcode"));
function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: { dark: "#ffffff", light: "#212529" }, width: 128, height: 128 }, function (err) {
        if (err) {
            throw err;
        }
    });
}
function drawCodes() {
    drawQRCode("16qHHvfutygHyEH7uxrqZjcUcm7EDfv4mM", "btc-address-qrcode");
    drawQRCode("0x0bDF220BB5D9933C869354478a3A525716fC42a5", "eth-address-qrcode");
    drawQRCode("FCXgkkWYLnzzr1Mwt75E5XJreibbpYtaP9mAYrd9Fph4", "sol-address-qrcode");
    drawQRCode("45P4sfCLDS9LKxgci85MA4VRZu5REpKkE2a23jku3BGo2g6XJn1vZreM6MSUC6omKoWSyTZaSmSqBhkWGJv6MMfr93fDiVC", "xmr-address-qrcode");
}
drawCodes();
