import React, { useEffect, useState, useContext } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Context } from '../../App';
import AuctionNftCard from '../Nft/AuctionNftCard';
import { LoadingContext } from '../../Layout/Layout';

const AuctionShop = () => {
  // context
  const { web3, tokenContract, tradeContract } = useContext(Context);
  const { setIsLoading } = useContext(LoadingContext);
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
      // 로딩 시작
      setIsLoading(true);

      // 경매중인 토큰 리스트
      const tokensOnAuction = await tradeContract.methods.onAuctionList().call();

      // 경매중이 토큰 uri, info 들고오기
      const tokensURI = {};
      const tokensInfo = {};
      for (const tokenId of tokensOnAuction) {
        tokensURI[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
        tokensInfo[tokenId] = await tradeContract.methods.dataOfOnAuction(tokenId).call();
      }

      // 로딩 끝
      setIsLoading(false);

      // 경매시간지난거 프론트에서도 한번 필터해주기(블록생성시간 지연됐을경우 대비)
      const now = Math.floor(Date.now() / 1000);
      const filteredTokensOnAuction = tokensOnAuction.filter(
        tokenId => tokensInfo[tokenId].endTime - now >= 0
      );

      setTokensOnAuction(filteredTokensOnAuction);
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

  // 블록타임스탬프확인
  useEffect(() => {
    if (!web3) return;
    (async () => {
      // const block = await web3.eth.getBlock();
      // console.log(block.timestamp);
    })();
  }, [web3]);

  // returns
  // =================================================================================================
  // =================================================================================================

  if (!tokensOnAuction || tokensOnAuction?.length === 0)
    return <h1 style={styles.guideMent}>경매중인 상품이 없습니다.</h1>;

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
            ? tokensOnAuction.map(tokenId => (
                <AuctionNftCard
                  key={tokenId}
                  tokenId={tokenId}
                  tokenURI={onAuctionURI[tokenId]}
                  tokenInfo={onAuctionInfo[tokenId]}
                />
              ))
            : null}
        </Row>
      </Container>
    </section>
  );
};

export default AuctionShop;

const styles = {
  guideMent: {
    width: '100wh',
    height: 'calc(100vh - 100px - 50px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
