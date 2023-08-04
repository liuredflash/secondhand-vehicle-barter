const { ethers, getNamedAccounts } = require("hardhat")
const { marketplaceAddress, nftAddress } = require("../helper-hardhat-config")

async function barter() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach(marketplaceAddress)
    const vehicleNft = _vehicleNft.attach(nftAddress)

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const seller = singers[1]
    const buyer = singers[2] // account 3

    // console.log("Minting NFT...")
    // const mintTx = await vehicleNft.mintSVNft(player.address, "test_token_uri")
    // const mintTxReceipt = await mintTx.wait(1)
    // const tokenId = mintTxReceipt.logs[0].args.tokenId // get event from logs
    const sellerTokenId = 1
    const buyerTokenId = 2
    // console.log(`tokenId .....${tokenId}`)
    // console.log("Approving NFT... ")
    // const approvalTx = await vehicleNft.connect(player).approve(vehicleMarketplace.target, tokenId) // only the owner has the right to approve, the default is account0
    // await approvalTx.wait(1)

    const ownerOfSellerToken = await vehicleNft.ownerOf(sellerTokenId)
    console.log(await seller.getAddress())
    console.log(ownerOfSellerToken)
    const ownerOfBuyerToken = await vehicleNft.ownerOf(buyerTokenId)
    console.log(await buyer.getAddress())
    console.log(ownerOfBuyerToken)
    // console.log("barter NFT...")
    // const tx = await vehicleMarketplace.connect(seller).barterVehicle(vehicleNft.target, sellerTokenId, buyerTokenId)
    // await tx.wait(1)
    // console.log("NFT bartered!")
}

barter()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })