// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

// 확장성 고려
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// NFT 발행에 대한 컨트랙트
contract MintingNft is ERC721Enumerable, Ownable {

    // NFT 발행량 제한 (상수)
    uint constant private MAX_TOKEN_COUNT = 100;

    // 일반 판매 및 경매 성사 시 수수료율 (상수 : 할인할 예정 없음)
    // 1 / 1000 = 0.1% 계산할 예정
    uint constant private NFT_TRANSACTION_FEE_RATE = 1;
    uint constant private NFT_TRANSACTION_FEE_DIGITS = 1000;

    // 이미지 경로에 대한 데이터는 백엔드에 저장할 예정
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    // 배포자 EOA 계정 접근
    // owner() public

    // _allTokens 토큰 id 배열
    // _allTokensIndex 토큰 id => 모든 토큰 배열의 인덱스
    // _ownedTokens 소유자 주소 => (보유 토큰 인덱스 => 토큰 id)
    // _ownedTokensIndex 토큰 id => 소유자 기준 보유 토큰 인덱스


    // mintToken()

    event MintToken(string )
}

// npx truffle init
// npm i openzeppelin-solidity