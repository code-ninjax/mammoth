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

    const nodes = [await node1.getAddress(), await node2.getAddress(), await node3.getAddress()];
    const cid = ethers.keccak256(ethers.toUtf8Bytes("demo-cid"));

    const paid = ethers.parseEther("9"); // 9 ETH for clean division
    await expect(contract.connect(owner).storeFile(cid, nodes, { value: paid }))
      .to.emit(contract, "FileStored")
      .withArgs(cid, await owner.getAddress(), paid);

    const share = paid / BigInt(nodes.length);
    const b1Before = await ethers.provider.getBalance(await node1.getAddress());
    const b2Before = await ethers.provider.getBalance(await node2.getAddress());
    const b3Before = await ethers.provider.getBalance(await node3.getAddress());

    await expect(contract.releasePayment(cid))
      .to.emit(contract, "PaymentReleased")
      .withArgs(cid);

    const b1After = await ethers.provider.getBalance(await node1.getAddress());
    const b2After = await ethers.provider.getBalance(await node2.getAddress());
    const b3After = await ethers.provider.getBalance(await node3.getAddress());

    expect(b1After - b1Before).to.equal(share);
    expect(b2After - b2Before).to.equal(share);
    expect(b3After - b3Before).to.equal(share);

    await expect(contract.releasePayment(cid)).to.be.revertedWith("Already released");
  });

  it("prevents duplicate CIDs and zero-payment", async function () {
    const [owner, node] = await ethers.getSigners();
    const MammothStorage = await ethers.getContractFactory("MammothStorage");
    const contract = await MammothStorage.deploy();
    await contract.waitForDeployment();

    const cid = ethers.keccak256(ethers.toUtf8Bytes("cid-1"));
    const nodes = [await node.getAddress()];

    await expect(contract.storeFile(cid, nodes, { value: 0 }))
      .to.be.revertedWith("No payment");

    await contract.storeFile(cid, nodes, { value: ethers.parseEther("1") });
    await expect(contract.storeFile(cid, nodes, { value: ethers.parseEther("1") }))
      .to.be.revertedWith("Already exists");
  });
});