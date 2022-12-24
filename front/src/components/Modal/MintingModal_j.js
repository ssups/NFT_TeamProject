import React, { useContext, useEffect, useRef, useState } from 'react';

// createContext 경로
import { Context } from "../../App";
import "../../styles/modal.css";

// 민팅 하기 버튼 클릭시 발생하는 모달 창으로
// 민팅 기능 구현할 예정

// 배포자이며서 민팅의 가격을 미설정 했을 경우
// 가격을 설정하는 기능 구현

// 최대 발행 수량 초과 시 민팅 불가 안내

// 1. 메타마스트 연결 확인
// 2. 배포자인지 확인
// 3. 민팅 가격이 설정되었는지 확인

// isOwner, balance 값은 상위 컴포넌트에서 전달할 예정
const MintingModal = ({ setModal }) => {
    // 
    // 삭제할 예정
    const [isOwner, setIsOwner] = useState(false);
    const { account, balance } = useContext(Context);

    const { web3, tokenContract } = useContext(Context);

    const _mintingPrice = useRef();
    const _mintingQuantity = useRef();

    // 초기값 undefined
    const [isMintOn, setIsMintOn] = useState();
    const [maxSupply, setMaxSupply] = useState();
    const [maxMinting, setMaxMinting] = useState();
    const [totalSupply, setTotalSupply] = useState();
    const [mintingPrice, setMintingPrice] = useState();

    // ==========================================functions==========================================
    // =============================================================================================

    // 배포자인지 확인하는 함수
    async function isOwnerFn() {
        const owner = await tokenContract.methods.owner().call();
        return owner.toLowerCase() === account.toLowerCase();
    }

    // 민팅의 가격 설정 여부 확인 함수
    async function isMintOnFn() {
        return await tokenContract.methods.isMintOn().call();
    }

    // 민팅의 가격을 설정하는 함수
    async function setMintOnFn() {

        const _price = _mintingPrice.current.value;

        if (_price <= 0) {
            alert("0 ether 이상의 금액을 설정해야 합니다.");
            return;
        }

        // wei 단위로 변환
        const price = web3.utils.toWei(_price, "ether");

        if (price === mintingPrice) {
            alert("이미 설정된 가격과 동일합니다.");
            return;
        }

        await tokenContract.methods.setMintOn(price).send({ from: account });
        alert("가격 설정 완료!");
    }

    // 블록체인 상에 설정된 민팅 가격 조회 함수
    async function getMintingPriceFn() {
        return await tokenContract.methods.mintPrice().call();
    }

    // 한 번에 민팅 가능한 최대 수량 조회 함수
    async function getMaxMintingFn() {
        return await tokenContract.methods.maxAmountPerMint().call();
    }

    // 토큰의 최대 발행량 조회 함수
    async function getMaxSupplyFn() {
        return await tokenContract.methods.maxSupply().call();
    }

    // 토큰의 현재 발행량 조회 함수
    async function getTotalSupplyFn() {
        return await tokenContract.methods.totalSupply().call();
    }

    // 민팅 함수
    async function mintFn() {

        console.log(_mintingQuantity);

        const quantity = _mintingQuantity.current.value;

        if (quantity <= 0) {
            alert("0개 이상의 수량을 입력해야 합니다.");
            return;
        }

        if (quantity > maxMinting) {
            alert(`한번에 민팅 가능한 수량은 최대 ${maxMinting}개입니다.`);
            return;
        }

        if (quantity > maxSupply - totalSupply) {
            alert("최대 발행 수량을 초과할 수 없습니다.");
            return;
        }

        // wei 단위
        const payment = mintingPrice * quantity;
        if (balance < payment) {
            alert("잔액이 부족합니다.");
            return;
        }

        // require..
        await tokenContract.methods.mintTestToken(quantity).send({ from: account, value: payment });
        alert(`민팅 ${quantity}개 성공!`);
    }

    // ==========================================useEffect==========================================
    // =============================================================================================

    //
    useEffect(() => {
        //
        // 초기값
        console.log(account);

        if (!account) return;

        (async () => {
            setIsOwner(await isOwnerFn());
        })();

    }, [account])

    //
    useEffect(() => {
        //
        // 초기값
        console.log(tokenContract);

        if (!tokenContract) return;

        (async () => {
            //
            setIsMintOn(await isMintOnFn());
            setMaxSupply(await getMaxSupplyFn());
            setMaxMinting(await getMaxMintingFn());
            setTotalSupply(await getTotalSupplyFn());
        })();

        console.log(window.ethereum);
        //
        if (!window.ethereum._events[""]) {
            //
            // event..
            // 민팅 가격 설정 이벤트
            tokenContract.events.SetMintOn((err, data) => {
                //
                console.log(err);
                const price = data.returnValues.mintPrice;
                const priceToEth = web3.utils.fromWei(price, "ether");

                setMintingPrice(priceToEth);
            });

            // 민팅 시 현재 발행량 업데이트
            tokenContract.events.MintTestToken((err, data) => {
                setTotalSupply(data.returnValues.totalSupply);
            });
        }

    }, [tokenContract]);

    //
    useEffect(() => {
        //
        if (!isMintOn) return;

        (async () => setMintingPrice(await getMintingPriceFn()))();
        
    }, [isMintOn]);

    //
    // ===========================================returns===========================================
    // =============================================================================================

    return (
        <div className="modal_wrapper">
            <div className="single_modal">

                <span className="close_modal">
                    <i className="ri-close-circle-line" onClick={() => setModal(false)}></i>
                </span>

                <h6 className="text-center text-light">💎 SSAN DE NFT MINTING 💎</h6>

                {!isMintOn &&
                    <p className="text-center text-light">민팅 가격이 설정되지 않아 민팅을 진행할 수 없습니다.</p>
                }

                {isOwner &&
                    totalSupply !== maxSupply &&
                    <>
                        <p className="text-center text-light">배포자님, 민팅 가격을 설정하시겠습니까?</p>

                        <div className="input_item mb-4">
                            <input type="number" placeholder='ether 단위로 입력해주세요.' ref={_mintingPrice} />
                        </div>

                        <button className="place-minting-btn" onClick={setMintOnFn}>
                            민팅 가격 설정
                        </button>
                    </>
                }

                {isMintOn &&
                    totalSupply !== maxSupply &&
                    <>
                        <p className="text-center text-light">한 번에 '{maxMinting}개'까지 민팅 가능합니다.<br />1개를 민팅하는 데 발생하는 가스비만으로,<br />무려 {maxMinting}개를 민팅할 수 있다는 게 사실? 사실!</p>
                        <p className="text-center text-light">민팅 1개당 가격 : {mintingPrice && web3.utils.fromWei(mintingPrice, "ether")} ether</p>
                        <p className="text-center text-light">현재 발행량 : {totalSupply}</p>
                        <p className="text-center text-light">최대 발행량 : {maxSupply}</p>

                        <div className="input_item mb-4">
                            <input type="number" placeholder='한 번에 민팅할 개수를 입력하세요.' min={1} max={maxMinting} ref={_mintingQuantity} />
                        </div>

                        <button className="place-minting-btn" onClick={mintFn}>
                            민팅
                        </button>
                    </>
                }

                {isMintOn &&
                    totalSupply === maxSupply &&
                    <p className="text-center text-light">최대 발행 수량을 초과하여 더 이상의 민팅이 불가합니다.</p>
                }

            </div>
        </div>
    )
}

export default MintingModal;