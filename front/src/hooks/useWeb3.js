import React, { useEffect, useState } from "react";
import Web3 from "web3";
const useWeb3 = () => {
  const [account, setAccount] = useState();
  const [web3, setWeb3] = useState();
  useEffect(() => {
    (async () => {
      if (!window.ethereum) {
        // 메타마스크 설치여부 확인
        alert("메타마스크를 설치하세요");
        return;
      }
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(address);

      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
    })();

    // 메타마스크 지갑바꿨을때 이벤트
    window.ethereum.on("accountsChanged", async () => {
      const [switchedAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(switchedAddress);
    });
  }, []);
  return [account, web3];
};

export default useWeb3;
