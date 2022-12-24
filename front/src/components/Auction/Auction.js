import React from 'react';
import { Container,Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import NftCard from '../Nft/NftCard'
import {NFT__DATA} from "../../asset/data/data"
import "../../styles/auction.css"

const Auction = () => {
  return ( <section> 
    <Container>
        <Row>
            <Col lg='12'>
                {/* NFT */}
                <div className="auction_top d-flex align-items-center
                justify-content-between">
                    <h3>NFT</h3>
                    <span><Link to='/shop'>Explore</Link></span>
                </div>
            </Col>

                    {/*dats.js에 있는 내용 4개 가져옴  */}
               { 
                NFT__DATA.slice(0,4).map((item)=>(
                <Col lg='3'>
                    <NftCard key={item.id} item={item}/>
            </Col>
                ))
               }
        </Row>
    </Container>
   </section>
  )
}

export default Auction