import React, { useEffect, useRef, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import TestTokenContract from "../../contracts/TestToken.json";

const Minseop = () => {
  const [account, web3, balance] = useWeb3();
  const [owner, setOwner] = useState();
  const [deployed, setDeployed] = useState();
  const [isMintOn, setIsMintOn] = useState();
  const [mintPrice, setMintPrice] = useState();
  const [maxAmountPerMint, setMaxAmountPerMint] = useState();
  const [currentSupply, setCurrentSupply] = useState();
  const [maxSupply, setMaxSupply] = useState();
  const priceRef = useRef();
  const mintQuantityRef = useRef();

  useEffect(() => {
    (async () => {
      if (!web3) return;
      // 배포된 컨트렉트 가져오기
      const networkId = await web3.eth.net.getId();
      const TestTokenInstance = await new web3.eth.Contract(
        TestTokenContract.abi,
        TestTokenContract.networks[networkId].address
      );
      console.log(TestTokenInstance);
      setDeployed(TestTokenInstance);

      // owner계정 가져오기
      const ownerAccount = await TestTokenInstance.methods.owner().call();
      // console.log(ownerAccount);
      setOwner(ownerAccount);
      // 민팅 진행중인지 확인
      const mintState = await TestTokenInstance.methods.isMintOn().call();
      setIsMintOn(mintState);
      // 민트 한번에 최대갯수 가져오기
      const maxAmount = await TestTokenInstance.methods.maxAmountPerMint().call();
      setMaxAmountPerMint(maxAmount);
      // 총 발행량 가져오기
      const collectionSize = await TestTokenInstance.methods.maxSupply().call();
      setMaxSupply(collectionSize);
      console.log(collectionSize);
    })();
  }, [web3]);

  // 컨트렉트랑 연결되면 실행시킬것들
  useEffect(() => {
    if (!deployed) return;
    // 누군가 민팅할때마다 현재공급량 고쳐주기
    deployed.events.MintTestToken((err, data) => {
      setCurrentSupply(data.returnValues.totalSupply);
    });
  }, [deployed]);

  // 민팅 시작되면 가져올 값들
  useEffect(() => {
    (async () => {
      if (!isMintOn) return;
      // 민팅가격
      const price = await deployed.methods.mintPrice().call();
      const priceToEth = web3.utils.fromWei(price, "ether");
      setMintPrice(priceToEth);

      // 현재 발행량
      const supplyAmount = await deployed.methods.totalSupply().call();
      setCurrentSupply(supplyAmount);

      // 토큰URI 테스트용
      //   const tokeUri = await deployed.methods.tokenURI(1).call();
      //   console.log(tokeUri);
    })();
  }, [isMintOn, deployed]);

  // 민팅 시작시키기(owner만 실행가능)
  async function startMint(price) {
    if (!price > 0) {
      alert("가격다시");
      return;
    }
    const adjustedPrice = web3.utils.toWei(price, "ether");
    deployed.methods.setMintOn(adjustedPrice).send({ from: account });
  }

  // 민팅하기
  async function mint(quantity) {
    if (!quantity > 0) {
      alert("수량 0개이상");
      return;
    }
    if (quantity * 1 > maxAmountPerMint * 1) {
      alert("민트한번당 최대갯수 3개입니다");
      return;
    }
    const totalPayment = quantity * web3.utils.toWei(mintPrice, "ether");
    if (totalPayment > balance) {
      alert("잔액부족");
      return;
    }

    try {
      await deployed.methods.mintTestToken(quantity).send({ from: account, value: totalPayment });
    } catch (err) {
      const error = new Error(err.message);
      alert(error);
    }
  }

  if (!account) return <h1>메타마스크 연결하세요</h1>;
  return (
    <div>
      {account?.toLowerCase() === owner?.toLowerCase() && (
        <div>
          <input type="number" ref={priceRef} />
          <button onClick={() => startMint(priceRef.current.value)}>
            민팅시작하기 , 민팅가격 바꾸기
          </button>
        </div>
      )}
      <div>{isMintOn ? "민팅진행중 가격: " + mintPrice : "민팅시작전"}</div>
      <div>
        {isMintOn ? currentSupply : 0} / {maxSupply}{" "}
      </div>
      {isMintOn && (
        <div>
          <input type="text" ref={mintQuantityRef} />
          <span></span>
          <button onClick={() => mint(mintQuantityRef.current.value)}>Mint</button>
        </div>
      )}
    </div>
  );
};

export default Minseop;
