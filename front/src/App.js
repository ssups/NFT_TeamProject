import React, { useEffect, useState, createContext } from 'react';
import './App.css';
import './styles/auction.css';

import useWeb3 from './hooks/useWeb3';
import Layout from './Layout/Layout';
import useSsandeContracts from './hooks/useSsandeContracts';

const App = () => {
  //
  // hooks
  const [web3] = useWeb3();
  const [tokenContract, tradeContract] = useSsandeContracts();

  // states
  const netWorkId = 5; // 컨트렉트 배포할 네트워크에 따라 다르게 설정 나중에 goerli에 배포하고나면 5로 바꾸면됨
  const [isNetWorkCorrect, setIsNetWorkCorrect] = useState();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();

  // useEffect
  useEffect(() => {
    if (!window.ethereum) return;

    (async () => {
      // 블록체인 네트워크 우리가 컨트렉트 배포한 네트워크인지 확인
      const chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
      setIsNetWorkCorrect(netWorkId === chainId);

      // 이미 지갑이 연결되어있는경우
      const [account] = await window.ethereum.request({ method: 'eth_accounts' });
      if (account) {
        setAccount(account);
        localStorage.setItem('userAccout', JSON.stringify({ account }));
      }
    })();

    // 메타마스크 지갑바꿨을때 이벤트
    if (!window.ethereum._events['accountsChanged'])
      // 이벤트쌓이는거 방지
      window.ethereum.on('accountsChanged', async switchedAddress => {
        setAccount(switchedAddress[0]);
        localStorage.setItem('userAccout', JSON.stringify({ account }));

        if (switchedAddress.length === 0) {
          // 지갑연결 해제됐을때
          setAccount(null);
          setBalance(null);
          localStorage.clear();
        }
      });

    // 네트워크 바꼈을때 이벤트
    if (!window.ethereum._events['chainChanged'])
      window.ethereum.on('chainChanged', async switchedChain => {
        switchedChain = parseInt(switchedChain, 16);
        setIsNetWorkCorrect(netWorkId === switchedChain);
        // console.log(switchedChain);
      });

    return () => {
      delete window.ethereum._events['chainChanged'];
      // delete window.ethereum._events["accountsChanged"];
    };
  }, []);

  // 네트워크 다른게 설정되어있으면 우리네트워크 쓰도록 메타마스크 팝업창 띄우기
  useEffect(() => {
    if (!window.ethereum) return;
    if (isNetWorkCorrect) return;
    if (isNetWorkCorrect === undefined) return;
    (async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + netWorkId.toString(16) }],
        });
        console.log('성공');
      } catch (err) {
        console.log(err);
      }
    })();
  }, [isNetWorkCorrect]);

  // account바뀌면 잔액 다시 업데이트
  useEffect(() => {
    (async () => {
      if (!web3 || !account) return;
      const balance = await web3.eth.getBalance(account);
      setBalance(balance);
      localStorage.setItem('userAccout', JSON.stringify({ account }));
    })();
  }, [web3, account]);

  // if (!window.ethereum) return <h1>메타마스크를 설치해 주세요</h1>;
  // if (!isNetWorkCorrect) return <h1>네트워크를 맞게 설정하세요</h1>;

  return (
    <Context.Provider value={{ web3, account, balance, tokenContract, tradeContract }}>
      <Layout />
    </Context.Provider>
  );
};
export const Context = createContext();
export default App;
