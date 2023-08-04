const { ethers, getNamedAccounts } = require("hardhat")
const { marketplaceAddress, nftAddress } = require("../helper-hardhat-config")

async function update() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach(marketplaceAddress)
    const vehicleNft = _vehicleNft.attach(nftAddress)

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const seller = singers[1] // seller index1  buyer index2
    const updator = singers[0]

    const tokenId = 1 // get event from logs
    console.log(`tokenId .....${tokenId}`)
    console.log(await updator.getAddress())
    const recepit = await vehicleNft.connect(seller).approveUpdator(updator, tokenId)
    await recepit.wait(3)
    const tx = await vehicleNft.connect(updator).updateTokenURI(tokenId, "update_uri")
    await tx.wait(1)
    console.log(tx)
    console.log("NFT updated!")
}

update()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })