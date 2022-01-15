//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./Holder.sol";

contract StreamableNFT is ERC721, Ownable {
    address public devAddress;
    bool public isAirDropOn;
    string public MetadataURI =
        "https://rbxs.mypinata.cloud/ipfs/QmZibSohNuCyeF5penELA4KgzFXjSWR9REH3oM46auvDkH/";

    uint256 public counter;

    mapping(uint256 => Holder) public HPRecords;

    constructor() ERC721("FluidNFT", "FNFT") {}

    function mint() public {
        _safeMint(msg.sender, counter);
        Holder _holder = new Holder(address(this), counter);
        HPRecords[counter] = _holder;
        counter += 1;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    MetadataURI,
                    Strings.toString(_tokenId),
                    "/metadata.json"
                )
            );
    }
}
