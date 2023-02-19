pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    uint8 decimal;

    constructor(uint256 initialSupply, uint8 _decimal) ERC20("USDT", "USDT") {
        _mint(msg.sender, initialSupply*10**_decimal);
        decimal = _decimal;
    }

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }
}
