const { ethers, getNamedAccounts } = require("hardhat")
const { marketplaceAddress, nftAddress } = require("../helper-hardhat-config")

async function mint() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach(marketplaceAddress)
    const vehicleNft = _vehicleNft.attach(nftAddress)

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const buyer = singers[2] // seller index1  buyer index2

    console.log("Minting NFT...")
    const mintTx = await vehicleNft.mintSVNft(buyer, "test_token_uri")
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.logs[0].args.tokenId // get event from logs
    console.log(`tokenId .....${tokenId}`)
    console.log("NFT minted!")
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })