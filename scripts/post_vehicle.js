const { ethers, getNamedAccounts } = require("hardhat")

async function post() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicle")
    const vehicleMarketplace = _vehicleMarketplace.attach("0xcc8934C1a128e1a3e7059282a1A2744093d00892")
    const vehicleNft = _vehicleNft.attach("0x106B5793BA6CDab998f848796a6D1B6035A87b72")

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const player = singers[1] // seller index1  buyer index2

    const tokenId = 0 // get event from logs
    console.log(`tokenId .....${tokenId}`)
    const tx = await vehicleMarketplace.connect(player).postVehicle(vehicleNft.target, tokenId)
    await tx.wait(1)
    console.log("NFT posted!")
}

post()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })