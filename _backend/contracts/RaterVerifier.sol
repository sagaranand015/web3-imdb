// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MoviesNFT.sol";
import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

contract RaterVerifier is ZKPVerifier {
    address private _moviesNftAddress;
    uint64 public constant TRANSFER_REQUEST_ID = 1;

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor(address moviesNftContract) {
        _moviesNftAddress = moviesNftContract;
    }

    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // execute the airdrop (from example)
        // Casting of Rating for the movie should be done here!
        if (idToAddress[id] == address(0)) {
            // super._mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }

    // function _beforeTokenTransfer(
    //     address, /* from */
    //     address to,
    //     uint256 /* amount */
    // ) internal view override {
    //     require(
    //         proofs[to][TRANSFER_REQUEST_ID] == true,
    //         "only identities who provided proof are allowed to receive tokens"
    //     );
    // }
}
