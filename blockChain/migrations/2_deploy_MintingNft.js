const MintingNft = artifacts.require("MintingNft");

module.exports = function (deployer) {
  //
  deployer.deploy(MintingNft, "test", "TST", 30, 1, "http://localhost:4000");
};
