import React from 'react'
import {Routes,Route,Navigate} from "react-router-dom"

import Home from "../pages/Home"
import Shop from "../pages/Shop"
import Create from "../pages/Create"
import Contact from "../pages/Contanct"
import Sell from '../pages/Sell'
import ProFile from "../pages/ProFile"
import Wallet from "../pages/Wallet"
import NftDetail from "../pages/NftDetail"

import TrendingNft from "../components/TrendingNft/TrendingNft"
import Header from "../components/header/Header"
import Brand from "../components/Brand/Brand"
import TopFold from "../components/TopFold/TopFold"

import Minseop from "../components/minseop/minseop"
import SeopMy from "../components/minseop/seopMy"
import MyNfts from "../components/minseop/MyNfts_j"
import NftInfo from '../components/minseop/NftInfo_j'
import Minting from "../components/minseop/Minting_j"


const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to = '/home'/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/Shop' element={<Shop/>}/>
      
      <Route path='/Contact' element={<Contact/>}/>
      <Route path='/ProFile' element={<ProFile/>}/>
      <Route path='/sell' element={<Sell/>}/>
      <Route path='/Wallet' element={<Wallet/>}/>
      <Route path='/Shop/:id' element={<NftDetail/>}/>

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
      </Routes>
  )
}

export default Routers