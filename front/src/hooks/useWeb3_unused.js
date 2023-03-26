import React, { useEffect, useState } from 'react';

// 밑줄..
import Web3 from 'web3/dist/web3.min';

const useWeb3 = () => {
  //
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    //
    (async () => {
      //
      // 메타마스크 연결 확인
      if (!window.ethereum) {
        //
        alert('메타마스크를 연결하세요.');
        return;
      }

      const web3 = new Web3(window.ethereum);
      const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const balance = await web3.eth.getBalance(address);

      setWeb3(web3);
      setAccount(address);
      setBalance(balance);

      // 메타마스크 계정 변경 이벤트
      window.ethereum.on('accountsChanged', async () => {
        //
        const [switchedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const balance = await web3.eth.getBalance(address);
        // console.log("메타마스크 계정 변경");

        setAccount(switchedAddress);
        setBalance(balance);
      });
    })();

    return () => {
      //
      // 페이지 새로고침 시에는 이벤트가 쌓이지 않을 것으로 예상되나
      // 이 훅을 사용하는 다른 컴포넌트로 이동 시에 window 객체에 이벤트가 쌓이는 것을 고려하여 컴포넌트 언마운트 시점에 이벤트 삭제
      delete window.ethereum._events['accountsChanged'];
      // window.ethereum.removeListener("accountsChanged", function());
    };
  }, []);
  return [web3, account, balance];
};

export default useWeb3;
