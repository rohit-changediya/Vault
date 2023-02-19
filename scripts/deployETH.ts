import { parse } from "@ethersproject/transactions";
import { base58 } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const USDT = await ethers.getContractFactory("USDT");
  const USDC = await ethers.getContractFactory("USDT");
  const BUSD = await ethers.getContractFactory("USDT");

  const usdt = await USDT.deploy(1000, 18);
  await usdt.deployed();

  const usdc = await USDC.deploy(1000, 18);
  await usdc.deployed();

  const busd = await BUSD.deploy(1000, 6);
  await busd.deployed();

  const arr = [usdt.address, usdc.address, busd.address];

  const Vault = await ethers.getContractFactory("VaultETH");
  const vault = await Vault.deploy(arr);
  await vault.deployed();
  console.log("Vault address:", vault.address); // eslint-disable-line no-console

  await usdt.approve(vault.address, "10000000000000000000000");
  await usdc.approve(vault.address, 1000000 * 10 ** 6);
  await busd.approve(vault.address, "10000000000000000000000");

  await vault.deposit("400000000000000000000", 0);
  await vault.deposit("500000000", 1);

  const tokenDetails0 = await vault.tokenType(0);
  console.log(parseInt(tokenDetails0.totalDeposit));

  const tokenDetails1 = await vault.tokenType(1);
  console.log(parseInt(tokenDetails1.totalDeposit));

  const totalDeposit = await vault.totalDeposit();
  console.log("Total deposit:",ethers.utils.formatEther(totalDeposit));


  const balance1 = await usdt.balanceOf(vault.address);
  console.log("USDT bal:", parseInt(balance1));

  const balance2 = await usdc.balanceOf(vault.address);
  console.log("USDC bal:", parseInt(balance2));

  await vault.withdraw();

  const balanceAfter1 = await usdt.balanceOf(vault.address);
  console.log("USDT bal:", parseInt(balanceAfter1));

  const balanceAfter2 = await usdc.balanceOf(vault.address);
  console.log("USDC bal:", parseInt(balanceAfter2));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
