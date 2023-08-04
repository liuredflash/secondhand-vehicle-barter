const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert, expect } = require("chai")

describe("SecondHandVehicle unit test", function () {
    async function deployTokenFixture() {
        const [owner, addr1] = await ethers.getSigners();
        const secondHandVehicle = await ethers.deployContract("SecondHandVehicleNft");
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
    describe("approveUpdator", () => {
        it("Only owner can approve a updater", async () => {
            const { secondHandVehicle, owner: updator, addr1 } = await loadFixture(deployTokenFixture);
            const before_uri = await secondHandVehicle.tokenURI(0)
            await expect(secondHandVehicle.connect(updator).approveUpdator(updator, 0))
                .to.revertedWithCustomError(secondHandVehicle, "NotOwner")
        })
    })


    //     Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
    // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

    // Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
    // Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
    describe("updateTokenURI", () => {
        it("allows approved address to update the tokenURI", async () => {
            const { secondHandVehicle, owner: updator, addr1 } = await loadFixture(deployTokenFixture);
            const before_uri = await secondHandVehicle.tokenURI(0)
            await secondHandVehicle.connect(addr1).approveUpdator(updator, 0)
            const updateTokenId = await secondHandVehicle.connect(updator).updateTokenURI(0, "update_uri")
            const after_uri = await secondHandVehicle.tokenURI(0)

            assert.equal(before_uri, "test_uri")
            assert.equal(updateTokenId.value, 0)
            assert.equal(after_uri, "update_uri")

        })
        it("owner can not update tokenURI", async () => {
            const { secondHandVehicle, owner: updator, addr1 } = await loadFixture(deployTokenFixture);
            const before_uri = await secondHandVehicle.tokenURI(0)
            await expect(secondHandVehicle.connect(addr1).updateTokenURI(0, "update_uri"))
                .to.revertedWithCustomError(secondHandVehicle, "NotApproved")
        })
        it("allows approved address to update the tokenURI", async () => {
            const { secondHandVehicle, owner: updator, addr1 } = await loadFixture(deployTokenFixture);
            const before_uri = await secondHandVehicle.tokenURI(0)
            await expect(secondHandVehicle.connect(updator).updateTokenURI(0, "update_uri"))
                .to.revertedWithCustomError(secondHandVehicle, "NotApproved")

        })
    })


})