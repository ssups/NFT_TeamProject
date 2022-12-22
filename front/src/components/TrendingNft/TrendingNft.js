import React from 'react'
import Mm from "../../asset/img/1.png"
import openS from "../../asset/img/2.png"
import pinata from "../../asset/img/3.png"
import openZ from "../../asset/img/4.png"
import "../../styles/trending.css"

// marqueen 함수 이용하기
const TrendingNft = () => {
  return (
   <div className='box'>
    <div className='inner'>
    <span><img src={openS}/></span>
    
    </div>
    <div className='inner'>
     <span><img src={openS}/></span>
     
    </div>
   </div>
  )
}

export default TrendingNft