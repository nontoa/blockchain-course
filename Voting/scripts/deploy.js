// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const currentDate = new Date();


function getInitialDate(){

  return Math.floor(currentDate.getTime() / 1000);
}

function getFinalDate(){

  // 4 minutes for voting
  currentDate.setMinutes(currentDate.getMinutes() + 4);
  return Math.floor(currentDate.getTime() / 1000);
}

async function main() {

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(getInitialDate(), getFinalDate());

  await voting.deployed();

  console.log(
    `Voting with deployed to ${voting.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
