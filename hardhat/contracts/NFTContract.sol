//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "base64-sol/base64.sol";

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

    constructor(address _facAddress) ERC721("FluidNFT", "FNFT") {
        _factory = TokenContract(_facAddress);
    }

    function mint(
        uint256 rv,
        uint256 gv,
        uint256 bv
    ) public {
        _safeMint(msg.sender, counter);
        Holder _holder = new Holder(address(this), counter);
        HPRecords[counter] = _holder;
        _factory.handleMint(address(_holder), rv, gv, bv);
        counter += 1;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        Holder _holder = HPRecords[_tokenId];
        (int256 rColor, int256 gColor, int256 bColor) = _factory.getBalances(
            address(_holder)
        );

        string memory svgImg = getNFTMetadata(
            uint256(rColor),
            uint256(gColor),
            uint256(bColor)
        );

        string memory uri = formatTokenURI(
            svgImg,
            uint256(rColor),
            uint256(gColor),
            uint256(bColor)
        );
        return uri;
    }

    function formatTokenURI(
        string memory imageURI,
        uint256 r,
        uint256 g,
        uint256 b
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "Streamable NFT",
                                '", "description":"Made on Eth Global", "attributes":"", "image":"',
                                imageURI,
                                '","rColor":"',
                                Strings.toString(r),
                                '",',
                                '"gColor":"',
                                Strings.toString(g),
                                '",',
                                '"bColor":"',
                                Strings.toString(b),
                                '"',
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function getNFTMetadata(
        uint256 _r,
        uint256 _g,
        uint256 _b
    ) public pure returns (string memory) {
        string[3] memory parts;
        parts[
            0
        ] = "<svg xmlns='http://www.w3.org/2000/svg' width='350' height='350' version='1.1'>";
        parts[1] = string(
            abi.encodePacked(
                "<rect width='350' height='350' style='fill:rgb(",
                Strings.toString(_r),
                ",",
                Strings.toString(_g),
                ",",
                Strings.toString(_b),
                ");",
                "stroke:rgb(0,0,0)'"
            )
        );
        parts[2] = "</svg>";

        return string(abi.encodePacked(parts[0], parts[1], parts[2]));
    }
}
