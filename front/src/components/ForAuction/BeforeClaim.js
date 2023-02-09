import React, { useEffect, useState, useContext } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Context } from '../../App';
import useLoading from '../../hooks/useLoading';
import Loading from '../Loading/Loading';
import BeforeClaimNftCard from '../Nft/BeforeClaimNftCard';

const BeforeClaim = () => {
  // context
  const { account, web3, balance, tokenContract, tradeContract } = useContext(Context);

  // state
  const [tokensNotClaimed, setTokensNotClaimed] = useState();
  const [onAuctionURI, setOnAuctionURI] = useState();
  const [onAuctionInfo, setOnAuctionInfo] = useState();

  // hooks
  const { isLoading, setIsLoading, returnLoadingComp } = useLoading();

  // useEffect
  useEffect(() => {
    if (!tradeContract || !account || !tokenContract) return;
    (async () => {
      setIsLoading(true);
      // 내가입찰한거중에 정산안된 토큰들 리스트
      const tokenList = await tradeContract.methods.notClaimedTokensOfBiderList(account).call();
      setTokensNotClaimed(tokenList);

      // 정산안된 토큰 uri, info 들고오기
      const tokensURI = {};
      const tokensInfo = {};
      for (const tokenId of tokenList) {
        tokensURI[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
        tokensInfo[tokenId] = await tradeContract.methods.dataOfOnAuction(tokenId).call();
      }

      setIsLoading(false);
      setOnAuctionURI(tokensURI);
      setOnAuctionInfo(tokensInfo);
    })();
  }, [tokenContract, tradeContract, account]);

  // 누군가 토큰정산하면 발생하는 이벤트(아무나 정산해도 실행됨)
  useEffect(() => {
    if (!tradeContract || !tokensNotClaimed) return;
    (async () => {
      await tradeContract.events.ClaimMatchedAuction(async (err, data) => {
        const claimedTokenId = data.returnValues.tokenId;
        //정산된 토큰이 내가 입찰한거일때만 실행
        const index = tokensNotClaimed.indexOf(claimedTokenId);
        if (index !== -1) {
          const newList = [...tokensNotClaimed];
          newList.splice(index, 1);
          setTokensNotClaimed(newList);
        }
      });
    })();
  }, [tradeContract, tokensNotClaimed]);

  // returns
  // =================================================================================================
  // =================================================================================================
  if (isLoading) return returnLoadingComp(styles.loading);
  if (!tokensNotClaimed || tokensNotClaimed.length === 0)
    return (
      <h1
        style={{
          width: '100wh',
          height: 'calc(100vh - 100px - 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        낙찰된 상품이 없습니다.
      </h1>
    );
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5"></div>
            </div>
          </Col>
          {onAuctionURI && onAuctionInfo && tokensNotClaimed
            ? tokensNotClaimed.map(tokenId => (
                <BeforeClaimNftCard
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

export default BeforeClaim;

const styles = {
  loading: {
    height: 'calc(100vh - 100px - 32px)',
  },
};
