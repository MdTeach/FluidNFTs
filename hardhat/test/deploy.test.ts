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
    const TokenContract = await ethers.getContractFactory("TokenContract");
    const tokenContract = await TokenContract.deploy(
      "0xEB796bdb90fFA0f28255275e16936D25d3418603",
      "0x200657E2f123761662567A1744f9ACAe50dF47E6"
    ).then((e: any) => e.deployed());

    const tokenAdd = await tokenContract._sodaToken();
    console.log("token contract", tokenAdd);

    const nativeToken = await ethers.getContractAt(
      "INativeSuperToken",
      tokenAdd
    );

    // const nativeToken = await ethers.getContractAt(
    //   "INativeSuperToken",
    //   "0x3e1CCa7F3D29Cf9BD4De9DF56B9072926F4A2c81"
    // );

    console.log("Native contract", nativeToken.address);

    const n = await nativeToken.name();
    console.log(n);
    console.log(nativeToken.functions);
  });
});
