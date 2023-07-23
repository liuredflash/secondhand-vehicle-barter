const { ethers } = require("hardhat")
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert, expect } = require("chai")

describe("SecondHandVehicleMarketplace unit test", function () {
    const SELLER_TOKEN_ID = 0
    const BUYER_TOKEN_ID = 1
    async function deployTokenFixture() {
        const [owner, seller, buyer] = await ethers.getSigners();

        const secondHandVehicleMarketplace = await ethers.deployContract("SecondHandVehicleMarketplace");
        const secondHandVehicle = await ethers.deployContract("SecondHandVehicle");

        await secondHandVehicleMarketplace.waitForDeployment();
        await secondHandVehicle.waitForDeployment();

        await secondHandVehicle.mintSVNft(seller, "seller_uri");
        await secondHandVehicle.mintSVNft(buyer, "buyer_uri");
        await secondHandVehicle.connect(seller).approve(secondHandVehicleMarketplace.target, SELLER_TOKEN_ID)
        await secondHandVehicle.connect(buyer).approve(secondHandVehicleMarketplace.target, BUYER_TOKEN_ID)
        // Fixtures can return anything you consider useful for your tests
        return { secondHandVehicleMarketplace, secondHandVehicle, owner, seller, buyer };
    }

    describe("postVehicle", () => {
        it("emit an event if post successfully", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller } = await loadFixture(deployTokenFixture)
            await expect(secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.emit(secondHandVehicleMarketplace, "VehiclePosted"); // how to test a event properly. NOTE: must await
        })
        it("already be posted", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondHandVehicleMarketplace, "IsPosted")

        })
        it("not the owner", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, buyer } = await loadFixture(deployTokenFixture)
            await expect(secondHandVehicleMarketplace.connect(buyer).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondHandVehicleMarketplace, "NotOwner")

        })
        it("not approved", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller } = await loadFixture(deployTokenFixture)
            await secondHandVehicle.connect(seller).approve(ethers.ZeroAddress, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.be.revertedWithCustomError(secondHandVehicleMarketplace, "NotApprovedForMarketplace")

        })
    })

    describe("cancelVehicle", () => {
        it("emit a VehicleCancelled event when cancel successfully", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(seller).cancelVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)).to.emit(
                secondHandVehicleMarketplace, "VehicleCancelled"
            )
        })
        it("must be the owner", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(buyer).cancelVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondHandVehicleMarketplace, "NotOwner")
        })
        it("must be posted", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller } = await loadFixture(deployTokenFixture)
            await expect(secondHandVehicleMarketplace.connect(seller).cancelVehicle(secondHandVehicle.target, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondHandVehicleMarketplace, "NotPosted")
        })
    })
    describe("bidForVehicle", () => {
        it("emit a VehicleBid event when bid successfully", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(buyer).bidForVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.emit(secondHandVehicleMarketplace, "VehicleBid")
        })
        it("must be posted", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, buyer } = await loadFixture(deployTokenFixture)
            await expect(secondHandVehicleMarketplace.connect(buyer).bidForVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.revertedWithCustomError(secondHandVehicleMarketplace, "NotPosted")
        })
        it("must be the owner", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(buyer).bidForVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, SELLER_TOKEN_ID))
                .to.revertedWithCustomError(secondHandVehicleMarketplace, "NotOwner")
        })

    })

    describe("barterVehicle", async () => {
        it("emit a VehicleBartered event when barter successfully", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await secondHandVehicleMarketplace.connect(buyer).bidForVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(seller).barterVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.emit(secondHandVehicleMarketplace, "VehicleBartered")

            assert.equal(await secondHandVehicle.ownerOf(SELLER_TOKEN_ID), buyer.address)
            assert.equal(await secondHandVehicle.ownerOf(BUYER_TOKEN_ID), seller.address)
        })
        it("must seller can barter", async () => {
            const { secondHandVehicleMarketplace, secondHandVehicle, seller, buyer } = await loadFixture(deployTokenFixture)
            await secondHandVehicleMarketplace.connect(seller).postVehicle(secondHandVehicle.target, SELLER_TOKEN_ID)
            await secondHandVehicleMarketplace.connect(buyer).bidForVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID)
            await expect(secondHandVehicleMarketplace.connect(buyer).barterVehicle(secondHandVehicle.target, SELLER_TOKEN_ID, BUYER_TOKEN_ID))
                .to.revertedWithCustomError(secondHandVehicleMarketplace, "NotOwner")
        })
    })
})