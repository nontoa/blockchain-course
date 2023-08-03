// Load dependencies
const { expect } = require("chai");

describe("ERC20 Token contract", function () {
  it("Test contract", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const myToken = await ethers.deployContract("ERC20Token");
    const tx = await myToken.transfer(addr1.address, 100n * 10n ** 18n);
    const rc = await tx.wait();
    const event = rc.events.find((event) => event.event === "Transfer");

    expect(event).to.have.property("event", "Transfer");
    expect(await myToken.balanceOf(addr1.address)).to.equal(100n * 10n ** 18n);
    expect(await myToken.balanceOf(owner.address)).to.equal(900n * 10n ** 18n);

    expect(await myToken.totalSupply()).to.equal(1000n * 10n ** 18n);

  });
});