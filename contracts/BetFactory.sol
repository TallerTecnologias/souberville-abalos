// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;
import "./ownable.sol";
import "./safemath.sol";
import "./Bet.sol";

contract BetFactory is Ownable {
  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewBet(address oracleAddress, string name, string optionA, string optionB);

  Bet[] public bets;
  mapping (uint => address) public betToOwner;

  function _createBet(address oracleAddress, string memory name, string memory optionA, string memory optionB) internal {
    Bet newBet = new Bet(oracleAddress, name, optionA, optionB);
    bets.push(newBet);
    //Ver si tenemos que usar el address de la apuesta como id
    uint id = bets.length - 1;
    betToOwner[id] = msg.sender;
    emit NewBet(oracleAddress, name, optionA, optionB);
  }

  function _getBets() view public returns(Bet[] memory) {
    Bet[] memory result;
    uint position = 0;
    for (uint index = 0; index < bets.length; index++) {
      Bet aux = bets[index];
      if (aux.isActive()) {
        result[position] = bets[index];
        position++;
      }
    }
    return result;
  }
}