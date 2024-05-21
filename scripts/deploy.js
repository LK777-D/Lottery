const { ethers } = require("hardhat");

const main = async () => {
  try {
    const contract = await ethers.deployContract("Lottery");
    await contract.waitForDeployment();
    console.log("contract deployed at", contract.target);
  } catch (error) {
    console.log(error);
  }
};
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
