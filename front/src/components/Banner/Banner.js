import React from 'react';
import '../../styles/banner.css';
import banner from '../../asset/images/banner.jpg';

const Banner = () => {
  return (
    <div className="banner_back">
      <div className="banner">
        <img src={banner} alt="banner" />
      </div>
    </div>
  );
};

export default Banner;
