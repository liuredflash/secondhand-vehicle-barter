const { ethers } = require("hardhat")
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert, expect } = require("chai")

describe("SecondVehicleMarketplace unit test", function () {
    const SELLER_TOKEN_ID = 0
    const BUYER_TOKEN_ID = 1
    async function deployTokenFixture() {
        const [owner, seller, buyer] = await ethers.getSigners();

        const secondVehicleMarketplace = await ethers.deployContract("SecondVehicleMarketplace");
        const secondVehicleNft = await ethers.deployContract("SecondVehicleNft");

        await secondVehicleMarketplace.waitForDeployment();
        await secondVehicleNft.waitForDeployment();

        await secondVehicleNft.mintSVNft(seller, "seller_uri");
        await secondVehicleNft.mintSVNft(buyer, "buyer_uri");
        await secondVehicleNft.connect(seller).approve(secondVehicleMarketplace.target, SELLER_TOKEN_ID)
        await secondVehicleNft.connect(buyer).approve(secondVehicleMarketplace.target, BUYER_TOKEN_ID)
        // Fixtures can return anything you consider useful for your tests
        return { secondVehicleMarketplace, secondVehicleNft, owner, seller, buyer };
    }

    describe("postVehicle", () => {
        it("emit an event if post successfully", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller } = await loadFixture(deployTokenFixture)
            await expect(secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.emit(secondVehicleMarketplace, "VehiclePosted"); // how to test a event properly. NOTE: must await
        })
        it("already be posted", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondVehicleMarketplace, "IsPosted")

        })
        it("not the owner", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, buyer } = await loadFixture(deployTokenFixture)
            await expect(secondVehicleMarketplace.connect(buyer).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondVehicleMarketplace, "NotOwner")

        })
        it("not approved", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller } = await loadFixture(deployTokenFixture)
            await secondVehicleNft.connect(seller).approve(ethers.ZeroAddress, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondVehicleMarketplace, "NotApprovedForMarketplace")

        })
    })

    describe("cancelVehicle", () => {
        it("emit a VehicleCancelled event when cancel successfully", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(seller).cancelVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)).to.emit(
                secondVehicleMarketplace, "VehicleCancelled"
            )
        })
        it("must be the owner", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(buyer).cancelVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondVehicleMarketplace, "NotOwner")
        })
        it("must be posted", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller } = await loadFixture(deployTokenFixture)
            await expect(secondVehicleMarketplace.connect(seller).cancelVehicle(secondVehicleNft.target, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondVehicleMarketplace, "NotPosted")
        })
    })
    describe("bidForVehicle", () => {
        it("emit a VehicleBid event when bid successfully", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(buyer).bidForVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.emit(secondVehicleMarketplace, "VehicleBid")
        })
        it("must be posted", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, buyer } = await loadFixture(deployTokenFixture)
            await expect(secondVehicleMarketplace.connect(buyer).bidForVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.revertedWithCustomError(secondVehicleMarketplace, "NotPosted")
        })
        it("must be the owner", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(buyer).bidForVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondVehicleMarketplace, "NotOwner")
        })

    })

    describe("barterVehicle", async () => {
        it("emit a VehicleBartered event when barter successfully", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await secondVehicleMarketplace.connect(buyer).bidForVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(seller).barterVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.emit(secondVehicleMarketplace, "VehicleBartered")

            assert.equal(await secondVehicleNft.ownerOf(SELLER_TOKEN_ID), buyer.address)
            assert.equal(await secondVehicleNft.ownerOf(BUYER_TOKEN_ID), seller.address)
        })
        it("must seller can barter", async () => {
            const { secondVehicleMarketplace, secondVehicleNft, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondVehicleMarketplace.connect(seller).postVehicle(secondVehicleNft.target, SELLER_TOKEN_ID)
            await secondVehicleMarketplace.connect(buyer).bidForVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID)
            await expect(secondVehicleMarketplace.connect(buyer).barterVehicle(secondVehicleNft.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.revertedWithCustomError(secondVehicleMarketplace, "NotOwner")
        })
    })
})