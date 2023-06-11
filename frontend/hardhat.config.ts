import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
      hardhat: {},
      polygon_mumbai: {
        url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
        accounts: [`0x${process.env.PRIVATE_KEY_SANGOKU}`],
    },
  },

};

export default config;