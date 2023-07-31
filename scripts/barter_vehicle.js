const { ethers, getNamedAccounts } = require("hardhat")

async function barter() {
    const _vehicleMarketplace = await ethers.getContractFactory("SecondHandVehicleMarketplace")
    const _vehicleNft = await ethers.getContractFactory("SecondHandVehicleNft")
    const vehicleMarketplace = _vehicleMarketplace.attach("0xd5a63fd5556D6Df1257f632e2DB13eF02c26C299")
    const vehicleNft = _vehicleNft.attach("0x22A0A13382Ca7F00ae39b2deA735A3061cE287a3")

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
    console.log("barter NFT...")
    const tx = await vehicleMarketplace.connect(seller).barterVehicle(vehicleNft.target, sellerTokenId, buyerTokenId)
    await tx.wait(1)
    console.log("NFT bartered!")
}

barter()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })