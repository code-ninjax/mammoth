import { expect } from "chai";
import { ethers } from "hardhat";

describe("MammothStorage", function () {
  it("registers nodes, stores file and releases payment", async function () {
    const [owner, node1, node2, node3] = await ethers.getSigners();
    const MammothStorage = await ethers.getContractFactory("MammothStorage");
    const contract = await MammothStorage.deploy();
    await contract.waitForDeployment();

    await expect(contract.registerNode(await node1.getAddress()))
      .to.emit(contract, "NodeRegistered")
      .withArgs(await node1.getAddress());
    await contract.registerNode(await node2.getAddress());
    await contract.registerNode(await node3.getAddress());

    const rootHash = ethers.keccak256(ethers.toUtf8Bytes("demo-root-hash"));
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("demo-metadata"));

    const paid = ethers.parseEther("9"); // 9 ETH for clean division
    await expect(contract.connect(owner).storeFile(rootHash, metadataHash, { value: paid }))
      .to.emit(contract, "FileStored")
      .withArgs(rootHash, metadataHash, await owner.getAddress(), paid);

    await expect(contract.releasePayment(rootHash))
      .to.emit(contract, "PaymentReleased")
      .withArgs(rootHash);

    await expect(contract.releasePayment(rootHash)).to.be.revertedWith("Already released");
  });

  it("prevents duplicate CIDs and zero-payment", async function () {
    const [owner, node] = await ethers.getSigners();
    const MammothStorage = await ethers.getContractFactory("MammothStorage");
    const contract = await MammothStorage.deploy();
    await contract.waitForDeployment();

    const rootHash = ethers.keccak256(ethers.toUtf8Bytes("cid-1"));
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("cid-1-meta"));

    await expect(contract.storeFile(rootHash, metadataHash, { value: 0 }))
      .to.be.revertedWith("No payment");

    await contract.storeFile(rootHash, metadataHash, { value: ethers.parseEther("1") });
    await expect(contract.storeFile(rootHash, metadataHash, { value: ethers.parseEther("1") }))
      .to.be.revertedWith("Already exists");
  });
});
