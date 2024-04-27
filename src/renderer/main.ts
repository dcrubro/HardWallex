//main.ts
//Written by DcruBro @ https://dcrubro.com/
console.log("Hello from HardWallex!");

function getLatestCoingeckoPrices(): void {
    let url: string = `${localStorage.getItem("coinGeckoQueryUrl")}/price?ids=ethereum&vs_currencies=usd`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("ethPrice", data.ethereum.usd);
        })
        .catch(error => {
            console.log("Error fetching coingecko prices");
    });

    url = `${localStorage.getItem("coinGeckoQueryUrl")}/price?ids=bitcoin&vs_currencies=usd`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("btcPrice", data.bitcoin.usd);
        })
        .catch(error => {
            console.log("Error fetching coingecko prices");
    });

    url = `${localStorage.getItem("coinGeckoQueryUrl")}/price?ids=solana&vs_currencies=usd`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("solPrice", data.solana.usd);
        })
        .catch(error => {
            console.log("Error fetching coingecko prices");
    });
}

getLatestCoingeckoPrices();