import React, { useEffect, useState } from "react";
import Web3 from "web3";
const useWeb3 = () => {
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
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
      const balance = await web3.eth.getBalance(address);
      setWeb3(web3);
      setBalance(balance);

      // 메타마스크 지갑바꿨을때 이벤트
      window.ethereum.on("accountsChanged", async () => {
        const [switchedAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(switchedAddress);

        const balance = await web3?.utils.getBalance(account);
        setBalance(balance);
      });
    })();
    return () => {
      // 컴포넌트 언마운트때 이벤트 날리기
      delete window.ethereum._events["accountsChanged"];
      // window.ethereum.removeListener("accountsChanged");
    };
  }, []);
  return [account, web3, balance];
};

export default useWeb3;
