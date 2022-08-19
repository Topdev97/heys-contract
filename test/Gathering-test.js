const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();


describe("GatheringToken", function () {
  let gathering, Gathering, Token, token, owner, account1; 
  beforeEach(async ()=> {
    gathering = await ethers.getContractFactory("GatheringToken");
    Gathering = await gathering.deploy();
    await Gathering.deployed();

    Token = await ethers.getContractFactory("RewardToken"); // test ERC20 token
    token = await Token.deploy();
    await token.deployed();

    [owner, account1] = await ethers.getSigners();
  });
  describe("Deployment", ()=> {
    it('Should check bGBT token balance when user call initialize function', async ()=> {
      await Gathering.connect(owner).initialize();
      expect(await Gathering.balanceOf(owner.address)).to.equal('100000000000000000000');
    }) 
    it('Should transfer ERC20 token to gBGT holders', async () => {
      const balance = await token.balanceOf(owner.address)
      expect(await token.totalSupply()).to.equal(balance);
      await token.transfer(Gathering.address, 10000);
      const contractBalance = await token.balanceOf(Gathering.address)
      expect(contractBalance).to.equal(10000);
      await Gathering.setTokenAddress(token.address)
      await Gathering.connect(account1).initialize();
      await Gathering.connect(account1).tokenTransfer()
      const account1Balance = await token.balanceOf(account1.address)
      expect(contractBalance).to.equal(account1Balance);
    })
  })
});
