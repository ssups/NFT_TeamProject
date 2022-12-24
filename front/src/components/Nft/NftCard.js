import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import useSsandeContracts from "../../hooks/useSsandeContracts";
import axios from "axios";
import { Context } from "../../App";

const NftCard = ({ tokenId, tokenURI }) => {
  // hooks
  const [testTokenInstance, testTradeInstance] = useSsandeContracts();
  const { account, web3, balance } = useContext(Context);
  // states
  const [jsonData, setJsonData] = useState();
  const [attributes, setAttributes] = useState();
  const [moDal, setModal] = useState(false);
  const [bider, setBider] = useState();
  const [endTime, setEndTime] = useState();
  const [timeCount, setTimeCount] = useState();
  const [lastBidPrice, setLastBidPrice] = useState();
  const [owner, setOwner] = useState();
  // refs
  const timeCountRef = useRef();

  // useEffect
  // 토큰의 json데이터 가져오기
  useEffect(() => {
    (async () => {
      const jsonData = await axios.get(`${tokenURI}.json`);
      setAttributes(jsonData.data.attributes);
      setJsonData(jsonData.data);
    })();
  }, []);

  // 토큰의 경매정보 가져오기
  useEffect(() => {
    if (!testTradeInstance || !web3) return;
    console.log(testTradeInstance.methods);
    (async () => {
      const { bider, endTime, lastBidPrice } = await testTradeInstance.methods
        .dataOfOnAuction(tokenId)
        .call();
      setBider(bider);
      setEndTime(endTime);
      setLastBidPrice(web3.utils.fromWei(lastBidPrice, "ether"));
    })();
  }, [testTradeInstance, web3]);

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
    if (!testTokenInstance) return;
    (async () => {
      const owner = await testTokenInstance.methods.ownerOf(tokenId).call();
      setOwner(owner);
    })();
  }, [testTokenInstance]);

  if (jsonData && timeCount >= 0)
    return (
      <div className="single_nft">
        <div className="nft_img">
          <img src={jsonData.image} className="w-100" alt="" />
        </div>

        {/* 카드 상태창 */}
        <div className="nft_content">
          <h5 className="nft_title">
            <Link to={`/shop/${tokenId}`}>{jsonData.name}</Link>
          </h5>
          <h5>현재입찰가: {lastBidPrice} Eth</h5>
          <h5>
            남은시간: {(Math.floor(timeCount / 60 / 60) + "").padStart(2, "0")} :
            {(Math.floor((timeCount / 60) % 60) + "").padStart(2, "0")} :{" "}
            {((timeCount % 60) + "").padStart(2, "0")}
          </h5>
          <div className="creator_info d-flex align-items-center justify-content-between">
            <div className="w-50">
              {/* <h6>Current Bid</h6>
            <p>{currentBid} ETH</p> */}
            </div>
          </div>

          {/* 주문하기 버튼 */}
          <div className=" mt-3 d-flex align-items-center justify-content-between">
            {owner && account && owner.toLowerCase() !== account.toLowerCase() && (
              <button
                className="bid_btn d-flex align-items-center gap-1"
                onClick={() => setModal(true)}
                disabled={owner && account && owner.toLowerCase() === account.toLowerCase()}
              >
                <i className="ri-shopping-bag-fill"></i>
                입찰하기
              </button>
            )}

            {/* 주문하기 버튼 누르면 모달창 */}
            {moDal && <Modal setModal={setModal} />}
          </div>
        </div>
      </div>
    );
};

export default NftCard;
