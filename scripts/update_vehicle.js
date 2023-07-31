const { ethers, getNamedAccounts } = require("hardhat")

async function update() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach("0xd5a63fd5556D6Df1257f632e2DB13eF02c26C299")
    const vehicleNft = _vehicleNft.attach("0x22A0A13382Ca7F00ae39b2deA735A3061cE287a3")

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