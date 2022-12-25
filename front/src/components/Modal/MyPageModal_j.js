import React, { useContext, useRef, useState } from 'react';
import "../../styles/modal.css"

import { Context } from "../../App";

const MyPageModal = ({ title, setModal, tokenId }) => {
    //
    const { web3, account, tradeContract } = useContext(Context);

    // 발표를 위해 분 단위로 select option 설정
    const _endTime = useRef();
    const _transactionPrice = useRef();

    const [transactionFee, setTransactionFee] = useState();
    const [incomeAfterFee, setIncomeAfterFee] = useState();

    // ==========================================functions==========================================
    // =============================================================================================

    // 판매가 및 최소 입찰가의 입력에 따른 수수료 및 정산금 조회 함수
    async function changeAmountFn() {
        //
        // 버튼 기능을 위해서 e.target.value 값이 아닌 ref 사용
        const transactionPrice = _transactionPrice.current.value;

        setTransactionFee(await getTransactionFeeFn(transactionPrice));
        setIncomeAfterFee(await getIncomeAfterFeeFn(transactionPrice));
    }

    // 판매 상품으로 등록하는 함수
    async function registerSaleToken() {
        //
        let salePrice = _transactionPrice.current.value;
        if (salePrice <= 0) {
            alert("0 이더 이하의 금액은 설정할 수 없습니다.");
            return;
        }

        const registerMsg = `${salePrice} ether로 등록하시겠습니까?`;
        if (!window.confirm(registerMsg)) return;

        salePrice = web3.utils.toWei(salePrice, "ether");

        await tradeContract.methods.registerForSale(tokenId, salePrice).send({ from: account });
        alert("판매 상품으로 등록이 완료되었습니다.");
    }

    // 경매 상품으로 등록하는 함수
    async function registerAuctionToken() {
        //
        const endTime = _endTime.current.value;
        //
        const decimals = 3;
        let bidPrice = _transactionPrice.current.value;
        bidPrice = Math.trunc(bidPrice * 10 ** decimals) / 10 ** decimals;

        if (bidPrice < 1 / 10 ** decimals) {
            alert("최소 단위인 0.001 ether보다 작은 금액은 설정할 수 없습니다.");
            return;
        }

        const registerMsg = `${bidPrice} ether로 등록하시겠습니까?`;
        if (!window.confirm(registerMsg)) return;

        bidPrice = web3.utils.toWei(bidPrice.toString(), "ether");

        await tradeContract.methods.registerForAuction(tokenId, bidPrice, endTime).send({ from: account });
        alert("경매 상품으로 등록이 완료되었습니다.");
    }

    // 판매 및 경매 상품으로 등록할 경우의 수수료 조회 함수
    async function getTransactionFeeFn(price) {
        price = web3.utils.toWei(price, "ether");
        const amount = await tradeContract.methods.calculateFee(price).call();
        return web3.utils.fromWei(amount, "ether");
    }
    
    // 판매 및 경매 상품으로 등록할 경우의 정산금 조회 함수
    async function getIncomeAfterFeeFn(price) {
        price = web3.utils.toWei(price, "ether");
        const amount = await tradeContract.methods.afterFee(price).call();
        return web3.utils.fromWei(amount, "ether");
    }

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
                            <p className="text-center text-light">판매가를 ether 단위로 입력해주세요.</p>
                            <input type="number" ref={_transactionPrice} onChange={changeAmountFn} />
                        </div>

                        <p className="text-center text-light">판매 완료 시 정산금 : {incomeAfterFee ? incomeAfterFee + " ether" : "0 ether"}</p>
                        <p className="text-center text-light">판매 완료 시 발생하는 수수료 : {transactionFee ? transactionFee + " ether" : "0 ether"}</p>

                        <button className="place-minting-btn" onClick={registerSaleToken}>
                            판매 등록
                        </button>
                    </>
                }

                {title === "경매 상품으로 등록하기" &&
                    <>
                        <div className="input_item mb-4">

                            <p className="text-center text-light">최소 입찰가를 ether 단위로 입력해주세요.</p>
                            <input type="number" placeholder='최소 단위 0.001' ref={_transactionPrice} onChange={changeAmountFn} />
                            
                            <p className="text-center text-light">경매 진행 시간을 1 ~ 30 분 중에서 선택해주세요.</p>
                            <select ref={_endTime}>
                                {Array.from({ length: 30 }, (value, index) => index + 1).map((minute) => <option key={minute}value={minute}>{minute}분</option>)}
                            </select>

                        </div>

                        <p className="text-center text-light">경매 낙찰 시 정산금 : {incomeAfterFee ? incomeAfterFee + " ether" : "0 ether"}</p>
                        <p className="text-center text-light">경매 낙찰 시 발생하는 수수료 : {transactionFee ? transactionFee + " ether" : "0 ether"}</p>

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