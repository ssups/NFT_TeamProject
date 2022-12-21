import React, { useEffect, useState } from "react";
import useWeb3 from "./useWeb3";
import TestTokenContract from "../contracts_seop/TestToken.json";

const useTestTokenContract = () => {
  const [account, web3, balance] = useWeb3();
  const [deployed, setDeployed] = useState();
  useEffect(() => {
    (async () => {
      if (!web3) return;
      // 배포된 컨트렉트 가져오기
      const networkId = await web3.eth.net.getId();
      const TestTokenInstance = await new web3.eth.Contract(
        TestTokenContract.abi,
        TestTokenContract.networks[networkId].address
      );
      console.log(TestTokenInstance);
      setDeployed(TestTokenInstance);
    })();
  }, [web3]);
  return [deployed];
  // 사용할때 return값이 없는경우 꼭 고려하기
  // if(!deployed) return
};

export default useTestTokenContract;
