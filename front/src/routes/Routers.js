import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Contact from "../pages/Contanct";
import Sell from "../pages/Sell";
import NftDetail from "../pages/NftDetail";

import Brand from "../components/Brand/Brand";
import TopFold from "../components/TopFold/TopFold";

import MyNfts from "../components/minseop/MyNfts_unused";
import NftInfo from "../components/minseop/NftInfo_unused";
import Minting from "../components/minseop/Minting_unused";
import MyPage from "../pages/MyPage_j";

import Minseop from "../components/minseop/minseop";
import SeopMy from "../components/minseop/seopMy";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Shop" element={<Shop />} />

      <Route path="/Contact" element={<Contact />} />

      <Route path="/sell" element={<Sell />} />

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

      <Route path="/1" element={<MyNfts />} />
      <Route path="/2" element={<NftInfo />} />
      <Route path="/3" element={<Minting />} />
      <Route path="/4" element={<MyPage />} />
    </Routes>
  );
};

export default Routers;
