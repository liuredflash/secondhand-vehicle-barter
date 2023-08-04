const { ethers, getNamedAccounts } = require("hardhat")
const { marketplaceAddress, nftAddress } = require("../helper-hardhat-config")

async function post() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach(marketplaceAddress)
    const vehicleNft = _vehicleNft.attach(nftAddress)

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const seller = singers[1] // seller index1  buyer index2

    const tokenId = 1 // get event from logs
    console.log(`tokenId .....${tokenId}`)
    const recepit = await vehicleNft.connect(seller).approve(vehicleMarketplace.target, tokenId)
    await recepit.wait(3) // wait for a certain number of confirmation until the block is mined.
    console.log(recepit)
    const tx = await vehicleMarketplace.connect(seller).postVehicle(vehicleNft.target, tokenId)
    console.log(tx)
    await tx.wait(1)
    console.log("NFT posted!")
}

post()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })