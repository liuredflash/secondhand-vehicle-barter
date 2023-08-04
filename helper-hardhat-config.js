const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "localhost",
        entranceFee: "10000000000000000",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callbackGasLimit: "500000",
        interval: "30",
    },
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", //https://docs.chain.link/vrf/v2/subscription/supported-networks
        entranceFee: "10000000000000000",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30"
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

const developmentChains = ["hardhat", "localhost"]
const marketplaceAddress = "0x48480e3060cF7be6B183E3CB3a42251fDcB7735e"
const nftAddress = "0x7D338F8602227afAC68104858f83C82A48296037"
// const DECIMALS = 8
// const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    marketplaceAddress,
    nftAddress
    // DECIMALS,
    // INITIAL_ANSWER
}