import React, { useEffect, useState, useContext } from "react";
import Nft from "./nft";
import useWeb3 from "../../hooks/useWeb3";
import useSsandeContracts from "../../hooks/useSsandeContracts";

import { Context } from "../../App";

const SeopMy = () => {
  // hooks
  const { account, web3, balance } = useContext(Context);
  const netWorkId = 7722;
  const [testTokenInstance, testTradeInstance] = useSsandeContracts();
  //  states
  const [myNftsURI, setMyNftsURI] = useState({});

  // ==========================================useEffect==========================================
  // =============================================================================================

  // testToken 컨트렉트 연동됐을때
  useEffect(() => {
    (async () => {
      if (!testTokenInstance || !account) return;
      // 가지고있는토큰 uri 들고오기
      // console.log(testTokenInstance.methods);
      // console.log(account);
      const tokensIdOfOwner = await testTokenInstance.methods.tokensOfOwner(account).call();
      // console.log(tokensIdOfOwner);
      const tokensURI = {};
      for (const tokenId of tokensIdOfOwner) {
        tokensURI[tokenId] = await testTokenInstance.methods.tokenURI(tokenId).call();
      }
      setMyNftsURI(tokensURI);
    })();
  }, [testTokenInstance, account]); // 지갑바꿀떄 자동으로 바뀌게 account도 넣어놈

  useEffect(() => {
    (async () => {
      if (!testTradeInstance) return;
      console.log(testTradeInstance.methods);
      console.log(testTradeInstance.events);
    })();
  }, [testTradeInstance]);

  useEffect(() => {
    // console.log(account);
  }, [account]);

  if (!account) return <h1>지갑 연결하세요</h1>;
  return (
    <div
      style={{
        color: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>나의 NFT</h2>
      <div style={{ display: "flex" }}>
        {myNftsURI &&
          Object.keys(myNftsURI).map(tokenId => {
            return <Nft key={tokenId} tokenId={tokenId} nftURI={myNftsURI[tokenId]} />;
          })}
      </div>
      <div style={{ marginTop: "100px" }}>
        <input type="number" placeholder="토큰ID" />
        <button>구매하기</button>
      </div>
      <div>
        <input type="number" placeholder="토큰ID" />
        <input type="number" placeholder="가격" />
        <button>판매하기</button>
      </div>
      <div>
        <input type="number" placeholder="토큰ID" />
        <input type="number" placeholder="입찰가격" />
        <button>경매입찰하기</button>
      </div>
      <div>
        <input type="number" placeholder="토큰ID" />
        <input type="number" placeholder="최소가격" />
        <button>경매등록하기</button>
      </div>
    </div>
  );
};

export default SeopMy;
