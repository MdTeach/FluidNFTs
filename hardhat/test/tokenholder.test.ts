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

  it.skip("Should be deployed", async function () {
    const TokenHolder = await ethers.getContractFactory("StreamableNFT");
    const tokenHolder = await TokenHolder.deploy().then((e: any) =>
      e.deployed()
    );

    // const tokenAdd = await tokenHolder._sodaToken();
    console.log("token contract", tokenHolder.address);
  });

  it.skip("Should be deployed", async function () {
    const TokenHolder = await ethers.getContractAt(
      "INativeSuperToken",
      "0xaa4ba593fa6908b5242ee9c69b1817fe5ea98a4f"
    );

    const d = await TokenHolder.getHost();

    // const tokenAdd = await tokenHolder._sodaToken();
    console.log("token contract", d);
  });

  it("Can stream", async () => {
    const TokenHolder = await ethers.getContractAt(
      "StreamableNFT",
      "0x609EDBC2F3Fd68C541fb4DbF45081b0997c6db3E"
    );

    const log = await TokenHolder.sendFlow(
      "0x64cA6A03784b42FF3b65E9430Ac0FE3d3e42f116",
      "0x512da6a432253750FE402E3Bd7f9680Da94463E6"
    ).then((e: any) => e.wait());

    console.log(log);
  });
});
