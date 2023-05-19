# POC User Guide

## 1. Compile op-geth

execute the following commands in sequence will generate geth in the op-geth directory:

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

### custom compile
If you want to compile it yourself, you can execute the following command：
```bash
git clone git@github.com:TopiaNetwork/solidity.git
cd solidity
./scripts/build_emscripten.sh
```
It will generate `soljson.js` in the Solidity directory.

To use soljson.js in Remix, you need to start an HTTP server locally. Here is the code:
```python
from flask import Flask, send_file

app = Flask(__name__)


@app.route('/soljson.js')
def get_file():
    return send_file('soljson_1.js', mimetype='application/javascript')


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

### new workspace and add contracts

open Remix in the Chrome browser using the following URL：https://remix.ethereum.org/ .

Create a new workspace named `POC`.

Delete the existing contracts and create three new contracts with the following file names:
`Topia.sol`、`TopiaDB_Layer2_A.sol` and `TopiaDB_Layer2_B.sol`。

`Topia.sol`：
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library TopiaDBLib {
    function dbCreate(string memory key, string memory value) internal returns (uint256) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 valOffset;
        uint256 valLen;
        uint256 res;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            valOffset := add(value, 0x20)
            valLen := mload(value)
            res := dbput(keyOffset, keyLen, valOffset, valLen)
        }

        return res;
    }

    function dbQuery(uint256 chainId, address contractAddr,
        string memory key) internal pure returns (string memory) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 resOffset;
        uint256 resLength;
        uint256 memOffset;
        uint256 valLen;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            memOffset := mload(0x40)
            valLen := dbvallen(chainId, contractAddr, keyOffset, keyLen)
            resOffset, resLength := dbquery(chainId, contractAddr, keyOffset, keyLen, memOffset, valLen)
            mstore(0x40, add(memOffset, resLength))
        }

        return getStringFromMemory(resOffset, resLength);
    }

    function dbDelete(string memory key) internal returns (uint256) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 res;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            res := dbdelete(keyOffset, keyLen)
        }

        return res;
    }

    function dbUpdate(string memory key, string memory value) internal returns (uint256) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 valOffset;
        uint256 valLen;
        uint256 res;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            valOffset := add(value, 0x20)
            valLen := mload(value)
            res := dbupdate(keyOffset, keyLen, valOffset, valLen)
        }

        return res;
    }

    function getStringFromMemory(uint256 offset, uint256 length) private pure returns (string memory) {
        bytes memory valueBytes = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            bytes1 b;
            assembly {
                b := mload(add(offset, i))
            }
            valueBytes[i] = b;
        }

        return string(valueBytes);
    }
}
```

`TopiaDB_Layer2_A.sol`：
```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Topia.sol";

contract TopiaDB_Layer2_A {

    function topia_create(string memory key, string memory value) public returns (uint256) {
        return TopiaDBLib.dbCreate(key, value);
    }
    function topia_query(
        uint256 chainId, address contractAddr,
        string memory key) public pure returns (string memory) {
        return TopiaDBLib.dbQuery(chainId, contractAddr, key);
    }
    function topia_delete(string memory key) public returns (uint256) {
        return TopiaDBLib.dbDelete(key);
    }
    function topia_update(string memory key, string memory value) public returns (uint256) {
        return TopiaDBLib.dbUpdate(key, value);
    }
}
```

`TopiaDB_Layer2_B.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Topia.sol";

contract TopiaDB_Layer2_B {

    function topia_create(string memory key, string memory value) public returns (uint256) {
        return TopiaDBLib.dbCreate(key, value);
    }
    function topia_query(
        uint256 chainId, address contractAddr,
        string memory key) public pure returns (string memory) {
        return TopiaDBLib.dbQuery(chainId, contractAddr, key);
    }
    function topia_delete(string memory key) public returns (uint256) {
        return TopiaDBLib.dbDelete(key);
    }
    function topia_update(string memory key, string memory value) public returns (uint256) {
        return TopiaDBLib.dbUpdate(key, value);
    }
}
```

Open two Remix pages and switch both of them to the `POC` workspace.

### compile contracts

Switch to the compilation page in Remix, referring to step 2 to configure the custom compiler URL. Then click the 
compile button to compile the contracts. Both Remix pages need to compile, with one Remix compiling `TopiaDB_Layer2_A.sol` and the other Remix compiling `TopiaDB_Layer2_B.sol` .

### deploy contracts

During the deployment phase, the two Remix pages will differ. In this step, you will use the geth compiled in step 1. At this point, you need to start two local geth instances, with one having a chain ID of 123 and the other with a chain ID of 456.

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

To execute the following command in the `op-geth/chain1` directory:
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

At this point, you have started the chain with a chain ID of 123. You can now start mining by executing the command `miner.start(2)`.

Similarly, to create the initial block configuration chain2.json in the `op-geth/chain2` directory, please use the following 
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

To execute the following command in the `op-geth/chain2` directory:

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

At this point, you have started the chain with a chain ID of 456. You can now start mining by executing the command `miner.start(2)`.

To enable Remix to connect to these two chains, you need to configure the MetaMask wallet by adding two network configurations 
using the "Add Network" button.

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

For the upcoming steps, it is recommended to have one Remix page deploying contracts on Chain 123 and another Remix page deploying contracts on Chain 456.

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