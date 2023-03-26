import React, { useState } from 'react';
import { AuctionShop, BeforeClaim } from '../components/ForAuction';
import { useLocation } from 'react-router-dom';

const Auction = () => {
  const [isShop, setIsShop] = useState(true);

  return (
    <div>
      <div style={{ marginTop: '100px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          style={{ ...styles.buttons, marginRight: '20px', color: !isShop ? 'GrayText' : 'white' }}
          disabled={isShop}
          onClick={() => setIsShop(!isShop)}
        >
          경매중인 상품 보기
        </button>
        <button
          style={{ ...styles.buttons, color: isShop ? 'GrayText' : 'white' }}
          disabled={!isShop}
          onClick={() => setIsShop(!isShop)}
        >
          나의 낙찰 상품 수령
        </button>
      </div>
      {!window.ethereum ? (
        <h1 style={styles.guideMent}>메타마스크를 설치해주세요</h1>
      ) : isShop ? (
        <AuctionShop />
      ) : (
        <BeforeClaim />
      )}
    </div>
  );
};

const styles = {
  buttons: {
    border: 'none',
    color: 'white',
    backgroundColor: 'transparent',
    fontFamily: "'Jua', sans-serif",
    fontSize: '20px',
  },
  guideMent: {
    width: '100wh',
    height: 'calc(100vh - 100px - 50px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Auction;
