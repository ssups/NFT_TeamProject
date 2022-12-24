# 2022 12 19 월

<br>

## ⭕ back 폴더

- config 폴더 : index.js (dotenv)
- controller 폴더 : app.js (express, cors)
- models 폴더 : index.js (sequelize, mysql2)

<br>

## ⭕ blockChain 폴더

- contracts 폴더
- migrations 폴더
- test 폴더

<br>

## ⭕ front 폴더

- public 폴더 : index.html
- src 폴더
  - components 폴더
  - hooks 폴더 : useWeb.js
  - pages 폴더
  - redux 폴더
    - middleware 폴더 : index.js
    - reducer 폴더 : index.js
    - store.js

<br>

---

18 01 문서 작성 완료

Q1. ERC721 vs ERC721Enumerable

---

<br>

# 2022 12 20 화

A1. ERC721Enumerable : 확장성 => supportsInterface(interfaceId), tokenOfOwnerByIndex(owner, index), totalSupply(), tokenByIndex(index), _beforeTokenTransfer(from, to, firstTokenId, batchSize)


    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool) {
        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
    }


    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
        require(index < ERC721.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }


    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _allTokens.length;
    }


    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
        require(index < ERC721Enumerable.totalSupply(), "ERC721Enumerable: global index out of bounds");
        return _allTokens[index];
    }


    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

<br>

## ⭕ ERC721Enumerable 상태 변수

<br>

- 토큰 id 배열
- uint256[] private _allTokens;

<br>

- 토큰 id => 모든 토큰 배열의 인덱스
- mapping(uint256 => uint256) private _allTokensIndex;

<br>

- 소유자 주소 => (보유 토큰 인덱스 => 토큰 id)
- mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

<br>

- 토큰 id => 소유자 기준 보유 토큰 인덱스
- mapping(uint256 => uint256) private _ownedTokensIndex;

<br>

---

Q2. NTF의 토큰 단위? SYMBOL..

10 48 MintingNFT 컨트랙트의 상태 변수 작성 중

---

Q3. A3. ERC721Enumerable 컨트랙트에 내장된 이벤트 함수

## ⭕ IERC721

<br>

- 토큰 전송 이벤트
- Transfer(from, to, tokenId)

<br>

- 토큰 위임 이벤트
- Approval(owner, approved, tokenId)


<br>

- owner의 승인된 operator에 대한 활성화 이벤트
- ApprovalForAll(owner, operator, approved)

<br>

---

Q4. _beforeTokenTransfer() 함수 역할

A4. 실행 전에 체크할 사항 설정

- 토큰 발행 시 RC721Enumerable 상태 변수를 업데이트 하는 함수와 ERC721 상태 변수를 업데이트 하는 함수 모두 호출 필요
- super의 역할 : 부모 함수 + @

---

Q5. override 함수의 접근 제어는 동일 해야 하는 것인가..
Q6. 컨트랙트에 이미지 경로를 저장해야 하는 것인가..

14 13 MintingNft 컨트랙트 테스트

15 36 순서
JSON 객체 생성 => NFT 이름, 이미지, 경로 => 구매자, 이더 구매 => 컨트랙트 mintToken() 함수 실행 => 내 토큰 조회 => 컨트랙트 tokenURI() 함수 실행

A6. 어차피 각 토큰의 이미지 경로를 최대한 간단하게 tokenId로 설정할 거기 때문에 tokenURI() 함수로 _baseURI()/tokenId를 반환하면 가스비 많이 발생하지 않음..

A2. SYMBOL, 토큰의 단위이자 토큰 종류의 약자

16 31 tokenURI() 함수와 _baseURI() 함수는 모두 super 키워드 없이 오버라이딩 해야 하는 것!
그러나 추후에 변경할 가능성을 고려하여 _defaultPath 상태 변수 사용

18 40 remix에서 MintingNft 컨트랙트의 mintToken() 함수 테스트
- CA : 0x59Da9A2C0D0A3dcB91dd01CaD335f4c99D3Aa5E5
- ownerOf() 함수의 값은 정상적으로 1이 증가된 값을 반환하나, totalSupply() 함수의 값은 2가 증가된 값을 반환하는 문제 발생
- 원인 : _beforeTokenTransfer() 함수 내 조건문으로 인하여 RC721Enumerable 컨트랙트의 상태 변수 값이 두 번 업데이트..

