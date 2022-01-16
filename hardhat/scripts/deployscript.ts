import { utils } from "ethers";

const hre = require("hardhat");

async function main() {
  const TokenContract = await hre.ethers.getContractFactory("TokenContract");
  const StreamableNFT = await hre.ethers.getContractFactory("StreamableNFT");

  const tokenContract = await TokenContract.deploy(
    "0xEB796bdb90fFA0f28255275e16936D25d3418603",
    "0x200657E2f123761662567A1744f9ACAe50dF47E6",
    "MyNFT1", // Name
    "MNFT" // Symbol
  ).then((e: any) => e.deployed());

  const streamableNFT = await StreamableNFT.deploy(tokenContract.address).then(
    (e: any) => e.deployed()
  );

  const rAdd = await tokenContract._redValToken();
  const gAdd = await tokenContract._greenValToken();
  const bAdd = await tokenContract._blueValToken();

  console.log("Factory address", tokenContract.address);
  console.log("NFT address", streamableNFT.address);

  console.log("r,g,b @", rAdd, gAdd, bAdd);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
