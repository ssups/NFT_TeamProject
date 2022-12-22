import React, { useEffect, useRef, useState } from "react";

import useWeb3 from "../../hooks/useWeb3_j";
import useContract from "../../hooks/useContract_j";
import TestTokenContract from "../../contracts/TestToken.json";

const Minting = () => {
  //
  const [web3, account, balance] = useWeb3();

  // await 체크..
  const [owner, setOwner] = useState();
  const [mintPrice, setMintPrice] = useState();
  const [maxSupply, setMaxSupply] = useState();

  const [isMintOn, setIsMintOn] = useState(false);
  const [currentSupply, setCurrentSupply] = useState();
  const [maxAmountPerMint, setMaxAmountPerMint] = useState();

  const priceRef = useRef();
  const mintQuantityRef = useRef();

  const testTokenInstance = useContract(TestTokenContract);

  // ==========================================useEffect==========================================
  // =============================================================================================

  // 컨트랙트 인스턴스
  useEffect(() => {
    //
    if (!testTokenInstance) return;

    // event callback..
    // 민팅 시 총 발행량을 업데이트 하는 이벤트
    testTokenInstance.events.MintTestToken((err, data) => {
      setCurrentSupply(data.returnValues.totalSupply);
    });

    // 가격 변경 시 가격과 민팅 여부를 업데이트 하는 이벤트
    testTokenInstance.events.SetMintOn((err, data) => {
      //
      const price = data.returnValues.mintPrice;
      const priceToEth = web3.utils.fromWei(price, "ether");

      setMintPrice(priceToEth);
      setIsMintOn(data.returnValues.isMintOn);
    });

    (async () => {
      //
      const owner = await testTokenInstance.methods.owner().call();
      const isMintOn = await testTokenInstance.methods.isMintOn().call();
      const maxSupply = await testTokenInstance.methods.maxSupply().call();
      const maxAmountPerMint = await testTokenInstance.methods.maxAmountPerMint().call();

      setOwner(owner);
      setIsMintOn(isMintOn);
      setMaxSupply(maxSupply);
      setMaxAmountPerMint(maxAmountPerMint * 1);
    })();
  }, [testTokenInstance]);

  //
  // 민팅 시작
  useEffect(() => {
    //
    (async () => {
      //
      if (!isMintOn || !testTokenInstance) return;

      const totalSupply = await testTokenInstance.methods.totalSupply().call();
      const mintPrice = await testTokenInstance.methods.mintPrice().call();
      const priceToEth = web3.utils.fromWei(mintPrice, "ether");

      setCurrentSupply(totalSupply);
      setMintPrice(priceToEth);

      // tokenURI() 테스트..
      //
    })();
  }, [isMintOn, testTokenInstance]);

  // ==========================================functions==========================================
  // =============================================================================================

  // 민팅 가격 설정 (변경) 함수
  async function setMintOn(price) {
    //
    if (price <= 0) {
      alert("0 ether 이상의 금액을 설정해야 합니다.");
      return;
    }

    // 0.0000000000000000001 입력할 경우 에러 발생
    const adjustedPrice = web3.utils.toWei(price, "ether");
    //
    // from..
    testTokenInstance.methods.setMintOn(adjustedPrice).send({ from: account });
  }

  // 민팅 함수
  async function mintTestToken(quantity) {
    //
    const remainingSupply = maxSupply - currentSupply;
    const totalPayment = quantity * web3.utils.toWei(mintPrice, "ether");

    if (quantity <= 0) {
      alert("0개 이상의 수량을 설정해야 합니다.");
      return;
    }

    if (quantity > maxAmountPerMint) {
      alert("1회에 설정 가능한 민팅의 최대 수량은 3개입니다.");
      return;
    }

    if (quantity > remainingSupply) {
      alert("이 토큰에 설정된 최대 발행량을 초과합니다.");
      return;
    }

    if (balance < totalPayment) {
      alert("잔액이 부족합니다.");
      return;
    }

    try {
      // try-catch : require 에러 시
      // value : 이더 전송 금액
      await testTokenInstance.methods.mintTestToken(quantity).send({ from: account, value: totalPayment });
    } catch (err) {
      alert(err.message);
    }
  }

  // ===========================================returns===========================================
  // =============================================================================================

  if (!account) return <h1>메타마스크와 연결하세요.</h1>;

  console.log(account, owner);

  return (
    <div>
      {/* 배포자일 경우 */}
      {account?.toLowerCase() === owner?.toLowerCase() && (
        <div>
          {/* ref.. */}
          <input className="minting-price" type="number" ref={priceRef} placeholder="ether 단위" />
          <button onClick={() => setMintOn(priceRef.current.value)}>민팅 가격 설정</button>
        </div>
      )}

      <div>{isMintOn ? "민팅 가격 : " + mintPrice + " ether" : "민팅 시작 전"}</div>

      <div>
        {isMintOn ? currentSupply : 0} / {maxSupply}
      </div>

      {isMintOn && (
        <div>
          <input className="minting-quantity" type="text" ref={mintQuantityRef} disabled={currentSupply === maxSupply} />
          <button onClick={() => mintTestToken(mintQuantityRef.current.value * 1)} disabled={currentSupply === maxSupply}>
            Mint
          </button>
        </div>
      )}
    </div>
  );
};

export default Minting;
