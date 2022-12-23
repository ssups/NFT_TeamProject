import React, { useEffect, useState, createContext } from "react";
import Routers from "../../routes/Routers";
import Header2 from "../Header2/Header2";
import useWeb3 from "../../hooks/useWeb3";
import useSsandeContracts from "../../hooks/useSsandeContracts";
const Layout = () => {
  const [web3, account, balance] = useWeb3();
  const [tokenContract, tradeContract] = useSsandeContracts();

  return (
    <>
      {/* 전체페이지에 헤더 적용 */}
      <Context.Provider value={{ web3, account, balance, tokenContract, tradeContract }}>
        <Header2 />
        <div>
          <Routers />
        </div>
      </Context.Provider>
    </>
  );
};

export const Context = createContext();
export default Layout;
