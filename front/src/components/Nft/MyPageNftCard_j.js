import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Context } from "../../App";
import MyPageModal from "../Modal/MyPageModal_j";

const MyPageNftCard = ({ tokenId, tokenURI, classificationName, setApprovalForAllFn }) => {
  //
  const { web3, account, tradeContract } = useContext(Context);

  const [tokenName, setTokenName] = useState();
  const [tokenImgUrl, setTokenImgUrl] = useState();
  const [registerSaleModal, setRegisterSaleModal] = useState(false);
  const [registerAuctionModal, setRegisterAuctionModal] = useState(false);

  // ==========================================functions==========================================
  // =============================================================================================

  // 판매 등록 취소하기 버튼에 대한 함수
  async function deregisterSaleToken() {
    //
    await tradeContract.methods.cancleSale(tokenId).send({ from: account });
    alert("판매 등록이 취소되었습니다.");
  }

  // 경매 낙찰 상품 정산 받기 버튼에 대한 함수
  async function claimMatchedToken() {
    //
    const transactionFee = await getAuctionFeeFn();
    const incomeAfterFee = await getIncomeAfterAuctionFeeFn();

    const claimMessage = `경매 낙찰로 인해 발생한 수수료는 ${transactionFee} ether 이며 정산금은 ${incomeAfterFee} ether 입니다. 정산 받으시겠습니까?`;
    if (!window.confirm(claimMessage)) return;

    await tradeContract.methods.claimMatchedAuction(tokenId).send({ from: account });

    alert("정산이 완료되었습니다.");
  }

  // 경매 낙찰 상품의 수수료 조회 함수
  async function getAuctionFeeFn() {
    const amount = await tradeContract.methods.feeOfMatchedAuctionToken(tokenId).call();
    return web3.utils.fromWei(amount, "ether");
  }

  // 경매 낙찰 상품의 정산금 조회 함수
  async function getIncomeAfterAuctionFeeFn() {
    const amount = await tradeContract.methods.afterFeeOfNotClaimedToken(tokenId).call();
    return web3.utils.fromWei(amount, "ether");
  }

  // 보유 토큰의 분류명에 따라 버튼에 대한 JSX를 반환하는 함수
  function getNftCardJsxFn(title, modal, setModal, tokenId, buttonFn) {
    return (
      <div className=" mt-3 d-flex align-items-center justify-content-between">
        <button className="bid_btn d-flex align-items-center gap-1"

          onClick={
            setApprovalForAllFn &&
              title !== "판매 등록 취소하기" ?
              setApprovalForAllFn : modal === false ? () => setModal(true) : buttonFn}>

          💎 {title}
        </button>
        {modal && <MyPageModal title={title} setModal={setModal} tokenId={tokenId} />}
      </div>
    )
  }

  function getClassificationName() {
    //
    switch (classificationName) {
      case "myOwnToken":
        return "순수 보유 토큰";
      case "mySaleToken":
        return "판매 중인 토큰";
      case "myAuctionToken":
        return "경매 중인 토큰";
      case "myNotClaimedAuctionToken":
        return "경매 낙찰 토큰";
      default:
        return;
    }
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    (async () => {
      //
      // name, image, attributes, dna, edition, date, compiler, description
      const { name, image } = (await axios.get(tokenURI + ".json")).data;

      setTokenName(name);
      setTokenImgUrl(image);
    })();
  }, []);

  // ===========================================returns===========================================
  // =============================================================================================

  return (
    <div className="single_nft">
      <div className="nft_img">
        <img src={tokenImgUrl} className="w-100" alt="" />
      </div>

      {/* 카드 정보 */}
      <div className="nft_content">
        {/* <h5 className="nft_title"><Link to={`/shop/${"여기에 상세 페이지 경로 입력해주세용"}`}>{name}</Link></h5> */}
        <h5 className="nft_title">{tokenName}</h5>
        <h5 className="nft_title">{getClassificationName()}</h5>
        <div className="creator_info d-flex align-items-center justify-content-between">
          <div className="w-50"></div>
        </div>

        {/* 
필요한 버튼
1. 순수 보유 토큰 : 판매 등록 버튼, 경매 등록 버튼
2. 판매 중인 보유 토큰 : 판매 취소 버튼
3. 경매 진행 중인 보유 토큰 (낙찰 취소 기능 없음)
4. 경매 종료 후 정산 하기 전 보유 토큰 : 정산 받기 버튼
*/}

        {classificationName === "myOwnToken" &&
          <>
            {getNftCardJsxFn("판매 상품으로 등록하기", registerSaleModal, setRegisterSaleModal, tokenId)}
            {getNftCardJsxFn("경매 상품으로 등록하기", registerAuctionModal, setRegisterAuctionModal, tokenId)}
          </>
        }

        {classificationName === "mySaleToken" &&
          getNftCardJsxFn("판매 등록 취소하기", "", "", "", deregisterSaleToken)
        }

        {classificationName === "myNotClaimedAuctionToken" &&
          getNftCardJsxFn("경매 낙찰 상품 정산 받기", "", "", "", claimMatchedToken)
        }

      </div>
    </div>
  );
};

export default MyPageNftCard;
