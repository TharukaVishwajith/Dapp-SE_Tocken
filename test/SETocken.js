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

	it('transfer Tocken ownership', ()=> {
		return SETocken.deployed().then((instance) => {
			tockenInstance = instance;
			return tockenInstance.trasfer.call(accounts[1],9999999999999999999);
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tockenInstance.trasfer.call(accounts[1],250000, {from: accounts[0]});
		}).then((success) => {
			assert.equal(success, true, 'it returns true');
			return tockenInstance.trasfer(accounts[1],250000, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tocken are trasfered from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tocken are trasfered to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the trasfer amount');
			return tockenInstance.balanceOf(accounts[1]);
		}).then((balance) =>{
			assert.equal(balance.toNumber(), 250000, 'adds the amount of the receiving account');
			return tockenInstance.balanceOf(accounts[0]);
		}).then((balance) =>{
			assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
		})
	});
});
