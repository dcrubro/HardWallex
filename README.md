# HardWallex
HardWallex - An opensource hardware wallet

## Purpose
HardWallex is a piece of software that you can use to create a hardware wallet on any device.

## Installation

### Method 1 - Pre-compiled binaries (Easier):
1. Download the latest release from the releases section depending on your platform.
2. Extract the archive on your device of choice.
3. Run the executable.

### Method 2 - Compile from source:
1. Clone the repo with **git clone https://github.com/dcrubro/HardWallex.git**
2. Run ```cd HardWallex``` to change your directory into the **HardWallex** repository directory.
3. Run ```npm install``` to download all required dependencies.
4. Run the build with ```npm run build-win```, changing the **build-win** with **build-linux** for Linux and **build-mac** for macOS.
5. You should have a directory in **build/** with the name **[platform]-unpacked/**
6. Copy the directory to your device of choice.
7. Enter the directory and navigate to resources/app/.
8. Create two directories: **wallets** and **exports**.
9. Run the executable in the main directory.
- *Note that you may have to modify the source if you choose this method. You also must have node.js and npm installed.*

## Updating
To update your wallet, simply follow the installation steps again and overwrite any existing files that conflict.  
<br>
**This shouldn't delete any wallet files, but it's always a good idea to keep a backup of your wallet data, or at least the mnemonic phrase.**

## Features
- Wallet balance viewer
- Crypto withdrawal
- Wallet exporting
- Wallet importing
- AES Wallet encryption
- Custom assets
- **Note:** *This list is subject to change*

## Supported currencies
- **Bitcoin** (BTC)
- **Ethereum** (ETH)
- **Solana** (SOL)
- **All ERC-20 Tokens** (Ethereum)
- **Note:** *This list is subject to change*

<br>

---

**Made by DcruBro @ https://dcrubro.com/ - All Rights Reserved**  
**MPL-2.0 License**
