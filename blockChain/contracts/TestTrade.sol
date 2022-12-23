// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TestToken.sol";

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// remix 전용 경로
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

    event BidOnAuction(uint256 tokenId, uint256 bidPrice , address bider);
    event RefundBid(uint256 tokenId, address failedBider);

    // 판매수수료 재설정
    function setSaleFeeRate(uint256 rate) external onlyOwner {
        saleFeeRate = rate;
    } 

    // 일반판매중인 토큰 갯수(테스트완료)
    function _countOnSale() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(_tokensOnSale[tokenId] != 0) count ++;
        }

        return count;
    }

    // 일반판매중인 토큰 리스트(테스트 완료)
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

    // 일반판매중인 토큰 가격 확인(테스트 완료)
    function priceOfOnSale(uint256 tokenId) public view  returns(uint256)  {
        require(_tokensOnSale[tokenId] > 0, "this token is not on sale");
        return _tokensOnSale[tokenId];
        // 이값이 0보다크면 일반판매중인 토큰(토큰 판매중인지 확인할때도 사용가능)
    }  

    // 일반판매등록(테스트 완료)
    function registerForSale(uint256 tokenId, uint256 price) external {
        // require(_callerIsOwner(tokenId), "caller is not owner");
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(price > 0, "price must be greater than zero");
        require(dataOfOnAuction(tokenId).endTime < block.timestamp, "this token is on auction"); // 경매등록한건 일반판매등록안되게 하기
        // 프론트에서 Nft 컨트렉트에 setApprovalForAll(address operator, bool approved)
        // 이거 operator에 컨트렉트 CA로넣어서 프론트에서 먼저 실행시켜줘야함.
        require(Token.isApprovedForAll(msg.sender, address(this)));

        _tokensOnSale[tokenId] = price;
        // _onSaleIndex += 1;

    }

    // 일반판매 취소(테스트 완료)
    function cancleSale(uint256 tokenId) public {
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(_tokensOnSale[tokenId] > 0, "this token is not on sale");
        _tokensOnSale[tokenId] = 0; // 판매가격 0으로만들면 알아서 판매등록 안된걸로 인식
        // Token.setApprovalForAll(address(this), false); // approve 승인한거 다시 취소하기
        // 위에꺼 실행안되는데 저함수 require에 operater != msg.sender 가 통과가 안된다
        // 둘다 이 컨트렉트 CA로 인식되기 때문에...
        // 그래서 아마 프론트에서 직접 토큰 컨트렉트 setApprovalForAll(이 컨트렉트 CA, false)로 실행시켜줘야할거 같다.
        // 근데 어차피 컨트렉트어드레스에 권한을 준거라서 악용되기 힘들거같은데 안해줘도 괜찮을듯 하다,
    }

    // 일반구매(테스트 완료)
    function purchase(uint256 tokenId) external payable {
        uint256 price = _tokensOnSale[tokenId];
        address tokenOwner = Token.ownerOf(tokenId);

        require(tokenOwner != msg.sender, "owner cannot buy owns");
        require(price > 0, "this nft is not on sale");
        require(msg.value == price, "payment dosen't match");
        // 판매등록한 토큰 transferFrom 함수로 다른계정으로 보내버릴수도 있는데
        // 그렇게되면 아마 토큰 받은 계정에 판매금액 들어가고 토큰은 구매자한테 전달될꺼기 때문에 괜찮을듯?

        uint256 incomeAfterFee = price * (100 - saleFeeRate) / 100;
        (bool success, ) = tokenOwner.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        Token.safeTransferFrom(tokenOwner, msg.sender, tokenId);
        cancleSale(tokenId);
        // _onSaleIndex -= 0;
    }


    // 경매중인 토큰 갯수 (테스트 완료)
    function _countOnAuction() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
            uint256 endTime = _tokensOnAuction[tokenId].endTime;

            if(lastBidPrice != 0 && endTime > block.timestamp) {
                count ++;
            } // lastBidPrice가 0이면 경매등록 안된걸로 인식
              // endTime 이 block.timestamp 보다 작으면은 경매가 만료된거다.
        }

        return count;
    }

    // 경매중인 토큰 리스트 (테스트 완료)
    function onAuctionList() public view returns(uint256[] memory){
        uint256[] memory tokensOnAuction = new uint256[](_countOnAuction()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
            uint256 endTime = _tokensOnAuction[tokenId].endTime;

            if(lastBidPrice != 0 && endTime > block.timestamp) {
                tokensOnAuction[index] = tokenId;
                index ++;
            } // lastBidPrice가 0이면 경매등록 안된걸로 인식
              // endTime 이 block.timestamp 보다 작으면은 경매가 만료된거다.
        }

        return tokensOnAuction;
    }

    // 경매중인 토큰 정보 조회(테스트완료)
    function dataOfOnAuction(uint256 tokenId) public view returns(AuctionInfo memory){
        return _tokensOnAuction[tokenId];
    }

    // 경매판매등록(테스트완료)
    function registerForAuction(uint256 tokenId, uint256 minimumPrice, uint256 lastingMinutes) external {
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(minimumPrice >= 0.001 ether, "minimumPrice must be greater thans 0.001 ether"); // 이거 경매입찰할떄 최소단위 통과조건때문에 필요함
        require(!priceOfOnSale(tokenId) > 0, "this token is on Sale"); // 일반판매중인 토큰은 경매등록 불가
        require(dataOfOnAuction(tokenId).endTime < block.timestamp, "this token is already on auction"); // 경매 중복등록 불가
        // 프론트에서 Nft 컨트렉트에 있는 setApprovalForAll(address operator, bool approved)
        // 이거 operator에 이 컨트렉트 CA 넣어서 프론트에서 먼저 실행시켜줘야함.
        require(Token.isApprovedForAll(msg.sender, address(this)), "not approved");

        uint256 endTime = block.timestamp + lastingMinutes * 60;

        _tokensOnAuction[tokenId] = AuctionInfo(minimumPrice, endTime, address(0)); // 최초에 입찰한사람 없음으로 입찰한 계정은 address(0) 
        // _onAuctionIndex += 1;
    }

    // 경매에 입찰하기(테스트완료)
    function bidOnAcution(uint256 tokenId) external payable {
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        uint256 endTime = _tokensOnAuction[tokenId].endTime;
        address bider = _tokensOnAuction[tokenId].bider;
        // {uint256 lastBidPrice, uint256 endTime, address bider} = _tokensOnAuction[tokenId];

        require(block.timestamp < endTime, "this acution ended"); // 시간지난 경매 입찰불가
        require(Token.ownerOf(tokenId) != msg.sender, "owner cannot bid on owns"); // 자기 경매에 입찰불가
        require(lastBidPrice > 0 , "this token is not on auction"); // 옥션등록안된 토큰
        require(msg.value > lastBidPrice, "bid must be greater than last bid"); // 입찰가는 해당토큰의 마지막 입찰가보다 높아야함
        require((msg.value - lastBidPrice) % 0.001 ether == 0, ""); // 입찰단위는 0.001이더 단위로

        if(bider != address(0)) { // 전에 입찰한사람이 있을경우
            _refundBid(tokenId ,bider ,lastBidPrice); // 전에입찰한사람한테 환불해주기
        }

        _tokensOnAuction[tokenId].lastBidPrice = msg.value;
        _tokensOnAuction[tokenId].bider = msg.sender;

        emit BidOnAuction(tokenId, msg.value , bider);
    }

    // 입찰경쟁 밀린사람 환불해주기(테스트완료)
    function _refundBid(uint256 tokenId ,address to, uint256 bidPrice) private {
        payable(to).transfer(bidPrice);

        emit RefundBid(tokenId, to);
    }   

    // 실패한 경매 처리(아무런 입찰없이 경매기간끝났을때)
    function cancleFailedAuction(uint tokenId) external {
        // 경매기간 끝나면 endTime 이 block.timestamp보다 커져서 알아서 경매중이 아닌걸로 인식될거라서
        // 따로 처리 안해줘도 될듯한데 혹시 모르니
        // 경매 입찰없이 마감된 경매 다시 경매등록하거나 판매등록하는거 한번 테스트해보기

        // 컨트렉트한테 준 approve 취소하는거 해야할까?

        // uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        // uint256 endTime = _tokensOnAuction[tokenId].endTime;
        // address bider = _tokensOnAuction[tokenId].bider;

        // require(endTime > block.timestamp, "auction not ended yet"); //경매기간 끝났는지 확인
        // require(lastBidPrice > 0, "acution already ended"); // 이미 경매기간 
    }

    // 입찰성공한사람 토큰(NFT) 클레임할수있게 해주기(경매기간끝났을때)(테스트완료)
    function claimTokenForWinner(uint256 tokenId) external {
        uint256 endTime = _tokensOnAuction[tokenId].endTime;
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        address bider = _tokensOnAuction[tokenId].bider;
        address tokenOwner = Token.ownerOf(tokenId);

        require(endTime < block.timestamp, "auction not ended");
        require(lastBidPrice != 0, "this token is not on auction");
        require(bider == msg.sender, "caller is not highest bider");

         uint256 incomeAfterFee = lastBidPrice * (100 - saleFeeRate) / 100;
        (bool success, ) = tokenOwner.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        Token.safeTransferFrom(tokenOwner, msg.sender, tokenId);
        // 그래서 프론트에서 토큰 컨트렉트 setApprovalForAll(이 컨트렉트 CA, false)실행시켜서 권한 다시 없애기.
        // 근데 어차피 컨트렉트어드레스에 권한을 준거라서 악용되기 힘들거같은데 안해줘도 괜찮을듯 하다,
        
        // _tokensOnAuction[tokenId].endTime = 0; 
        // _tokensOnAuction[tokenId].lastBidPrice = 0;
        // _tokensOnAuction[tokenId].bider = addres(0); // 이거세개 안해줘도 경매중인토큰 조회할때 경매시간지난거는 자동 제외되기때문에 실행안시켜줘도될듯
    }


    // 내가 입찰중인(내 입찰가가 최고입찰가인) 토큰갯수(테스트 완료)
    function _countOnBid(address owner) private view returns(uint256) {
        uint256 count = 0;
        uint256 countOnAuction = _countOnAuction();
        uint256[] memory listOnAuction = onAuctionList();

        for(uint i = 0; i < countOnAuction; i++) {
            uint256 tokenId = listOnAuction[i];
            if(_tokensOnAuction[tokenId].bider == owner) {
                count ++;
            } 
        }
        return count;
    }

    // 내가 입찰중인(내 입찰가가 최고입찰가인) 토큰 조회(테스트 완료)
    function onBidList(address owner) external view returns(uint256[] memory){
        uint256[] memory tokensOnBid = new uint256[](_countOnBid(owner)); // 배열크기 미리배정
        uint256 countOnAuction = _countOnAuction();
        uint256[] memory listOnAuction = onAuctionList();
        uint256 index = 0;

        for(uint i = 0; i < countOnAuction; i++){
            uint256 tokenId = listOnAuction[i];
            if(_tokensOnAuction[tokenId].bider == owner){
                tokensOnBid[index] = tokenId;
                index ++;
            }
        }
        return tokensOnBid;
    }

    function withdrawFees() external onlyOwner {
        // 입찰때문에 받아놓은 입찰가금액들 제외하고 출금하게 하기
    }

}