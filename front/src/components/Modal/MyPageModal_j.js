import React, { useRef } from 'react';
import "../../styles/modal.css"

const MyPageModal = ({ title, setModal }) => {
    //
    const _salePrice = useRef();
    const _bidPrice = useRef();
    const _endTime = useRef();

    // ===========================================returns===========================================
    // =============================================================================================

    return (
        <div className="modal_wrapper">
            <div className="single_modal">

                <span className="close_modal">
                    <i className="ri-close-circle-line" onClick={() => setModal(false)}></i>
                </span>

                <h6 className="text-center text-light">{title}</h6>

                {title === "판매 상품으로 등록하기" &&
                    <>
                        <div className="input_item mb-4">
                            <input type="number" placeholder='판매가를 입력해주세요.' ref={_salePrice} />
                        </div>

                        <p className="text-center text-light">판매 완료 시 수익금 : {""}</p>
                        <p className="text-center text-light">판매 완료 시 발생하는 수수료 : {""}</p>

                        <button className="place-minting-btn" onClick={""}>
                            판매 등록
                        </button>
                    </>
                }

                {title === "경매 상품으로 등록하기" &&
                    <>
                        <div className="input_item mb-4">
                            <input type="number" placeholder='최소 입찰가를 입력해주세요.' ref={_bidPrice} />
                            <input type="number" placeholder='경매 진행 시간을 선택해주세요.' ref={_endTime} />
                        </div>

                        <p className="text-center text-light">경매 완료 시 수익금 : {""}</p>
                        <p className="text-center text-light">경매 완료 시 발생하는 수수료 : {""}</p>

                        <button className="place-minting-btn" onClick={""}>
                            경매 등록
                        </button>
                    </>
                }

            </div>
        </div>
    )
}

export default MyPageModal;