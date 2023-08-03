// Load dependencies
const { expect } = require("chai");

const isHardHatNetwork = () => {
  return hre.network.name === "hardhat";
};

// Make sure the current block has been mined
const waitNextBlock = async () => {
  if (isHardHatNetwork()) {
    return helpers.mine();
  }
  const startBlock = await ethers.provider.getBlockNumber();
  return new Promise((resolve, reject) => {
    const isNextBlock = async () => {
      const currentBlock = await ethers.provider.getBlockNumber();
      if (currentBlock > startBlock) {
        resolve();
      } else {
        setTimeout(isNextBlock, 300);
      }
    };
    setTimeout(isNextBlock, 300);
  });
};

describe("MyToken contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const myToken = await ethers.deployContract("MyToken");

    const ownerBalance = await myToken.balanceOf(owner.address);
    var totalSupply = await myToken.totalSupply();
    expect(totalSupply).to.equal(ownerBalance);
    expect(totalSupply).to.equal(1000n * 10n ** 18n);

    await myToken.mint(owner.address, 1000n * 10n ** 18n);
    await waitNextBlock();
    totalSupply = await myToken.totalSupply();

    expect(totalSupply).to.equal(2000n * 10n ** 18n);

    await expect(myToken.connect(addr1).mint(addr1.address, 1000n * 10n ** 18n)).to.be.revertedWith("Ownable: caller is not the owner");

  });
});