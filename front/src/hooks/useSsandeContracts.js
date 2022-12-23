import useContract from "./useContract";
import React, { useEffect } from "react";
import testTokenJson from "../contracts/TestToken.json";
import testTradeJson from "../contracts/TestTrade.json";

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
