import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import Brand from "./components/Brand/Brand";
import Header from "./components/header/Header";
import TopFold from "./components/TopFold/TopFold";
import TrendingNft from "./components/TrendingNft/TrendingNft";
import Minseop from "./components/minseop/minseop";



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
      </Routes>
    </div>
  );
};

export default App;
