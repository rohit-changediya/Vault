import { ethers } from "hardhat";

async function main(): Promise<void> {
  const network = await ethers.getDefaultProvider().getNetwork();
  const owner = "0x28082e507dfb3efb18770fdf8e34d2be0429e363";
  console.log("Network name=", network.name);
  console.log("Network chain id=", network.chainId);

  const signer = await ethers.getSigners();
  const bal = await ethers.provider.getBalance(signer[0].address);
  console.log("bal:", ethers.utils.formatEther(bal));

  const USDT = await ethers.getContractFactory("USDT", signer[0]);
  const USDC = await ethers.getContractFactory("USDT", signer[0]);
  const BUSD = await ethers.getContractFactory("USDT", signer[0]);

  const usdt = await USDT.deploy(10000000, 18, "USDT", "USDT");
  await usdt.deployed();

  const usdc = await USDC.deploy(10000000, 18, "USDC", "USDC");
  await usdc.deployed();

  const busd = await BUSD.deploy(10000000, 18, "BUSD", "BUSD");
  await busd.deployed();

  const arr = [usdt.address, usdc.address, busd.address];
  console.log("arr:", arr);

  const Vault = await ethers.getContractFactory("VaultBSC", signer[0]);
  const vault = await Vault.deploy(arr, owner);
  await vault.deployed();
  console.log("Vault address:", vault.address); // eslint-disable-line no-console

  console.log("Reciever:", await vault.receiver());

  await usdt.approve(vault.address, "10000000000000000000000");
  await usdc.approve(vault.address, "10000000000000000000000");
  await busd.approve(vault.address, "10000000000000000000000");

  await vault.deposit("400000000000000000000", 0);
  await vault.deposit("400000000000000000000", 1);

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

  const ownerBalanceBefore = await usdt.balanceOf(owner);
  console.log(
    "Owner USDT bal before:",
    ethers.utils.formatEther(ownerBalanceBefore)
  );

  await vault.withdraw();

  // await vault.rescue();

  const totalDepositAfter = await vault.totalDeposit();
  console.log(
    "Total deposit after rescue:",
    ethers.utils.formatEther(totalDepositAfter)
  );
  const ownerBalanceAfter = await usdt.balanceOf(owner);
  console.log(
    "Owner USDT bal after:",
    ethers.utils.formatEther(ownerBalanceAfter)
  );

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
