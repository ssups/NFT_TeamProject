import React from 'react';

import { Link, useParams } from 'react-router-dom'
import { Container,Row,Col } from 'reactstrap'
import { NFT__DATA } from '../asset/data/data'
import toast ,{ Toaster } from 'react-hot-toast'

import Auction from "../components/Auction/Auction"

import '../styles/nftdetail.css'

// 상품누르면 상세페이지로 이동
const NftDetail = () => {

    const {id} = useParams()
      // Nft이름을 useParams로 전달해서 이름과 같은 상세페이지로 이동
    const singleNft = NFT__DATA.find(item=> item.id ==id)

    // alert UI
    const notify = () => toast.success('구매완료!');
  
    return (
      <>
      <section>
        <Container>
          <Row>
            <Col lg='6' md='6' sm='6'>
              <img src={singleNft.imgUrl} className="single-img w-100"/>
            </Col>

            <Col lg='6' md='6' sm='6'>
              <div className='single_nft'>
                <h2>
                  {singleNft.title}
                </h2>
                <div className='d-flex align-items-center justify-content-between'>
                  <div className='d-flex align-items-center gap-4 single-seen'>
                      <span>
                      <i className="ri-eye-line"></i> 333
                      </span>
                      <span>
                      <i className="ri-hearts-fill"></i> 333
                      </span>
                  </div>

                 

                </div>

                <p>{singleNft.desc}</p>
                <button onClick={notify} className='bid_btn1 d-flex align-items-center gap-2'>
                <i className="ri-shopping-bag-line"></i>

                 <Toaster/>     
                  <Link >구매하기                 
                  </Link>

                  
                  </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Auction />
      </>
    )
   
}

export default NftDetail