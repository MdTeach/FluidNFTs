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
      "MyNFT100", // Name
      "MNFT100" // Symbol
    ).then((e: any) => e.deployed());

    console.log("factory contract", tokenContract.address);

    const rAdd = await tokenContract._redValToken();
    const gAdd = await tokenContract._greenValToken();
    const bAdd = await tokenContract._blueValToken();

    const rnativeToken = await ethers.getContractAt("INativeSuperToken", rAdd);
    const gnativeToken = await ethers.getContractAt("INativeSuperToken", gAdd);
    const bnativeToken = await ethers.getContractAt("INativeSuperToken", bAdd);

    const txn1 = await tokenContract
      .handleMint(
        "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873",
        10 ** 4,
        10 ** 4,
        10 ** 4
      )
      .then((e: any) => e.wait());

    const rbal = await rnativeToken.balanceOf(
      "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
    );
    const gbal = await gnativeToken.balanceOf(
      "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
    );
    const bbal = await bnativeToken.balanceOf(
      "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
    );

    console.log(
      "fluid token",
      rnativeToken.address,
      gnativeToken.address,
      bnativeToken.address
    );
    console.log("transfered ammut man", rbal, gbal, bbal);

    const balances = await tokenContract.getBalances(
      "0x49e565ed1bdc17f3d220f72df0857c26fa83f873"
    );

    console.log("all fetched", balances);
  });
});
