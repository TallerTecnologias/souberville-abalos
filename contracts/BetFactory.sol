// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;
import "./Ownable.sol";
import "./Bet.sol";

contract BetFactory is Ownable {
    event NewBet(
        address oracleAddress,
        string name,
        string optionA,
        string optionB,
        address indexed addressContract
    );

    Bet[] public bets;
    mapping(uint256 => address) public betToOwner;
    mapping(address => Bet) betAddresses;
    mapping(Bet => uint256) betToIndex;
    uint256 public version = 1;

    constructor() {
        //Iniciar una BetDefault
        createBet(msg.sender, "Default", "option A", "option B");
    }

    function createBet(
        address oracleAddress,
        string memory name,
        string memory optionA,
        string memory optionB
    ) public payable {
        Bet myBet = new Bet(oracleAddress, name, optionA, optionB);
        bets.push(myBet);
        betAddresses[address(myBet)] = myBet;
        //Ver si tenemos que usar el address de la apuesta como id
        uint256 id = bets.length - 1;
        betToOwner[id] = msg.sender;
        emit NewBet(oracleAddress, name, optionA, optionB, address(myBet));
    }

    //Devuelve las apuestas creadas
    function getBets() public view returns (Bet[] memory) {
        return bets;
    }

    //Devuelve la cantidad de apuestas creadas
    function getBetsCount() public view returns (uint256) {
        return bets.length;
    }

    //Termina una apuesta, se ingresa el address del contrato de la apuesta y la opcion ganadora
    function endBet(address betAddress, uint16 winnerOption) public {
        betAddresses[betAddress].endBet(winnerOption);
    }

    //Obtiene los datos de las apuestas a cargar en el frontend (Esto es provisorio)
    function getAllBetsDescription() public view returns (string memory) {
        string memory betsNames;
        for (uint256 i = 0; i < bets.length; i++) {
            betsNames = append(betsNames, "<div><ul><li>Indice: ");
            betsNames = append(betsNames, intToString(i));
            betsNames = append(betsNames, "</li><li>Nombre: ");
            betsNames = append(betsNames, bets[i].GetName());
            betsNames = append(betsNames, "</li><li>Opcion A: ");
            betsNames = append(betsNames, bets[i].GetOptionA());
            betsNames = append(betsNames, "</li><li>Opcion B: ");
            betsNames = append(betsNames, bets[i].GetOptionB());
            betsNames = append(betsNames, "</ul></div>");
        }

        return betsNames;
    }

    function getBetName(uint256 i) public view returns (string memory) {
        return bets[i].GetName();
    }

    function getBetOptionA(uint256 i) public view returns (string memory) {
        return bets[i].GetOptionA();
    }

    function getBetOptionB(uint256 i) public view returns (string memory) {
        return bets[i].GetOptionB();
    }

    function betOnBet(
        uint256 index,
        uint8 option,
        uint256 amount
    ) public payable {
        bets[index].bet(option, amount, msg.sender);
    }

    //Obtiene los datos de las apuestas a cargar en el frontend (Esto es provisorio)
    function getAllBetsTiles() public view returns (string memory) {
        string memory betTiles;

        for (uint256 i = 0; i < bets.length; i++) {
            //esto es para agarrar una imagen distinta del 01 al 09
            string memory m = intToString((i % 6) + 1);
            betTiles = append(betTiles, '<article class="style');
            betTiles = append(betTiles, m);
            betTiles = append(betTiles, '" onclick="App.loadBetData(');
            betTiles = append(betTiles, intToString(i));
            betTiles = append(
                betTiles,
                ')" ><span class="image"><img src="images/pic0'
            );
            betTiles = append(betTiles, m);
            betTiles = append(
                betTiles,
                '.jpg"/></span><a href="#bettingSection"><h2>'
            );
            betTiles = append(betTiles, bets[i].GetName());
            betTiles = append(
                betTiles,
                '</h2><div class="content"><p><li>Opcion A: '
            );
            betTiles = append(betTiles, bets[i].GetOptionA());
            betTiles = append(betTiles, "</li><li>Opcion B: ");
            betTiles = append(betTiles, bets[i].GetOptionB());
            betTiles = append(betTiles, "</li></p></div></a></article>");
        }

        return betTiles;
    }

    //Para concatenar strings
    function append(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }

    //Para convertir int en string
    function intToString(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
