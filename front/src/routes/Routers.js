import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Auction from '../pages/Auction';

import Minting from '../pages/Minting';

import ShopJ from '../pages/Shop_j';
import MyPage from '../pages/MyPage_j';

import Minseop from '../components/minseop/minseop';
import SeopMy from '../components/minseop/seopMy';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auction" element={<Auction />} />

      <Route path="/mypage" element={<MyPage />} />

      <Route path="/minting" element={<Minting />} />

      <Route path="/minseop" element={<Minseop />} />
      <Route path="/seopmy" element={<SeopMy />} />

      <Route path="/shop" element={<ShopJ />} />
    </Routes>
  );
};

export default Routers;
