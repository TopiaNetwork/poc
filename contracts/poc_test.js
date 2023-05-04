// Creation of Web3 class
const Web3 = require("web3");

// Setting up a HttpProvider
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

let abiCode = [{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbCreate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"}],"name":"dbDelete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"}],"name":"dbQuery","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"dbUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_create","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"}],"name":"test_db_delete","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"}],"name":"test_db_query","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contractAddr","type":"address"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"test_db_update","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"}];

let binCode = "608060405234801561001057600080fd5b506108ce806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c806360a41b991161005b57806360a41b991461014d57806386a29ee81461017d578063c48c4243146101ad578063f6e58a17146101dd57610088565b806307ed143e1461008d5780632be3a124146100bd57806347647696146100ed5780634ad5b5311461011d575b600080fd5b6100a760048036038101906100a291906105f0565b61020d565b6040516100b4919061066e565b60405180910390f35b6100d760048036038101906100d291906105f0565b610223565b6040516100e49190610708565b60405180910390f35b6101076004803603810190610102919061072a565b610264565b604051610114919061066e565b60405180910390f35b6101376004803603810190610132919061072a565b61027c565b604051610144919061066e565b60405180910390f35b610167600480360381019061016291906105f0565b6102b2565b6040516101749190610708565b60405180910390f35b610197600480360381019061019291906105f0565b6102c8565b6040516101a4919061066e565b60405180910390f35b6101c760048036038101906101c2919061072a565b6102ec565b6040516101d4919061066e565b60405180910390f35b6101f760048036038101906101f2919061072a565b610304565b604051610204919061066e565b60405180910390f35b600061021a8484846102c8565b90509392505050565b606060008060008060006020870194508651935060405190508385828a8c2292509250818101604052610256838361033a565b955050505050509392505050565b600061027285858585610304565b9050949350505050565b6000806000806000806020880194508751935060208701925086519150818385878c8e2490508095505050505050949350505050565b60606102bf848484610223565b90509392505050565b60008060008060208501925084519150818387892390508093505050509392505050565b60006102fa8585858561027c565b9050949350505050565b6000806000806000806020880194508751935060208701925086519150818385878c8e2190508095505050505050949350505050565b606060008267ffffffffffffffff811115610358576103576104c5565b5b6040519080825280601f01601f19166020018201604052801561038a5781602001600182028036833780820191505090505b50905060005b838110156103f7576000818601519050808383815181106103b4576103b36107c9565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053505080806103ef90610827565b915050610390565b508091505092915050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61042981610416565b811461043457600080fd5b50565b60008135905061044681610420565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006104778261044c565b9050919050565b6104878161046c565b811461049257600080fd5b50565b6000813590506104a48161047e565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6104fd826104b4565b810181811067ffffffffffffffff8211171561051c5761051b6104c5565b5b80604052505050565b600061052f610402565b905061053b82826104f4565b919050565b600067ffffffffffffffff82111561055b5761055a6104c5565b5b610564826104b4565b9050602081019050919050565b82818337600083830152505050565b600061059361058e84610540565b610525565b9050828152602081018484840111156105af576105ae6104af565b5b6105ba848285610571565b509392505050565b600082601f8301126105d7576105d66104aa565b5b81356105e7848260208601610580565b91505092915050565b6000806000606084860312156106095761060861040c565b5b600061061786828701610437565b935050602061062886828701610495565b925050604084013567ffffffffffffffff81111561064957610648610411565b5b610655868287016105c2565b9150509250925092565b61066881610416565b82525050565b6000602082019050610683600083018461065f565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156106c35780820151818401526020810190506106a8565b60008484015250505050565b60006106da82610689565b6106e48185610694565b93506106f48185602086016106a5565b6106fd816104b4565b840191505092915050565b6000602082019050818103600083015261072281846106cf565b905092915050565b600080600080608085870312156107445761074361040c565b5b600061075287828801610437565b945050602061076387828801610495565b935050604085013567ffffffffffffffff81111561078457610783610411565b5b610790878288016105c2565b925050606085013567ffffffffffffffff8111156107b1576107b0610411565b5b6107bd878288016105c2565b91505092959194509250565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061083282610416565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610864576108636107f8565b5b60018201905091905056fea2646970667358221220c6480f66c281f3a749633bc499114626883fedb484e43735010a9fabca7fcbbe64736f6c63782b302e382e32302d646576656c6f702e323032332e352e342b636f6d6d69742e33386436383235382e6d6f64005c";

contract = new web3.eth.Contract(abiCode);

// let val = new Array(10).fill("a").join("");

let key = "myKey";
let val = "myValue";

web3.eth.getAccounts().then((accounts) => {
    // Display all Ganache Accounts
    console.log("Accounts:", accounts);

    let mainAccount = accounts[0];
    // web3.eth.personal.unlockAccount(mainAccount, "123", 36000).
    //     then(console.log("Account unlocked!"));

    // address that will deploy smart contract
    console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: binCode })
        .send({ from: mainAccount, gas: 500000000 })
        .on("receipt", (receipt) => {

            // Contract Address will be returned here
            console.log("Contract Address:", receipt.contractAddress);
        })
        .then(async (myContract) => {
            let contractAddr = myContract.options.address;
            let chainId = 12345;
            let res = await myContract.methods.test_db_create(
                chainId,
                contractAddr,
                key, val).send({from: mainAccount});
            console.log(res);
            res = await myContract.methods.test_db_query(
                chainId,
                contractAddr,
                key).call();
            console.log("query after create:", res);
            res = await myContract.methods.test_db_update(
                chainId,
                contractAddr,
                key, "newValue").send({from: mainAccount});
            console.log(res);
            res = await myContract.methods.test_db_query(
                chainId,
                contractAddr,
                key).call();
            console.log("query after update:", res);
            res = await myContract.methods.test_db_delete(
                chainId,
                contractAddr,
                key).send({from: mainAccount});
            console.log(res);
        });
});