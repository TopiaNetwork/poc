// Creation of Web3 class
const Web3 = require("web3");
const fs = require('fs');

let address1
let address2

fs.readFile('config.json', (err, data) => {
    if (err) {
        console.error('Error reading config file:', err);
        return;
    }

    const config = JSON.parse(data);
    address1 = config.address1;
    address2 = config.address2;
});

// Setting up a HttpProvider
web3_1 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3_2 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:18545"));

let abiCode = [{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbCreate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"dbDelete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"dbQuery","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_create","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"test_db_delete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"test_db_query","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_update","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"}];

contract_1 = new web3_1.eth.Contract(abiCode, address1);
contract_2 = new web3_2.eth.Contract(abiCode, address2);

let val = new Array(100000).fill("a").join("");

(async (chain, key) => {
    let account = chain === 1
        ? (await web3_1.eth.getAccounts())[0]
        : (await web3_2.eth.getAccounts())[0]

    let contract = chain === 1
        ? contract_1
        : contract_2

    let res = await contract.methods.test_db_query(key).call();
    console.log(res);
})(1, "myKey")
