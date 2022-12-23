import React from 'react';
import "../../styles/modal.css"

//NftCard.js에 전달
const Modal = ({setModal}) => {

  return (
    // 모달창 만들기
    <div className = "modal_wrapper">
        <div className="single_modal">
            <span className="close_modal">
                {/* x버튼 눌러야 모달창 꺼지게 하기 */}
            <i className="ri-close-circle-line" onClick={()=> setModal(false)}></i>
            </span>
            <h6 className="text-center text-light">Bid 주문</h6>
            <p className="text-center text-light">최소 Bid는 <span className="money">5.5 ETH</span> 입니다</p>

            <div className="input_item mb-4">
                <input type="number" placeholder='0.0 ETH' />
            </div>


            <div className="d-flex align-items-center justify-content-between">
                <p>최소Bid</p>
                <span className="money">0.8 ETH</span>
            </div>

            <div className="d-flex align-items-center justify-content-between">
                <p>수수료</p>
                <span className="money">0.8 ETH</span>
            </div>

            <div className="d-flex align-items-center justify-content-between">
                <p>총 Bid 금액</p>
                <span className="money">5.9 ETH</span>
            </div>

            <button className="place_bid_btn">
                입찰
            </button>

        </div>
    </div>
  )
}

export default Modal