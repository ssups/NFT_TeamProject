import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'

const NftCard = (props) => {

        // Auction.js 
    const {title , id , currentBid, imgUrl} = props.item

    // modal창 useState
    const [moDal, setModal] =  useState(false)

  return <div className="single_nft">
  <div className="nft_img">
      <img src={imgUrl} className="w-100"/>
  </div>

{/* 카드 상태창 */}
  <div className="nft_content">
      <h5 className="nft_title"><Link to={`/shop/${id}`}>{title}</Link></h5>  
     <div className="creator_info d-flex align-items-center justify-content-between">
     <div className="w-50">
      <h6>Current Bid</h6>
      <p>{currentBid} ETH</p>
      </div>
     </div>

  
  {/* 주문하기 버튼 */}
  <div className=" mt-3 d-flex align-items-center justify-content-between">
      <button className="bid_btn d-flex align-items-center gap-1"
      onClick={()=> setModal(true)}>
      <i className="ri-shopping-bag-fill"></i>
          주문하기</button>

            {/* 주문하기 버튼 누르면 모달창 */}
          {moDal && <Modal setModal={setModal}/>} 

  </div>

  </div>
</div>

}

export default NftCard