import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import MyPageModal from "../Modal/MyPageModal_j";

const MyPageNftCard = ({ tokenURI, classificationName, setApprovalForAllFn }) => {
  //
  const [tokenName, setTokenName] = useState();
  const [tokenImgUrl, setTokenImgUrl] = useState();
  const [registerSaleModal, setRegisterSaleModal] = useState(false);
  const [registerAuctionModal, setRegisterAuctionModal] = useState(false);

  // ==========================================functions==========================================
  // =============================================================================================

  function getNftCardJsxFn(title, modal, setModal) {
    return (
      <div className=" mt-3 d-flex align-items-center justify-content-between">
        <button className="bid_btn d-flex align-items-center gap-1" onClick={() => setModal(true)}>
          💎 {title}
        </button>
        {modal && <MyPageModal title={title} setModal={setModal} />}
      </div>
    )
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
            {getNftCardJsxFn("판매 상품으로 등록하기", registerSaleModal, setRegisterSaleModal)}
            {getNftCardJsxFn("경매 상품으로 등록하기", registerAuctionModal, setRegisterAuctionModal)}
          </>
        }

        {classificationName === "mySaleToken" &&
          getNftCardJsxFn("판매 등록 취소하기")
        }

        {classificationName === "myNotClaimedAuctionToken" &&
          getNftCardJsxFn("경매 낙찰 상품 정산 받기")
        }

      </div>
    </div>
  );
};

export default MyPageNftCard;
