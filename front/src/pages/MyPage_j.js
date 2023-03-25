import React, { useEffect, useContext, useState } from 'react';

// createContext 경로
import { Context } from '../App';
import { Col, Container, Row } from 'reactstrap';
import MyPageNftCard from '../components/Nft/MyPageNftCard_j';
import { LoadingContext } from '../Layout/Layout';

// 1. 배포한 컨트랙트 인스턴스 확인
// 2. 메타마스크 계정 연결 확인
// 3. 연결된 계정의 보유 토큰 조회
// 4. 보유 토큰에 대한 리렌더링

// 1. 순수 보유 토큰 : 판매 등록 버튼, 경매 등록 버튼
// 2. 판매 중인 보유 토큰 : 판매 취소 버튼
// 3. 경매 진행 중인 보유 토큰 (낙찰 취소 기능 없음)
// 4. 경매 종료 후 정산 하기 전 보유 토큰 : 정산 받기 버튼

const MyPage = () => {
  //
  const [myTokens, setMyTokens] = useState();
  const [isApprovedForAll, setIsApprovedForAll] = useState();
  const { account, tokenContract, tradeContract } = useContext(Context);
  const { setIsLoading } = useContext(LoadingContext);

  // ==========================================functions==========================================
  // =============================================================================================

  // 토큰의 전송 권한 위임 여부에 대한 함수
  async function getIsApprovedForAllFn() {
    //
    const ca = await tradeContract.methods.getCA().call();
    return await tokenContract.methods.isApprovedForAll(account, ca).call();
  }

  // 토큰의 전송 권한 위임 설정에 대한 함수
  async function setApprovalForAllFn() {
    //
    console.log('why false : true ===', isApprovedForAll);
    if (isApprovedForAll) return;

    const delegationMsg =
      '판매 및 경매 상품으로 등록하기 위해서는 토큰에 대한 전송 권한을 위임하는 것에 동의해야 합니다. 동의하시겠습니까?';
    if (!window.confirm(delegationMsg)) {
      //
      alert('토큰에 대한 전송 권한을 위임하지 않았습니다.');
      return;
    }
    console.log(isApprovedForAll);

    // 거래 컨트랙트의 CA 값 전송
    const ca = await tradeContract.methods.getCA().call();

    setIsLoading(true);
    try {
      await tokenContract.methods.setApprovalForAll(ca, true).send({ from: account });
      alert('토큰에 대한 전송 권한 위임이 완료되었습니다.');
      setIsLoading(false);
      setIsApprovedForAll(true);
    } catch (err) {
      setIsLoading(false);
    }
  }
  console.log('true ===', isApprovedForAll);

  // 나의 보유 토큰들을 보유하게 된 순서대로 컴포넌트화 하기 위한 JSON 파일 경로 조회 함수
  async function getMyTokenURIsFn() {
    //
    // 보유 토큰 조회 및 토큰의 JSON 객체가 담긴 파일 경로 가져오기
    const myTokenURIs = {};
    const tokenIds = await tokenContract.methods.tokensOfOwner(account).call();

    for (const tokenId of tokenIds) {
      myTokenURIs[tokenId] = await tokenContract.methods.tokenURI(tokenId).call();
    }
    return myTokenURIs;
  }

  // 마이 페이지의 토큰 분류 - classificationName
  // 모든 보유 토큰 - myTokens : tokensOfOwner() 함수 사용

  // 순수 보유 토큰 - myOwnToken
  // 판매 중인 토큰 - mySaleToken : isOnAuction() 함수 사용
  // 경매 중인 토큰 - myAuctionToken : isOnAuction() 함수 사용
  // 경매 정산 대상 토큰 - myNotClaimedAuctionToken : isNotClaimMatchedToken() 함수 사용

  // 보유 토큰을 분류하여 JSX를 반환하는 함수
  async function getMyTokensFn(myTokenURIs) {
    return await Promise.all(
      Object.keys(myTokenURIs).map(tokenId => classifyMyTokensFn(tokenId, myTokenURIs[tokenId]))
    );
  }

  // 마이페이지의 보유 토큰을 분류하는 함수
  async function classifyMyTokensFn(tokenId, tokenURI) {
    //
    // 블록체인 상에서 판매와 경매는 중복으로 등록 불가
    const isSaleToken = await tradeContract.methods.isOnSale(tokenId).call();
    if (isSaleToken) {
      return getMyTokenJSXFn(tokenId, tokenURI, 'mySaleToken');
    }

    const isAuctionToken = await tradeContract.methods.isOnAuction(tokenId).call();
    if (isAuctionToken) {
      return getMyTokenJSXFn(tokenId, tokenURI, 'myAuctionToken');
    }

    const isNotClaimMatchedToken = await tradeContract.methods.isNeedToClaim(tokenId).call();
    if (isNotClaimMatchedToken) {
      return getMyTokenJSXFn(tokenId, tokenURI, 'myNotClaimedAuctionToken');
    }

    return getMyTokenJSXFn(tokenId, tokenURI, 'myOwnToken');
  }

  // 토큰의 전송 권한 위임 여부 확인이 필요한 지 여부에 따라 분류하여 JSX를 반환하는 함수
  function getMyTokenJSXFn(tokenId, tokenURI, classificationName) {
    //
    // 토큰에 대한 전송 권한 위임이 필요한 토큰에 위임 동의가 되어 있지 않은 경우
    const isMyOwnToken = classificationName === 'myOwnToken';
    const isNotClaimMatchedToken = classificationName === 'myNotClaimedAuctionToken';
    if (!isApprovedForAll && (isMyOwnToken || isNotClaimMatchedToken)) {
      //
      return (
        <Col key={tokenId} lg="3" md="4" sm="6" className="mb-4">
          <MyPageNftCard
            key={tokenId}
            tokenId={tokenId}
            tokenURI={tokenURI}
            classificationName={classificationName}
            setApprovalForAllFn={setApprovalForAllFn}
          />
        </Col>
      );
    }

    return (
      <Col key={tokenId} lg="3" md="4" sm="6" className="mb-4">
        <MyPageNftCard
          key={tokenId}
          tokenId={tokenId}
          tokenURI={tokenURI}
          classificationName={classificationName}
        />
      </Col>
    );
  }

  // 토큰 컨트랙트나 계정이 없을 경우에 사용할 JSX를 반환하는 함수
  function getMessageJsxFn(message) {
    return (
      <p
        style={{
          color: 'white',
          textAlign: 'center',
          marginTop: '20%',
          fontSize: '5vw',
          fontWeight: '900',
        }}
      >
        {message}
      </p>
    );
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    // 초기값 / undefined
    if (!tokenContract || !account) return;

    (async () => {
      //
      setIsLoading(true);
      const _isApprovedForAll = await getIsApprovedForAllFn();
      setIsApprovedForAll(_isApprovedForAll);
    })();
  }, [tokenContract, account]);

  // 토큰 전송 권한 위임 여부 확인 후 보유 토큰 조회
  useEffect(() => {
    //
    if (isApprovedForAll === undefined) return;

    (async () => {
      //
      const myTokenURIs = await getMyTokenURIsFn();
      const myTokens = await getMyTokensFn(myTokenURIs);
      setIsLoading(false);
      if (myTokens.length === 0) {
        //
        return setMyTokens(getMessageJsxFn('보유한 토큰이 없습니다.'));
      }
      setMyTokens(myTokens);
    })();
  }, [isApprovedForAll]);

  // ===========================================returns===========================================
  // =============================================================================================

  // JSX 반환을 위해 바깥에
  if (!tokenContract) {
    return getMessageJsxFn('배포된 컨트랙트를 찾을 수 없습니다.');
  }

  if (!account) {
    return getMessageJsxFn('메타마스크와 연결되어 있는 계정이 없습니다.');
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
          {myTokens}
          {/*  */}
        </Row>
      </Container>
    </section>
  );
};

export default MyPage;
