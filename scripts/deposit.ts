import { ethers } from "hardhat";

async function main(): Promise<void> {
  const signer = await ethers.getSigners();
  const vault = await ethers.getContractFactory("VaultBSC", signer[0]);
  const contract = await vault.attach(
    //   "0x4901e991f5234ac7Bf748d66d08C44a028Bf3474" // eth
    "0xb99d7ca89ee34884281000740ed4c2f479a3895d"
  );

  let details = await contract.tokenType(2);
  console.log(details);
  let txn = await contract.deposit("400000000000000000000", 2);
  await txn.wait();
  let totalDeposit = await contract.totalDeposit();
  console.log("total:", ethers.utils.formatEther(totalDeposit));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
