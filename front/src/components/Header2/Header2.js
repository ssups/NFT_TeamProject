import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Web3 from "web3";

import "../../styles/header2.css";

import { Container } from "reactstrap";
import { Context } from "../../App";

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
  {
    display: "Auction",
    url: "/create",
  },
];

const Header2 = () => {
  // const [walletAddress, setWalletAddress] = useState(null)
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const { account, balance } = useContext(Context);
  // const [account,setAccount] = useState()
  //
  // 메타마스크 지갑 연결에 대한 함수 (지갑 연동 버튼 클릭 시)
  // const connectWallet = async () => {
  //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});

  //   setWalletAddress(accounts[0])

  // }

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem("userAccount"));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
        }
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        ethBalance = web3.utils.fromWei(ethBalance, "ether");
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
        }
      }
    } catch (err) {}
  };

  const onDisconnect = () => {
    window.localStorage.removeItem("userAccount");
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem("userAccount", JSON.stringify(userAccount));
    const userData = JSON.parse(localStorage.getItem("userAccount"));
    setUserInfo(userData);
    setIsConnected(true);
  };

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
            {!isConnected && (
              <div>
                <button className="btn1" onClick={onConnect}>
                  <p>지갑연결</p>
                </button>
              </div>
            )}
          </div>
          {isConnected && (
            <>
              <div>
                <div className="account_text" style={{ height: "30px" }}>
                  {/* Account: <Link to="/mypage">{userInfo.account}</Link> */}
                  Account: <Link to="/mypage">{account}</Link>
                </div>
                <div className="account_text" style={{ height: "30px" }}>
                  Balance: <span>{((balance * 1) / 10 ** 18).toFixed(3) + "Eth"}</span>
                  {/* Balance: <span>{(userInfo.balance * 1).toFixed(3) + "Eth"}</span> */}
                </div>
              </div>
              <div>
                <button className="btn2" onClick={onDisconnect}>
                  <p>해제하기</p>
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header2;
