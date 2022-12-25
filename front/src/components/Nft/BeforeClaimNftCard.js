import React, { useState, useEffect, useContext, useRef } from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../App";

const BeforeClaimNftCard = ({ tokenId, tokenURI, tokenInfo }) => {
  // context
  const { account, web3, balance, tokenContract, tradeContract } = useContext(Context);
  // states
  const [jsonData, setJsonData] = useState();
  const [matchedPrice, setMatchedPrice] = useState();

  // useEffect
  // 토큰의 json데이터 가져오기
  useEffect(() => {
    if (!tokenURI) return;
    (async () => {
      const jsonData = await axios.get(`${tokenURI}.json`);
      setJsonData(jsonData.data);
    })();
  }, [tokenURI]);

  // 토큰경매정보들 업데이트
  useEffect(() => {
    if (!tokenInfo) return;
    const { endTime, lastBidPrice, bider } = tokenInfo;
    if (!web3) return;
    setMatchedPrice(web3.utils.fromWei(lastBidPrice + "", "ether"));
  }, [tokenInfo, web3]);

  // functions
  async function claim() {
    await tradeContract.methods
      .claimMatchedAuction(tokenId)
      .send({ from: account })
      .then(success => alert("정산 성공"))
      .catch(err => alert("정산실패", err));
  }

  // returns
  if (!jsonData) return;
  return (
    <Col key={tokenId} lg="3" md="4" sm="6" className="mb-4">
      <div className="single_nft">
        <div className="nft_img">
          <img src={jsonData.image} className="w-100" alt="" />
        </div>

        {/* 카드 상태창 */}
        <div className="nft_content" style={{ color: "white" }}>
          <h5 className="nft_title">
            {/* 이거 링크걸린거 경국이한테 물어보기 */}
            <Link to={`/shop/${tokenId}`}>{jsonData.name}</Link>
          </h5>
          <h5>낙찰받은 입찰가: {matchedPrice && matchedPrice + " Eth"}</h5>

          <div className="creator_info d-flex align-items-center justify-content-between">
            <div className="w-50"></div>
          </div>

          {/* 정산하기 버튼 */}
          <div className=" mt-3 d-flex align-items-center justify-content-between">
            <button
              className="bid_btn d-flex align-items-center gap-1"
              onClick={() => {
                claim();
              }}
            >
              <i className="ri-shopping-bag-fill"></i>
              NFT 수령하기
            </button>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default BeforeClaimNftCard;
