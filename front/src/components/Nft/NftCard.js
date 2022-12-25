import React, { useState, useEffect, useContext, useRef } from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import useSsandeContracts from "../../hooks/useSsandeContracts";
import axios from "axios";
import { Context } from "../../App";

const NftCard = ({ tokenId, tokenURI, tokenInfo }) => {
  // context
  const { account, web3, balance, tokenContract, tradeContract } = useContext(Context);
  // states
  const [jsonData, setJsonData] = useState();
  const [attributes, setAttributes] = useState();
  const [moDal, setModal] = useState(false);
  const [timeCount, setTimeCount] = useState();
  const [currentBid, setCurrentBid] = useState();
  const [endTime, setEndTime] = useState();
  const [bider, setBider] = useState();
  const [owner, setOwner] = useState();
  // refs
  const timeCountRef = useRef();

  // useEffect
  // 토큰의 json데이터 가져오기
  useEffect(() => {
    if (!tokenURI) return;
    (async () => {
      const jsonData = await axios.get(`${tokenURI}.json`);
      setAttributes(jsonData.data.attributes);
      setJsonData(jsonData.data);
    })();
  }, [tokenURI]);

  // 토큰경매정보들 업데이트
  useEffect(() => {
    if (!tokenInfo) return;
    const { endTime, lastBidPrice, bider } = tokenInfo;
    setEndTime(endTime);
    setBider(bider);
    if (!web3) return;
    setCurrentBid(web3.utils.fromWei(lastBidPrice + "", "ether"));
  }, [tokenInfo, web3]);

  // 경매남은시간
  useEffect(() => {
    if (!endTime) return;
    timeCountRef.current = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      setTimeCount(endTime - now);
    }, 1000);

    return () => {
      clearInterval(timeCountRef.current);
    };
  }, [endTime]);

  // 토큰owner
  useEffect(() => {
    if (!tokenContract || !tokenId) return;
    (async () => {
      const owner = await tokenContract.methods.ownerOf(tokenId).call();
      setOwner(owner);
    })();
  }, [tokenContract, tokenId]);

  if (!jsonData || timeCount < 0) return; //시간지난거 실시간으로 없애주기
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
          <h5>최고입찰가: {parseInt(bider, 16) === 0 ? "입찰자없음" : currentBid + " Eth"}</h5>
          <h5>
            남은시간: {timeCount ? (Math.floor(timeCount / 60 / 60) + "").padStart(2, "0") : "00"} :
            {timeCount ? " " + (Math.floor((timeCount / 60) % 60) + "").padStart(2, "0") : " 00"} :
            {timeCount ? " " + ((timeCount % 60) + "").padStart(2, "0") : " 00"}
          </h5>
          <div className="creator_info d-flex align-items-center justify-content-between">
            <div className="w-50">
              {/* <h6>Current Bid</h6>
            <p>{currentBid} ETH</p> */}
            </div>
          </div>

          {/* 주문하기 버튼 */}
          <div className=" mt-3 d-flex align-items-center justify-content-between">
            {/* 내가 올린 토큰은 구매버튼 안보이게 */}
            <button
              className="bid_btn d-flex align-items-center gap-1"
              onClick={() => setModal(true)}
              disabled={owner && account && owner.toLowerCase() === account.toLowerCase()}
              style={{
                opacity: owner && account && owner.toLowerCase() !== account.toLowerCase() ? 1 : 0,
              }}
            >
              <i className="ri-shopping-bag-fill"></i>
              입찰하기
            </button>
            {/* 주문하기 버튼 누르면 모달창 */}
            {moDal && (
              <Modal
                setModal={setModal}
                jsonData={jsonData}
                currentBid={currentBid}
                bider={bider}
                timeCount={timeCount}
                tokenId={tokenId}
              />
            )}
          </div>
        </div>
      </div>
    </Col>
  );
};

export default NftCard;
