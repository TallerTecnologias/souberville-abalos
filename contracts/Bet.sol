// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;

contract Bet {
    string _name;
    string _optionA;
    string _optionB;
    address _oracleAddress;
    bool public _isActive;

    constructor (address oracleAddress, string memory name, string memory optionA, string memory optionB)
    {
        _name = name;
        _optionA = optionA;
        _optionB = optionB;
        _oracleAddress = oracleAddress;
        _isActive = true;
    }

    function isActive() view public returns (bool){
        return _isActive;
    }

    function getName() view public returns (string memory){
        return _name;
    }

    function getOptionA() view public returns (string memory){
        return _optionA;
    }

    function getOptionB() view public returns (string memory){
        return _optionB;
    }
}