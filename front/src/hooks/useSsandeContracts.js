import React from "react";
import useContract from "./useContract";
import testTokenJson from "../contracts/TestToken.json";
import testTradeJson from "../contracts/TestTrade.json";

const useSsandeContracts = () => {
  //
  const networkId = 7722;

  const tokenContractAbi = testTokenJson.abi;
  const tokenContractCa = testTokenJson.networks[networkId].address;

  const tradeContractAbi = testTradeJson.abi;
  const tradeContractCa = testTradeJson.networks[networkId].address;

  const tokenContract = useContract(tokenContractAbi, tokenContractCa);
  const tradeContract = useContract(tradeContractAbi, tradeContractCa);

  return [tokenContract, tradeContract];
};

export default useSsandeContracts;
