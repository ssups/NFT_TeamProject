import React, { useEffect, useState } from "react";
import Nft from "./nft";
import useWeb3 from "../../hooks/useWeb3";
import useTestTokenContract from "../../hooks/useTestTokenContract";

const SeopMy = () => {
  // hooks
  const [account, web3, balance] = useWeb3();
  const [testTokenContract] = useTestTokenContract();
  //  states
  const [myNftsURI, setMyNftsURI] = useState({});

  // ==========================================useEffect==========================================
  // =============================================================================================

  // testToken 컨트렉트 연동됐을때
  useEffect(() => {
    (async () => {
      if (!testTokenContract) return;
      // 가지고있는토큰 uri 들고오기
      const tokensIdOfOwner = await testTokenContract.methods.tokensOfOwner(account).call();
      const tokensURI = {};
      for (const tokenId of tokensIdOfOwner) {
        tokensURI[tokenId] = await testTokenContract.methods.tokenURI(tokenId).call();
      }
      setMyNftsURI(tokensURI);
    })();
  }, [testTokenContract, account]); // 지갑바꿀떄 자동으로 바뀌게 account도 넣어놈

  return (
    <div>
      <div>나의 NFT</div>
      <div style={{ display: "flex" }}>
        {myNftsURI &&
          Object.keys(myNftsURI).map(tokenId => {
            return <Nft key={tokenId} tokenId={tokenId} nftURI={myNftsURI[tokenId]} />;
          })}
      </div>
    </div>
  );
};

export default SeopMy;
