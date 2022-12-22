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

    // 일반구매
    function purchase(uint256 tokenId) external payable {
        uint256 price = _tokensOnSale[tokenId];
        address tokenOwner = Token.ownerOf(tokenId);

        require(tokenOwner != msg.sender, "owner cannot buy owns");
        require(price > 0, "this nft is not on sale");
        require(msg.value == price, "payment dosen't match");

        uint256 incomeAfterFee = price * (100 - saleFeeRate) / 100;
        (bool success, ) = msg.sender.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        Token.safeTransferFrom(tokenOwner, msg.sender, tokenId);
        _tokensOnSale[tokenId] = 0; // 판매가격 0으로만들면 알아서 판매등록 안된걸로 인식
        // _onSaleIndex -= 0;
    }

    // 일반판매 취소
    function cancleSale(uint256 tokenId) external {
        _tokensOnSale[tokenId] = 0; // 판매가격 0으로만들면 알아서 판매등록 안된걸로 인식
    }

    // 경매중인 토큰 갯수 (테스트 필요)
    function _countOnAuction() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(_tokensOnAuction[tokenId].lastBidPrice != 0) count ++; // lastBidPrice가 0이면 경매등록 안된걸로 인식
        }

        return count;
    }

    // 경매인 토큰 리스트 (테스트 필요)
    function onAuctionList() external view returns(uint256[] memory){
        uint256[] memory tokensOnAuction = new uint256[](_countOnAuction()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(_tokensOnAuction[tokenId].lastBidPrice != 0) {
                tokensOnAuction[index] = tokenId;
                index ++;
            }
        }

        return tokensOnAuction;
    }

    // 경매판매등록
    function registerForAuction(uint256 tokenId, uint256 minimumPrice, uint256 lastingMinutes) external {
        // require(_callerIsOwner(tokenId), "caller is not owner");
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(minimumPrice > 0);
        require(Token.isApprovedForAll(msg.sender, address(this)));

        uint256 endTime = block.timestamp + lastingMinutes * 60;

        _tokensOnAuction[tokenId] = AuctionInfo(minimumPrice, endTime, address(0)); // 최초에 입찰한사람 없음으로 입찰한 계정은 address(0) 
        // _onAuctionIndex += 1;
    }

    // 경매에 입찰하기
    // struct AuctionInfo {
    //     uint256 lastBidPrice; // 마지막 비딩가격은 무조건 최고가
    //     uint256 endTime;
    //     address bider; // 입찰한사람 아무도 없으면 address(0)
    // }
    function bidOnAcution(uint256 tokenId) external payable{
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        uint256 endTime = _tokensOnAuction[tokenId].endTime;
        address bider = _tokensOnAuction[tokenId].bider;
        // {uint256 lastBidPrice, uint256 endTime, address bider} = _tokensOnAuction[tokenId];

        require(Token.ownerOf(tokenId) != msg.sender, "owner cannot bid on owns"); // 자기 경매에 입찰불가
        require(lastBidPrice > 0 , "this token is not on auction"); // 옥션등록안된 토큰
        require(lastBidPrice, "bid must be greater than last bid"); // 입찰가는 해당토큰의 마지막 입찰가보다 높아야함
        require(msg.value - lastBidPrice % 0.001 ether);

    }

    // 실패한 경매 처리
    function cancleFailedAuction() external {

    }

    // 입찰경쟁 밀린사람 환불해주기
    function refundBid() external {

    }

    // 입찰성공한사람 NFT 클레임할수있게 해주기
    function claimTokenForWinner() external {
        
    }




    // function _callerIsOwner(uint256 tokenId) private view returns(bool) {
    //     return Token.ownerOf(tokenId) == msg.sender;
    // }


}