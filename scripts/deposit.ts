import { ethers } from "hardhat";

async function main(): Promise<void> {
    const signer = await ethers.getSigners();
    const vault= await ethers.getContractFactory("VaultBSC",signer[0]);
    const contract = await vault.attach(
      "0x4901e991f5234ac7Bf748d66d08C44a028Bf3474"
    );

    let details = await contract.tokenType(1);
    console.log(details);
    let txn = await contract.deposit("400000000000000000000", 1);
    await txn.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
