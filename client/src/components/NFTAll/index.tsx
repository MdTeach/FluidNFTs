import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import Loading from "components/SuperfluidGraph/loading";
import Card from "./card";
import Svg from "./s.svg";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import HolderJson from "artifacts/contracts/Holder.sol/Holder.json";
import { AbiItem } from "web3-utils";
import web3 from "web3";

const App = () => {
  const context = useContext(Web3Context);
  const nftAddrs = context.nftContractAddress;

  const ckey = "ckey_11f33873c56b4c50b39a19973a6";
  const url = `https://api.covalenthq.com/v1/80001/tokens/${nftAddrs}/nft_token_ids/?key=${ckey}&page-size=100`;

  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const flowRate = web3.utils.toWei("0.05"); // 2592 DAIx per month

  const [R, setR] = useState("1000000000000000");
  const [G, setG] = useState("1000000000000000");
  const [B, setB] = useState("1000000000000000");
  const [t1, setT1] = useState("1");
  const [t2, setT2] = useState("0");

  useEffect(() => {
    (async () => {
      const res = await axios.get(url);
      const items = await res.data.data.items;
      console.log(items);
      setIsLoading(false);
      setDatas(items);
    })();
  }, []);

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

    console.log(senderAddress, receiverAddress);

    await holder_instance.methods
      .sendFlow(acceptedToken, receiverAddress, flowRate)
      .send({ from: context.account });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ textAlign: "center", height: "95vh", position: "relative" }}>
      <img
        src={Svg}
        alt="svg"
        style={{
          position: "absolute",
          zIndex: "1",
          left: "-100px",
          bottom: "0",
        }}
      />
      <div style={{ position: "relative", zIndex: "2" }}>
        <div style={{ marginTop: "20px", fontSize: "48px" }}>
          Streamable NFTs
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          {datas.map((e: any) => (
            <div key={e.token_id}>
              <Card id={e.token_id} />
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div style={{ width: "60%", margin: "0 auto", marginTop: "30px" }}>
          <TextField
            required
            id="outlined-required"
            label="Enter sender token Id"
            defaultValue=""
            onChange={(e: any) => {
              //   setT1(e.traget.value);
            }}
          />
          <TextField
            required
            id="outlined-required"
            label="Enter sender token Id"
            defaultValue=""
            onChange={(e: any) => {
              //   setT2(e.traget.value);
            }}
          />
          <br />

          <TextField
            id="outlined-number"
            label="RFlowRate"
            type="number"
            defaultValue={1000000000000000}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e: any) => {
              setR(e.traget.value.toString());
            }}
          />
          <TextField
            id="outlined-number"
            label="GFlowRate"
            type="number"
            defaultValue={1000000000000000}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e: any) => {
              setG(e.traget.value.toString());
            }}
          />
          <TextField
            id="outlined-number"
            label="BFlowRate"
            type="number"
            defaultValue={1000000000000000}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e: any) => {
              setB(e.traget.value.toString());
            }}
          />
        </div>
        <br />
        <Button
          variant="contained"
          onClick={async () => {
            if (!context.rgbAddress) return;
            await handleFlow(parseInt(t1), parseInt(t2), context.rgbAddress[0]);
          }}
        >
          Stream Rvalue
        </Button>
        <Button
          variant="contained"
          style={{ margin: "0 50px" }}
          onClick={async () => {
            if (!context.rgbAddress) return;
            await handleFlow(parseInt(t1), parseInt(t2), context.rgbAddress[1]);
          }}
        >
          Stream Gvalue
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            if (!context.rgbAddress) return;
            await handleFlow(parseInt(t1), parseInt(t2), context.rgbAddress[2]);
          }}
        >
          Stream Bvalue
        </Button>

        <br />
      </Box>
    </div>
  );
};
export default App;
