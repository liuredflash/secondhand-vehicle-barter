const hre = require("hardhat")
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
async function main() {
    console.log("deploy SecondHandVehicleMarketplace........")
    const marketplace = await hre.ethers.deployContract("SecondHandVehicleMarketplace")
    const contract = await marketplace.waitForDeployment();
    console.log(await contract.getAddress())
    console.log("SecondHandVehicleMarketplace deployed!")

    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block confirmations....")
        await contract.deploymentTransaction(6)
        await verify(await contract.getAddress(), [])
        // if not bytecode https://hardhat.org/hardhat-runner/docs/guides/verifying
    }
}

main().then(
    () => process.exit(0)
).catch((e) => {
    console.error(e)
    process.exit(1)
})
