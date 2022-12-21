// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// 확장성 고려
// import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// remix 경로 수정
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// NFT 발행에 대한 컨트랙트
contract MintingNft is ERC721Enumerable, Ownable {

    // 토큰 발행량 제한
    uint immutable private _mintingLimit;

    // 랜덤의 토큰을 발행 받기 위한 고정 비용 (wei 단위)
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

    // json 파일 이름을 tokenId로 활용 예정
    function mintToken(address _tokenOwner, uint _tokenId) external payable {

        // wei 단위
        require(_mintingPrice <= msg.value, "insufficient money to mint");

        // 현재 발행량 확인 후 토큰 발행
        require(totalSupply() < _mintingLimit, "exceeding the maximum issuance");

        payable(owner()).transfer(_mintingPrice);

        // ERC721Enumerable 상태 변수 업데이트
        // 소유자 없는 토큰을 추가로 하나 더 발행하는 이슈 발생..
        _beforeTokenTransfer(address(0), _tokenOwner, _tokenId, 1);

        // event indexed 키워드 확인..
        // ERC721 상태 변수 업데이트 (토큰 id 중복 확인 및 event 기능 내장)
        _mint(_tokenOwner, _tokenId);
    }

    // 토큰 소유자 변경 함수
    function transferToken(address _from, address _to, uint _tokenId) external {
        
        emit Transfer(_from, _to, _tokenId);

        transferFrom(_from, _to, _tokenId);

        _beforeTokenTransfer(_from, address(0), _tokenId, 1);
        _beforeTokenTransfer(address(0), _to, _tokenId, 1);
    }

    // _allTokens 모든 토큰 id 배열
    // _allTokensIndex 토큰 id => 모든 토큰 배열의 인덱스
    // _ownedTokens 소유자 주소 => (보유 토큰 인덱스 => 토큰 id)
    // _ownedTokensIndex 토큰 id => 소유자 기준 보유 토큰 인덱스

    // wei 단위
    function setMintingPrice(uint _price) external onlyOwner {

        require(_mintingPrice != _price, "same as previous price");

        _mintingPrice = _price;
    }

    function setDefaultPath(string memory defaultPath_) external onlyOwner {
        _defaultPath = defaultPath_;
    }
    
    // 토큰에 대한 정보가 담긴 JSON 파일에 접근할 수 있도록 파일 경로를 반환하는 함수
    function tokenURI(uint _tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_defaultPath, _tokenId));
    }

    // 보유 토큰 조회 함수
    function getMyTokenIds(address _owner) external view returns (uint[] memory) {
        
        // 보유 토큰 수
        uint count = balanceOf(_owner);
        
        require(count > 0, "no token");

        uint[] memory tokenIds = new uint[](count);
        
        // for문 대신 가스비를 절약할 방법..
        for (uint index = 0; index < count; index++)

            // push 사용 불가
            tokenIds[index] = tokenOfOwnerByIndex(_owner, index);

        return tokenIds;
    }
    
    // 해당 함수를 호출하는 계정을 반환하는 함수
    // function msgSender() external view returns (address) {
    //     return _msgSender();
    // }

    function mintingPrice() external view returns (uint) {
        return _mintingPrice;
    }

    // 사용할 이미지 경로 : defaultPath() / tokenId
    function defaultPath() external view returns (string memory) {
        return _defaultPath;
    }

    // 함수 코드 순서
    // set => view => public => external => private

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