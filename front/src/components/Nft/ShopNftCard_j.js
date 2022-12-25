import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Context } from "../../App";

const ShopNftCard = ({ tokenId, tokenURI }) => {
  //
  const { web3, account, balance, tokenContract, tradeContract } = useContext(Context);

  const [seller, setSeller] = useState();
  const [salePrice, setSalePrice] = useState();
  const [tokenName, setTokenName] = useState();
  const [tokenImgUrl, setTokenImgUrl] = useState();

  // ==========================================functions==========================================
  // =============================================================================================

  // 하위 컴포넌트에서 사용할 구매하기 버튼에 대한 함수
  async function purchaseTokenFn() {

    if (salePrice && salePrice > balance) {
      alert("잔액이 부족합니다.");
      return;
    }

    const purchaseMsg = "토큰을 구매하시겠습니까?";
    if (!window.confirm(purchaseMsg)) return;

    await tradeContract.methods.purchase(tokenId).call();
    alert("구매가 완료되었습니다.")
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    (async () => {
      //
      // name, image, attributes, dna, edition, date, compiler, description
      const { name, image } = (await axios.get(tokenURI + ".json")).data;

      const seller = await tokenContract.methods.ownerOf(tokenId).call();
      const _salePrice = await tradeContract.methods.priceOfOnSale(tokenId).call();

      setSeller(seller);
      setTokenName(name);
      setTokenImgUrl(image);
      setSalePrice(_salePrice);
    })();
  }, []);

  // ===========================================returns===========================================
  // =============================================================================================

  return (
    <div className="single_nft">

      <div className="nft_img">
        <img src={tokenImgUrl} className="w-100" alt="" />
      </div>

      <div className="nft_content">
        <h5 className="nft_title">
          {/* <Link to={`상세 페이지 경로`}></Link> */}
          {tokenName}
        </h5>
        <h5>판매가: {web3.utils.fromWei(salePrice, "ether")} ether</h5>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid_btn d-flex align-items-center gap-1"
            onClick={purchaseTokenFn}
            disabled={account && seller && account.toLowerCase() === seller.toLowerCase()}
          >
            💎 구매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopNftCard;
