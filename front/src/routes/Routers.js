import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Contact from "../pages/Contanct";
import Sell from "../pages/Sell";
import NftDetail from "../pages/NftDetail";

import Brand from "../components/Brand/Brand";
import TopFold from "../components/TopFold/TopFold";

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

      <Route path="/4" element={<MyPage />} />
    </Routes>
  );
};

export default Routers;
