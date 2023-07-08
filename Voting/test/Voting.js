
const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
let numVotes = 0;

const isHardHatNetwork = () => {
    return hre.network.name === "hardhat";
  };
  
async function waitNextBlock() {
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
}
describe("Voting", function () {
  let owner, voter1, voter2, voter3, voter4;
  let voting;
  
  this.beforeAll(async function () {
    [owner, voter1, voter2, voter3, voter4] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("Voting");
    const currentDate = new Date();
    const initialDate = Math.floor(currentDate.getTime() / 1000);
    currentDate.setSeconds(currentDate.getSeconds() + 10);
    const finalDate = Math.floor(currentDate.getTime() / 1000);
    voting = await contractFactory.deploy(initialDate, finalDate);
    await voting.deployed();
  });

  it("Simple Voting test", async function () {

    const rc = await (
      await voting
          .connect(voter1)
          .vote("barcelona")
      ).wait();

    const successful = rc.events.find((e) => e.event === "Successful");
    const failed = rc.events.find((e) => e.event === "Failed");
    if (successful) {
      numVotes += 1;
      expect(failed).to.be.undefined;
    }
    const number = await voting.getNumVotes();
    expect(number).to.be.equal(numVotes);
  });

  it("Voting test failed for double vote", async function () {
    
    const rc = await (
      await voting
          .connect(voter1)
          .vote("real")
      ).wait();

    const successful = rc.events.find((e) => e.event === "Successful");
    const failed = rc.events.find((e) => e.event === "Failed");
    if (failed) {
      expect(successful).to.be.undefined;
    }
    const number = await voting.getNumVotes();
    expect(number).to.be.equal(numVotes); 

  });

  it("Final voting and check winner", async function () {

    const winner = "psg";
    let vot;
    for (let i = 0; i < 3; i++) {

      if (i==0){
        vot = voter2;
      }else if(i==1){
        vot = voter3;
      } else {
        vot = voter4;
      }

      const rc = await (
        await voting
            .connect(vot)
            .vote("psg")
        ).wait();
  
      const successful = rc.events.find((e) => e.event === "Successful");
      const failed = rc.events.find((e) => e.event === "Failed");
      if (successful) {
        numVotes += 1;
        expect(failed).to.be.undefined;
      }
      await waitNextBlock();
    }
    
    const number = await voting.getNumVotes();
    expect(number).to.be.equal(numVotes);

    const winner_c = await voting.getWinner();
    expect(winner_c).to.be.equal(winner);
  });

  it("Voting test failed for voting after deadline", async function () {

    await new Promise(resolve => setTimeout(resolve, 10 * 1000));

    await expect(voting.connect(owner).vote("liverpool")).to.be.revertedWith("Voting is not currently open");
    
  });


});