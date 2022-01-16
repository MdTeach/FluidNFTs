import axios from "axios";
import { useEffect } from "react";
import Loading from "./loading";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";

let contractAddrs = "0x8db7C7ed6403e26445843855D86834014500D4D7";
contractAddrs = contractAddrs.toLowerCase();
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [ownAddr, setOwnAddrs] = useState("0x0");
  const [inRates, setInRate] = useState(0);

  const fetchData = async () => {
    // GrapgQL
    const QUERY_URL =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai";

    const query = `{
		account(id: "${contractAddrs}") {
			flowsReceived(where: {flowRate_gt: 0}) {
				flowRate
				sum
				lastUpdate
				owner{id}
				token{id}
			}
        	flowsOwned(where: {flowRate_gt: 0}){
          		flowRate
				sum
				lastUpdate
				recipient{id}
				token{id}
        	}
		}
	}`;
    const result = await axios.post(QUERY_URL, { query });
    console.log(result.data.data.account);

    setIsLoading(false);
    setIsFailed(false);
  };

  useEffect(() => {
    (async () => {
      await fetchData();
      setInterval(async () => {
        await fetchData();
      }, 5000);
    })();
  }, [0]);

  if (isLoading) {
    return <Loading />;
  }

  if (isFailed) {
    return (
      <div>
        <Alert
          severity="warning"
          style={{ fontSize: "28px", fontWeight: "bold" }}
        >
          No active flow found on {contractAddrs}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1>Flow</h1>
    </div>
  );
};

export default App;
