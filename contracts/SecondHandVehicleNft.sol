// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// the info of vehicles can be updated

contract SecondHandVehicleNft is ERC721URIStorage, ERC721Enumerable {
    error NotOwner();
    error NotApproved();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) private s_updators;

    constructor() ERC721("Second_Vehicle", "SV") {}

    function mintSVNft(
        address tokenOwner,
        string memory uri
    ) public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(tokenOwner, newItemId);
        _setTokenURI(newItemId, uri);

        _tokenIds.increment();
        return newItemId;
    }

    function approveUpdator(address updator, uint256 tokenId) public {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwner();
        }
        s_updators[tokenId] = updator;
    }

    function updateTokenURI(
        uint256 tokenId,
        string memory uri
    ) public returns (uint256) {
        if (
            ownerOf(tokenId) == msg.sender || s_updators[tokenId] != msg.sender
        ) {
            revert NotApproved();
        }
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function getTokenIds() public view returns (uint256) {
        return _tokenIds.current();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }
}
