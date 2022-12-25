import useContract from "./useContract";
import testTokenJson from "../contracts/TestToken.json";
import testTradeJson from "../contracts/TestTrade.json";
import tokenAbi from "../contracts/goerli/token.json";
import tradeAbi from "../contracts/goerli/trade.json";

const useSsandeContracts = () => {
  //
  // const networkId = 7722;

  // const tokenContractAbi = testTokenJson.abi;
  // const tokenContractCa = testTokenJson.networks[networkId].address;

  // const tradeContractAbi = testTradeJson.abi;
  // const tradeContractCa = testTradeJson.networks[networkId].address;

  const tokenContract = useContract(tokenAbi, "0xa8be286ec172021BcEE0F11aDFE91B0FFdcf6662");
  const tradeContract = useContract(tradeAbi, "0xa8be286ec172021BcEE0F11aDFE91B0FFdcf6662");

  return [tokenContract, tradeContract];
};

export default useSsandeContracts;
