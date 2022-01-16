import { Signer } from "ethers";
import { expect } from "chai";
const { ethers, upgrades } = require("hardhat");

describe("Contract Deployment", function () {
  let accounts: Signer[];
  let owner: String;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    owner = await accounts[0].getAddress();
  });

  it("Should be deployed", async function () {
    const TokenContract = await ethers.getContractFactory("NFT");
    const tokenContract = await TokenContract.deploy().then((e: any) =>
      e.deployed()
    );

    console.log(tokenContract.address, "\n");

    await tokenContract.mintNFT(100, 20, 200);
    await tokenContract.mintNFT(100, 20, 200);
    await tokenContract.mintNFT(100, 20, 200);

    let res = await tokenContract.tokenURI(0);
    console.log(res);
    res = await tokenContract.tokenURI(1);
    console.log(res);
    res = await tokenContract.tokenURI(2);
    console.log(res);
  });
});
