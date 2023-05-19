# POC用户指南

## 1. 编译op-geth
依次执行如下命令可以在op-geth目录下生成geth：
```bash
git clone git@github.com:TopiaNetwork/op-geth.git
cd op-geth
go build -o geth cmd/geth/*.go
```
## 2. 编译Solidity编译器
### 使用预编译的版本
可以使用Topia预编译好的编译器版本，GitHub仓库地址：

https://github.com/TopiaNetwork/topia-bin

在remix中可以指定自定义编译器，URL为 `https://binaries.topia.network/poc/soljson-latest.js` 。

### 使用自定义版本
如果你想自己编译，可以执行如下命令：
```bash
git clone git@github.com:TopiaNetwork/solidity.git
cd solidity
./scripts/build_emscripten.sh
```
会在solidity目录下生成soljson.js。
为了在remix中使用soljson.js，需要在本地启一个http服务，代码如下：
```python
from flask import Flask, send_file

app = Flask(__name__)


@app.route('/soljson.js')
def get_file():
    return send_file('soljson_1.js', mimetype='application/javascript')


if __name__ == '__main__':
    app.run()
```
为了使用该http服务，需要安装Flask框架：
```bash
pip install flask
```
然后启动该服务(比如文件名是sol_server.py)：
```bash
python sol_server.py
```
在remix配置自定义编译器URL `http://127.0.0.1:5000/soljson.js` 即可。

## 3. 在remix中使用POC

### 新建workspace并添加相关智能合约

在Chrome浏览器打开remix，url为：https://remix.ethereum.org/。

创建一个新的workspace，比如命名为`POC`。

删除原有的合约，新建3个合约，文件名分别是`Topia.sol`、`TopiaDB_Layer2_A.sol`和`TopiaDB_Layer2_B.sol`。

`Topia.sol`代码如下：
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

`TopiaDB_Layer2_A.sol`代码如下：
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

`TopiaDB_Layer2_B.sol`代码如下：

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

这里需要打开2个remix页面，都切换到POC workspace。

### 使用自定义编译器编译合约

在remix中切换到编译页面，参考步骤2配置自定义编译器url。然后点编译按钮编译合约。两个remix页面都需要编译，一个remix编译`TopiaDB_Layer2_A.sol`，
另一个remix编译`TopiaDB_Layer2_B.sol`。

### 部署合约

在部署阶段，2个remix页面会有不同，这一步会使用步骤1编译出来的geth，这时需要在本地启动2个geth，一个链id为123，另一个为456。

可以参考如下命令进行操作：

```bash
mkdir -p op-geth/chain1 op-geth/chain2
cp geth op-geth/chain1
cp geth op-geth/chain2
```

在op-geth/chain1目录下创建初始块配置chain1.json(注意替换`<>`内容)：
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

在op-geth/chain1下执行如下命令：
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
这时便启动了链ID为123这条链。然后通过`miner.start(2)`开启挖矿。

同理在op-geth/chain2目录下创建初始块配置chain2.json(注意替换`<>`内容)：

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

在op-geth/chain2下执行如下命令：
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

这时便启动了链ID为456这条链。然后通过`miner.start(2)`开启挖矿。

为了让remix连接这2条链，接下来需要配置metamask钱包，通过`Add Network`按钮添加2条网络配置。

链123配置如下：
```
Network name： Topia_L2_A
RPC URL: http://localhost:8545
Chain ID: 123
Currency symbol: ETH
```

链456配置如下：
```
Network name： Topia_L2_B
RPC URL: http://localhost:8546
Chain ID: 456
Currency symbol: ETH
```

metamask配置好后，通过在Remix的Deploy页选择部署环境为`Injected Provider - MetaMask`。这时remix便和我们本地配置的geth连接起来了。

为了接下来的步骤，建议一个remix页面在链123部署合约，另一个remix页面在链456上部署合约。

这样POC环境便搭建好了。

### 测试合约

为了测试部署好的合约，需要在本地再起一个leveldb服务，命令如下：

```bash
git clone git@github.com:TopiaNetwork/poc.git
cd poc/leveldb_server
go run server.go
```

启动好后，就可以在remix上测试合约了。这里建议按如下方式测试合约：

1. 在链123部署的合约上执行`topia_create`，然后在链456部署的合约上执行`topia_query`。
2. 在链456部署的合约上执行`topia_create`，然后在链123部署的合约上执行`topia_query`。
3. 在链123部署的合约上执行`topia_update`，然后在链456部署的合约上执行`topia_query`。