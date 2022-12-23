import React from 'react'
import "../../styles/seller.css"
import { Container,Row,Col } from 'reactstrap'


const Seller = () => {
  return (
    <section>
        <Container>
            <Row>
                <Col lg='12' className='mb-5'>
                    <div className="seller_title">
                        <h3>판매자</h3>
                        </div>                
            </Col>

            <Col lg='2'>
                
            </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Seller