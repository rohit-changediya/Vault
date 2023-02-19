import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import chai from "chai";
import { VaultBscFactory, UsdtFactory, VaultBsc, Usdt } from "../typechain";
import { Signer } from "@ethersproject/abstract-signer";
chai.use(solidity);
const { expect } = chai;

describe("VaultBSC", async () => {
  let vault: VaultBsc;
  let usdt: Usdt;
  let usdc: Usdt;
  let busd: Usdt;
  let signers: Signer[];
  before(async () => {
    signers = await ethers.getSigners();
    const vaultFactory = await ethers.getContractFactory("VaultBSC",signers[1]);
    const usdtFactory = await ethers.getContractFactory("USDT");
    usdt = (await usdtFactory.deploy(1000, 18)) as Usdt;
    usdc = (await usdtFactory.deploy(1000, 18)) as Usdt;
    busd = (await usdtFactory.deploy(1000, 18)) as Usdt;
    const arr = [usdt.address, usdc.address, busd.address];
    vault = (await vaultFactory.deploy(arr)) as VaultBsc;

    //approve vault contract
    await usdt.approve(vault.address, await usdt.totalSupply());
    await usdc.approve(vault.address, await usdc.totalSupply());
    await busd.approve(vault.address, await busd.totalSupply());

    const owner1 = await signers[0].getAddress();
    const owner2 = await signers[1].getAddress();

    const usdtBalanceOwner1 = await usdt.balanceOf(owner1);
    const usdtBalanceOwner2 = await usdt.balanceOf(owner2);
    console.log("owner1 bal:", ethers.utils.formatEther(usdtBalanceOwner1));
    console.log("owner2 bal:",  ethers.utils.formatEther(usdtBalanceOwner2));
    console.log("owner1:", owner1);
    console.log("owner2:", owner2);
  });

  it("Should print", async () => {
    console.log(usdt.address);
    console.log("vault:", vault.address);
  });

  it("should deposit USDT tokens", async () => {
    const amount = "500000000000000000000";
    const totalBalanceBefore = await vault.totalDeposit();
    await vault.connect(signers[0]).deposit(amount, 0);
    const totalBalanceAfter = await vault.totalDeposit();
    const usdtDetails = await vault.tokenType(0);
    console.log(ethers.utils.formatEther(totalBalanceAfter));
    const contractBalance = await usdt.balanceOf(vault.address);
    expect(totalBalanceBefore.add(amount)).to.equal(totalBalanceAfter);
    expect(contractBalance).to.equal(usdtDetails.totalDeposit);
  });

  it("should deposit USDC tokens", async () => {
    const amount = "500000000000000000000";
    const totalBalanceBefore = await vault.totalDeposit();
    await vault.connect(signers[0]).deposit(amount, 1);
    const totalBalanceAfter = await vault.totalDeposit();
    const usdcDetails = await vault.tokenType(1);
    console.log(ethers.utils.formatEther(totalBalanceAfter));
    const contractBalance = await usdc.balanceOf(vault.address);
    expect(totalBalanceBefore.add(amount)).to.equal(
      totalBalanceAfter
    );
    expect(contractBalance).to.equal(usdcDetails.totalDeposit);
  });

  it("should deposit BUSD tokens", async () => {
    const amount = "500000000000000000000";
    const totalBalanceBefore = await vault.totalDeposit();
    await vault.connect(signers[0]).deposit(amount, 2);
    const totalBalanceAfter = await vault.totalDeposit();
    const busdDetails = await vault.tokenType(2);
    console.log(ethers.utils.formatEther(totalBalanceAfter));
    const contractBalance = await busd.balanceOf(vault.address);
    expect(totalBalanceBefore.add(amount)).to.equal(totalBalanceAfter);
    expect(contractBalance).to.equal(busdDetails.totalDeposit);
  });

  it("should withdraw tokens:", async () => {

    const usdtDetailsBefore = await vault.tokenType(0);
    const usdcDetailsBefore = await vault.tokenType(1);
    const busdDetailsBefore = await vault.tokenType(2);

    await vault.connect(signers[1]).withdraw();
    const totalDeposit = await vault.totalDeposit();
    const usdtDetailsAfter = await vault.tokenType(0);
    const usdcDetailsAfter = await vault.tokenType(1);
    const busdDetailsAfter = await vault.tokenType(2);

    const usdtBalanceOwner2 = await usdt.balanceOf(await signers[1].getAddress());
    const usdcBalanceOwner2 = await usdc.balanceOf(await signers[1].getAddress());
    const busdBalanceOwner2 = await busd.balanceOf(await signers[1].getAddress());

    const usdtBalanceVault = await usdt.balanceOf(vault.address);
    const usdcBalanceVault = await usdc.balanceOf(vault.address);
    const busdBalanceVault = await busd.balanceOf(vault.address);

    expect(usdtBalanceOwner2).to.equal(usdtDetailsBefore.totalDeposit);
    expect(usdcBalanceOwner2).to.equal(usdcDetailsBefore.totalDeposit);
    expect(busdBalanceOwner2).to.equal(busdDetailsBefore.totalDeposit);
    expect(usdtDetailsAfter.totalDeposit).to.equal(0);
    expect(usdcDetailsAfter.totalDeposit).to.equal(0);
    expect(busdDetailsAfter.totalDeposit).to.equal(0);

    expect(usdtBalanceVault).to.equal(0);
    expect(usdcBalanceVault).to.equal(0);
    expect(busdBalanceVault).to.equal(0);
    expect(usdcDetailsAfter.totalDeposit).to.equal(0);
    expect(busdDetailsAfter.totalDeposit).to.equal(0);
    expect(totalDeposit).to.equal(0);
  })
});
