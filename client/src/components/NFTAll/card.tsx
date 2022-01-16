import { CircularProgress } from "@material-ui/core";
import { useEffect, useState, useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import web3 from "web3";
const App = ({ id }: any) => {
  const context = useContext(Web3Context);
  const [isLoading, setLoaing] = useState(true);
  const [data, setData] = useState<any>();
  useEffect(() => {
    (async () => {
      console.log("called");

      const rawdata = await context.nftContract?.methods
        .tokenURI(id)
        .call({ from: context.account });

      const json = atob(rawdata.substring(29));
      console.log(json);

      const result = JSON.parse(json);
      console.log("res", result);
      setData(result);
      setLoaing(false);

      let blob = new Blob([result.image], { type: "image/svg+xml" });
      let url = URL.createObjectURL(blob);
      console.log(url);
    })();
  }, []);
  return (
    <div style={{ margin: "0 23px" }}>
      {isLoading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ width: "150px" }}>
          <div
            style={{
              width: 150,
              height: 150,
              background: `rgb(${web3.utils.fromWei(
                data.rColor
              )},${web3.utils.fromWei(data.gColor)},${web3.utils.fromWei(
                data.bColor
              )})`,
              borderRadius: "10px",
              border: "2px solid gray",
            }}
          />
          <div style={{ marginTop: "6px" }}>
            RGB: {web3.utils.fromWei(data.rColor)},
            {web3.utils.fromWei(data.gColor)},{web3.utils.fromWei(data.bColor)}
          </div>
          <div
            style={{ textAlign: "center", marginTop: "16px", fontSize: "24px" }}
          >
            Fluid token <b>#{id}</b>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
