import { useState, useEffect } from "react";

import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import useWeb3 from "./hooks/web3";
import getWeb3 from "./web3/getWeb3";

import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import GenerateLayout from "./components/GenerateLayout";
import HomeLayout from "./components/LandingPage";

import NFTContractJSON from "./artifacts/contracts/NFTContract.sol/StreamableNFT.json";
import FactoryContractJSON from "./artifacts/contracts/Factory.sol/TokenContract.json";
import Web3Context from "./contexts/Web3Context";

import addressMap from "./addresses.json";
import SubGraph from "components/SuperfluidGraph/SuperGraph";

interface Window {
  ethereum: any;
  addEventListener: any;
}
declare const window: Window;

const sf = new SuperfluidSDK.Framework({
  ethers: new Web3Provider(window.ethereum),
});

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [acc, setAcc] = useState("0x0");

  const tokenAdd = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";
  const receipt = "0xafe0DA2BDBc38A2376C7b775e784075523d3C1AC";
  const [isStreaming, setIsStreaming] = useState(false);

  const flowRate = "10000000"; // 2592  per month

  const handleFlow = async () => {
    await user.flow({
      recipient: receipt,
      flowRate: `${flowRate}`,
    });

    setIsStreaming(true);
  };

  const stopFlow = async () => {
    await user.flow({
      recipient: receipt,
      flowRate: "0",
    });
    setIsStreaming(false);
  };

  // useEffect(() => {
  //   (async () => {
  //     const [acc] = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //       params: [
  //         {
  //           eth_accounts: {},
  //         },
  //       ],
  //     });
  //     setAcc(acc);
  //     console.log("Accountds loaded", acc);
  //     await sf.initialize();
  //     console.log("sf inited");

  //     const carol = sf.user({
  //       address: acc,
  //       token: tokenAdd,
  //     });
  //     setUser(carol);
  //     setIsLoading(false);
  //   })();
  // }, []);

  // return (
  //   <div className="App">
  //     {isLoading ? (
  //       <h1>Loading ...</h1>
  //     ) : (
  //       <div>
  //         <h3>{acc}</h3>
  //         <button onClick={handleFlow}>Transfer</button>
  //         <button onClick={stopFlow}>Stop</button>
  //       </div>
  //     )}i
  //   </div>
  // );

  const [isConnected, setIsConnected] = useState(false);
  const [isWalletConnecting, setWalletConnecting] = useState(false);

  const [nftContract, setNftContract] = useState<Contract>();
  const [factoryContract, setFactoryContract] = useState<Contract>();
  const [address, setAddress] = useState("0x0");
  const { isLoading, web3, account, hasMetamask } = useWeb3();

  const requestWalletConnect = async () => {
    try {
      setWalletConnecting(true);
      // connect the wallet
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const nft_abi = NFTContractJSON.abi as AbiItem[];
      const nft_contract_instance = new web3.eth.Contract(
        nft_abi,
        addressMap.NFTAddress
      );

      const factoryAbi = FactoryContractJSON.abi as AbiItem[];
      const factory_contract_instance = new web3.eth.Contract(
        factoryAbi,
        addressMap.FactoryAddress
      );

      setNftContract(nft_contract_instance);
      setFactoryContract(factory_contract_instance);

      setAddress(accounts[0]);
      console.log(accounts);
    } catch (e) {
      console.log(e);

      setWalletConnecting(false);
    } finally {
      setWalletConnecting(false);
    }
    setIsConnected(true);
  };

  useEffect(() => {
    requestWalletConnect();
  }, []);

  if (isWalletConnecting) {
    return <h1>Connecting....</h1>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Web3Context.Provider
          value={{
            web3,
            nftContract,
            factoryContract,
            nftContractAddress: addressMap.NFTAddress,
            factoryContractAddress: addressMap.FactoryAddress,
            rgbAddress: addressMap.RGB,
            account: address,
            isLoading,
            hasMetamask,
          }}
        >
          <Switch>
            <Route exact path="/">
              <GenerateLayout />
            </Route>
            <Route exact path="/mint">
              {/* <LandingPage /> */}
            </Route>
            <Route exact path="/graph">
              <SubGraph />
            </Route>
          </Switch>
        </Web3Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
