//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {INativeSuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/INativeSuperToken.sol";
import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Holder {
    address addrsCLA = 0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873;
    INativeSuperToken public _sodaToken;
    ISuperfluid private host =
        ISuperfluid(0xEB796bdb90fFA0f28255275e16936D25d3418603);
    IConstantFlowAgreementV1 cfa = IConstantFlowAgreementV1(addrsCLA);

    IERC721 nftContract;
    uint256 tokenId;

    constructor(address _nftContract, uint256 _tokenId) {
        nftContract = IERC721(_nftContract);
        tokenId = _tokenId;
    }

    function sendFlow(
        address acceptedToken,
        address receiver,
        uint256 rate
    ) public {
        require(
            msg.sender == nftContract.ownerOf(tokenId),
            "Only the owner can stream the nfts"
        );
        host.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.createFlow.selector,
                acceptedToken,
                receiver, // Receiver
                rate, // Rate
                new bytes(0)
            ),
            "0x"
        );
    }
}
