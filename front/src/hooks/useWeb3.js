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

      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      // 이미 지갑이 연결되어있는경우
      const [account] = await window.ethereum.request({ method: "eth_accounts" });
      setAccount(account);
      const balance = await web3.eth.getBalance(account);
      setBalance(balance);

      // 메타마스크 지갑바꿨을때 이벤트
      if (!window.ethereum._events["accountsChanged"])
        // 이벤트쌓이는거 방지
        window.ethereum.on("accountsChanged", async switchedAddress => {
          console.log(switchedAddress[0]);
          setAccount(switchedAddress[0]);
          const balance = await web3.eth.getBalance(switchedAddress[0]);
          setBalance(balance);
        });
    })();
    return () => {
      // 컴포넌트 언마운트때 이벤트 날리기
      delete window.ethereum._events["accountsChanged"];
    };
  }, []);
  return [web3, account, balance];
};

export default useWeb3;
