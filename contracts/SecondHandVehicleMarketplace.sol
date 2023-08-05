// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// features:
//     1. post vehicles
//     2. cancel vehicles

//     users should bid for the vehicels then they can barter, so where should I store the bid states, on chain or off chain
//     3. bid for vehicles.  one can bid for many vehicles, but it costs gas fee
//     4. barter vehicles.

contract SecondHandVehicleMarketplace is ReentrancyGuard {
    error NotOwner();
    error NotPosted();
    error IsPosted();
    error NotGrantedToCancelBarter();
    error NotApprovedForMarketplace();

    // emit an event when a vehicle is posted
    event VehiclePosted(
        address indexed nftAddress,
        address indexed sellerAddress,
        uint256 indexed sellerTokenId
    );

    // emit an event when the vehicle posting is cancelled
    event VehicleCancelled(
        address indexed nftAddress,
        address indexed sellerAddress,
        uint256 indexed sellerTokenId
    );

    // emit an event when a user tries to bid
    event VehicleBid(
        address indexed nftAddress,
        address indexed sellerAddress,
        address indexed buyerAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId
    );

    // emit an event when a barter finished, when a barter is done, all the bids assolicated with the two cars and ads should be cancelled.
    //  vehicle post should also be cancelled
    event VehicleBartered(
        address indexed nftAddress,
        address indexed sellerAddress,
        address indexed buyerAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId
    );

    // emit an event when a bid is canclled, vehicle post should also be cancelled
    event VehicleBidCancelled(
        address indexed nftAddress,
        address indexed sellerAddress,
        address indexed buyerAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId
    );

    mapping(address => mapping(uint256 => address)) private s_postings; // nftAddress => mapping(tokenId => ownerAddress)

    // post a vehicle to the marketplace, the state should be stored in s_postings, and a VehiclePosted should be emit so that
    // the posting infomation can be got without gas fee
    function postVehicle(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        notPosted(nftAddress, tokenId)
    {
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_postings[nftAddress][tokenId] = msg.sender;
        emit VehiclePosted(nftAddress, msg.sender, tokenId);
    }

    //  cancle a posted vehicle, pop the tokenId from s_postings, and emit a Vehiclecanclled event.
    function cancelVehicle(
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender) // can the access control be granted to the marketplace not only the owner
        isPosted(nftAddress, tokenId)
    {
        delete s_postings[nftAddress][tokenId];
        emit VehicleCancelled(nftAddress, msg.sender, tokenId);
    }

    // bid for a vehicle, it is necessary because the costs can keep the fake buyer away
    function bidForVehicle(
        address nftAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId // the buyerTokenId is not required to be posted, but the buyer must be the owner of buyerTokenId
    )
        external
        isPosted(nftAddress, sellerTokenId)
        isOwner(nftAddress, buyerTokenId, msg.sender)
    {
        address sellerAddress = s_postings[nftAddress][sellerTokenId];
        emit VehicleBid(
            nftAddress,
            sellerAddress,
            msg.sender,
            sellerTokenId,
            buyerTokenId
        );
    }

    // barter a vehicel, TODO what conditions should be required for a acceptable bartering?
    function barterVehicle(
        address nftAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId
    ) external isOwner(nftAddress, sellerTokenId, msg.sender) nonReentrant {
        // barter the two nfts
        address buyerAddress = IERC721(nftAddress).ownerOf(buyerTokenId); // TODO optimize for the gas fee

        // TODO is it atomic?
        IERC721(nftAddress).safeTransferFrom(
            msg.sender,
            buyerAddress,
            sellerTokenId
        );
        IERC721(nftAddress).safeTransferFrom(
            buyerAddress,
            msg.sender,
            buyerTokenId
        );
        emit VehicleBartered(
            nftAddress,
            msg.sender,
            buyerAddress,
            sellerTokenId,
            buyerTokenId
        );
    }

    // seller or buyer can cancel the barter. is it necessary, it costs gas fee
    function cancelBarter(
        address nftAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId
    )
        external
        isGrantedToCanclBatering(
            nftAddress,
            sellerTokenId,
            buyerTokenId,
            msg.sender
        )
    {
        address buyerAddress = IERC721(nftAddress).ownerOf(buyerTokenId);
        emit VehicleBidCancelled(
            nftAddress,
            msg.sender,
            buyerAddress,
            sellerTokenId,
            buyerTokenId
        );
    }

    // modifier
    modifier isPosted(address nftAddress, uint256 tokenId) {
        address ownerAddress = s_postings[nftAddress][tokenId];
        if (ownerAddress == address(0)) {
            revert NotPosted();
        }
        _;
    }

    modifier notPosted(address nftAddress, uint256 tokenId) {
        address ownerAddress = s_postings[nftAddress][tokenId];
        if (ownerAddress != address(0)) {
            revert IsPosted();
        }
        _;
    }

    // check if msg sender is the owner of the nft
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address poster
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (poster != owner) {
            revert NotOwner();
        }
        _;
    }

    // check if the user has the grant to cancel a barter, the user can be either a buyer or a seller.
    modifier isGrantedToCanclBatering(
        address nftAddress,
        uint256 sellerTokenId,
        uint256 buyerTokenId,
        address operator
    ) {
        IERC721 nft = IERC721(nftAddress);
        // address seller = nft.ownerOf(sellerTokenId);
        address seller = s_postings[nftAddress][sellerTokenId];
        address buyer = nft.ownerOf(buyerTokenId);
        if (!(operator == seller || operator == buyer)) {
            revert NotGrantedToCancelBarter();
        }
        _;
    }
}
