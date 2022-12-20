import React from 'react'
import "./App.css"
import Brand from './components/Brand/Brand'
import Footer from './components/Footer/Footer'
import Header from './components/header/Header'
import Info from './components/Info/Info'
import TopFold from './components/TopFold/TopFold'
import TrendingNft from './components/TrendingNft/TrendingNft'

const App = () => {
  return (
    <div>
      <Header/>
      <TopFold/>
      <Brand/>
      <TrendingNft/>
      <Info/>
      <Footer/>
    </div>
  )
}

export default App