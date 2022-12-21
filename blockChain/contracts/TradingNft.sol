// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MintingNft.sol";

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

// onlyOwner 접근 제어자 사용을 위해 상속
contract TradingNft is Ownable {

    MintingNft private _MintingNft;

    // 일반 판매 및 경매 성사 시 수수료율 (상수 : 할인할 예정 없음)
    // 1 / 1000 = 0.1% 계산할 예정
    uint private _tokenTransactionFeeRate;
    uint private _tokenTransactionFeeDigits;

    constructor(address _ca, uint _feeRate, uint _feeDigits) {

        // 상호 작용을 통해 해당 컨트랙트의 함수 모두 사용 가능
        _MintingNft = MintingNft(_ca);

        _tokenTransactionFeeRate = _feeRate;
        _tokenTransactionFeeDigits = _feeDigits;
    }

    function setMintingNft(address _ca) external onlyOwner {
        _MintingNft = MintingNft(_ca);
    }

    function setTokenTransactionFeeRate(uint _feeRate) external onlyOwner {
        _tokenTransactionFeeRate = _feeRate;
    }

    function setTokenTransactionFeeDigits(uint _feeDigits) external onlyOwner {
        _tokenTransactionFeeRate = _feeDigits;
    }

    // test
    function getMintingNft() external view returns (MintingNft) {
        return _MintingNft;
    }

    function getTokenTransactionFeeRate() external view returns (uint) {
        return _tokenTransactionFeeRate;
    }

    function getTokenTransactionFeeDigits() external view returns (uint) {
        return _tokenTransactionFeeRate;
    }
}