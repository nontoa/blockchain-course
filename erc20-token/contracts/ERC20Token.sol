// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}


contract ERC20Token is IERC20 {

    mapping(address => uint256) public balances;

    constructor(){

          balances[msg.sender] = 1000 * 10 ** 18;
    }

    function totalSupply() external view override returns (uint256) {

        return 1000 * 10 ** 18;
    }

    function balanceOf(address account) external view override returns (uint256) {

        return balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        
        require(amount <= balances[msg.sender], 'Not enough balance to transfer');
        balances[to] += amount;
        balances[msg.sender] -= amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {revert("Not Implemented");}

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {revert("Not Implemented");}

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {revert("Not Implemented");}
}
