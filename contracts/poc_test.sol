// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    function db_create(string memory key, string memory value) public returns (uint256) {
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

    function db_query(string memory key) public returns (string memory) {
        uint256 keyOffset;
        uint256 keyLen;
        uint256 resOffset;
        uint256 resLength;
        uint256 memOffset;

        assembly {
            keyOffset := add(key, 0x20)
            keyLen := mload(key)
            memOffset := mload(0x40)
            resOffset, resLength := dbquery(memOffset, keyOffset, keyLen)
            mstore(0x40, add(memOffset, resLength))
        }

        return getStringFromMemory(resOffset, resLength);
    }

    function db_delete(string memory key) public returns (uint256) {
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

    function db_update(string memory key, string memory value) public returns (uint256) {
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


    function test_db_create(string memory key, string memory value) public returns (uint256) {
        return db_create(key, value);
    }
    function test_db_query(string memory key) public returns (string memory) {
        return db_query(key);
    }
    function test_db_delete(string memory key) public returns (uint256) {
        return db_delete(key);
    }
    function test_db_update(string memory key, string memory value) public returns (uint256) {
        return db_update(key, value);
    }
}