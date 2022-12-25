// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./TestToken.sol";

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// remix 전용 경로
// import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract TestTrade is Ownable{
    TestToken public Token;

    uint256 public saleFeeRate = 5; //퍼센트

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

    event RegisterForAuction(uint256 tokenId);
    event BidOnAuction(uint256 tokenId, uint256 bidPrice , address bider);
    event RefundBid(uint256 tokenId, address failedBider);
    event ClaimMatchedAuction(uint256 tokenId, address caller);

    // CA값 받기
    function getCA() external view returns(address){
      return(address(this));
    }

    // 판매수수료 재설정
    function setSaleFeeRate(uint256 rate) external onlyOwner {
        saleFeeRate = rate;
    } 

    // 수수료 얼만지 계산해주는 함수
    function calculateFee(uint256 price) public view returns(uint256) {
        return price * saleFeeRate / 100;
    }

    // 수수료 제외한 판매금 계산해주는 함수
    function afterFee(uint256 price) public view returns(uint256) {
        return price - calculateFee(price);
    }

    // 일반판매중인지 확인하는 함수
    function isOnSale(uint256 tokenId) public view returns(bool) {
        return (_tokensOnSale[tokenId] != 0);
        // 판매중이면 true 아니면 false
    }

    // 일반판매중인 토큰 갯수(테스트완료)
    function _countOnSale() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isOnSale(tokenId)) count ++;
        }

        return count;
    }

    // 일반판매중인 토큰 리스트(테스트 완료)
    function onSaleList() external view returns(uint256[] memory){
        uint256[] memory tokensOnSale = new uint256[](_countOnSale()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isOnSale(tokenId)) {
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
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(price > 0, "price must be greater than zero");
        require(!isOnAuction(tokenId), "this token is on auction"); // 경매등록한건 일반판매등록안되게 하기
        // 프론트에서 Nft 컨트렉트에 setApprovalForAll(address operator, bool approved)
        // 이거 operator에 컨트렉트 CA로넣어서 프론트에서 먼저 실행시켜줘야함.
        require(Token.isApprovedForAll(msg.sender, address(this)));

        _tokensOnSale[tokenId] = price;
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

        uint256 incomeAfterFee = afterFee(price);
        (bool success, ) = tokenOwner.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        Token.safeTransferFrom(tokenOwner, msg.sender, tokenId);
        // 여기서 토큰 소유권이 구매자에게 넘어가기때문에 cancleSale 함수에서
        // require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner"); 이게 통과가 된다.
        cancleSale(tokenId);
    }


    // 경매중인 토큰 갯수 (테스트 완료)
    function _countOnAuction() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isOnAuction(tokenId)) {
                count ++;
            }
            // endTime 이 block.timestamp 보다 작으면은 경매가 만료된거다.
        }

        return count;
    }

    // 경매중인 토큰 리스트 (테스트 완료)
    function onAuctionList() public view returns(uint256[] memory){
        uint256[] memory tokensOnAuction = new uint256[](_countOnAuction()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isOnAuction(tokenId)) {
                tokensOnAuction[index] = tokenId;
                index ++;
            } 
            // endTime 이 block.timestamp 보다 작으면은 경매가 만료된거다.
        }

        return tokensOnAuction;
    }

    // 경매중인 토큰 정보 조회(테스트완료)
    function dataOfOnAuction(uint256 tokenId) public view returns(AuctionInfo memory){
        // require(_tokensOnAuction[tokenId].endTime > block.timestamp, "this token is not on Auction");
        return _tokensOnAuction[tokenId];
    }

    // 해당토큰 경매중인지 확인
    function isOnAuction(uint256 tokenId) public view returns(bool) {
        return (_tokensOnAuction[tokenId].endTime > block.timestamp);
        // 경매마감시간이 현재시간보다 크면 경매진행중 true
    }

    // 경매판매등록(테스트완료)
    function registerForAuction(uint256 tokenId, uint256 minimumPrice, uint256 lastingMinutes) external {
        require(Token.ownerOf(tokenId) == msg.sender, "caller is not owner");
        require(minimumPrice >= 0.001 ether, "minimumPrice must be greater thans 0.001 ether"); // 이거 경매입찰할떄 최소단위 통과조건때문에 필요함
        require(!isOnSale(tokenId), "this token is already on Sale"); // 일반판매중인 토큰은 경매등록 불가
        require(_tokensOnAuction[tokenId].endTime < block.timestamp, "this token is already on auction"); // 경매 중복등록 불가
        // 프론트에서 Nft 컨트렉트에 있는 setApprovalForAll(address operator, bool approved)
        // 이거 operator에 이 컨트렉트 CA 넣어서 프론트에서 먼저 실행시켜줘야함.
        require(Token.isApprovedForAll(msg.sender, address(this)), "not approved");

        uint256 endTime = block.timestamp + lastingMinutes * 60;

        _tokensOnAuction[tokenId] = AuctionInfo(minimumPrice, endTime, address(0)); // 최초에 입찰한사람 없음으로 입찰한 계정은 address(0) 

        emit RegisterForAuction(tokenId);
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

        emit BidOnAuction(tokenId, msg.value , msg.sender);
    }

    // 입찰경쟁 밀린사람 환불해주기(테스트완료)
    function _refundBid(uint256 tokenId ,address to, uint256 bidPrice) private {
        // payable(to).transfer(bidPrice);
        (bool success, ) = to.call{value: bidPrice}("");
        require(success, "refund failed");

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

    // 입찰성공한사람 토큰(NFT) 클레임할수있게 해주기(경매기간끝났을때)
    // 경매판매성공한사람 판매금액 클레임할수있게 해주기
    // 둘중 한사람만 실행하면 된다.
    function claimMatchedAuction(uint256 tokenId) external {
        uint256 endTime = _tokensOnAuction[tokenId].endTime;
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        address bider = _tokensOnAuction[tokenId].bider;
        address tokenOwner = Token.ownerOf(tokenId);

        require(endTime < block.timestamp, "auction not ended");
        require(lastBidPrice != 0, "this token did not registered on auction");
        require(bider != address(0), "already claimed or failed auction");
        require(msg.sender == bider || msg.sender == tokenOwner , "caller is not highest bider nor seller");

        // 경매 등록자 판매금 주기
        uint256 incomeAfterFee = afterFee(lastBidPrice);
        (bool success, ) = tokenOwner.call{value: incomeAfterFee}("");
        require(success, "payment failed");

        // 입찰자 토큰 주기
        Token.safeTransferFrom(tokenOwner, bider, tokenId); // 이거하면 토큰 오너 바뀌고
        _tokensOnAuction[tokenId].bider = address(0); 
        // _tokensOnAuction[tokenId].lastBidPrice = 0; // 이것도 수정안해줘도됨
        // _tokensOnAuction[tokenId].endTime = 0; // 이건 endTime이 경매끝나면 알아서 block.timestamp 보다 작아지니깐 수정안해줘도되고

        emit ClaimMatchedAuction(tokenId, msg.sender); // 경매등록자 입찰자 둘중에 누가 클레임했는지 알려주기
    }

    // 정산대상인지 확인하는 함수
    function isNeedToClaim(uint256 tokenId) public view returns(bool){
        uint256 endTime = _tokensOnAuction[tokenId].endTime;
        address bider = _tokensOnAuction[tokenId].bider;

        return(bider != address(0) && endTime < block.timestamp);
        // 정산대상이면 true 아니면 false
        // 정산때 bider값을 address(0)로 바꿔준다
        // 경매시간은 지났지만 bider값이 address(0)이 아니기때문에 정산이 안된 토큰이다.
        // 따라서 경매시간이 지나고 bider 값이 address(0)인거는 
        // 경매가 실패한 토큰 혹은 경매에 한번도 등록되지 않은 토큰 혹은 정산이 완료된 토큰이다.
    }

    // 경매성공했지만 정산되지않은 토큰 갯수
    function _countNotClaimedAuction() private view returns(uint256) {
        uint256 count;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isNeedToClaim(tokenId)) {
                count ++;
            } 
        }

        return count;
    }

    // 경매종료됐지만 정산되지않은 토큰 리스트
    function notClaimedAuctionList() public view returns(uint256[] memory){
        uint256[] memory tokensNotClaimedOnAuction = new uint256[](_countNotClaimedAuction()); // 배열크기 미리배정
        uint256 index = 0;

        for(uint tokenId = 1; tokenId <= Token.totalSupply(); tokenId++) {
            if(isNeedToClaim(tokenId)) {
                tokensNotClaimedOnAuction[index] = tokenId;
                index ++;
            } 
        }

        return tokensNotClaimedOnAuction;
    }

    // 내가 입찰한것중에 정산되지 않은 토큰 갯수 - 경매끝
    function _countNotClaimedTokenOfBider(address owner) public view returns(uint256) {
        uint256 count = 0;
        uint256 countNotClaimedAuction = _countNotClaimedAuction();
        uint256[] memory tokensNotClaimedOnAuction = notClaimedAuctionList();

        for(uint256 i = 0; i < countNotClaimedAuction; i++) {
            uint256 tokenId = tokensNotClaimedOnAuction[i]; 
            if(_tokensOnAuction[tokenId].bider == owner) {
                count++;
            }
        }

        return count;
    }
    
    // 내가 입찰한것중에 정산되지 않은 토큰 리스트 - 경매끝
    function notClaimedTokensOfBiderList(address owner) public view returns(uint256[] memory) {
        uint256[] memory notClaimedtokensOfBider = new uint256[](_countNotClaimedTokenOfBider(owner)); // 배열크기 미리배정
        uint256[] memory tokensNotClaimedOnAuction = notClaimedAuctionList();
        uint256 countNotClaimedAuction = _countNotClaimedAuction();
        uint256 index = 0;

        for(uint256 i = 0; i < countNotClaimedAuction; i++) {
            uint256 tokenId = tokensNotClaimedOnAuction[i]; 
            if(_tokensOnAuction[tokenId].bider == owner) {
                notClaimedtokensOfBider[index] = tokenId;
                index ++;
            }
        }

        return notClaimedtokensOfBider;
    }


    // 내가 입찰중인(내 입찰가가 최고입찰가인) 토큰갯수(테스트 완료) - 경매중
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

    // 내가 입찰중인(내 입찰가가 최고입찰가인) 토큰 조회(테스트 완료) - 경매중
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

    // 경매 낙찰된 토큰의 수수료 반환하는 함수
    function feeOfMatchedAuctionToken(uint256 tokenId) public view returns(uint256) {
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        return calculateFee(lastBidPrice);
    }

    // 낙찰된 토큰의 정산액(수수료제외한)을 반환하는 함수
    function afterFeeOfNotClaimedToken(uint256 tokenId) public view returns (uint256) {
        uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
        return lastBidPrice - feeOfMatchedAuctionToken(tokenId);
    }

    // 경매는종료됐지만 정산되지않은 금액들 합(수수료 제외)
    function _notClaimedMoney() private view returns(uint256) {
        uint256[] memory tokensNotClaimedOnAuction = notClaimedAuctionList();
        uint256 notClaimedMoney;

        for (uint i = 0; i < tokensNotClaimedOnAuction.length; i++ ) {
            uint256 tokenId = tokensNotClaimedOnAuction[i];
            uint256 lastBidPrice = _tokensOnAuction[tokenId].lastBidPrice;
            uint256 priceAfterFee = afterFee(lastBidPrice);
            notClaimedMoney += priceAfterFee;
        }

        return notClaimedMoney;
    }


    // 수수료 출금
    function withdrawFees() external onlyOwner {
        // 입찰때문에 받아놓은 입찰가금액들 제외하고 출금하게 하기        
        uint256 notClaimedMoney = _notClaimedMoney();
        uint256 balanceExceptNotClaimedMoney = address(this).balance - notClaimedMoney;

        require(balanceExceptNotClaimedMoney > 0, "balance without notClaimedMoney is zero");

        (bool success, ) = msg.sender.call{value: balanceExceptNotClaimedMoney}("");
        require(success, "withdraw failed");
    }

}

