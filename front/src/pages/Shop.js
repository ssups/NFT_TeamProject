import React, { useEffect, useState, useContext } from "react";
import { Col, Container, Row } from "reactstrap";
import NftCard from "../components/Nft/NftCard";
import { NFT__DATA } from "../asset/data/data";
import useSsandeContracts from "../hooks/useSsandeContracts";
import { Context } from "../App";

const Shop = () => {
  // context
  const { account, web3, balance, tokenContract, tradeContract } = useContext(Context);
  // state
  const [tokensOnAuction, setTokensOnAuction] = useState();
  const [onAuctionURI, setOnAuctionURI] = useState();
  const [onAuctionInfo, setOnAuctionInfo] = useState();

  // useEffect

  useEffect(() => {
    if (!tradeContract) return;
    // 경매등록했을때 자동으로 올라오도록 이벤트설정
    tradeContract.events.RegisterForAuction(async (err, data) => {
      const tokenId = data.returnValues.tokenId;
      const tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
      const tokensInfo = await tradeContract.methods.dataOfOnAuction(tokenId).call();

      setTokensOnAuction(current => [...new Set([...current, tokenId])]); // 블록생성 지연됐을때 중복값 생길수있어서 방지
      setOnAuctionURI(current => {
        return { ...current, [tokenId]: tokenURI };
      });
      setOnAuctionInfo(current => {
        return { ...current, [tokenId]: tokensInfo };
      });
    });

    // 경매입찰했을때 자동으로 최고입찰가 바뀌도록
    tradeContract.events.BidOnAuction(async (err, data) => {
      const tokenId = data.returnValues.tokenId;
      const bidPrice = data.returnValues.bidPrice;
      const bider = data.returnValues.bider;
      // const previousTokenInfo = onAuctionInfo[tokenId];

      setOnAuctionInfo(current => {
        return { ...current, [tokenId]: { ...current[tokenId], lastBidPrice: bidPrice, bider } };
      });
    });
  }, [tradeContract]);

  // 토큰정보받아오기
  useEffect(() => {
    if (!tokenContract || !tradeContract) return;
    (async () => {
      // 경매중인 토큰 리스트
      const tokensOnAuction = await tradeContract.methods.onAuctionList().call();
      setTokensOnAuction(tokensOnAuction);

      // 경매중이 토큰 uri, info 들고오기
      const tokensURI = {};
      const tokensInfo = {};
      for (const tokenId of tokensOnAuction) {
        tokensURI[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
        tokensInfo[tokenId] = await tradeContract.methods.dataOfOnAuction(tokenId).call();
      }
      setOnAuctionURI(tokensURI);
      setOnAuctionInfo(tokensInfo);
    })();
  }, [tokenContract, tradeContract]);

  // 경매시간 적게남은 순대로 하도록 sort
  useEffect(() => {
    // 이 배열이 frozen in strict mode 상태라 복사한번 해주고 sort해야 솔트가 된다
    // 뭔지모르겠다...
    if (!tokensOnAuction || !onAuctionInfo) return;
    const sortedList = [...tokensOnAuction].sort(
      (a, b) => onAuctionInfo[a].endTime - onAuctionInfo[b].endTime
    );
    setTokensOnAuction(sortedList);
  }, [onAuctionInfo]); //onAuctionInfo값이 업데이트되고나서 sort작업을해줘야해서 tokensOnAuction이 바꼈을때는 랜더링 안되게

  useEffect(() => {
    (async () => {
      if (!tradeContract) return;
      // console.log(tradeContract.methods);
      console.log(tradeContract.events);
    })();
  }, [tradeContract]);

  // 블록타임스탬프확인
  useEffect(() => {
    if (!web3) return;
    (async () => {
      const block = await web3.eth.getBlock();
      console.log(block.timestamp);
    })();
  }, [web3]);

  // functions

  // 입찰하기

  // return
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5"></div>
            </div>
          </Col>

          {onAuctionURI && onAuctionInfo && tokensOnAuction
            ? tokensOnAuction.map(tokenId =>
                // 새로고침때 시간지난거 먼저 걸러주기
                onAuctionInfo[tokenId].endTime - Math.floor(Date.now() / 1000) > 0 ? (
                  <NftCard
                    key={tokenId}
                    tokenId={tokenId}
                    tokenURI={onAuctionURI[tokenId]}
                    tokenInfo={onAuctionInfo[tokenId]}
                  />
                ) : null
              )
            : null}
        </Row>
      </Container>
    </section>
  );
};

export default Shop;
