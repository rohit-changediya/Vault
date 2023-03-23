import { ethers } from "hardhat";

async function main(): Promise<void> {
  const network = await ethers.getDefaultProvider().getNetwork();
  console.log("Network name=", network.name);
  console.log("Network chain id=", network.chainId);

  const signer = await ethers.getSigners();
  const bal = await ethers.provider.getBalance(signer[0].address);
  console.log("bal:", ethers.utils.formatEther(bal));

  const arr = [
    "0xdac17f958d2ee523a2206206994597c13d831ec7", //USDT
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", //USDC
    "0x4Fabb145d64652a948d72533023f6E7A623C7C53", //BUSD
  ];
  //   console.log("arr:", arr);
  //   const USDT = await ethers.getContractFactory("USDT", signer[0]);
  //   const usdtContract = USDT.attach(arr[0]);
  //   console.log("symbol:", await usdtContract.symbol());
  //   console.log(
  //     "balance:",
  //     ethers.utils.formatEther(
  //       await usdtContract.balanceOf("0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503")
  //     )
  //   );

  const Vault = await ethers.getContractFactory("VaultETH", signer[0]);
  const vault = await Vault.deploy(arr);
  await vault.deployed();
  console.log("Vault address:", vault.address); // eslint-disable-line no-console
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
