import { parse } from "@ethersproject/transactions";
import { base58 } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const USDT = await ethers.getContractFactory("USDT");
  const USDC = await ethers.getContractFactory("USDT");
  const BUSD = await ethers.getContractFactory("USDT");
  const owner = "0x28082e507dfb3efb18770fdf8e34d2be0429e363";

  const usdt = await USDT.deploy(10000, 6, "USDT", "USDT");
  await usdt.deployed();

  const usdc = await USDC.deploy(10000, 6, "USDC", "USDC");
  await usdc.deployed();

  const busd = await BUSD.deploy(10000, 18, "BUSD", "BUSD");
  await busd.deployed();

  const arr = [usdt.address, usdc.address, busd.address];

  const Vault = await ethers.getContractFactory("VaultETH");
  const vault = await Vault.deploy(arr, owner);
  await vault.deployed();
  console.log("Vault address:", vault.address); // eslint-disable-line no-console

  await usdt.approve(vault.address, 1000000 * 10 ** 6);
  await usdc.approve(vault.address, 1000000 * 10 ** 6);
  await busd.approve(vault.address, "10000000000000000000000");

  await vault.deposit("300000000", 0);
  await vault.deposit("300000000", 1);
  await vault.deposit("400000000000000000000", 2);

  const tokenDetails0 = await vault.tokenType(0);
  console.log(parseInt(tokenDetails0.totalDeposit));

  const tokenDetails1 = await vault.tokenType(1);
  console.log(parseInt(tokenDetails1.totalDeposit));

  const totalDeposit = await vault.totalDeposit();
  console.log("Total deposit:", ethers.utils.formatEther(totalDeposit));

  const balance1 = await usdt.balanceOf(vault.address);
  console.log("USDT bal:", parseInt(balance1));

  const balance2 = await usdc.balanceOf(vault.address);
  console.log("USDC bal:", parseInt(balance2));

  const balance3 = await busd.balanceOf(vault.address);
  console.log("BUSD bal:", parseInt(balance3));

  await vault.withdraw();

  const balanceAfter1 = await usdt.balanceOf(vault.address);
  console.log("USDT bal:", parseInt(balanceAfter1));

  const balanceAfter2 = await usdc.balanceOf(vault.address);
  console.log("USDC bal:", parseInt(balanceAfter2));

  const balanceAfter3 = await busd.balanceOf(vault.address);
  console.log("BUSD bal:", parseInt(balanceAfter3));

  const totalDepositAfter = await vault.totalDeposit();
  console.log(
    "Total deposit after:",
    ethers.utils.formatEther(totalDepositAfter)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
