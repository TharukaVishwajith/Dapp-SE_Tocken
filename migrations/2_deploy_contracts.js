var SETocken = artifacts.require("./SETocken.sol");

module.exports = function(deployer) {
  deployer.deploy(SETocken, 1000000);
};
