import React from "react";

import Header from "../components/Header/Header";
import Routers from "../routes/Routers";

const Layout = () => {
  return (
    <>
      {/* 전체페이지에 헤더 적용 */}
      <Header />
      <div>
        <Routers />
      </div>
    </>
  );
};

export default Layout;
