
const { expect } = require("chai");
const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

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
describe("Lottery", function () {
  let owner, player;
  let lottery;
  let getBalances;

  // Setup only once at the beginning of the test
  this.beforeAll(async function () {
    [owner, player] = await ethers.getSigners();
    lottery = await ethers.deployContract("Lottery");
    getBalances = async () => ({
        lotteryBalance: await ethers.provider.getBalance(lottery.address),
        playerBalance: await ethers.provider.getBalance(player.address),
        ownerBalance: await ethers.provider.getBalance(owner.address),
      });
  });

  it("Randomness", async function () {
    for (let i = 0; i < 20; i++) {
      const number = await lottery.random(5 + i, 3);
      expect(number)
        .to.be.greaterThanOrEqual(3)
        .and.to.be.lessThanOrEqual(5 + i);
    }
  });

  it("Win/Loose", async function () {
    const wins = [];
    for (let i = 0; i < 5; i++) {
      wins.push(await lottery.isWinning());
      await waitNextBlock();
    }
    expect(wins).to.contain(true);
    expect(wins).to.contain(false);
  }).timeout(1000000);

  it("Test buyTicket", async function () {
    // get balances before buying a ticket
    var wins = 0;
    var losses = 0;
    for (let i = 0; i < 2; i++) {
       
        const before = await getBalances();
        // Buy a ticket, we the the transaction receipt as return value
        const rc = await (
        await lottery
            .connect(player)
            .buyTicket({ value: ethers.utils.parseEther("1") })
        ).wait();
    
        // get balances after buying a ticket
        const after = await getBalances();
    
        const win = rc.events.find((e) => e.event === "Win");
        const loose = rc.events.find((e) => e.event === "Loose");

        // Calculate the transaction price based on gas used and the gas price
        const txPrice = ethers.BigNumber.from(rc.effectiveGasPrice).mul(
        ethers.BigNumber.from(rc.gasUsed)
        );
    
        if (loose) {
            losses+=1;
            expect(win).to.be.undefined;
        
            // Check balances in case we lost
            expect(after.lotteryBalance).to.be.equal(
                before.lotteryBalance.add(ethers.utils.parseEther("1"))
            );
            expect(after.playerBalance).to.be.equal(
                before.playerBalance.sub(ethers.utils.parseEther("1")).sub(txPrice)
            );
        } else if (win) {
            wins += 1;
            expect(loose).to.be.undefined;
        
            // Check balances in case we won
            expect(after.lotteryBalance).to.be.equal(
                before.lotteryBalance.add(ethers.utils.parseEther("1")).sub(win.args.amount)
            );
        
            expect(after.playerBalance).to.be.equal(
                before.playerBalance.sub(ethers.utils.parseEther("1")).sub(txPrice).add(win.args.amount)
            );
            } else {
            expect.fail("No win/loose event was emitted");
        }
        await waitNextBlock();
    }
    const numTickets = await lottery.getNumTickets();
    expect(numTickets).to.be.equal(2);
    console.log("Number of wins: ",wins);
    console.log("Number of losses: ", losses);
  }).timeout(1000000);

});