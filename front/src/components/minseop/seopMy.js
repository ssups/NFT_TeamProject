import React, { useEffect, useState, useContext, useRef } from "react";
import Nft from "./nft";
import useSsandeContracts from "../../hooks/useSsandeContracts";

import { Context } from "../../App";

const SeopMy = () => {
  // hooks
  const { account, web3, balance } = useContext(Context);
  const [testTokenInstance, testTradeInstance] = useSsandeContracts();
  // states
  const [myNftsURI, setMyNftsURI] = useState({});
  // refs
  const registerRef = useRef();
  const claimRef = useRef();

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
      // console.log(testTradeInstance.events);
    })();
  }, [testTradeInstance]);

  useEffect(() => {
    (async () => {
      if (!testTokenInstance) return;
      console.log(testTokenInstance.methods);
      // console.log(testTradeInstance.events);
    })();
  }, [testTokenInstance]);

  useEffect(() => {
    // console.log(account);
  }, [account]);

  // functions

  // 경매등록
  async function registerAuction() {
    const tokenId = registerRef.tokenId.value;
    const bidTime = registerRef.time.value;
    const price = registerRef.price.value;
    const adjustedPice = web3.utils.toWei(price, "ether");
    const CAofTestTrade = await testTradeInstance.methods.getCA().call();
    let isApproved = await testTokenInstance.methods
      .isApprovedForAll(account, CAofTestTrade)
      .call();
    // CA에 권한없으면 권한 넘기기
    if (!isApproved) {
      await testTokenInstance.methods
        .setApprovalForAll(CAofTestTrade, true)
        .send({ from: account })
        .then(success => (isApproved = true))
        .catch(err => {
          alert("권한을 주세요");
          isApproved = false;
        });
    }
    // 사용자가 거부하면 빠져나가기
    if (!isApproved) return;
    // 경매등록 (토큰아이디, 가격, 시간(분단위))
    await testTradeInstance.methods
      .registerForAuction(tokenId, adjustedPice, bidTime)
      .send({ from: account })
      .then(success => alert("등록성공"))
      .catch(err => alert("등록실패"));
  }

  // 정산하기
  async function claimAuction() {
    const tokenId = claimRef.current.value;
    await testTradeInstance.methods
      .claimMatchedAuction(tokenId)
      .send({ from: account })
      .then(success => alert("정산 성공"))
      .catch(err => alert("정산실패", err));
  }

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

      <div>
        <input
          type="number"
          placeholder="토큰ID"
          ref={ref => {
            registerRef["tokenId"] = ref;
          }}
        />
        <input
          type="number"
          placeholder="최소가격"
          ref={ref => {
            registerRef["price"] = ref;
          }}
        />
        <input
          type="number"
          placeholder="경매시간"
          ref={ref => {
            registerRef["time"] = ref;
          }}
        />
        <button onClick={registerAuction}>경매등록하기</button>
      </div>
      <div>
        <input type="number" placeholder="토큰ID" ref={claimRef} />
        <button onClick={claimAuction}>정산하기</button>
      </div>
    </div>
  );
};

export default SeopMy;
