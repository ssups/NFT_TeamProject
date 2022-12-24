import React, { useContext, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import "../../styles/header2.css";

import { Container } from "reactstrap";
import { Context } from "../Layout/Layout";
//헤더 링크
const Nav_Link = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Shop",
    url: "/shop",
  },
  {
    display: "Create",
    url: "/create",
  },
];

const Header2 = () => {
  const { web3 } = useContext(Context);
  // 지갑연결 함수
  async function connectWallet() {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  }

  // 헤더바 고정
  const headerRef = useRef(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add("header2_stick");
      } else {
        headerRef.current.classList.remove("header2_stick");
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);
  return (
    // 헤더
    <header className="header2" ref={headerRef}>
      <Container>
        {/* 로고 */}
        <div className="navigation">
          <div className="logo">
            <h2 className="d-flex gap-2 align-items-center">
              <span>
                <i className="ri-fire-fill"></i>
              </span>
              SSAN DE NFT
            </h2>
          </div>

          <div className="nav_menu">
            <ul className="nav_list">
              {Nav_Link.map((item, index) => (
                <li className="nav_item" key={index}>
                  <NavLink
                    to={item.url}
                    className={navClass => (navClass.isActive ? "active" : "")}
                  >
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* 지갑버튼 */}
          <div className="nav_right d-flex align-items-center gap-5">
            <button className="btn1" onClick={connectWallet}>
              <Link className="d-flex gap-2 align-items-center">
                <span>
                  <i className="ri-wallet-3-fill"></i>
                </span>
                지갑 연동
              </Link>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header2;
