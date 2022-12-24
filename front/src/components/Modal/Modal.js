import React, { useEffect, useState, memo, useContext, useRef } from "react";
import useSsandeContracts from "../../hooks/useSsandeContracts";
import "../../styles/modal.css";
import { Context } from "../../App";

//NftCard.js에 전달
const Modal = ({ setModal, jsonData, currentBid, bider, timeCount, tokenId }) => {
  const bidStep = 0.001;
  const minBid = Math.floor((currentBid * 1 + bidStep) * 1000) / 1000;
  // context
  const { account, web3, balance, tokenContract, tradeContract } = useContext(Context);
  // states
  const [data, setData] = useState();
  const [attributes, setAttributes] = useState();
  // refs
  const priceRef = useRef();
  //   console.log(timeCount);

  // useEffect
  useEffect(() => {
    // console.log(tradeContract.methods);
    // console.log(tokenId);
  }, []);

  // function
  async function bidOnAuction() {
    const price = priceRef.current.value;
    if (price < minBid) {
      alert("입찰액은 최소입찰액 이상으로 해야합니다.");
      return;
    }
    if (price % bidStep === 0) {
      alert("입찰액 단위는 0.001Eth 단위여야 합니다.");
      return;
    }
    if (timeCount <= 0) {
      alert("경매가 마감되었습니다");
      return;
    }

    const priceToWei = web3.utils.toWei(price, "ether");
    console.group(priceToWei);
    await tradeContract.methods
      .bidOnAcution(tokenId)
      .send({ from: account, value: priceToWei })
      .then(success => {
        alert("입찰에 성공하셨습니다");
        setModal(false);
      });
  }

  return (
    // 모달창 만들기
    <div className="modal_wrapper">
      <div className="single_modal">
        <span className="close_modal">
          {/* x버튼 눌러야 모달창 꺼지게 하기 */}
          <i className="ri-close-circle-line" onClick={() => setModal(false)}></i>
        </span>
        <h3 className="text-center text-light" style={{ marginBottom: "25px" }}>
          경매 입찰
        </h3>
        {/* <p className="text-center text-light">
          최소 Bid는 <span className="money">5.5 ETH</span> 입니다
        </p> */}
        <fieldset id="attributes" style={{ marginBottom: "30px" }}>
          <legend style={{ color: "white", marginBottom: "15px" }}>attributes</legend>
          {jsonData.attributes.map(attribute => {
            return (
              <div
                className="d-flex align-items-center justify-content-between"
                style={{ fontSize: "5px", height: "20px" }}
                key={attribute.trait_type}
              >
                <p>{attribute.trait_type}</p>
                <span className="money" style={{ color: attribute.value }}>
                  {attribute.value}
                </span>
              </div>
            );
          })}
        </fieldset>
        <div className="d-flex align-items-center justify-content-between">
          <p>최고입찰자</p>
          <span className="money">
            {" "}
            {parseInt(bider, 16) === 0
              ? "입찰자없음"
              : bider.slice(0, 6) + "......" + bider.slice(bider.length - 6, bider.length)}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <p>입찰액 단위</p>
          <span className="money">{bidStep} ETH</span>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <p>최소 입찰액</p>
          <span className="money">{minBid} ETH</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div className="input_item" style={{}}>
            <input
              type="number"
              placeholder="0.0 ETH"
              step={bidStep}
              defaultValue={minBid}
              min={minBid}
              ref={priceRef}
            />
          </div>
          <button className="place_bid_btn" style={{ margin: 0 }} onClick={bidOnAuction}>
            입찰
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
// 상위컴포넌트의 setinterval때문에 계속 리렌더링되는거 방지
