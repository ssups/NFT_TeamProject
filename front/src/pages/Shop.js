import React, { useEffect, useState, useContext } from "react";
import { Col, Container, Row } from "reactstrap";
import NftCard from "../components/Nft/NftCard";
import { NFT__DATA } from "../asset/data/data";
import useSsandeContracts from "../hooks/useSsandeContracts";
import { Context } from "../App";

const Shop = () => {
  // hoooks
  const [testTokenInstance, testTradeInstance] = useSsandeContracts();
  // context
  const { account, web3, balance } = useContext(Context);
  // state
  const [onAuctionURI, setOnAuctionURI] = useState({});

  // useEffect

  useEffect(() => {
    if (!testTradeInstance) return;
    testTradeInstance.events.RegisterForAuction((err, data) => {
      getOnAuctions();
    });
  }, [testTradeInstance]);

  useEffect(() => {
    // (async () => {
    //   if (!testTokenInstance || !testTradeInstance) return;
    //   // 경매중인 토큰 리스트
    //   const tokenOnAuction = await testTradeInstance.methods.onAuctionList().call();
    //   // 경매중이 토큰 uri 들고오기
    //   const tokensURI = {};
    //   for (const tokenId of tokenOnAuction) {
    //     tokensURI[tokenId] = await testTokenInstance.methods.tokenURI(tokenId).call();
    //   }
    //   setOnAuctionURI(tokensURI);
    // })();
    getOnAuctions();
  }, [testTokenInstance, testTradeInstance]);

  useEffect(() => {
    (async () => {
      if (!testTradeInstance) return;
      // console.log(testTradeInstance.methods);
      // console.log(testTradeInstance.events);
    })();
  }, [testTradeInstance]);

  useEffect(() => {
    if (!web3) return;
    (async () => {
      const block = await web3.eth.getBlock();
      console.log(block.timestamp);
    })();
  }, [web3]);

  async function getOnAuctions() {
    if (!testTokenInstance || !testTradeInstance) return;
    // 경매중인 토큰 리스트
    const tokenOnAuction = await testTradeInstance.methods.onAuctionList().call();
    // 경매중이 토큰 uri 들고오기
    const tokensURI = {};
    for (const tokenId of tokenOnAuction) {
      tokensURI[tokenId] = await testTokenInstance.methods.tokenURI(tokenId).call();
    }
    setOnAuctionURI(tokensURI);
  }

  // return
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-5"></div>
            </div>
          </Col>

          {onAuctionURI &&
            Object.keys(onAuctionURI).map(tokenId => (
              <Col key={tokenId} lg="3" md="4" sm="6" className="mb-4">
                <NftCard tokenId={tokenId} tokenURI={onAuctionURI[tokenId]} />
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
};

export default Shop;
