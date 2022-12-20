// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

// 확장성 고려
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// NFT 발행에 대한 컨트랙트
contract MintingNft is ERC721Enumerable, Ownable {

    // 토큰 발행량 제한 (상수)
    uint constant private MAX_TOKEN_COUNT = 100;

    // 토큰 발행 비용 (단위 확인 필요..)
    uint private _mintingPrice;

    constructor(string memory name_, string memory symbol_, uint mintingPrice_) ERC721(name_, symbol_) {
        _mintingPrice = mintingPrice_;
    }

    // 배포자 EOA 계정 접근
    // owner() public

    // _allTokens 토큰 id 배열
    // _allTokensIndex 토큰 id => 모든 토큰 배열의 인덱스
    // _ownedTokens 소유자 주소 => (보유 토큰 인덱스 => 토큰 id)
    // _ownedTokensIndex 토큰 id => 소유자 기준 보유 토큰 인덱스

    // 토큰 민팅 이벤트, 검색을 위해 indexed 사용
    event MintingToken(address indexed owner, uint indexed tokenId);

    // 이미지 경로에 대한 데이터는 백엔드에 저장할 예정
    function mintToken(address _owner, string memory _tokenName) external payable {

        // wei 단위인지 확인 필요..
        require(msg.value >= _mintingPrice, "insufficient money to mint");

        // 현재 발행량 확인 후 토큰 발행
        require(totalSupply() < MAX_TOKEN_COUNT, "exceeding the maximum issuance");

        // 토큰 이름을 통해 tokenId 생성
        uint tokenId = uint(keccak256(abi.encodePacked(_tokenName)));
        emit MintingToken(_owner, tokenId);

        // ERC721Enumerable 상태 변수 업데이트
        _beforeTokenTransfer(address(0), _owner, tokenId);

        // ERC721 상태 변수 업데이트
        _mint(_owner, tokenId);
    }

    // 단위 확인 필요..
    function setMintingPrice(uint _price) external {
        _mintingPrice = _price;
    }
}

// npx truffle init
// npm i openzeppelin-solidity