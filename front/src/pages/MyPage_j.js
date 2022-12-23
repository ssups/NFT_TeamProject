import React, { useEffect, useContext, useState } from "react";

// createContext 경로
import { Context } from "../components/Layout/Layout";
import { Col, Container, Row } from "reactstrap";
import NftCard from "../components/Nft/NftCard";

// 1. 배포한 컨트랙트 인스턴스 확인
// 2. 메타마스크 계정 연결 확인
// 3. 연결된 계정의 보유 토큰 조회
// 4. 보유 토큰에 대한 리렌더링

// 1. 보유 토큰
// 2. 판매 중인 보유 토큰
// 3. 경매 진행 중인 보유 토큰
// 4. 경매 종료 후 정산 하기 전 보유 토큰 (정산하기)

const MyPage = () => {
  //
  const [tokenURI, setTokenURI] = useState();
  const { account, tokenContract, tradeContract } = useContext(Context);

  // ==========================================functions==========================================
  // =============================================================================================

  // 나의 보유 토큰들을 보유하게 된 순서대로 컴포넌트화 하기 위한 JSON 파일 경로 조회 함수
  async function getMyTokenURI() {
    //
    // 보유 토큰 조회 및 토큰의 JSON 객체가 담긴 파일 경로 가져오기
    const tokenURI = {};
    const tokenIds = await tokenContract.methods.tokensOfOwner(account).call();
    console.log(tokenIds);

    for (const tokenId of tokenIds) {
      tokenURI[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
    }
    return tokenURI;
  }

  // 조회 후 토큰의 종류를 분류할 예정

  function getMessageJsx(message) {
    return <p style={{ color: "white", textAlign: "center", marginTop: "20%", fontSize: "5vw", fontWeight: "900" }}>{message}</p>;
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    // context 데이터를 가져오기까지 시간 소요 (undefined 거치는)
    // console.log(tokenContract, account);
    
    if (!tokenContract || !account) return;

    (async() => {
      //
      const tokenURI = await getMyTokenURI();
      setTokenURI(tokenURI);
      console.log(tokenURI);
    })();

  }, [tokenContract, account]);

  // ===========================================returns===========================================
  // =============================================================================================

  // JSX 반환을 위해 바깥에
  if (!tokenContract) {
    return getMessageJsx("no cotract");
  }

  if (!account) {
    return getMessageJsx("no account");
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

          {/* {tokenURI && Object.keys(tokenURI).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
              <NftCard item={item} />
            </Col>
          ))} */}
        </Row>
      </Container>
    </section>
  );
};

export default MyPage;
