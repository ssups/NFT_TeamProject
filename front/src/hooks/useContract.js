import React, { useEffect, useState } from "react";
import useWeb3 from "./useWeb3";

const useContract = (abi, CA) => {
  // abi CA
  const [web3, ,] = useWeb3();
  const [deployed, setDeployed] = useState();
  useEffect(() => {
    (async () => {
      if (!web3) return;
      const deployed = await new web3.eth.Contract(abi, CA);
      console.log(deployed);
      setDeployed(deployed);
    })();
  }, [web3]);
  return deployed;
  // 사용할때 return값이 없는경우 꼭 고려하기
  // if(!deployed) return
};

export default useContract;
