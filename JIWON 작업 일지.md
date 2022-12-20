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