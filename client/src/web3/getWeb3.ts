import Web3 from "web3";

interface Window {
  ethereum: any;
  web3: Web3;
  addEventListener: any;
}
declare const window: Window;

const web3 = async () => {
  if (window.ethereum) {
    // Modern Dapp Browser...
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      const id: number = await web3.eth.net.getId();
      if (id !== 80001) throw new Error("Invalid network id");
      return web3;
    } catch (error) {
      throw error;
    }
  } else if (window.web3) {
    // Use metamask provider
    const web3 = window.web3;
    const id: number = await web3.eth.net.getId();
    if (id !== 4) throw new Error("Invalid network id");

    return web3;
  } else {
    throw new Error("Metamask not found");
  }
};

export default web3;
