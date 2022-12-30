import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Shop from "../pages/Shop";


import NftDetail from "../pages/NftDetail";

import Brand from "../components/Brand/Brand";
import TopFold from "../components/TopFold/TopFold";

import ShopJ from "../pages/Shop_j";
import MyPage from "../pages/MyPage_j";

import Minseop from "../components/minseop/minseop";
import SeopMy from "../components/minseop/seopMy";

import PublicRoute from "./PublicRoute";



// import Minseop from "../components/minseop/minseop";
// import SeopMy from "../components/minseop/seopMy";

const Routers = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/Create" />} />
     

      <Route path="/home" element={<Home />} />
      <Route path="/auction" element={<Shop />} />
      
       
  
      <Route path="/mypage" element={<MyPage />} />

      <Route path="/Shop/:id" element={<NftDetail />} />

      <Route
        path="/Create"
        element={
          <>
            {/* <TrendingNft /> */}
            {/* <Header /> */}
            <Brand />
            <TopFold />
          </>
        }
      />

      <Route path="/minseop" element={<Minseop />} />
      <Route path="/seopmy" element={<SeopMy />} />

      
      <Route path="/shop" element={<ShopJ />} />
    </Routes>
  );
};

export default Routers;
