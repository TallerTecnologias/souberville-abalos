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

    //Se define la struct para el apostante
    struct Bettor {
        uint amountBet;
        uint16 teamSelected;
    }

    mapping(address => Bettor) public bettorInfo;
    // Cantidad total apostada a la opcion 1
    uint totalBetsOption1;
    // Cantidad total apostada a la opcion 2
    uint totalBetsOption2;
    // Valor de apuesta minima posible
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
        // Para verificar que el que interactua sea el oráculo
        return msg.sender == _oracle;
    }

    function endBet(uint16 winnerOption) public onlyOracle {
        // Distribuye los premios
        distributePrizes(winnerOption);
        //Elimina el contrato y le devuelve lo que sobra al organizador
        selfdestruct(payable (owner()));
    }

    function checkBettorExists(address bettor) view public returns(bool){
        for(uint256 i = 0; i < bettors.length; i++){
            if(bettors[i] == bettor) return true;
        }
        return false;
    }

    // Accion de apostar
    function bet(uint8 _optionSelected) public payable {
        //Esto es para que no puedan apostar mas de una vez
        require(!checkBettorExists(msg.sender));
        //Ver que el monto enviado sea mayor al minimo
        require(msg.value >= minimumBet);

        // Se guarda la información del apostante, la cantidad apostada y el equipo al que apostó
        bettorInfo[msg.sender].amountBet = msg.value;
        bettorInfo[msg.sender].teamSelected = _optionSelected;

        // Se agrega la address del apostante al array
        bettors.push(payable(msg.sender));

        // Se agrega el monto apostado a la suma del equipo que corresponde
        if ( _optionSelected == 1){
            totalBetsOption1 += msg.value;
        }
        else{
            totalBetsOption2 += msg.value;
        }
        // Emite el evento
        emit BetGenerated(msg.value, address(this), msg.sender, _optionSelected);
    }


    function distributePrizes(uint16 optionWinner) public {
        // Se crea un array de tamaño fijo para guardar a los ganadores
        address payable[1000] memory winners;

        // Contador de ganadores
        uint256 count = 0; 
        // Contador de la suma de todas las apuestas al perdedor
        uint256 LoserBet = 0; 
        // Contador de la suma de todas las apuestas al ganador
        uint256 WinnerBet = 0; 

        // Se busca a todos los ganadores y se los guarda en el array de ganadores
        for(uint256 i = 0; i < bettors.length; i++){
            address payable bettorAddress = bettors[i];

            if(bettorInfo[bettorAddress].teamSelected == optionWinner){
                winners[count] = bettorAddress;
                count++;
            }
        }

        // Se definen los valores apostados respectivos de cada opcion 
        if ( optionWinner == 1){
            LoserBet = totalBetsOption2;
            WinnerBet = totalBetsOption1;
        }
        else{
            LoserBet = totalBetsOption1;
            WinnerBet = totalBetsOption2;
        }

        // Se recorre todo el el array de ganadores y se les distribuye el premio
        for(uint j = 0; j < count; j++){
            if(winners[j] != address(0)) {
                address winnerAddress = winners[j];
                uint256 winnerAmountBet = bettorInfo[winnerAddress].amountBet;
                //Se hace el *(9/10) para descontar el porcentaje de 10%
                winners[j].transfer(    (winnerAmountBet*((WinnerBet+LoserBet)*9))/(WinnerBet*10) );
            }
        }
    }

    function GetName() public view returns(string memory){
       return _name;
    } 
    
    function GetOptionA() public view returns(string memory){
       return _optionA;
    } 
    
    function GetOptionB() public view returns(string memory){
       return _optionB;
    } 

    function AmountOne() public view returns(uint256){
       return totalBetsOption1;
    }

    function AmountTwo() public view returns(uint256){
       return totalBetsOption2;
    }

}