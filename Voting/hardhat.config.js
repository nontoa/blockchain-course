require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    local: {
      url: "http://127.0.0.1:8545",
      chainId: 8118,
      accounts: [
        "1d2701c212a73bf9f800289ac717395a261d20815ec08678042f0a3104e45d4d",
        "69214d99fc7d58f611de869fdaa40e2f1a4ef9bbdce766a698bcd6809d12d3bc",
      ],
    },
  },
};