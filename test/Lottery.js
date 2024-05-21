const { expect } = require("chai");
const { ethers } = require("hardhat");
const toWei = (num) => ethers.parseEther(num.toString());
const fromWei = (num) => ethers.formatEther(num);
const parseEther = (num) => ethers.parseUnits(num.toString(), "wei");
describe("Lottery", () => {
  let contract;
  const PLAYERSNUMBER = 5;
  const ENTERPRICE = 2;

  beforeEach(async () => {
    [
      deployer,
      participant1,
      participant2,
      participant3,
      participant4,
      participant5,
    ] = await ethers.getSigners();
    contract = await ethers.deployContract("Lottery");
    await contract.waitForDeployment();
  });
  it("Should set the owner", async () => {
    const owner = await contract.owner();
    expect(owner).to.equal(deployer);
  });
  describe("Lottery creation", () => {
    beforeEach(async () => {
      await contract.connect(deployer).createLottery(PLAYERSNUMBER, ENTERPRICE);
    });
    it("Should confirm lottery creation", async () => {
      const lottery = await contract.lotteries(1);
      expect(toWei(lottery.enterPrice)).to.equal(toWei(ENTERPRICE));
      expect(lottery.playersNumber).to.equal(PLAYERSNUMBER);
    });
  });
  describe("Lottery participating", () => {
    beforeEach(async () => {
      await contract.connect(deployer).createLottery(PLAYERSNUMBER, ENTERPRICE);
    });
    it("Should confirm buying ticket", async () => {
      await contract
        .connect(participant1)
        .buyTicket(1, { value: parseEther(ENTERPRICE) });
      const lottery = await contract.lotteries(1);
      expect(lottery.currentBalance).to.greaterThan(0);
      expect(lottery.currentPlayersNum).to.greaterThan(0);
    });
    describe("winning", () => {
      beforeEach(async () => {
        await contract
          .connect(deployer)
          .createLottery(PLAYERSNUMBER, ENTERPRICE);
        await contract
          .connect(participant1)
          .buyTicket(1, { value: parseEther(ENTERPRICE) });

        await contract
          .connect(participant2)
          .buyTicket(1, { value: parseEther(ENTERPRICE) });
        await contract
          .connect(participant3)
          .buyTicket(1, { value: parseEther(ENTERPRICE) });

        await contract
          .connect(participant4)
          .buyTicket(1, { value: parseEther(ENTERPRICE) });
        await contract
          .connect(participant5)
          .buyTicket(1, { value: parseEther(ENTERPRICE) });
      });
      it("Should confirm lottery winner and reset lottery stats", async () => {
        const winners = await contract.getWinners();
        const lottery = await contract.lotteries(1);
        expect(lottery.currentPlayersNum).to.equal(0);
        expect(lottery.currentBalance).to.equal(0);
        expect(winners.length).to.equal(1);
      });
    });
  });
});
