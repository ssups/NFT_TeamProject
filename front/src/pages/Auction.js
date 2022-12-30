import React, { useState } from "react";
import { AuctionShop, BeforeClaim } from "../components/ForAuction";

const Auction = () => {
  const [isShop, setIsShop] = useState(true);

  return (
    <div>
      <div style={{ marginTop: "100px", width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          style={{ ...styles.buttons, marginRight: "20px", color: !isShop ? "GrayText" : "white" }}
          disabled={isShop}
          onClick={() => setIsShop(!isShop)}
        >
          경매중인 상품 보기
        </button>
        <button
          style={{ ...styles.buttons, color: isShop ? "GrayText" : "white" }}
          disabled={!isShop}
          onClick={() => setIsShop(!isShop)}
        >
          나의 낙찰 상품 수령
        </button>
      </div>
      {isShop ? <AuctionShop /> : <BeforeClaim />}
    </div>
  );
};

const styles = {
  buttons: {
    border: "none",
    color: "white",
    backgroundColor: "transparent",
    fontFamily: "'Jua', sans-serif",
    fontSize: "20px",
  },
};

export default Auction;
