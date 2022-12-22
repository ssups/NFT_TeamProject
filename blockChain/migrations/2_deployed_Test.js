const TestToken = artifacts.require("TestToken");

// 컨스트럭터 인수 순서  한번에민팅가능한수량, 총발행량
module.exports = deployer => deployer.deploy(TestToken, 3, 14);
