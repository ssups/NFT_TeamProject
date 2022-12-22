import React, { useEffect, useState } from "react";

import Nft from "./NftInfo_j";
import useWeb3 from "../../hooks/useWeb3_j";
import useContract from "../../hooks/useContract_j";
import TestTokenContract from "../../contracts/TestToken.json";

const MyNft = () => {
  //
  // hooks
  const [web3, account, balance] = useWeb3();

  const testTokenInstance = useContract(TestTokenContract);

  const [myNftsURI, setMyNftsURI] = useState({});

  // ==========================================useEffect==========================================
  // =============================================================================================

  // testToken 컨트렉트 연동됐을때
  useEffect(() => {
    (async () => {
      if (!testTokenInstance) return;
      // 가지고있는토큰 uri 들고오기
      const tokensIdOfOwner = await testTokenInstance.methods.tokensOfOwner(account).call();
      const tokensURI = {};
      for (const tokenId of tokensIdOfOwner) {
        tokensURI[tokenId] = await testTokenInstance.methods.tokenURI(tokenId).call();
      }
      setMyNftsURI(tokensURI);
    })();
  }, [testTokenInstance, account]); // 지갑바꿀떄 자동으로 바뀌게 account도 넣어놈

  return (
    <div>
      <div>나의 NFT</div>
      <div style={{ display: "flex" }}>
        {myNftsURI &&
          Object.keys(myNftsURI).map((tokenId) => {
            return <Nft key={tokenId} tokenId={tokenId} nftURI={myNftsURI[tokenId]} />;
          })}
      </div>
      <div style={{ marginTop: "100px" }}>
        <input type="number" placeholder="토큰ID" />
        <button>구매하기</button>
      </div>
      <div>
        <input type="number" placeholder="토큰ID" />
        <button>판매하기</button>
      </div>
    </div>
  );
};

export default MyNft;
