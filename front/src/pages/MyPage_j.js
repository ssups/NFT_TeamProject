import React, { useEffect, useContext, useState } from "react";

// createContext 경로
import { Context } from "../App";
import { Col, Container, Row } from "reactstrap";
import NftCard from "../components/Nft/NftCard_j";

// 1. 배포한 컨트랙트 인스턴스 확인
// 2. 메타마스크 계정 연결 확인
// 3. 연결된 계정의 보유 토큰 조회
// 4. 보유 토큰에 대한 리렌더링

// 1. 순수 보유 토큰 : 상품 등록 버튼, 경매 등록 버튼
// 2. 판매 중인 보유 토큰 : 판매 취소 버튼
// 3. 경매 진행 중인 보유 토큰 (낙찰 취소 기능 없음)
// 4. 경매 종료 후 정산 하기 전 보유 토큰 : 정산 받기 버튼

const MyPage = () => {
  //
  // 토큰 전송의 권한 위임 여부 확인 및 설정 기능

  const [myTokenURIs, setMyTokenURIs] = useState();
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const { account, tokenContract, tradeContract } = useContext(Context);

  // ==========================================functions==========================================
  // =============================================================================================

  async function getIsApprovedForAllFn() {
    //
    const ca = await tradeContract.methods.getCA().call();

    const isApprovedForAll = await tokenContract.methods.isApprovedForAll(account, ca).call();
    return isApprovedForAll;
  }

  async function setApprovalForAllFn() {
    //
    if (isApprovedForAll) return;

    const delegationMsg = "판매 및 경매 상품으로 등록하기 위해서는 토큰에 대한 전송 권한을 위임하는 것에 동의해야 합니다. 동의하시겠습니까?";
    if (!window.confirm(delegationMsg)) {
      //
      alert("토큰에 대한 전송 권한을 위임하지 않았습니다.");
      return;
    }

    // 거래 컨트랙트의 CA 값 전송
    const ca = await tradeContract.methods.getCA().call();

    await tokenContract.methods.setApprovalForAll(ca, true).send({ from: account });

    alert("토큰에 대한 전송 권한 위임이 완료되었습니다.");
    setIsApprovedForAll(true);
  }

  // 나의 보유 토큰들을 보유하게 된 순서대로 컴포넌트화 하기 위한 JSON 파일 경로 조회 함수
  async function getMyTokenURIsFn() {
    //
    // 보유 토큰 조회 및 토큰의 JSON 객체가 담긴 파일 경로 가져오기
    const _tokenURIs = {};
    const tokenIds = await tokenContract.methods.tokensOfOwner(account).call();

    for (const tokenId of tokenIds) {
      _tokenURIs[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
    }
    return _tokenURIs;
  }

  // 마이 페이지의 토큰 분류 - classificationName
  // 모든 보유 토큰 - myTokenURIs : tokensOfOwner() 함수 사용

  // 순수 보유 토큰 - myOwnToken
  // 판매 중인 토큰 - mySaleToken : onSaleList() 함수 사용
  // 경매 중인 토큰 - myAuctionToken : onAuctionList() 함수 사용
  // 경매 정산 대상 토큰 - myNotClaimedAuctionToken : notClaimedAuctionList() 함수 사용

  async function classifyMyTokensFn() {
    // myTokenURIs
  }

  // 토큰의 전송 권한 위임 여부 확인이 필요한 지 여부에 따라 분류하여 JSX를 반환하는 함수
  function getMyTokenJSXFn(tokenId, classificationName) {
    //
    if (!myTokenURIs) return;

    // 토큰에 대한 전송 권한 위임이 필요한 토큰에 위임 동의가 되어 있지 않은 경우
    const isMyOwnToken = classificationName === "myOwnToken";
    if (!isApprovedForAll && !isMyOwnToken) {
      //
      return (
        <Col lg="3" md="4" sm="6" className="mb-4">
          <NftCard key={tokenId} tokenURI={myTokenURIs[tokenId]} classificationName={classificationName} setApprovalForAllFn={setApprovalForAllFn} />
        </Col>
      );
    }

    return (
      <Col lg="3" md="4" sm="6" className="mb-4">
        <NftCard key={tokenId} tokenURI={myTokenURIs[tokenId]} classificationName={classificationName} />
      </Col>
    );
  }

  async function getMySaleTokenIdsFn() {
    const mySaleTokenIds = await tradeContract.methods.onSaleList(account).call();
    console.log(mySaleTokenIds);
    return mySaleTokenIds;
  }

  async function getMyAuctionTokenIdsFn() {
    const myAuctionTokenIds = await tradeContract.methods.onAuctionList(account).call();
    console.log(myAuctionTokenIds);
    return myAuctionTokenIds;
  }

  async function getMyNotClaimedAuctionTokenIdsFn() {
    const myNotClaimedAuctionTokenIds = await tradeContract.methods.notClaimedAuctionList(account).call();
    console.log(myNotClaimedAuctionTokenIds);
    return myNotClaimedAuctionTokenIds;
  }

  // 토큰 컨트랙트나 계정이 없을 경우에 사용할 JSX를 반환하는 함수
  function getMessageJsxFn(message) {
    return <p style={{ color: "white", textAlign: "center", marginTop: "20%", fontSize: "5vw", fontWeight: "900" }}>{message}</p>;
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    // context 데이터를 가져오기까지 시간 소요 (undefined 거치는)
    // 초기값 / undefined
    console.log(tokenContract, account);

    if (!tokenContract || !account) return;

    (async () => {
      //
      const myTokenURI = await getMyTokenURIsFn();
      setMyTokenURIs(myTokenURI);

      const _isApprovedForAll = await getIsApprovedForAllFn();
      if (_isApprovedForAll) {
        setIsApprovedForAll(true);
      }
    })();
  }, [tokenContract, account]);

  // ===========================================returns===========================================
  // =============================================================================================

  // JSX 반환을 위해 바깥에
  if (!tokenContract) {
    return getMessageJsxFn("no cotract");
  }

  if (!account) {
    return getMessageJsxFn("no account");
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
          {/*  */}
          {myTokenURIs && Object.keys(myTokenURIs).map((tokenId) => getMyTokenJSXFn(tokenId, "토큰 분류명"))}
          {/*  */}
        </Row>
      </Container>
    </section>
  );
};

export default MyPage;
