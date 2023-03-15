import React, { useEffect, useContext, useState } from 'react';

import { Context } from '../App';
import { Col, Container, Row } from 'reactstrap';
import ShopNftCard from '../components/Nft/ShopNftCard_j';
import { LoadingContext } from '../Layout/Layout';

const Shop = () => {
  //
  const [saleTokenURIs, setSaleTokenURIs] = useState();
  const { tokenContract, tradeContract } = useContext(Context);
  const { setIsLoading } = useContext(LoadingContext);

  // ==========================================functions==========================================
  // =============================================================================================

  // 현재 판매 중인 토큰 정보가 담긴 JSON 파일 경로 조회 함수
  async function getSaleTokenURIsFn() {
    //
    if (!tradeContract) return;
    const _saleTokenURIs = {};
    const saleTokenIds = await tradeContract.methods.onSaleList().call();
    for (const tokenId of saleTokenIds) {
      _saleTokenURIs[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
    }
    console.log(_saleTokenURIs);
    return _saleTokenURIs;
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    (async () => {
      //
      setIsLoading(true);
      setSaleTokenURIs(await getSaleTokenURIsFn());
      setIsLoading(false);
    })();
  }, [tradeContract]);

  // ===========================================returns===========================================
  // =============================================================================================

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5"></div>
            </div>
          </Col>
          {/*  */}
          {saleTokenURIs &&
            Object.keys(saleTokenURIs).map(tokenId => (
              <Col key={tokenId} lg="3" md="4" sm="6" className="mb-4">
                <ShopNftCard key={tokenId} tokenId={tokenId} tokenURI={saleTokenURIs[tokenId]} />
              </Col>
            ))}
          {/*  */}
        </Row>
      </Container>
    </section>
  );
};

export default Shop;
