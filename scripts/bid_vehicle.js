const { ethers, getNamedAccounts } = require("hardhat")

async function bid() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicle")
    const vehicleMarketplace = _vehicleMarketplace.attach("0xcc8934C1a128e1a3e7059282a1A2744093d00892")
    const vehicleNft = _vehicleNft.attach("0x106B5793BA6CDab998f848796a6D1B6035A87b72")

    const singers = await ethers.getSigners()
    // const deployer = singers[0] account 2 in metamask
    const buyer = singers[2] // account 3
    console.log(`player address....${buyer}`)

    // console.log("Minting NFT...")
    // const mintTx = await vehicleNft.mintSVNft(player.address, "test_token_uri")
    // const mintTxReceipt = await mintTx.wait(1)
    // const tokenId = mintTxReceipt.logs[0].args.tokenId // get event from logs
    const sellerTokenId = 0
    const buyerTokenId = 1
    // console.log(`tokenId .....${tokenId}`)
    // console.log("Approving NFT... ")
    // const approvalTx = await vehicleNft.connect(player).approve(vehicleMarketplace.target, tokenId) // only the owner has the right to approve, the default is account0
    // await approvalTx.wait(1)
    console.log("bid NFT...")
    const tx = await vehicleMarketplace.connect(buyer).bidForVehicle(vehicleNft.target, sellerTokenId, buyerTokenId)
    await tx.wait(1)
    console.log("NFT bid!")
}

bid()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })