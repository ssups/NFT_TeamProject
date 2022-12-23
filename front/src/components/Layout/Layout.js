import React, { createContext } from "react";

import Header2 from "../Header2/Header2";
import Routers from "../../routes/Routers";

const Layout = () => {
  return (
    <>
      {/* 전체페이지에 헤더 적용 */}
      <Header2 />
      <div>
        <Routers />
      </div>
    </>
  );
};

export default Layout;
