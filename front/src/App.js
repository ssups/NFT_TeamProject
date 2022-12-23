import React, { useEffect, useState } from "react";
import Layout from "./components/Layout/Layout";
import "./App.css";

const App = () => {
  // const netWorkId = 7722; // 컨트렉트 배포할 네트워크에 따라 다르게 설정 나중에 goerli에 배포하고나면 5로 바꾸면됨
  // const [isNetWorkCorrect, setIsNetWorkCorrect] = useState();

  // useEffect(() => {
  //   (async () => {
  //     // 블록체인 네트워크 우리가 컨트렉트 배포한 네트워크인지 확인
  //     const chainId = parseInt(await window.ethereum.request({ method: "eth_chainId" }), 16);
  //     setIsNetWorkCorrect(netWorkId === chainId || 1337 === chainId);
  //   })();

  //   if (!window.ethereum._events["chainChanged"])
  //     window.ethereum.on("chainChanged", async switchedChain => {
  //       switchedChain = parseInt(switchedChain, 16);
  //       setIsNetWorkCorrect(netWorkId === switchedChain || 1337 === switchedChain);
  //       console.log(switchedChain);
  //     });

  //   return () => {
  //     delete window.ethereum._events["chainChanged"];
  //   };
  // }, []);

  // if (!isNetWorkCorrect) return <h1>네트워크를 맞게 설정하세요</h1>;
  return <Layout />;
};

export default App;
