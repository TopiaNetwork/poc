// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PocTest {
    function dbCreate(
        uint256 chainId, address contractAddr,
        string memory key, string memory value) public pure returns (uint256) {

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
            res := dbput(chainId, contractAddr, keyOffset, keyLen, valOffset, valLen)
        }

        return res;
    }

    function dbQuery(uint256 chainId, address contractAddr,
        string memory key) public pure returns (string memory) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 resOffset;
        uint256 resLength;
        uint256 memOffset;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            memOffset := mload(0x40)
            resOffset, resLength := dbquery(chainId, contractAddr, memOffset, keyOffset, keyLen)
            mstore(0x40, add(memOffset, resLength))
        }

        return getStringFromMemory(resOffset, resLength);
    }

    function dbDelete(
        uint256 chainId, address contractAddr,
        string memory key) public pure returns (uint256) {

        uint256 keyOffset;
        uint256 keyLen;
        uint256 res;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            res := dbdelete(chainId, contractAddr, keyOffset, keyLen)
        }

        return res;
    }

    function dbUpdate(
        uint256 chainId, address contractAddr,
        string memory key, string memory value) public pure returns (uint256) {

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
            res := dbupdate(chainId, contractAddr, keyOffset, keyLen, valOffset, valLen)
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


    function test_db_create(
        uint256 chainId, address contractAddr,
        string memory key, string memory value) public pure returns (uint256) {
        return dbCreate(chainId, contractAddr, key, value);
    }
    function test_db_query(uint256 chainId, address contractAddr,
        string memory key) public pure returns (string memory) {
        return dbQuery(chainId, contractAddr, key);
    }
    function test_db_delete(uint256 chainId, address contractAddr,
        string memory key) public pure returns (uint256) {
        return dbDelete(chainId, contractAddr, key);
    }
    function test_db_update(
        uint256 chainId, address contractAddr,
        string memory key, string memory value) public pure returns (uint256) {
        return dbUpdate(chainId, contractAddr, key, value);
    }
}