const MintingNft = artifacts.require("MintingNft");

module.exports = function (deployer) {
  //
  deployer.deploy(MintingNft, "test", "TST", 1);
};
