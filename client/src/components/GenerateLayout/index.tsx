import { useEffect, useState, useContext } from "react";
import Web3Context from "../../contexts/Web3Context";

import NativeTokenJson from "artifacts/@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/INativeSuperToken.sol/INativeSuperToken.json";
import HolderJson from "artifacts/contracts/Holder.sol/Holder.json";
import { AbiItem } from "web3-utils";
import CFAJson from "artifacts/@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol/IConstantFlowAgreementV1.json";

import { Contract } from "web3-eth-contract";

const flowRate = "1000000000000000";

const App = () => {
  const context = useContext(Web3Context);

  if (!context.rgbAddress) throw Error("rgb missing");

  const handleMint = async () => {
    const rValue = context.web3?.utils.toWei("90");
    const gValue = context.web3?.utils.toWei("240");
    const bValue = context.web3?.utils.toWei("90");
    await context.nftContract?.methods.mint(rValue, gValue, bValue).send({
      from: context.account,
    });
  };

  const logAddress = async (n1: number, n2: number) => {
    const h1 = await context.nftContract?.methods
      .HPRecords(n1)
      .call({ from: context.account });
    const h2 = await context.nftContract?.methods
      .HPRecords(n2)
      .call({ from: context.account });

    console.log(h1);
    console.log(h2);

    return [h1, h2];
  };

  const handleFlow = async (
    sender: number,
    receiver: number,
    acceptedToken: string
  ) => {
    if (!context.web3) throw new Error("Error");

    const senderAddress = await context.nftContract?.methods
      .HPRecords(sender)
      .call({ from: context.account });

    const receiverAddress = await context.nftContract?.methods
      .HPRecords(receiver)
      .call({ from: context.account });

    const holderAbi = HolderJson.abi as AbiItem[];
    const holder_instance = new context.web3.eth.Contract(
      holderAbi,
      senderAddress
    );

    await holder_instance.methods
      .sendFlow(
        acceptedToken,
        "0x8db7C7ed6403e26445843855D86834014500D4D7",
        flowRate
      )
      .send({ from: context.account });
  };

  const checkBalance = async (id: number, addrs: string) => {
    if (!context.web3) throw new Error("Error");

    const holderAddress = await context.nftContract?.methods
      .HPRecords(id)
      .call({ from: context.account });

    const bal = await context.factoryContract?.methods
      .getBalances(holderAddress)
      .call({ from: context.account });
    console.log(bal);

    console.log(`Addrs ${holderAddress} balance is ${bal}`);
  };

  const getRealtimeBal = async (userAddrs: string, tokenAddrs: string) => {
    if (!context.web3) throw new Error("Error");

    const cfaAbi = CFAJson.abi as AbiItem[];
    const cfa = new context.web3.eth.Contract(
      cfaAbi,
      "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873"
    );

    const data = await cfa.methods
      .getAccountFlowInfo(tokenAddrs, userAddrs)
      .call({ from: context.account });
    console.log(data);
  };

  const addrsR = context.rgbAddress[0];

  return (
    <div>
      <h1>Mint nft here</h1>
      <button onClick={handleMint}>Mint</button>

      <button
        onClick={async () => {
          await checkBalance(0, addrsR);
        }}
      >
        Balance of token 1
      </button>
      <button
        onClick={async () => {
          await handleFlow(0, 1, addrsR);
        }}
      >
        Transfer from 0 t0 1
      </button>
      <button
        onClick={async () => {
          await logAddress(0, 1);
        }}
      >
        Show address
      </button>
      <br />
      <button
        onClick={async () => {
          const [a1, a2] = await logAddress(0, 1);
          await getRealtimeBal(a1, addrsR);
        }}
      >
        Get RT addresss{" "}
      </button>
    </div>
  );
};

export default App;
