const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai")

describe("SecondHandVehicle unit test", function () {
    async function deployTokenFixture() {
        const [owner, addr1] = await ethers.getSigners();

        const secondHandVehicle = await ethers.deployContract("SecondHandVehicle");

        const txResponse = await secondHandVehicle.mintSVNft(addr1, "test_uri");
        await txResponse.wait(1)

        // Fixtures can return anything you consider useful for your tests
        return { secondHandVehicle, owner, addr1 };
    }

    describe("Contructor", () => {
        it("Initializes Correctly.", async () => {
            const { secondHandVehicle } = await loadFixture(deployTokenFixture);
            const name = await secondHandVehicle.name();
            const symbol = await secondHandVehicle.symbol();
            assert.equal(name, "Second_Vehicle");
            assert.equal(symbol, "SV");
        })
    })

    describe("mintSVNft", () => {
        it("Allows user to mint an nft, and updates correctly", async () => {
            const { secondHandVehicle, addr1 } = await loadFixture(deployTokenFixture);
            const tokenIds = await secondHandVehicle.getTokenIds()
            const tokenURI = await secondHandVehicle.tokenURI(0)
            assert.equal(tokenIds.toString(), "1")
            assert.equal(tokenURI, "test_uri")
        })
        it("shows the correct balance and owner of a nft", async () => {
            const { secondHandVehicle, addr1 } = await loadFixture(deployTokenFixture);
            const owner = await secondHandVehicle.ownerOf(0);
            const balance = await secondHandVehicle.balanceOf(addr1);
            assert.equal(owner, addr1.address)
            assert.equal(balance, 1)
        })
    })


})