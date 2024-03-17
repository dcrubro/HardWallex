//main.ts
//Written by DcruBro @ https://dcrubro.com/
console.log("Hello from HardWallex!");

function getLatestCoingeckoPrices(): void {
    let url: string = `${localStorage.getItem("coinGeckoEthQueryUrl")}/price?ids=ethereum&vs_currencies=usd`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("ethPrice", data.ethereum.usd);
        })
        .catch(error => {
            console.log("Error fetching coingecko prices");
    });
}

getLatestCoingeckoPrices();