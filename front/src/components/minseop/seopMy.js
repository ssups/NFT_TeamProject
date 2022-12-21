import React, { useEffect, useState } from "react";
import Nft from "./nft";
import useWeb3 from "../../hooks/useWeb3";
import useContract from "../../hooks/useContract";
import TestTokenContract from "../../contracts_seop/TestToken.json";

const SeopMy = () => {
  // hooks
  const [account, web3, balance] = useWeb3();
  const netWorkId = 7722;
  const testTokenInstance = useContract(
    TestTokenContract.abi,
    TestTokenContract.networks[netWorkId].address
  );
  //  states
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
          Object.keys(myNftsURI).map(tokenId => {
            return <Nft key={tokenId} tokenId={tokenId} nftURI={myNftsURI[tokenId]} />;
          })}
      </div>
    </div>
  );
};

export default SeopMy;
