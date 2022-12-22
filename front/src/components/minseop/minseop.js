<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import useWeb3 from "../../hooks/useWeb3";
import TestTokenContract from "../../contracts_seop/TestToken.json";
import useContract from "../../hooks/useContract";

const Minseop = () => {
  // hooks
  const [account, web3, balance] = useWeb3();
  const netWorkId = 7722;
  const testTokenInstance = useContract(
    TestTokenContract.abi,
    TestTokenContract.networks[netWorkId].address
  );
  // states
  const [owner, setOwner] = useState();
  const [isMintOn, setIsMintOn] = useState();
  const [mintPrice, setMintPrice] = useState();
  const [maxAmountPerMint, setMaxAmountPerMint] = useState();
  const [currentSupply, setCurrentSupply] = useState();
  const [maxSupply, setMaxSupply] = useState();
  // ref
  const priceRef = useRef();
  const mintQuantityRef = useRef();
=======
// import React, { useEffect, useRef, useState } from "react";
// import useWeb3 from "../../hooks/useWeb3";
// import TestTokenContract from "../../contracts_seop/TestToken.json";

// const Minseop = () => {
//   const [account, web3, balance] = useWeb3();
//   const [owner, setOwner] = useState();
//   const [deployed, setDeployed] = useState();
//   const [isMintOn, setIsMintOn] = useState();
//   const [mintPrice, setMintPrice] = useState();
//   const [maxAmountPerMint, setMaxAmountPerMint] = useState();
//   const [currentSupply, setCurrentSupply] = useState();
//   const [maxSupply, setMaxSupply] = useState();
//   const priceRef = useRef();
//   const mintQuantityRef = useRef();
>>>>>>> main

//   // ==========================================useEffect==========================================
//   // =============================================================================================

<<<<<<< HEAD
  // 컨트렉트랑 연결되면 실행시킬것들
  useEffect(() => {
    if (!testTokenInstance) return;
    // 누군가 민팅할때마다 현재공급량 고쳐주기(이벤트)
    testTokenInstance.events.MintTestToken((err, data) => {
      setCurrentSupply(data.returnValues.totalSupply);
    });
    // 민팅시작되거나 가격바뀌면 실행(이벤트)
    testTokenInstance.events.SetMintOn((err, data) => {
      const price = data.returnValues.mintPrice;
      const priceToEth = web3.utils.fromWei(price, "ether");
      setMintPrice(priceToEth);
      setIsMintOn(data.returnValues.isMintOn);
    });

    (async () => {
      // owner계정 가져오기
      const ownerAccount = await testTokenInstance.methods.owner().call();
      setOwner(ownerAccount);
      // 민팅 진행중인지 확인
      const mintState = await testTokenInstance.methods.isMintOn().call();
      setIsMintOn(mintState);
      // 민트 한번에 최대갯수 가져오기
      const maxAmount = await testTokenInstance.methods.maxAmountPerMint().call();
      setMaxAmountPerMint(maxAmount * 1);
      // 총 발행량 가져오기
      const collectionSize = await testTokenInstance.methods.maxSupply().call();
      setMaxSupply(collectionSize);
      // 가지고있는토큰 확인하는거 테스트
      // const tokensOfOwner = await testTokenInstance.methods.tokensOfOwner(account).call();
      // console.log(tokensOfOwner);
    })();
  }, [testTokenInstance]);

  // 민팅 시작되면 가져올 값들
  useEffect(() => {
    (async () => {
      if (!(isMintOn && testTokenInstance)) return;
      // 민팅가격
      const price = await testTokenInstance.methods.mintPrice().call();
      const priceToEth = web3.utils.fromWei(price, "ether");
      setMintPrice(priceToEth);

      // 현재 발행량
      const supplyAmount = await testTokenInstance.methods.totalSupply().call();
      setCurrentSupply(supplyAmount);

      // 토큰URI 테스트용
      //   const tokeUri = await testTokenInstance.methods.tokenURI(1).call();
      //   console.log(tokeUri);
    })();
  }, [isMintOn, testTokenInstance]);
=======
//   useEffect(() => {
//     (async () => {
//       if (!web3) return;
//       // 배포된 컨트렉트 가져오기
//       const networkId = await web3.eth.net.getId();
//       const TestTokenInstance = await new web3.eth.Contract(
//         TestTokenContract.abi,
//         TestTokenContract.networks[networkId].address
//       );
//       console.log(TestTokenInstance);
//       setDeployed(TestTokenInstance);

//       // owner계정 가져오기
//       const ownerAccount = await TestTokenInstance.methods.owner().call();
//       setOwner(ownerAccount);
//       // 민팅 진행중인지 확인
//       const mintState = await TestTokenInstance.methods.isMintOn().call();
//       setIsMintOn(mintState);
//       // 민트 한번에 최대갯수 가져오기
//       const maxAmount = await TestTokenInstance.methods.maxAmountPerMint().call();
//       setMaxAmountPerMint(maxAmount * 1);
//       // 총 발행량 가져오기
//       const collectionSize = await TestTokenInstance.methods.maxSupply().call();
//       setMaxSupply(collectionSize);
//     })();
//   }, [web3]);

//   // 컨트렉트랑 연결되면 실행시킬것들
//   useEffect(() => {
//     if (!deployed) return;
//     // 누군가 민팅할때마다 현재공급량 고쳐주기(이벤트)
//     deployed.events.MintTestToken((err, data) => {
//       setCurrentSupply(data.returnValues.totalSupply);
//     });
//     // 민팅시작되거나 가격바뀌면 실행(이벤트)
//     deployed.events.SetMintOn((err, data) => {
//       const price = data.returnValues.mintPrice;
//       const priceToEth = web3.utils.fromWei(price, "ether");
//       setMintPrice(priceToEth);
//       setIsMintOn(data.returnValues.isMintOn);
//     });

//     // 가지고있는토큰 확인하는거 테스트
//     (async () => {
//       const tokensOfOwner = await deployed.methods.tokensOfOwner(account).call();
//       console.log(tokensOfOwner);
//     })();
//   }, [deployed]);

//   // 민팅 시작되면 가져올 값들
//   useEffect(() => {
//     (async () => {
//       if (!(isMintOn && deployed)) return;
//       // 민팅가격
//       const price = await deployed.methods.mintPrice().call();
//       const priceToEth = web3.utils.fromWei(price, "ether");
//       setMintPrice(priceToEth);

//       // 현재 발행량
//       const supplyAmount = await deployed.methods.totalSupply().call();
//       setCurrentSupply(supplyAmount);

//       // 토큰URI 테스트용
//       //   const tokeUri = await deployed.methods.tokenURI(1).call();
//       //   console.log(tokeUri);
//     })();
//   }, [isMintOn, deployed]);
>>>>>>> main

//   // =============================================================================================
//   // =============================================================================================

//   // ==========================================functions==========================================
//   // =============================================================================================

<<<<<<< HEAD
  // 민팅 시작시키기(owner만 실행가능)
  async function startMint(price) {
    if (!price > 0) {
      alert("가격다시");
      return;
    }
    const adjustedPrice = web3.utils.toWei(price, "ether");
    testTokenInstance.methods.setMintOn(adjustedPrice).send({ from: account });
  }
=======
//   // 민팅 시작시키기(owner만 실행가능)
//   async function startMint(price) {
//     if (!price > 0) {
//       alert("가격다시");
//       return;
//     }
//     const adjustedPrice = web3.utils.toWei(price, "ether");
//     deployed.methods.setMintOn(adjustedPrice).send({ from: account });
//   }
>>>>>>> main

//   // 민팅하기
//   async function mint(quantity) {
//     const remainingAmount = maxSupply - currentSupply;
//     const totalPayment = quantity * web3.utils.toWei(mintPrice, "ether");
//     if (!quantity > 0) {
//       alert("수량 0개이상");
//       return;
//     }
//     if (quantity > maxAmountPerMint) {
//       alert("민트한번당 최대갯수 3개입니다");
//       return;
//     }
//     if (remainingAmount < quantity) {
//       alert("남은수량이 부족합니다");
//       return;
//     }
//     if (totalPayment > balance) {
//       alert("잔액부족");
//       return;
//     }

<<<<<<< HEAD
    try {
      await testTokenInstance.methods
        .mintTestToken(quantity)
        .send({ from: account, value: totalPayment });
    } catch (err) {
      alert(err.message);
    }
    // await testTokenInstance.methods
    //   .mintTestToken(quantity)
    //   .send({ from: account, value: totalPayment })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => console.log(err.message));
  }
