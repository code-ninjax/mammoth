import { ethers } from "hardhat";

async function main() {
  const [, node1, node2, node3] = await ethers.getSigners();

  const MammothStorage = await ethers.getContractFactory("MammothStorage");
  const contract = await MammothStorage.deploy();
  await contract.waitForDeployment();
  console.log("Deployed at:", await contract.getAddress());

  await (await contract.registerNode(await node1.getAddress())).wait();
  await (await contract.registerNode(await node2.getAddress())).wait();
  await (await contract.registerNode(await node3.getAddress())).wait();

  const rootHash = ethers.keccak256(ethers.toUtf8Bytes("demo-root-hash"));
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("demo-metadata"));
  const nodes = [await node1.getAddress(), await node2.getAddress(), await node3.getAddress()];
  const paid = ethers.parseEther("9");
  await (await contract.storeFile(rootHash, metadataHash, { value: paid })).wait();
  console.log("Stored file with payment:", paid.toString());

  const share = paid / BigInt(nodes.length);
  const balancesBefore = await Promise.all(nodes.map((n) => ethers.provider.getBalance(n)));

  await (await contract.releasePayment(rootHash)).wait();
  console.log("Payment released. Share per node:", share.toString());

  const balancesAfter = await Promise.all(nodes.map((n) => ethers.provider.getBalance(n)));
  balancesAfter.forEach((b, i) => {
    const diff = b - balancesBefore[i];
    console.log(`Node ${i + 1} received:`, diff.toString());
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
