module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "7722",
    },
  },
  compilers: {
    solc: {
      version: "0.8.17",
    },
  },
  contracts_build_directory: "../front/src/contracts", // 메인버전
};
