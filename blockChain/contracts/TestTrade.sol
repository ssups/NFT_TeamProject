// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TestToken.sol";
// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract TestTrade is Ownable{
    TestToken public Token;

    uint256 public saleFeeRate = 5; //퍼센트
    // uint256 private _onSaleIndex = 0; // onSale토큰 갯수 파악용
    // uint256 private _onAuctionIndex = 0; // onACUTION토큰 갯수 파악용

    struct AuctionInfo {
        uint256 lastBidPrice; // 마지막 비딩가격은 무조건 최고가
        uint256 endTime;
        address bider; // 입찰한사람 아무도 없으면 address(0)
    }

    mapping(uint => uint) private _tokensOnSale;
    // tokenId to price
    mapping(uint => AuctionInfo) private _tokensOnAuction;
    // tokenId to AuctionInfo

    constructor(address tokenAddress_) {
        Token = TestToken(tokenAddress_);
    }

    // 판매수수료 재설정
    function setSaleFeeRate(uint256 rate) external onlyOwner {
        saleFeeRate = rate;
    } 

    // 일반판매중인 토큰 갯수
    function _countOnSale() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(_tokensOnSale[tokenId] != 0) count ++;
        }

        return count;
    }

    // 일반판매중인 토큰 리스트
    function onSaleList() external view returns(uint256[] memory){
        uint256[] memory tokensOnSale = new uint256[](_countOnSale()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(_tokensOnSale[tokenId] != 0) {
                tokensOnSale[index] = tokenId;
                index ++;
            }
        }

        return tokensOnSale;
    }


    // 일반판매 가격 확인
    function onSalePrice(uint256 tokenId) external view  returns(uint256)  {
        return _tokensOnSale[tokenId];
    }

  

    // 일반판매등록  
    function registerForSale(uint256 tokenId, uint256 price) external {
        // require(_callerIsOwner(tokenId), "caller is not owner");
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(price > 0);
        // Nft 컨트렉트에 setApprovalForAll(address operator, bool approved) 이거 operator 이 컨트렉트 CA로 넣어서 프론트에서 먼저 실행시켜줘야함.
        require(Token.isApprovedForAll(msg.sender, address(this)));

        _tokensOnSale[tokenId] = price;
        // _onSaleIndex += 1;
    }

    // 경매판매등록
    function registerForAuction(uint256 tokenId, uint256 mintPrice, uint256 lastingDays) external {
        // require(_callerIsOwner(tokenId), "caller is not owner");
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(mintPrice > 0);
        require(Token.isApprovedForAll(msg.sender, address(this)));

        uint256 endTime = block.timestamp + lastingDays * 60 * 60 * 24;

        _tokensOnAuction[tokenId] = AuctionInfo(mintPrice, endTime, address(0)); 
        // _onAuctionIndex += 1;
    }

    // 일반구매
    function purchase(uint256 tokenId) external payable {
        uint256 price = _tokensOnSale[tokenId];
        uint256 incomeAfterFee = price * (100 - saleFeeRate) / 100;
        address tokenOwner = Token.ownerOf(tokenId);

        require(tokenOwner != msg.sender, "owner cannot buy owns");
        require(price > 0, "this nft is not on sale");
        require(msg.value == price, "payment dosen't match");

        (bool success, ) = msg.sender.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        Token.safeTransferFrom(tokenOwner, msg.sender, tokenId);
        _tokensOnSale[tokenId] = 0; // 판매가격 0으로 만들기
        // _onSaleIndex -= 0;
    }

    // 경매에 입찰하기
    function bidOnAcution() external payable{

    }

    // 실패한 경매 처리
    function cancleFailedAuction() external {

    }

    // 입찰경쟁 밀린사람 환불해주기
    function refundBid() external {

    }

    // 
    function claimTokenForWinner() external {
        
    }




    // function _callerIsOwner(uint256 tokenId) private view returns(bool) {
    //     return Token.ownerOf(tokenId) == msg.sender;
    // }


}