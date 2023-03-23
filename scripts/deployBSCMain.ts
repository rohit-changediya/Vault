import { ethers } from "hardhat";

async function main(): Promise<void> {
  const network = await ethers.getDefaultProvider().getNetwork();
  console.log("Network name=", network.name);
  console.log("Network chain id=", network.chainId);

  const signer = await ethers.getSigners();
  const owner = "0x28082e507dfb3efb18770fdf8e34d2be0429e363";
  const bal = await ethers.provider.getBalance(signer[0].address);
  console.log("bal:", ethers.utils.formatEther(bal));

  const arr = [
    "0x55d398326f99059fF775485246999027B3197955", //USDT
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", //USDC
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", //BUSD
  ];
  //   console.log("arr:", arr);
  //   const USDT = await ethers.getContractFactory("USDT", signer[0]);
  //   const usdtContract = USDT.attach(arr[0]);
  //   console.log("symbol:", await usdtContract.symbol());
  //   console.log(
  //     "balance:",
  //     ethers.utils.formatEther(
  //       await usdtContract.balanceOf("0xf977814e90da44bfa03b6295a0616a897441acec")
  //     )
  //   );

  const Vault = await ethers.getContractFactory("VaultBSC", signer[0]);
  const vault = await Vault.deploy(arr, owner);
  await vault.deployed();
  console.log("Vault address:", vault.address); // eslint-disable-line no-console
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
