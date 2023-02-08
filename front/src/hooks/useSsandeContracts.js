import useContract from "./useContract";
// import testTokenJson from "../contracts/TestToken.json";
// import testTradeJson from "../contracts/TestTrade.json";
import tokenAbi from "../contracts/goerli/token.json";
import tradeAbi from "../contracts/goerli/trade.json";

const useSsandeContracts = () => {
  //
  // const networkId = 7722;

  // const tokenContractAbi = testTokenJson.abi;
  // const tokenContractCa = testTokenJson.networks[networkId].address;

  // const tradeContractAbi = testTradeJson.abi;
  // const tradeContractCa = testTradeJson.networks[networkId].address;

  // 2023 02 08 컨트랙트 배포 및 업데이트
  const tokenContract = useContract(tokenAbi, "0x64883B9b7375e1fA05D8a1661e915aFf0344dF51");
  const tradeContract = useContract(tradeAbi, "0x71C8773B760E6D976743f5710EDC645bABf0c804");

  return [tokenContract, tradeContract];
};

export default useSsandeContracts;
