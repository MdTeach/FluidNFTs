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
      "0x200657E2f123761662567A1744f9ACAe50dF47E6",
      "MyNFT1", // Name
      "MNFT" // Symbol
    ).then((e: any) => e.deployed());

    const tokenAdd = await tokenContract._fluidToken();

    const nativeToken = await ethers.getContractAt(
      "INativeSuperToken",
      tokenAdd
    );

    const txn1 = await tokenContract
      .handleMint("0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873", 10 ** 9)
      .then((e: any) => e.wait());

    console.log(txn1.hash);

    const bal = await nativeToken.balanceOf(
      "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
    );

    console.log("factory contract", tokenContract.address);
    console.log("fluid token", nativeToken.address);
    console.log("transfered ammut", bal);
  });
});
