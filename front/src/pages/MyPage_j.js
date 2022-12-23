import React, { useEffect, useContext } from "react";

import { Context } from "../components/Layout/Layout";
import { Col, Container, Row } from "reactstrap";
import NftCard from "../components/Nft/NftCard";

// JSON 데이터 가져오기
import { NFT__DATA } from "../asset/data/data";

// 1. 보유 토큰
// 2. 판매 중인 보유 토큰
// 3. 경매 진행 중인 보유 토큰
// 4. 경매 종료 후 정산 하기 전 보유 토큰 (정산하기)

const MyPage = () => {
  //
  const { account, tokenContract, tradeContract } = useContext(Context);

  // ==========================================functions==========================================
  // =============================================================================================

  // 나의 보유 토큰들을 보유하게 된 순서대로 컴포넌트화 하기 위한 JSON 파일 경로 조회 함수
  async function getMyTokenURI() {
    //
    // 보유 토큰 조회 및 토큰의 JSON 객체가 담긴 파일 경로 가져오기
    const tokenURI = {};
    const tokenIds = await tokenContract.methods.tokensOfOwner(account).call();

    for (const tokenId of tokenIds) {
      tokenURI[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
    }
    return tokenURI;
  }

  // 조회 후 토큰의 종류를 분류할 예정

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
  }, [tokenContract, account]);

  // ===========================================returns===========================================
  // =============================================================================================

  // context 데이터를 가져오기까지
  console.log(tokenContract, account);

  if (!tokenContract) {
    console.log("no contract");
    return <p style={{ color: "white", textAlign: "center", marginTop: "20%", fontSize: "5vw", fontWeight: "900" }}>no contract</p>;
  }

  if (!account) {
    console.log("no account");
    return <p style={{ color: "white", textAlign: "center", marginTop: "20%", fontSize: "5vw", fontWeight: "900" }}>no account</p>;
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5"></div>
            </div>
          </Col>

          {NFT__DATA.map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
              <NftCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default MyPage;
