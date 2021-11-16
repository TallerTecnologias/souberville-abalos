// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;

import "./Ownable.sol";

contract Bet is Ownable{
    string public _name;
    string public _optionA;
    string public _optionB;
    address public _oracle;
    bool public _isActive;

    address payable[] public bettors;

    struct Bettor {
        uint amountBet;
        uint16 teamSelected;
    }

    mapping(address => Bettor) public bettorInfo;
    uint totalBetsOption1;
    uint totalBetsOption2;
    uint public minimumBet;

    event BetGenerated(
        uint value,
        address indexed betAddress,
        address indexed bettorAddress,
        uint16 optionSelected 
    );


    constructor (address oracleAddress, string memory name, string memory optionA, string memory optionB)
    {
        _name = name;
        _optionA = optionA;
        _optionB = optionB;
        _oracle = oracleAddress;
        _isActive = true;
        minimumBet = 100000000000000;
    }

    modifier onlyOracle() {
        require(isOracle());
        _;
    }

    function isOracle() public view returns(bool) {
        return msg.sender == _oracle;
    }

    function endBet(uint16 winnerOption) public onlyOracle {
        distributePrizes(winnerOption);
        selfdestruct(payable (owner()));
    }

    function checkBettorExists(address bettor) view public returns(bool){
        for(uint256 i = 0; i < bettors.length; i++){
            if(bettors[i] == bettor) return true;
        }
        return false;
    }


    function bet(uint8 _optionSelected) public payable {
        require(!checkBettorExists(msg.sender));
        require(msg.value >= minimumBet);
        bettorInfo[msg.sender].amountBet = msg.value;
        bettorInfo[msg.sender].teamSelected = _optionSelected;

        bettors.push(payable(msg.sender));

        if ( _optionSelected == 1){
            totalBetsOption1 += msg.value;
        }
        else{
            totalBetsOption2 += msg.value;
        }
        emit BetGenerated(msg.value, address(this), msg.sender, _optionSelected);
    }

    function distributePrizes(uint16 optionWinner) public {
        address payable[1000] memory winners;

        uint256 count = 0; 
        uint256 LoserBet = 0; 
        uint256 WinnerBet = 0; 

        for(uint256 i = 0; i < bettors.length; i++){
            address payable bettorAddress = bettors[i];

            if(bettorInfo[bettorAddress].teamSelected == optionWinner){
                winners[count] = bettorAddress;
                count++;
            }
        }

        if ( optionWinner == 1){
            LoserBet = totalBetsOption2;
            WinnerBet = totalBetsOption1;
        }
        else{
            LoserBet = totalBetsOption1;
            WinnerBet = totalBetsOption2;
        }

        for(uint j = 0; j < count; j++){
            if(winners[j] != address(0)) {
                address winnerAddress = winners[j];
                uint256 winnerAmountBet = bettorInfo[winnerAddress].amountBet;
                //TODO Debemos descontar el porcentaje que corresponda
                winners[j].transfer(    (winnerAmountBet*(10000+(LoserBet*10000/WinnerBet)))/10000 );
            }
        }
    }

    function AmountOne() public view returns(uint256){
       return totalBetsOption1;
    }

    function AmountTwo() public view returns(uint256){
       return totalBetsOption2;
    }

}