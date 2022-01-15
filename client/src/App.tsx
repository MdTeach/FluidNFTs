import { useState, useEffect } from "react";

import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";

interface Window {
  ethereum: any;
  addEventListener: any;
}
declare const window: Window;

const sf = new SuperfluidSDK.Framework({
  ethers: new Web3Provider(window.ethereum),
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
    console.log("abishek bashyal");
  };

  const stopFlow = async () => {
    await user.flow({
      recipient: receipt,
      flowRate: "0",
    });
    setIsStreaming(false);
  };

  useEffect(() => {
    (async () => {
      const [acc] = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      setAcc(acc);
      console.log("Accountds loaded", acc);
      await sf.initialize();
      console.log("sf inited");

      const carol = sf.user({
        address: acc,
        token: tokenAdd,
      });
      setUser(carol);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <h1>Loading ...</h1>
      ) : (
        <div>
          <h3>{acc}</h3>
          <button onClick={handleFlow}>Transfer</button>
          <button onClick={stopFlow}>Stop</button>
        </div>
      )}
    </div>
  );
}

export default App;
