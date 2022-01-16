import "@nomiclabs/hardhat-etherscan";
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ganache");

const {
  infura_endpoint,
  mnemonic,
  ethersacn_key,
  polyscan_key,
} = require("./secrets.json");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: {
        mnemonic: mnemonic,
      },
      gasPrice: 15000000000,
      gas: 2100000,
    },
    // url: "https://polygon-mainnet.g.alchemy.com/v2/vRhKZNFeA8756awUcn42DIueMSl-ruiz",
    main: {
      url: "https://polygon-rpc.com/",
      accounts: {
        mnemonic: mnemonic,
      },
      gasPrice: 34000000000,
      gas: 2100000,
    },
    // url: "https://rinkeby.infura.io/v3/ad0f7d8b5f45447fa15576f4f2c0c0bf",
    rinkeby: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/vRhKZNFeA8756awUcn42DIueMSl-ruiz",
      accounts: {
        mnemonic: mnemonic,
      },
    },
  },
  etherscan: {
    apiKey: polyscan_key,
  },
  paths: {
    artifacts: "../client/src/artifacts",
  },
  mocha: {
    timeout: 500000,
  },
};
//  hh verify --network rinkeby 0x4ADa53Ae29F1c135FBe27ae9F926FD63907B60c0
//  hh verify --network matic 0xa04c11c5fc98c41bca75ea3e367be21e0382f32ab63746e947cce51ca5a0e111
//  hh run --network matic scripts/deploy-script.ts
//  hh run --network rinkeby scripts/deploy-script.ts
