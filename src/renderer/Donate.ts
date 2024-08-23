import * as QRCode from "qrcode";

function drawQRCode(content, canvasId) {
    // Generate the QR code
    QRCode.toCanvas(document.getElementById(canvasId), content, { color: {dark: "#ffffff", light: "#212529"}, width: 128, height: 128 }, function (err) {
        if (err) { throw err; }
    });
}

function drawCodes() {
    drawQRCode("16qHHvfutygHyEH7uxrqZjcUcm7EDfv4mM", "btc-address-qrcode");
    drawQRCode("0x0bDF220BB5D9933C869354478a3A525716fC42a5", "eth-address-qrcode");
    drawQRCode("FCXgkkWYLnzzr1Mwt75E5XJreibbpYtaP9mAYrd9Fph4", "sol-address-qrcode");
    drawQRCode("45P4sfCLDS9LKxgci85MA4VRZu5REpKkE2a23jku3BGo2g6XJn1vZreM6MSUC6omKoWSyTZaSmSqBhkWGJv6MMfr93fDiVC", "xmr-address-qrcode");
}

drawCodes();