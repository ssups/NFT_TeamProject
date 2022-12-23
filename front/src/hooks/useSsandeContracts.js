import useContract from "./useContract_j";
import React from "react";
import testTokenJson from "../contracts_seop/TestToken.json";
import testTradeJson from "../contracts_seop/TestTrade.json";

const useSsandeContracts = () => {
  const netWorkId = 7722;
  const tokenContractAbi = testTokenJson.abi;
  const tokenContractCa = testTokenJson.networks[netWorkId].address;
  const tradeContractAbi = testTradeJson.abi;
  const tradeContractCa = testTradeJson.networks[netWorkId].address;

  const tokenContract = useContract(tokenContractAbi, tokenContractCa);
  const tradeContract = useContract(tradeContractAbi, tradeContractCa);

  return [tokenContract, tradeContract];
};

export default useSsandeContracts;
