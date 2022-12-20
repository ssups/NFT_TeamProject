import React, { useEffect, useRef, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import TestTokenContract from "../../contracts/TestToken.json";

const Minseop = () => {
  const [account, web3] = useWeb3();
  const [owner, setOwner] = useState();
  const [deployed, setDeployed] = useState();
  const [isMintOn, setIsMintOn] = useState();
  const [maxAmountPerMint, setMaxAmountPerMint] = useState();
  const priceRef = useRef();
  const mintQuantityRef = useRef();

  useEffect(() => {
    (async () => {
      if (!account) return;
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
      //
    })();
  }, [account]);

  async function startMint(price) {
    if (!price > 0) {
      alert("가격다시");
      return;
    }
    const adjustedPrice = price * web3.utils.toWei(price, "ether");
    deployed.methods.setMintOn(adjustedPrice).send({ from: account });
  }

  async function mint(quantity) {
    if (!quantity > 0) {
      alert("수량 0개이상");
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
      <div>{isMintOn ? "민팅진행중" : "민팅시작전"}</div>
      <div>
        <input type="text" ref={mintQuantityRef} />
        <span></span>
        <button onClick={() => mint(mintQuantityRef)}>Mint</button>
      </div>
    </div>
  );
};

export default Minseop;
