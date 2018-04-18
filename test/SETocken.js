var SETocken = artifacts.require("./SETocken.sol");

contract('SETocken', function(account){

	it('sets the total supply upon deployment', function(){
		return SETocken.deployed().then((instance)=>{
			tockenInstance = instance;
			return tockenInstance.totalSupply();
		}).then((totalSupply)=>{
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
		})
	})
})
