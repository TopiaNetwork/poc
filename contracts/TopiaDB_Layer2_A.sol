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