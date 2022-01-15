//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./Holder.sol";
import "./Factory.sol";

contract StreamableNFT is ERC721, Ownable {
    address public devAddress;
    bool public isAirDropOn;
    string public MetadataURI =
        "https://rbxs.mypinata.cloud/ipfs/QmZibSohNuCyeF5penELA4KgzFXjSWR9REH3oM46auvDkH/";

    uint256 public counter;

    TokenContract _factory;

    mapping(uint256 => Holder) public HPRecords;

    constructor() ERC721("FluidNFT", "FNFT") {
        _factory = TokenContract(0x301ca2b6fd248C289e813Ba356c318462AB90EA9);
    }

    function mint(
        uint256 r,
        uint256 g,
        uint256 b
    ) public {
        _safeMint(msg.sender, counter);
        Holder _holder = new Holder(address(this), counter);
        HPRecords[counter] = _holder;
        _factory.handleMint(address(_holder), r, g, b);
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
