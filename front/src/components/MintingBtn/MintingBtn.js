import React, { useState } from "react";
import "../../styles/topfold.css";
import { Link } from "react-router-dom";

import "../../styles/topfold.css";
import MintingModal from "../Modals/MintingModal_j";

const MintingBtn = () => {
  //
  const [moDal, setModal] = useState(false);

  return (
    <div className="topfold">
      <div className="tf-left">
        <div className="tf-heading">
          <div className="tf__title">
            Hello<span className="head_style">안녕</span>NFT
          </div>
        </div>
        <div className="tf-des">졸려배고파밥줘</div>
        <div className="tf-r-bg-blob"></div>
      </div>

      <div className="tf-btns">
        <Link to="/shop">
          {" "}
          <button className="bbtn1">Explore</button>
        </Link>
        <button onClick={() => setModal(true)} className="bbtn2">
          민팅하기
        </button>

        {moDal && <MintingModal setModal={setModal} />}
      </div>
    </div>
  );
};

export default MintingBtn;
