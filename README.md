# POC User Guide

## 1. Compile op-geth

```bash
git clone git@github.com:TopiaNetwork/op-geth.git
cd op-geth
go build -o geth cmd/geth/*.go
```
## 2. Compile Solidity Compiler
### use pre-compiled

You can use the pre-compiled compiler version provided by Topia，GitHub：

https://github.com/TopiaNetwork/topia-bin

In Remix, you can specify a custom compiler，URL is `https://binaries.topia.network/poc/soljson-latest.js` .

### custom compile (optional)
If you want to compile it yourself, you can execute the following command：
```bash
git clone git@github.com:TopiaNetwork/solidity.git
cd solidity
./scripts/build_emscripten.sh
```
It will generate `soljson.js` in the Solidity directory.

To use this `soljson.js` in Remix, you need to start an HTTP server locally. Here is the code:
```python
from flask import Flask, send_file

app = Flask(__name__)

@app.route('/soljson.js')
def get_file():
    return send_file('soljson.js', mimetype='application/javascript')


if __name__ == '__main__':
    app.run()
```
To use the HTTP server, you need to install the Flask framework: 

```bash
pip install flask
```
Then start the server (for example, if the filename is sol_server.py):
```bash
python sol_server.py
```
To configure a custom compiler URL in Remix, use `http://127.0.0.1:5000/soljson.js` .

## 3. use POC in remix

### create new workspace and add contracts

1. open Remix in the Chrome browser using the following URL：https://remix.ethereum.org/ .

2. Create a new workspace named `POC`.

3. Delete the existing contracts.

4. create three new contracts with the following file names:
[`Topia.sol`](https://github.com/TopiaNetwork/poc/blob/main/contracts/Topia.sol)、
[`TopiaDB_Layer2_A.sol`](https://github.com/TopiaNetwork/poc/blob/main/contracts/TopiaDB_Layer2_A.sol) and 
[`TopiaDB_Layer2_B.sol`](https://github.com/TopiaNetwork/poc/blob/main/contracts/TopiaDB_Layer2_B.sol) .

5. Open two Remix pages and switch both of them to the `POC` workspace.

### compile contracts

1. Switch to the compilation page in Remix, 
2. referring to step 2 to configure the custom compiler URL. 
3. click the compile button to compile the contracts. Both Remix pages need to compile, with one Remix compiling 
`TopiaDB_Layer2_A.sol` and the other Remix compiling `TopiaDB_Layer2_B.sol` .

### deploy contracts

In this step, you will use the geth compiled in step 1, and you need to start two local geth instances, with one having 
a chain ID of 123 and the other with a chain ID of 456.

For the upcoming steps, it is recommended to have one Remix page deploying contracts on Chain 123 and another Remix page 
deploying contracts on Chain 456.

You can refer to the following commands for the operation:

```bash
mkdir -p op-geth/chain1 op-geth/chain2
cp geth op-geth/chain1
cp geth op-geth/chain2
```

To create the genesis block configuration chain1.json in the `op-geth/chain1` directory, please use the following 
template (remember to replace the `<>` placeholders with the appropriate values):
```json
{
     "config": {
         "chainId": 123,
         "homesteadBlock": 0,
         "eip150Block": 0,
         "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
         "eip155Block": 0,
         "eip158Block": 0,
         "byzantiumBlock": 0,
         "constantinopleBlock": 0,
         "petersburgBlock": 0,
         "istanbulBlock": 0,
         "muirGlacierBlock": 0
     },
     "difficulty": "2",
     "gasLimit": "80000000000000",
     "alloc": {
        "<your_metamask_wallet_address>": {"balance": "1000000000000000000000000"}
     }
}
```

execute the following command in the `op-geth/chain1` directory:
```bash
./geth --datadir node init chain1.json

./geth --datadir node \
        --networkid 123 \
        --port 30303 \
        --http \
        --http.corsdomain="https://remix.ethereum.org" \
        --vmdebug \
        --http.addr 127.0.0.1 \
        --http.port 8545 \
        --http.api personal,eth,web3,net \
        --ipcpath geth.ipc \
        --allow-insecure-unlock \
        --miner.etherbase <your_metamask_wallet_address> \
        --mine console
```

now you have started the chain with a chain ID of 123, then you can start mining by executing the command `miner.start(2)`.

Similarly, create the genesis block configuration chain2.json in the `op-geth/chain2` directory, please use the following 
template (remember to replace the `<>` placeholders with the appropriate values):

```json
{
     "config": {
         "chainId": 456,
         "homesteadBlock": 0,
         "eip150Block": 0,
         "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
         "eip155Block": 0,
         "eip158Block": 0,
         "byzantiumBlock": 0,
         "constantinopleBlock": 0,
         "petersburgBlock": 0,
         "istanbulBlock": 0,
         "muirGlacierBlock": 0
     },
     "difficulty": "2",
     "gasLimit": "80000000000000",
     "alloc": {
        "<your_metamask_wallet_address>": {"balance": "1000000000000000000000000"}
     }
}
```

execute the following command in the `op-geth/chain2` directory:

```bash
./geth --datadir node init chain2.json

./geth --datadir node \
        --networkid 456 \
        --port 30304 \
        --http \
        --http.corsdomain="https://remix.ethereum.org" \
        --vmdebug \
        --http.addr 127.0.0.1 \
        --http.port 8546 \
        --authrpc.port 18551 \
        --http.api personal,eth,web3,net \
        --ipcpath geth.ipc \
        --allow-insecure-unlock \
        --miner.etherbase <your_metamask_wallet_address> \
        --mine console
```

now you have started the chain with a chain ID of 456, then you can start mining by executing the command `miner.start(2)`.

you need to configure the MetaMask wallet by adding two network configurations using the "Add Network" button.

The configuration for Chain 123 is as follows:

```
Network name： Topia_L2_A
RPC URL: http://localhost:8545
Chain ID: 123
Currency symbol: ETH
```

The configuration for Chain 456 is as follows:

```
Network name： Topia_L2_B
RPC URL: http://localhost:8546
Chain ID: 456
Currency symbol: ETH
```

Once MetaMask is configured, select "Injected Provider - MetaMask" as the deployment environment on the Remix Deploy page. 
This will establish a connection between Remix and the locally configured geth instance.

With these steps completed, your POC environment is now set up and ready to use.

### test contracts

To test the deployed contracts, you need to start a local LevelDB service. Use the following command:

```bash
git clone git@github.com:TopiaNetwork/poc.git
cd poc/leveldb_server
go run server.go
```

Once the LevelDB service is started, you can proceed to test the contracts on Remix. It is recommended to follow the following testing steps:

1. execute the `topia_create` function on the contract deployed on Chain 123, and then execute the `topia_query` function on the contract deployed on Chain 456.
2. execute the `topia_create` function on the contract deployed on Chain 456, and then execute the `topia_query` function on the contract deployed on Chain 123.
3. execute the `topia_update` function on the contract deployed on Chain 123, and then execute the `topia_query` function on the contract deployed on Chain 456.