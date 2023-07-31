const hre = require("hardhat")
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
async function main() {
    console.log("deploy Second-hand Vehicle NFT........")
    const vehicleNft = await hre.ethers.deployContract("SecondHandVehicleNft")
    const nftContract = await vehicleNft.waitForDeployment();
    console.log(await nftContract.getAddress())
    console.log("Second-hand Vehicle NFT deployed!")

    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block confirmations....")
        await nftContract.deploymentTransaction(6)
        await verify(await nftContract.getAddress(), [])
        // if not bytecode https://hardhat.org/hardhat-runner/docs/guides/verifying
    }
}

main().then(
    () => process.exit(0)
).catch((e) => {
    console.error(e)
    process.exit(1)
})
