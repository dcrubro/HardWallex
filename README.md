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
2. ```cd HardWallex```
3. Run electron builder with ```npx electron-builder -w```, changing the **-w** with **-l** for Linux and **-m** for macOS.
4. You should have a directory in **build/** with the name **[platform]-unpacked/**
5. Copy the directory to your device of choice.
6. Enter the directory and navigate to resources/app/.
7. Create two directories: **wallets** and **exports**.
8. Run the executable in the main directory.
- *Note that you may have to modify the source if you choose this method.*

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
- **Note:** *This list is subject to change*

## Supported currencies
- **Bitcoin** (BTC)
- **Ethereum** (ETH)
- **Note:** *This list is subject to change*

<br>

---

**Made by DcruBro @ https://dcrubro.com/ - All Rights Reserved**  
**MPL-2.0 License**