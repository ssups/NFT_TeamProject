# Ssande - NFT Minting, Trade, Auction Project

## 🖥️ Project Page

<li><a href = "http://15.164.231.206">http://15.164.231.206</a></li>
<br><br>

## 📒 Documents

 <li><a href = "https://frost-wok-c3f.notion.site/784be7e84fd94a11b6d3be2e00183cc8?v=a2faa34c9d1d4c17ae075cb61d011f82">📖Project Info</a></li>
 <li><a href = "https://frost-wok-c3f.notion.site/85f791cb7345498ebb80c87bd0f1e3aa?v=f409f934557b4683bc10a71f2e3e8e6d">📑 Meeting Materials</a></li>
 <br><br>

## 🧾 Project Description

3인으로 구성된 팀으로 일주일간 진행한 Solidity 프로젝트.<br><br>
Goerli(Test-Network)에 <br>

1. ERC721Token(NFT)컨트렉트<br>
2. 해당 토큰을 거래할 수 있는 컨트렉트<br>

두가지의 컨트렉트를 배포하고 해당 컨트렉트들과 상호작용 할 수 있는 웹페이지를 구현하는 것을 목표로 진행.<br><br>

민팅방식은 한번에 2개이상의 민팅이 가능한 BatchMinting.<br>
BatchMinting시 사용자의 가스비 지출을 줄이기위해서 Azuki팀에서 만든 ERC721A-standard를 사용.<br><br>
일반적인 토큰거래 컨트렉트들과의 차별성을 두기 위해서, 경매를 통한 거래기능을 추가적으로 구현함.
<br><br>

## 🏗️ Project Structure

![image](https://user-images.githubusercontent.com/107898015/218940897-f58aa2bb-ecc2-4065-a0c4-49ee75d37e8e.png)
<br><br>

## 🛠 Tech Stack

<img src="https://img.shields.io/badge/Solidity-purple?style=flat-square&logo=Solidity&logoColor=white"> <img src="https://img.shields.io/badge/OpenZeppelin-purple?style=flat-square&logo=OpenZeppelin&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/React Router-61DAFB?style=flat-square&logo=ReactRouter&logoColor=white"/> <img src="https://img.shields.io/badge/React Router-61DAFB?style=flat-square&logo=ReactContext&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-61DAFB?style=flat-square&logo=Axios&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-yellow?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/.env-yellow?style=flat-square&logo=.env&logoColor=white"/>
<br><br>

## 🎨 Preview

![ezgif com-video-to-gif (1)](https://user-images.githubusercontent.com/97073355/218945995-c08d52a2-614b-49f0-b482-b3d367ec2921.gif)
<img width="1499" alt="image" src="https://user-images.githubusercontent.com/107898015/218937998-7a3f64c9-da9c-4300-a330-8a5b08425cc8.png">
<img width="1481" alt="image" src="https://user-images.githubusercontent.com/107898015/218936915-973fa1d4-e5a6-428a-b466-d0321ee572e6.png">
<br><br>

## 목차

1. [3D Slide](#3D-Slide)

2. [Connect Wallet](#Connect-Wallet)

3. [Modal && Minting](#Modal-&&-Minting)

---

### 3D Slide

<!-- <br><br><br><br><br><br><br><br><br><br><br><br> -->
```

유명한 NFT사진들로  3D 느낌이 나게 구현해봤습니다

.moveImg {
	width: 100%;
	position: absolute;
	float: right;
	animation: rotar 15s infinite linear;
	transform-style: preserve-3d;
    
}

각각 이미지에 nth-child로 지정해준다음 위치를 정해놓고
사진들을 오른쪽으로 돌게하는 animation 효과와 preserve-3d
마지막으로 @keyframes 으로 rotateY 값을 넣어주면 멋진 3d-slide를 만들수 있습니다
```

### Connect Wallet
<br>

![asdasd](https://user-images.githubusercontent.com/97073355/218951174-69cf3424-08f9-4479-be10-170e9a5c84c0.png)


```JS
메타마스크에 연결할 수 있는 버튼입니다


  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account);
        ethBalance = web3.utils.fromWei(ethBalance, 'ether');
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
        }
      }
    } catch (err) {}
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

지갑에 연동하게해주는 onConnenct 함수와 
지갑이랑 연동시  "지갑연동" 글자가 -> "해제하기"로 바뀌게 되면서
지갑을 연동을 해제 할 수 있는 onDisconnect함수를 만들었습니다

```
![ezgif com-video-to-gif](https://user-images.githubusercontent.com/97073355/218985250-592e8d44-4008-41b1-b0bf-47ec54a6a88d.gif)


지갑연결을 하면 보유한 이더와 계정주소를 확인할 수 있습니다.

<br>

### Modal && Minting

<br>

![ezgif com-video-to-gif (1)](https://user-images.githubusercontent.com/97073355/220283276-ff88f8ed-3b9b-4f94-a0ce-3418a026f5ef.gif)

<br>
민팅 버튼을 누르면 모달창이 나오고 민팅할 NFT 갯수를 정할 수 있습니다

민팅 갯수에 따라 설정한 Goerli이 빠져나갑니다.



<br>

### NFT Card

<br>

<img width="1499" alt="image" src="https://user-images.githubusercontent.com/107898015/218937998-7a3f64c9-da9c-4300-a330-8a5b08425cc8.png">

```JS
 { saleTokenURIs &&
            Object.keys(saleTokenURIs).map(tokenId => (

              <Col key={tokenId} lg="3" md="4" sm="6" 

              className="mb-4">
                <ShopNftCard key={tokenId} tokenId={tokenId} tokenURI={saleTokenURIs[tokenId]} />
              </Col>
            ))}
```
<br>
 saleTokenURIs 객체의 모든 항목에 대해 ShopNftCard 컴포넌트를 렌더링하여 NFT 토큰을 표시합니다.

<br>

 NFT 사진은 배경화면, 몸 , 눈 , 입모양으로 나뉘어서 직접 만들었고 Hashlips 에서 만든 코드를 이용해서 수백가지의 이미지를 추출했습니다
