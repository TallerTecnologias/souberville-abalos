// SPDX-License-Identifier: UNLICENCED
pragma solidity 0.8.4;
import "./BetCoin.sol";

contract Exchanger {
    string public name = "BetCoin Exchanger";
    BetCoin public betCoin;
    uint256 public rate = 100;

    event BetCoinPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event BetCoinSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(BetCoin _betCoin) {
        betCoin = _betCoin;
    }

    function buyBetCoin() public payable {
        // Calcula la cantidad de BetCoin que se va a comprar
        uint256 betCoinAmount = msg.value * rate;
        // Precisa que Exchanger tenga saldo suficiente
        require(betCoin.balanceOf(address(this)) >= betCoinAmount);
        // Transfiere los BetCoins al usuario
        betCoin.transfer(msg.sender, betCoinAmount);
        // Emite el evento BetCoinPurchased
        emit BetCoinPurchased(
            msg.sender,
            address(betCoin),
            betCoinAmount,
            rate
        );
    }

    function sellBetCoin(uint256 _amount) public {
        // El vendedor no puede vender mas del saldo que posee
        require(betCoin.balanceOf(msg.sender) >= _amount);
        // Calcula la cantidad de Ether que será canjeada
        uint256 etherAmount = _amount / rate;
        // Requiere que Exchanger tenga suficiente Ether
        require(address(this).balance >= etherAmount);
        // Realiza la venta
        betCoin.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);
        // Emite el evento que betCoin fue vendido
        emit BetCoinSold(msg.sender, address(betCoin), _amount, rate);
    }
}
