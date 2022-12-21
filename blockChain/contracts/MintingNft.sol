// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// 확장성 고려
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// remix 경로 수정
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// NFT 발행에 대한 컨트랙트
contract MintingNft is ERC721Enumerable, Ownable {

    // 토큰 발행량 제한
    uint immutable private _mintingLimit;

    // 랜덤의 토큰을 발행 받기 위한 고정 비용 (단위 확인 필요..)
    uint private _mintingPrice;

    // 백 서버 주소
    string private _defaultPath;

    constructor(string memory name_, string memory symbol_, uint mintingLimit_, uint mintingPrice_, string memory defaultPath_) ERC721(name_, symbol_) {
        _mintingLimit = mintingLimit_;
        _mintingPrice = mintingPrice_;
        _defaultPath = defaultPath_;
    }

    // 배포자 EOA 계정 접근
    // owner() public

    // 토큰 민팅 이벤트, 검색을 위해 indexed 사용
    event MintingToken(address indexed owner, uint indexed tokenId);

    // json 파일 이름을 tokenId로 활용 예정
    function mintToken(address _owner, uint _tokenId) external payable {

        // wei 단위인지 확인 필요..
        require(_mintingPrice <= msg.value, "insufficient money to mint");

        // 현재 발행량 확인 후 토큰 발행
        require(totalSupply() < _mintingLimit, "exceeding the maximum issuance");

        emit MintingToken(_owner, _tokenId);

        payable(owner()).transfer(_mintingPrice);

        // ERC721Enumerable 상태 변수 업데이트
        // 해당 함수 안의 조건문 때문에 값을 두 번 추가..
        _beforeTokenTransfer(address(0), _owner, _tokenId, 1);

        // ERC721 상태 변수 업데이트 (토큰 id 중복 확인 기능 포함)
        _mint(_owner, _tokenId);
    }

    // _allTokens 모든 토큰 id 배열
    // _allTokensIndex 토큰 id => 모든 토큰 배열의 인덱스
    // _ownedTokens 소유자 주소 => (보유 토큰 인덱스 => 토큰 id)
    // _ownedTokensIndex 토큰 id => 소유자 기준 보유 토큰 인덱스

    // 보유 토큰 조회 함수
    function getMyTokenIds(address _owner) external view returns (uint[] memory) {
        
        // 보유 토큰 수
        uint count = balanceOf(_owner);
        
        require(count > 0);

        uint[] memory tokenIds = new uint[](count);
        
        // for문 대신 가스비를 절약할 방법..
        for (uint index = 0; index < count; index++)

            // push 사용 불가
            tokenIds[index] = tokenOfOwnerByIndex(_owner, index);

        return tokenIds;
    }

    // 단위 확인 필요..
    function setMintingPrice(uint _price) external onlyOwner {
        _mintingPrice = _price;
    }

    function setDefaultPath(string memory defaultPath_) external onlyOwner {
        _defaultPath = defaultPath_;
    }

    function mintingPrice() external view returns (uint) {
        return _mintingPrice;
    }

    // 사용할 이미지 경로 : defaultPath()/tokenId
    function defaultPath() public view returns (string memory) {
        return _defaultPath;
    }

    // 토큰에 대한 정보가 담긴 JSON 파일에 접근할 수 있도록 파일 경로 반환
    function tokenURI(uint _tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_defaultPath, _tokenId));
    }

    // totalSupply() 모든 토큰의 개수
    // tokenByIndex(_index) 모든 토큰의 해당 인덱스의 토큰 id 조회 함수
    
    // onwerOf(_tokenId) 해당 토큰의 소유자 조회 함수
    // blanceOf(_owner) 계정별 보유 토큰 수량 조회 함수
    // tokenOfOwnerByIndex(_owner, _index) 해당 계정의 보유 토큰의 해당 인덱스의 토큰 id 조회 함수
}

// npx truffle init
// npm i openzeppelin-solidity
// openzeppelin-solidity vs @openzeppelin/contracts
// remixd -s . --remix-ide https://remix.ethereum.org