=======
//     try {
//       await deployed.methods.mintTestToken(quantity).send({ from: account, value: totalPayment });
//     } catch (err) {
//       alert(err.message);
//     }
//     // await deployed.methods
//     //   .mintTestToken(quantity)
//     //   .send({ from: account, value: totalPayment })
//     //   .then(res => {
//     //     console.log(res);
//     //   })
//     //   .catch(err => console.log(err.message));
//   }
>>>>>>> main

//   // =============================================================================================
//   // =============================================================================================

//   // ===========================================returns===========================================
//   // =============================================================================================

//   if (!account) return <h1>메타마스크 연결하세요</h1>;
//   return (
//     <div>
//       {account?.toLowerCase() === owner?.toLowerCase() && (
//         <div>
//           <input type="number" ref={priceRef} />
//           <button onClick={() => startMint(priceRef.current.value)}>
//             민팅시작하기 , 민팅가격 바꾸기
//           </button>
//         </div>
//       )}
//       <div>{isMintOn ? "민팅진행중 가격: " + mintPrice + "Eth" : "민팅시작전"}</div>
//       <div>
//         {isMintOn ? currentSupply : 0} / {maxSupply}
//       </div>
//       {isMintOn && (
//         <div>
//           <input type="text" ref={mintQuantityRef} disabled={currentSupply === maxSupply} />
//           <span></span>
//           <button
//             onClick={() => mint(mintQuantityRef.current.value * 1)}
//             disabled={currentSupply === maxSupply}
//           >
//             Mint
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Minseop;
