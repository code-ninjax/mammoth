import { ethers } from "hardhat";

async function main() {
  const MammothStorage = await ethers.getContractFactory("MammothStorage");
  const contract = await MammothStorage.deploy();
  await contract.waitForDeployment();

  console.log("MammothStorage deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});