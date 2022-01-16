//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "base64-sol/base64.sol";

contract NFT is ERC721 {
    mapping(uint256 => uint256) rMap;
    mapping(uint256 => uint256) gMap;
    mapping(uint256 => uint256) bMap;
    uint256 counter;

    constructor() ERC721("aa", "aa") {}

    function mintNFT(
        uint256 r,
        uint256 g,
        uint256 b
    ) public {
        _safeMint(msg.sender, counter);
        rMap[counter] = r;
        gMap[counter] = g;
        bMap[counter] = b;
        counter += 1;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory svgImg = getNFTMetadata(
            rMap[_tokenId],
            gMap[_tokenId],
            bMap[_tokenId]
        );

        string memory uri = formatTokenURI(svgImg);
        return uri;
    }

    function formatTokenURI(string memory imageURI)
        public
        pure
        returns (string memory)
    {
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
                                '"}'
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
