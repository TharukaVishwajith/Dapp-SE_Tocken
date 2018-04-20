pragma solidity ^0.4.2;

contract SETocken {

  string public name = 'SE Tocken';
  string public symbol = 'SE';
  string public standard = 'SE Tocken v1.0';
  uint256 public totalSupply;

  event Transfer(
  	address indexed _from,
  	address indexed _to,
  	uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  function SETocken(uint256 _initialSupply) public{
	balanceOf[msg.sender] = _initialSupply;
  	totalSupply = _initialSupply;
  }

  function trasfer(address _to, uint256 _value) public returns(bool success){

  	require(balanceOf[msg.sender] >= _value);

  	balanceOf[msg.sender] -= _value;
  	balanceOf[_to] += _value;

  	emit Transfer(msg.sender, _to, _value);

  	return true;
  }
}
