// Creation of Web3 class
const Web3 = require("web3");
const fs = require('fs');



let data = fs.readFileSync('config.json').toString()
console.log(data)

const config = JSON.parse(data);
let address1 = config.address1;
let address2 = config.address2;

console.log(address1)
console.log(address2)

// Setting up a HttpProvider
web3_1 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3_2 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8546"));

let abiCode = [{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbCreate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"dbDelete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"dbQuery","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_create","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"test_db_delete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"}],"name":"test_db_query","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_update","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"}];

contract_1 = new web3_1.eth.Contract(abiCode, address1);
contract_2 = new web3_2.eth.Contract(abiCode, address2);

// let val = new Array(10).fill("a").join("");
// let val = "Topia is a decentralized storage solution within the Ethereum Layer 2 ecosystem and is a tailor-made project for Ethereum. By providing a decentralized key-value database to address the issue of high storage costs and enhance Ethereum's storage capabilities.";
let val = "The Importance of Time Management, Time management is a crucial skill that everyone should possess. In today's fast-paced world, time is a precious commodity, and if not managed properly, it can lead to stress, burnout, and missed opportunities. Effective time management allows individuals to prioritize tasks, meet deadlines, and achieve their goals. One of the most important aspects of time management is setting goals. Without a clear sense of what one wants to accomplish, it is difficult to know how to allocate time. Goals should be specific, measurable, and realistic. By setting achievable goals, individuals can focus their time and energy on the tasks that matter most. Another key component of time management is creating a schedule. A schedule provides structure and helps individuals stay on track. It is important to create a realistic schedule that takes into account one's work, personal life, and other commitments. A schedule should be flexible enough to allow for unexpected events but rigid enough to ensure that important tasks are completed on time. Procrastination is a major obstacle to effective time management. It is easy to put off tasks that are difficult or unpleasant, but this only leads to more stress and anxiety. To overcome procrastination, individuals should break tasks down into smaller, manageable steps and set deadlines for each step. By tackling tasks one step at a time, individuals can build momentum and make progress towards their goals. Finally, time management requires self-discipline. It is important to avoid distractions and focus on the task at hand. This means turning off the phone, logging out of social media, and avoiding other temptations. It also means recognizing when it is time to take a break and recharge. In conclusion, time management is a critical skill that can lead to success in both personal and professional life. By setting goals, creating a schedule, overcoming procrastination, and practicing self-discipline, individuals can make the most of their time and achieve their full potential.";

(async (chain, key, value) => {
    let account = chain === 1
        ? (await web3_1.eth.getAccounts())[0]
        : (await web3_2.eth.getAccounts())[0]

    let contract = chain === 1
        ? contract_1
        : contract_2

    let res = await contract.methods.test_db_create(key, value).send({from: account})
    console.log(res)
})(1, "myKey-1k", val)
