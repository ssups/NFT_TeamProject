import React, { useContext, useEffect, useRef, useState } from 'react';
import "../../styles/modal.css"

import { Context } from "../../App";

const MyPageModal = ({ title, setModal, tokenId }) => {
    //
    const { web3, account, tradeContract } = useContext(Context);

    const _salePrice = useRef();
    const _bidPrice = useRef();
    const _endTime = useRef();

    const [saleFee, setSaleFee] = useState();
    const [incomeAfterFee, setIncomeAfterFee] = useState();

    // ==========================================functions==========================================
    // =============================================================================================

    // 판매 상품으로 등록하는 함수
    async function registerSaleToken() {
        //
        let salePrice = _salePrice.current.value;
        if (salePrice <= 0) {
            alert("0 이더 이하의 금액은 설정할 수 없습니다.");
            return;
        }

        salePrice = web3.utils.toWei(salePrice, "ether");

        await tradeContract.methods.registerForSale(tokenId, salePrice).send({ from: account });
        alert("판매 상품으로 등록이 완료되었습니다.");
    }

    // 경매 상품으로 등록하는 함수
    async function registerAuctionToken() {
        //
        // 타임스탬프 값..
        let endTime = _endTime.current.value;
        //
        // 소수점 단위..
        let bidPrice = _bidPrice.current.value;
        bidPrice = web3.utils.toWei(bidPrice, "ether");

        await tradeContract.methods.registerForAuction(tokenId, bidPrice, endTime).send({ from: account });
        alert("경매 상품으로 등록이 완료되었습니다.");
    }

    async function getSaleFeeFn() {
        return await tradeContract.methods.getSaleFee(tokenId).call();
    }

    async function getIncomeAfterFeeFn() {
        return await tradeContract.methods.getIncomeAfterFee(tokenId).call();
    }

    // ==========================================useEffect==========================================
    // =============================================================================================

    useEffect(() => {
        //
        if (!tradeContract || !account) return;

        (async () => {
            //
            setSaleFee(await getSaleFeeFn());
            setIncomeAfterFee(await getIncomeAfterFeeFn());
        })();
    }, [tradeContract, account])

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
                            <input type="number" placeholder='판매가를 ether 단위로 입력해주세요.' ref={_salePrice} min={0} />
                        </div>

                        <p className="text-center text-light">판매 완료 시 정산금 : {incomeAfterFee}</p>
                        <p className="text-center text-light">판매 완료 시 발생하는 수수료 : {saleFee}</p>

                        <button className="place-minting-btn" onClick={registerSaleToken}>
                            판매 등록
                        </button>
                    </>
                }

                {title === "경매 상품으로 등록하기" &&
                    <>
                        <div className="input_item mb-4">
                            <input type="number" placeholder='최소 입찰가를 ether 단위로 입력해주세요.' ref={_bidPrice} min={0} />
                            <select>dsf
                                {Array.from({ length: 24 }, (index, value) => index + 1).map((hour) => <option value={hour}></option>)}
                            </select>
                            <select type="number" placeholder='경매 진행 시간을 1 ~ 24 시간으로 선택해주세요.' ref={_endTime} min={1} max={24} />
                            {/* <input type="number" placeholder='경매 진행 시간을 1 ~ 24 시간으로 선택해주세요.' ref={_endTime} min={1} max={24} /> */}
                        </div>

                        <p className="text-center text-light">경매 낙찰 시 정산금 : {incomeAfterFee}</p>
                        <p className="text-center text-light">경매 낙찰 시 발생하는 수수료 : {saleFee}</p>

                        <button className="place-minting-btn" onClick={registerAuctionToken}>
                            경매 등록
                        </button>
                    </>
                }

            </div>
        </div>
    )
}

export default MyPageModal;