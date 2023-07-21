const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai")

describe("SecondVehicleNft unit test", function () {
    async function deployTokenFixture() {
        const [owner, addr1] = await ethers.getSigners();

        const secondVehicleNft = await ethers.deployContract("SecondVehicleNft");

        const txResponse = await secondVehicleNft.mintSVNft(addr1, "test_uri");
        await txResponse.wait(1)

        // Fixtures can return anything you consider useful for your tests
        return { secondVehicleNft, owner, addr1 };
    }

    describe("Contructor", () => {
        it("Initializes Correctly.", async () => {
            const { secondVehicleNft } = await loadFixture(deployTokenFixture);
            const name = await secondVehicleNft.name();
            const symbol = await secondVehicleNft.symbol();
            assert.equal(name, "Second_Vehicle");
            assert.equal(symbol, "SV");
        })
    })

    describe("mintSVNft", () => {
        it("Allows user to mint an nft, and updates correctly", async () => {
            const { secondVehicleNft, addr1 } = await loadFixture(deployTokenFixture);
            const tokenIds = await secondVehicleNft.getTokenIds()
            const tokenURI = await secondVehicleNft.tokenURI(0)
            assert.equal(tokenIds.toString(), "1")
            assert.equal(tokenURI, "test_uri")
        })
        it("shows the correct balance and owner of a nft", async () => {
            const { secondVehicleNft, addr1 } = await loadFixture(deployTokenFixture);
            const owner = await secondVehicleNft.ownerOf(0);
            const balance = await secondVehicleNft.balanceOf(addr1);
            assert.equal(owner, addr1.address)
            assert.equal(balance, 1)
        })
    })


})