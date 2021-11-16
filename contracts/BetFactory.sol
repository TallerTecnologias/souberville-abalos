// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;
import "./Ownable.sol";
// import "./safemath.sol";
import "./Bet.sol";

contract BetFactory is Ownable{
  // using SafeMath for uint256;
  // using SafeMath32 for uint32;
  // using SafeMath16 for uint16;

  event NewBet(address oracleAddress, string name, string optionA, string optionB, address indexed addressContract);

  Bet[] public bets;
  mapping (uint => address) public betToOwner;
  mapping(address => Bet) betAddresses;
  uint public version = 1;

  function createBet(address oracleAddress, string memory name, string memory optionA, string memory optionB) public payable{
    Bet myBet = new Bet(oracleAddress, name, optionA, optionB);
    bets.push(myBet);
    betAddresses[address(myBet)] = myBet;

    //Ver si tenemos que usar el address de la apuesta como id
    uint id = bets.length - 1;
    betToOwner[id] = msg.sender;
    emit NewBet(oracleAddress, name, optionA, optionB, address(myBet));
  }
/*
  function getBets() view public returns(Bet) {
    
    return bets[0];
  }*/

  function getBets() view public returns(Bet[] memory) {

    return bets;
  }

  function endBet (address betAddress, uint16 winnerOption) public {
    betAddresses[betAddress].endBet(winnerOption);
  }
}