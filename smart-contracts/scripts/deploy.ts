import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No signer available for 'bdag' network. Set PRIVATE_KEY in smart-contracts/.env and ensure it has BDAG testnet funds."
    );
  }

  console.log("Deploying with:", await deployer.getAddress());

  const MammothStorage = await ethers.getContractFactory("MammothStorage", deployer);
  const contract = await MammothStorage.deploy();
  await contract.waitForDeployment();

  console.log("MammothStorage deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});