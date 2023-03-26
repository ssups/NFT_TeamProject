import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
const useWeb3 = () => {
  const [web3, setWeb3] = useState();
  useEffect(() => {
    (async () => {
      if (!window.ethereum) {
        // 메타마스크 설치여부 확인
        return;
      }

      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
    })();
  }, []);

  return [web3];
};

export default useWeb3;
