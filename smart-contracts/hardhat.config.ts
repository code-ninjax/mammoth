import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const BDAG_RPC_URL = process.env.BDAG_RPC_URL || "https://rpc.awakening.bdagscan.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    bdag: {
      url: BDAG_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      // chainId can be set if known; omitted here for RPC-driven detection.
    },
  },
};

export default config;