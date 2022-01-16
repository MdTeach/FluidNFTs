import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface Web3ContextType {
  web3?: Web3 | null;
  nftContract?: Contract | undefined;
  nftContractAddress?: String;
  account?: String;
  factoryContract?: Contract | undefined;
  factoryContractAddress?: String | undefined;
  rgbAddress?: Array<string> | undefined;
  isLoading: boolean;
  hasMetamask: boolean;
}

export default Web3ContextType;
