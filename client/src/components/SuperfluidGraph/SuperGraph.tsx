import axios from "axios";
import { useEffect } from "react";
import Loading from "./loading";
import Alert from "@material-ui/lab/Alert";
import { useState, useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import web3 from "web3";
import LinearProgress from "@material-ui/core/LinearProgress";
import { setTimeout } from "timers";

const App = () => {
  const [d1, sd1] = useState<any>();
  const [d2, sd2] = useState<any>();
  const [loading, setIsloading] = useState(true);

  const fetchData = async () => {
    console.log("fetching");

    let rawdata = await context.nftContract?.methods
      .tokenURI(0)
      .call({ from: context.account });

    let json = atob(rawdata.substring(29));
    const result0 = JSON.parse(json);
    rawdata = await context.nftContract?.methods
      .tokenURI(1)
      .call({ from: context.account });

    json = atob(rawdata.substring(29));
    const result1 = JSON.parse(json);
    sd1(result0);
    sd2(result1);
    setIsloading(false);

    setTimeout(() => {
      fetchData();
    }, 500);
  };

  const context = useContext(Web3Context);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <div style={{ width: "250px" }}>
        <div
          style={{
            width: 250,
            height: 250,
            background: `rgb(${web3.utils.fromWei(
              d2.rColor
            )},${web3.utils.fromWei(d2.gColor)},${web3.utils.fromWei(
              d2.bColor
            )})`,
            borderRadius: "10px",
            border: "2px solid gray",
          }}
        />
        <div style={{ marginTop: "6px" }}>
          RGB: {web3.utils.fromWei(d2.rColor)},{web3.utils.fromWei(d2.gColor)},
          {web3.utils.fromWei(d2.bColor)}
        </div>
        <div
          style={{ textAlign: "center", marginTop: "16px", fontSize: "24px" }}
        >
          Fluid token <b>#{1}</b>
        </div>
      </div>
      <div style={{ margin: "0 20px", width: "100px" }}>
        <LinearProgress
          color="secondary"
          style={{ paddingTop: "10px", marginTop: "50px" }}
        />
        <LinearProgress
          color="secondary"
          style={{ paddingTop: "10px", marginTop: "50px" }}
        />
        <LinearProgress
          color="secondary"
          style={{ paddingTop: "10px", marginTop: "50px" }}
        />
      </div>
      <div style={{ width: "250px" }}>
        <div
          style={{
            width: 250,
            height: 250,
            background: `rgb(${web3.utils.fromWei(
              d1.rColor
            )},${web3.utils.fromWei(d1.gColor)},${web3.utils.fromWei(
              d1.bColor
            )})`,
            borderRadius: "10px",
            border: "2px solid gray",
          }}
        />
        <div style={{ marginTop: "6px" }}>
          RGB: {web3.utils.fromWei(d1.rColor)},{web3.utils.fromWei(d1.gColor)},
          {web3.utils.fromWei(d1.bColor)}
        </div>
        <div
          style={{ textAlign: "center", marginTop: "16px", fontSize: "24px" }}
        >
          Fluid token <b>#{0}</b>
        </div>
      </div>
    </div>
  );
};

export default App;
