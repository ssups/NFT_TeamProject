import React from 'react';

import "../../styles/modal.css";

const MintingModal = ({ setModal }) => {
    //
    return (
        <div className="modal_wrapper">
            <div className="single_modal">

                <span className="close_modal">
                    <i className="ri-close-circle-line" onClick={() => setModal(false)}></i>
                </span>

                <h6 className="text-center text-light">💎 SSAN DE NFT MINTING 💎</h6>
                <p className="text-center text-light">한 번에 '3개'까지 민팅 가능합니다.<br/>1개를 민팅하는 데 발생하는 가스비만으로,<br/>무려 3개를 민팅할 수 있다는 게 사실? 사실!</p>

                <div className="input_item mb-4">
                    <input type="number" placeholder='한 번에 민팅할 개수를 입력하세요.' min={1} max={3}/>
                </div>

                <button className="place-minting-btn">
                    민팅
                </button>

            </div>
        </div>
    )
}

export default MintingModal;