import React from 'react';

import { Col, Container, Row } from 'reactstrap'
import NftCard from '../components/Nft/NftCard'
import { NFT__DATA } from '../asset/data/data'

const Shop = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg='12' className='mb-5'>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center gap-5'>    
      </div>
     </div>
    </Col>

    {
      NFT__DATA.map((item) => (
        <Col lg='3' md='4' sm='6' className='mb-4'>
        <NftCard item={item}/>
        </Col>
        ))
    }
    </Row>
    </Container>
    </section>
  )
}

export default Shop