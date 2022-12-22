import React, { useEffect, useState } from 'react'
import "../../styles/bradns.css"
import { Animator, ScrollContainer, ScrollPage, batch, Fade, MoveOut, Sticky } from "react-scroll-motion";


const Brand = () => {

  return (
    <ScrollContainer snap='madnatory'>
      <ScrollPage page={0}>
      <Animator animation={batch(Fade(), Sticky(), MoveOut(0, 300))}>
    <section id="slideshow">
    <div className="slideImg">
      <div className="moveImg">
        <figure className="imgShadow">RektSkull<img src="https://i.seadn.io/gcs/files/fec7cca60a80b8bf7e6c2712bb6b1728.gif?auto=format&w=384"/></figure>
        <figure className="imgShadow">Luppyclub<img src="https://i.seadn.io/gcs/files/e98dad5dbac144288475ab0d152cb45a.gif?auto=format&w=384"/></figure>
        <figure className="imgShadow">Potatoz<img src="https://i.seadn.io/gcs/files/3c1fc0e0411ab42e095001d136612f05.gif?auto=format&w=384"/></figure>
        <figure className="imgShadow">Dooplicator<img src="https://i.seadn.io/gae/P-QQYsLgNQJltnKhIbZJgs6y6IB0MrCcxn_v1HxfncSqtfs0oTVeLTf4D6pASXMPzEohSTjO-Ed2-WEpveZQF3KLvc-Zz2WxsYOmgTQ?auto=format&w=384"/></figure>
        <figure className="imgShadow">Murakami Cat<img src="https://i.seadn.io/gae/VYf_3RvK7x4ijmmowHMsIrMu58tqkNgm9K6HDRodbNwKLoZMucyQE-a6XieG8tH4jWMa_JVFSDzpJVoGU5uwDinit87YivufCg_T?auto=format&w=384"/></figure>
        <figure className="imgShadow">Doodles<img src="https://i.seadn.io/gcs/files/4896101273a20364217e29cfb25b2188.png?auto=format&w=384"/></figure>
        <figure className="imgShadow">Potatoz<img src="https://i.seadn.io/gcs/files/91d61635e9bdfdd584c937ab30ff2cbc.gif?auto=format&w=384"/></figure>
        <figure className="imgShadow">MVP<img src="https://i.seadn.io/gae/4UYQcvBZ0VIkprkWDaR47BsvWqc3V2p0D1U_JD7Dvo4cn_PKJ4IgcirB_8E-7hBPBs1Vej_CkjDB09Cr1Am792yGFLcVg6k3LXcReNw?auto=format&w=384"/></figure>
        <figure className="imgShadow">RektSkull<img src="https://i.seadn.io/gcs/files/66414639d7e062e6af8ae5c666fbc617.gif?auto=format&w=384"/></figure>
  </div>
</div>
</section>
</Animator>
</ScrollPage>
</ScrollContainer>
  )
}

export default Brand