---

<br>

## ⭕ MintingNft 컨트랙트의 함수 목록

<br>

- view 함수
- balanceOf(_owner)
- defaultPath()
- getApproved(_tokenId)
- isApprovedForAll(_owner, _operator)
- mintingPrice()
- name()
- owner()
- ownerOf(_tokenId)
- supportsInterface(_interfaceId)
- symbol()
- tokenByIndex(_index)
- tokenOfOwnerByIndex(_owner, _index)
- tokenURI(_tokenId)
- totalSupply()

<br>

- approve(_to, _tokenId)
- mintToken(_owner, _tokenId)
- renounceOwnership()
- safeTransferFrom(_from, _to, _tokenId)
- safeTransferFrom(_from, _to, _tokenId, _data)
- setApprovalForAll(_operator, _approved)
- setDefaultPath(_defaultPath)
- setMintingPrice(_price)
- transferForm(_from, _to, _tokenId)
- transferOwnership(_newOwner)

<br>

---

# 2022 12 21 수

<br>

Q7. useEffect() 함수의 리턴 원리..

A7. useEffect() 함수의 기능..

Q8. 여러 컨트랙트에서의 onlyOwner 접근 제어자 사용

A8. 어쩔 수 없이 상속 필요

Q9. back cors 설정의 위치..

Q10. _safeMint() vs _mint()

<br>

---

<br>

## ⭕ TradingNft 컨트랙트의 buyToken() 함수 실행 시 MintingNft 컨트랙트에 대한 토큰 소유주의 권한 위임 여부 확인

<br>

    MintingNft.transferFrom();

    function MintingNft.transferFrom() {

        // msg.sender 값은 해당 함수를 호출한 TradingNft CA 값
        require(_isApprovedOrOwner(_msgSender(), tokenId)
    };

    function ERC721._isApprovedOrOwner() {

        // spender 값은 TradingNft CA 값
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function ERC721.isApprovedForAll() {
        return _operatorApprovals[owner][operator];
    }

    function ERC721.getApproved() {
        return _tokenApprovals[tokenId];
    }

---

<br>

Q11. 토큰의 소유주가 해당 거래에 대한 컨트랙트에 위임한다는 것...

---

# 2022 12 22 목

# 2022 12 23 금

## ⭕ 마이 페이지 구현

토큰 데이터 가져오는 함수 작성

1. 보유 토큰
2. 판매 중인 보유 토큰
3. 경매 진행 중인 보유 토큰
4. 경매 종료 후 정산 하기 전 보유 토큰 (정산하기)

- 마이페이지 컴포넌트 생성
- useContext 데이터 사용
- 보유 토큰 조회 함수 작성
- 테스트 해보려면 민팅 기능이 먼저 필요

---

# 2022 12 24 토

## ⭕ 민팅 페이지 구현

- 민팅 컴포넌트 생성

- useWeb3() 및 useContext() 값은 리렌더링 되어도 변경되지 않음..

- redux 구성

- 민팅 컴포넌트 기능 구현 완료

<br>

---

<br>

## ⭕ 마이 페이지 구성

- 마이 페이지 컴포넌트의 모든 보유 토큰 조회 기능 구현 완료

- 모든 보유 토큰에서 판매 중, 경매 중, 경매 정산 대상 토큰의 구분

- 토큰의 전송 권한 위임 여부 확인 기능 구현 완료
- 토큰의 전송 권한 위임 함수 작성

<br>

### ⭕ 마이 페이지의 토큰 분류 - classificationName

<br>

- 모든 보유 토큰 - myTokenURIs : tokensOfOwner() 함수 사용

- 순수 보유 토큰 - myOwnToken
- 판매 중인 토큰 - mySaleToken : isOnAuction() 함수 사용
- 경매 중인 토큰 - myAuctionToken : isOnAuction() 함수 사용
- 경매 정산 대상 토큰 - myNotClaimedAuctionToken : isNotClaimMatchedToken() 함수 사용

<br>

---

# 2022 12 25 일

## ⭕ 마이 페이지 구현

- 모든 보유 토큰에서 판매 중, 경매 중, 경매 정산 대상 토큰의 분류 기능 구현 완료

- 판매 및 경매 상품으로 등록하기 모달 생성
- 판매 등록 취소하기 및 경매 낙찰 상품 정산 받기 함수 작성