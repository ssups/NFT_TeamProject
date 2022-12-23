import React, { useEffect, useState } from "react";
import useWeb3 from "./useWeb3_unused";

const useContract = (contractJson) => {
  //
  const [web3, ,] = useWeb3();
  const [deployed, setDeployed] = useState();

  useEffect(() => {
    //
    (async () => {
      //
      if (!web3) return;

      const { abi } = contractJson;

      const networkId = await web3.eth.net.getId();
      const ca = contractJson.networks[networkId].address;

      const deployed = await new web3.eth.Contract(abi, ca);

      console.log("컨트랙트 인스턴스 반환");
      setDeployed(deployed);
    })();
    //
  }, [web3]);

  return deployed;

  // 이 훅을 사용할 때 사용하는 컴포넌트에서 반환 값으로 인스턴스가 담겼는지 확인 후 사용 (ps 친절한 민섭님)
  // if (!instance) return;
};

export default useContract;
