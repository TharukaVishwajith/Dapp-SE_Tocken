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
			return tockenInstance.transfer.call(accounts[1],9999999999999999999);
		}).then(assert.fail).catch((error) => {
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tockenInstance.transfer.call(accounts[1],250000, {from: accounts[0]});
		}).then((success) => {
			assert.equal(success, true, 'it returns true');
			return tockenInstance.transfer(accounts[1],250000, {from: accounts[0]});
		}).then((receipt) => {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tocken are trasfered from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tocken are trasfered to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tockenInstance.balanceOf(accounts[1]);
		}).then((balance) =>{
			assert.equal(balance.toNumber(), 250000, 'adds the amount of the receiving account');
			return tockenInstance.balanceOf(accounts[0]);
		}).then((balance) =>{
			assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
		})
	});

	it('approves tocken for delegated transfer', ()=> {
		return SETocken.deployed().then((instance) => {
			tockenInstance = instance;
			return tockenInstance.approve.call(accounts[1],100);
		}).then((success)=> {
			assert.equal(success, true, 'it returns true');
			return tockenInstance.approve(accounts[1], 100, { from: accounts[0]});
		}).then((receipt)=> {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tocken are authorozed by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tocken are authorozed to');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
			return tockenInstance.allowance(accounts[0], accounts[1]);
		}).then((allowace)=> {
			assert.equal(allowace.toNumber(), 100, 'store the allowace for delegated transfer');
		})
	});

	it('handles delegated token transfers', function() {
	    return SETocken.deployed().then((instance)=> {
	      tokenInstance = instance;
	      fromAccount = accounts[2];
	      toAccount = accounts[3];
	      spendingAccount = accounts[4];
	      // Transfer some tokens to fromAccount
	      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
	    }).then((receipt)=> {
	      // Approve spendingAccount to spend 10 tokens form fromAccount
	      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
	    }).then((receipt)=> {
	      // Try transferring something larger than the sender's balance
	      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
	    }).then(assert.fail).catch((error)=> {
	      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
	      // Try transferring something larger than the approved amount
	      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
	    }).then(assert.fail).catch((error)=> {
	      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
	      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
	    }).then((success)=> {
	      assert.equal(success, true);
	      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
	    }).then((receipt)=> {
	      assert.equal(receipt.logs.length, 1, 'triggers one event');
	      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
	      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
	      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
	      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
	      return tokenInstance.balanceOf(fromAccount);
	    }).then((balance)=> {
	      assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
	      return tokenInstance.balanceOf(toAccount);
	    }).then((balance)=> {
	      assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
	      return tokenInstance.allowance(fromAccount, spendingAccount);
	    }).then((allowance)=> {
	      assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
	    });
  });

});

