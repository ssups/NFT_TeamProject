import React from 'react'
import Mm from "../../asset/img/1.png"
import openS from "../../asset/img/2.png"
import pinata from "../../asset/img/3.png"
import openZ from "../../asset/img/4.png"
import "../../styles/trending.css"

// marqueen 함수 이용하기
const TrendingNft = () => {
  return (
    <div className='www'>
      <div className='mask'>
        <img src={Mm}/>
      </div>
      <div className='mask'>
        <img src={openS}/>
      </div>
      <div className='mask'>
        <img src={pinata}/>
      </div>
      <div className='mask'>
        <img src={openZ}/>
      </div>
    </div>
  )
}

export default TrendingNft