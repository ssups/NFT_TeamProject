import React, { useContext, useEffect, useState } from 'react';
import '../../styles/asd1.css';

import axios from 'axios';
import { Context } from '../../App';
import { LoadingContext } from '../../Layout/Layout';
import { BACK_URL } from '../../constant/urlConstant';

const ShopNftCard = ({ tokenId, tokenURI }) => {
  //
  const { web3, account, balance, tokenContract, tradeContract } = useContext(Context);
  const { setIsLoading } = useContext(LoadingContext);

  const [seller, setSeller] = useState();
  const [salePrice, setSalePrice] = useState();
  const [tokenName, setTokenName] = useState();
  const [tokenImgUrl, setTokenImgUrl] = useState();

  // ==========================================functions==========================================
  // =============================================================================================

  // 하위 컴포넌트에서 사용할 구매하기 버튼에 대한 함수
  async function purchaseTokenFn() {
    //

    const price = web3.utils.toWei(salePrice, 'ether');
    if (price && price > balance) {
      alert('잔액이 부족합니다.');
      return;
    }

    const purchaseMsg = '토큰을 구매하시겠습니까?';
    if (!window.confirm(purchaseMsg)) return;

    setIsLoading(true);
    // try catch 처리 안해주면 메타마스크 트렌젝션 취소했을때 다음코드 실행안되고 그냥 넘어감
    try {
      await tradeContract.methods.purchase(tokenId).send({ from: account, value: price });
      alert('구매가 완료되었습니다.');
      window.location.reload();
    } catch (err) {}
    setIsLoading(false);
  }

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    (async () => {
      //
      // name, image, attributes, dna, edition, date, compiler, description
      const newURI = tokenURI.replace('http://localhost:4000', BACK_URL);
      const { name, image } = (await axios.get(newURI + '.json')).data;

      const seller = await tokenContract.methods.ownerOf(tokenId).call();
      const _salePrice = await tradeContract.methods.priceOfOnSale(tokenId).call();

      setSeller(seller);
      setTokenName(name);
      setTokenImgUrl(BACK_URL + `/images/${tokenId}.png`);
      setSalePrice(web3.utils.fromWei(_salePrice, 'ether'));
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
        <div className="asd1">
          <h5>판매가: {salePrice} ether</h5>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          {account && seller && account.toLowerCase() !== seller.toLowerCase() && (
            //
            <button className="bid_btn d-flex align-items-center gap-1" onClick={purchaseTokenFn}>
              💎 구매하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopNftCard;
