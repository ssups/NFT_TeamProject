// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MintingNft.sol";

// onlyOwner 접근 제어자 사용을 위해 상속
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// remix 경로 수정
import "@openzeppelin/contracts/access/Ownable.sol";

contract TradingNft is Ownable {

    MintingNft private _MintingNft;

    // 일반 판매 및 경매 성사 시 판매자에 대한 수수료율
    // 1 / 1000 = 0.1% 계산할 예정
    uint private _saleFeeRate;
    uint private _saleFeeDigits;
    uint private _auctionFeeRate;
    uint private _auctionFeeDigits;

    struct TokenData {

        address seller;
        
        // wei 단위
        uint price;
    }

    mapping (uint => TokenData) private _saleTokenIdToData;
    mapping (uint => TokenData) private _auctionTokenIdToData;

    constructor(address _ca, uint saleFeeRate_, uint saleFeeDigits_, uint auctionFeeRate_, uint auctionFeeDigits_) {

        // 상호 작용을 통해 해당 컨트랙트의 함수 모두 사용 가능
        _MintingNft = MintingNft(_ca);

        _saleFeeRate = saleFeeRate_;
        _saleFeeDigits = saleFeeDigits_;
        _auctionFeeRate = auctionFeeRate_;
        _auctionFeeDigits = auctionFeeDigits_;
    }

    // - 토큰 판매 등록 : registerSaleToken()
    // - 토큰 판매 등록 취소 : deregisterSaleToken()
    // - 토큰 구매 : buyToken()
    // - 토큰 경매 등록 : registerAuctionToken()
    // - 토큰 입찰 : bidTokenAtAuction()
    // - 토큰 낙찰 (기간 종료 및 최소 가격 이상 시 최고 가격으로 낙찰) : winTokenAtAuction()
    // - 경매 종료 시 환불 : refundTokenAtAuction()

    // 토큰 판매 등록 함수
    function registerSaleToken(uint _tokenId, uint _price) external {

        _requireTokenOwner(_tokenId);

        // 등록 후 가격을 변경하려는 경우
        require(!_isOnSale(_tokenId) || _price != _saleTokenIdToData[_tokenId].price, "register already at the same price");

        // setApprovalForAll() 내장 함수의 msg.sender 값과 address(this) 값이 동일하기 때문에 여기서는 호출 불가
        // _MintingNft.setApprovalForAll(address(this), true);

        address seller = _MintingNft.ownerOf(_tokenId);
        require(_MintingNft.isApprovedForAll(seller, address(this)), "did not approve");

        // 판매 가격은 0원 이상으로 설정 가능
        require(_price >= 0, "invalid price");

        _saleTokenIdToData[_tokenId] = TokenData(seller, _price);
    }

    // 토큰 판매 등록 취소 함수
    function deregisterSaleToken(uint _tokenId) external {

        _requireOnSale(_tokenId);
        _requireTokenOwner(_tokenId);

        // 값이 초기 값으로 변경되는지 확인 필요..
        delete _saleTokenIdToData[_tokenId];
    }

    // 토큰 구매 함수 test
    function buyToken(uint _tokenId) external payable {
        
        _requireOnSale(_tokenId);
        
        // 판매자는 구매 불가
        require(!_isTokenOwner(_tokenId), "seller can not buy");

        uint price = _saleTokenIdToData[_tokenId].price;
        require(price <= msg.value, "insufficient money to buy token");

        // wei 단위
        address seller = _saleTokenIdToData[_tokenId].seller;
        payable(seller).transfer(price - _getSaleFee(price));

        // 토큰 소유자 변경
        _MintingNft.transferToken(seller, msg.sender, _tokenId);

        // 초기 값으로 변경
        delete _saleTokenIdToData[_tokenId];
    }

    function setMintingNft(address _ca) external onlyOwner {
        _MintingNft = MintingNft(_ca);
    }

    function setSaleFeeRate(uint saleFeeRate_) external onlyOwner {
        _saleFeeRate = saleFeeRate_;
    }

    function setSaleFeeDigits(uint saleFeeDigits_) external onlyOwner {
        _saleFeeDigits = saleFeeDigits_;
    }

    function setAuctionFeeRate(uint auctionFeeRate_) external onlyOwner {
        _auctionFeeRate = auctionFeeRate_;
    }

    function setAuctionFeeDigits(uint auctionFeeDigits_) external onlyOwner {
        _auctionFeeDigits = auctionFeeDigits_;
    }

    // 수수료 계산 함수 (0원 상품도 계산 가능)
    function _getSaleFee(uint _price) public view returns (uint) {
        return _price * _saleFeeRate / _saleFeeDigits;
    }

    // MintingNft 컨트랙트의 CA 값 반환
    // function getMintingNft() external view returns (MintingNft) {
    //     return _MintingNft;
    // }

    // 상호작용 하는 컨트랙트에서 호출할 경우 호출한 컨트랙트의 CA 값 반환
    // function msgSender() external view returns (address) {
    //     return _MintingNft.msgSender();
    // }

    function getSaleFeeRate() external view returns (uint) {
        return _saleFeeRate;
    }

    function getSaleFeeDigits() external view returns (uint) {
        return _saleFeeDigits;
    }

    function getAuctionFeeRate() external view returns (uint) {
        return _auctionFeeRate;
    }

    function getAuctionFeeDigits() external view returns (uint) {
        return _auctionFeeDigits;
    }

    // test
    function getSaleTokenData(uint _tokenId) public view returns (TokenData memory) {
        return _saleTokenIdToData[_tokenId];
    }

    function getAuctionTokenData(uint _tokenId) external view returns (TokenData memory) {
        return _auctionTokenIdToData[_tokenId];
    }

    // 토큰의 소유주인지 확인하는 함수
    // msg.sender 값을 사용할 예정이기 때문에 private 설정
    function _requireTokenOwner(uint _tokenId) private view {

        // tokenId 유효성 검사 포함
        require(_isTokenOwner(_tokenId), "not the owner");
    }

    function _isTokenOwner(uint _tokenId) private view returns (bool) {
        return msg.sender == _MintingNft.ownerOf(_tokenId);
    }

    // 판매 중인 상품인지 확인하는 함수
    function _requireOnSale(uint _tokenId) private view {
        require(_isOnSale(_tokenId), "not on sale");
    }

    function _isOnSale(uint _tokenId) private view returns (bool) {
        return _saleTokenIdToData[_tokenId].seller != address(0);
    }
}

// 함수 코드 순서
// set => view => external => private