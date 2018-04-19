pragma solidity ^0.4.2;

contract SETocken {

  string public name = 'SE Tocken';
  string public symbol = 'SE';
  string public standard = 'SE Tocken v1.0';
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;

  function SETocken(uint256 _initialSupply) public{
	balanceOf[msg.sender] = _initialSupply;
  	totalSupply = _initialSupply;
  }
}
