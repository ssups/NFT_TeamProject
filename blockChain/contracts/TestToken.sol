// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../standards/ERC721A.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "../node_modules/@openzeppelin/contracts/utils/Context.sol";


contract TestToken is  ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256; // Strings라이브러리 사용
    uint256 public immutable maxAmountPerMint;
    uint256 public mintPrice;

    event MintTestToken(address minter, uint256 quantity);

    constructor(uint256 maxBatchSize_, uint256 collectionSize_) ERC721A("Azuki", "AZUKI", maxBatchSize_, collectionSize_) {
     maxAmountPerMint = maxBatchSize_;
    }

    modifier callerIsUser() {
      // 함수호출자가 CA가아닌 EOA 인지 확인하는거
      require(tx.origin == msg.sender, "The caller is another contract");
      _;
    }

    function setMintOn(uint256 price) external onlyOwner {
      // wei 단위
      require(price > 0,"sale price must greater than 0");
      mintPrice = price;
    }

    function isMintOn() public view returns(bool) {
      return mintPrice != 0; 
    }

    function mintTestToken(uint256 quantity) external payable callerIsUser {
      require(isMintOn(),"sale has not begun yet");
      require(quantity <= maxAmountPerMint, "can not mint this amount at once"); // 한번에 민팅할수있는 최대량 초과하는지검사
      require(ERC721A.totalSupply() + quantity <= ERC721A.collectionSize, "not enough remainig amounts"); // 총공급량 초과하는지 검사
      ERC721A._safeMint(msg.sender, quantity);
      emit MintTestToken(msg.sender, quantity);
    }

    string private _baseTokenURI = "https://localhost:4000";

  //   function tokenURI(uint256 tokenId)
  //   public
  //   view
  //   override
  //   returns (string memory)
  // {
  //   require(
  //     _exists(tokenId),
  //     "ERC721Metadata: URI query for nonexistent token"
  //   );

  //   string memory baseURI = _baseURI();
  //   return
  //     bytes(baseURI).length > 0
  //       ? string(abi.encodePacked(baseURI, tokenId.toString()))
  //       : "";
  // }

    function _baseURI() internal override view returns(string memory){
      return _baseTokenURI;
    }
  
    function sertBaseURI(string memory baseURI) external onlyOwner {
      _baseTokenURI = baseURI;
    }
    // tokenURI는 ERC721A에 있는거 그대로 사용할꺼
    // 여기서 _baseURI 함수 오버라이드해서 리턴값으로 baseURI 넣어주면
    // tokenURI 함수내에서 _baseURI 호출해서 리턴값 바탕으로 tokenURI 만들어서 return해준다.

    function withdrawAll() external onlyOwner nonReentrant {
      // payable(msg.sender).transfer(address(this).balance);
      (bool success, ) = msg.sender.call{value:address(this).balance}("");
      require(success, "Withdrawl Faild");
    }

    

}
