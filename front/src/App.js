import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Brand from "./components/Brand/Brand";
import Footer from "./components/Footer/Footer";
import Header from "./components/header/Header";
import Info from "./components/Info/Info";
import TopFold from "./components/TopFold/TopFold";
import TrendingNft from "./components/TrendingNft/TrendingNft";
import Minseop from "./components/minseop/minseop";
import SeopMy from "./components/minseop/seopMy";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <TopFold />
              <Brand />
              <TrendingNft />
              <Info />
              <Footer />
            </>
          }
        />
        <Route path="/minseop" element={<Minseop />} />
        <Route path="/seopmy" element={<SeopMy />} />
      </Routes>
    </div>
  );
};

export default App;
