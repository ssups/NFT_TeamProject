const TestToken = artifacts.require("TestToken");
const TestTrade = artifacts.require("TestTrade");

// 컨스트럭터 인수 순서  한번에민팅가능한수량, 총발행량
module.exports = async deployer => {
  await deployer.deploy(TestToken, 3, 14);
  const token = await TestToken.deployed();
  await deployer.deploy(TestTrade, token.address);
};
