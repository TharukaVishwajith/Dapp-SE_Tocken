var SETocken = artifacts.require("./SETocken.sol");

contract('SETocken', (accounts) => {
var tockenInstance;
	
	it('initializes the contract with the correct value',() => {
		return SETocken.deployed().then((instance) => {
			tockenInstance = instance;
			return tockenInstance.name();
		}).then((name) => {
			assert.equal(name, 'SE Tocken', 'has the correct name');
			return tockenInstance.symbol();
		}).then((symbol) => {
			assert.equal(symbol, 'SE', 'has the correct symbol');
			return tockenInstance.standard();
		}).then((standard) => {
			assert.equal(standard, 'SE Tocken v1.0', 'has the correct standard');
			return tockenInstance.standard();
		});
	});

	it('allocates the initial supply upon deployment', () => {
		return SETocken.deployed().then((instance) => {
			tockenInstance = instance;
			return tockenInstance.totalSupply();
		}).then((totalSupply) => {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
			return tockenInstance.balanceOf(accounts[0]);
		}).then((adminBalance) => {
			assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin')
		});
	});
});
