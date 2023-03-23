//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VaultETH is Ownable {
    struct Token {
        address token;
        uint256 totalDeposit;
    }
    mapping(uint256 => Token) public tokenType; // 0 for USDT, 1 for USDC, 2 for BUSD
    uint256 public totalDeposit;

    event Deposit(address _caller, uint256 _amount, string _tokenType, uint256 _date);

    constructor(address[3] memory _token) {
        for (uint i = 0; i < _token.length; i++) {
            tokenType[i].token = _token[i];
        }
    }

    function deposit(uint256 _amount, uint256 _tokenType) public returns (bool) {
        require(_tokenType <= 2, "Invalid token type");
        string memory token = "";
        _tokenType == 0 || _tokenType == 1 ? totalDeposit += _amount * 10 ** 12 : totalDeposit += _amount;
        tokenType[_tokenType].totalDeposit += _amount;
        if (_tokenType == 0) {
            token = "USDT";
        } else if (_tokenType == 1) {
            token = "USDC";
        } else if (_tokenType == 2) {
            token = "BUSD";
        }
        require(IERC20(tokenType[_tokenType].token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        emit Deposit(msg.sender, _amount, token, block.timestamp);
        return true;
    }

    function withdraw() public onlyOwner returns (bool) {
        require(totalDeposit >= 1000 * 10 ** 18, "Total deposit less than 1K");

        for (uint256 i = 0; i < 3; i++) {
            uint256 balance = IERC20(tokenType[i].token).balanceOf(address(this));
            if (balance > 0) {
                tokenType[i].totalDeposit -= balance;
                i == 0 || i == 1 ? totalDeposit -= balance * 1000000000000 : totalDeposit -= balance;
                require(IERC20(tokenType[i].token).transfer(owner(), balance), "Transfer failed!");
            }
        }

        return true;
    }

    function rescue() public onlyOwner {
        for (uint256 i = 0; i < 3; i++) {
            uint256 balance = IERC20(tokenType[i].token).balanceOf(address(this));
            if (balance > 0) {
                totalDeposit = 0;
                require(IERC20(tokenType[i].token).transfer(owner(), balance), "Transfer failed!");
            }
        }
    }
}
