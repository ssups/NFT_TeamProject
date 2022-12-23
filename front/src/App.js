import React from "react";
<<<<<<< HEAD
import Layout from "./components/Layout/Layout"
import "./app.css";


const App = () => {
  return (
   <Layout/>
=======
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Brand from "./components/Brand/Brand";
import Header from "./components/header/Header";
import TopFold from "./components/TopFold/TopFold";
import TrendingNft from "./components/TrendingNft/TrendingNft";

import Minseop from "./components/minseop/minseop";
import SeopMy from "./components/minseop/seopMy";

import MyNfts from "./components/minseop/MyNfts_j";
import NftInfo from "./components/minseop/NftInfo_j";
import Minting from "./components/minseop/Minting_j";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TrendingNft />
              <Header />
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
      </Routes>
    </div>
>>>>>>> cea9723b357ed391a78fb4ab29455cf2bd9eeb41
  );
};

export default App;
