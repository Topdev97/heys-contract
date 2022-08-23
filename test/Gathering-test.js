const { expect } = require('chai')
const { ethers } = require('hardhat')
require('dotenv').config()


describe('GatheringToken', function () {
  let gathering, Gathering, Token, token, owner, account1 

  beforeEach(async ()=> {
    gathering = await ethers.getContractFactory('GatheringToken')
    Gathering = await gathering.deploy()
    await Gathering.deployed()

    Token = await ethers.getContractFactory('RewardToken') // test ERC20 token
    token = await Token.deploy()
    await token.deployed();

    [owner, account1] = await ethers.getSigners()
  })

  describe('Deployment', ()=> {
    it('Should check bGBT token balance when user call initialize function', async ()=> {
      await Gathering.connect(owner).initialize()
      expect(await Gathering.balanceOf(owner.address)).to.equal('100000000000000000000')
    })

    it('Should transfer ERC20 token to gBGT holders', async () => {
      const balance = await token.balanceOf(owner.address)
      expect(await token.totalSupply()).to.equal(balance)
      await token.transfer(Gathering.address, 10000)
      const contractBalance = await token.balanceOf(Gathering.address)
      expect(contractBalance).to.equal(10000)
      await Gathering.setTokenAddress(token.address)
      await Gathering.connect(account1).initialize()
      await Gathering.connect(account1).tokenTransfer()
      const account1Balance = await token.balanceOf(account1.address)
      expect(contractBalance).to.equal(account1Balance)
    })

    it('Should allow to submit a new doc', async () => {
      await Gathering.connect(account1).addDoc('sample-doc-uid', 1)
      const docCount = await Gathering.docCount()
      expect(docCount).to.equal(1)
      const newDoc = await Gathering.docs(0)
      expect(newDoc.docUid).to.equal('sample-doc-uid')
    })

    it('Should return list of docs to vote on', async () => {
      await Gathering.connect(owner).initialize()
      await Gathering.connect(account1).addDoc('sample-doc-uid-A', 1)
      await Gathering.connect(account1).addDoc('sample-doc-uid-B', 1)
      const docsToVoteOn = await Gathering.docsToVoteOn()
      expect(docsToVoteOn[0]).to.equal('1')
      expect(docsToVoteOn[1]).to.equal('0')
    })

    it('Should process a vote on an added doc', async () => {
      await Gathering.connect(owner).initialize()
      
      expect(await Gathering.docCount()).to.equal(0)
      
      await Gathering.connect(account1).addDoc('sample-doc-uri-A', 1)
      await Gathering.connect(account1).addDoc('sample-doc-uri-B', 1)
      
      expect(await Gathering.docCount()).to.equal(2)
      expect((await Gathering.docsToVoteOn())[0]).to.equal('1')
      expect((await Gathering.docsToVoteOn())[1]).to.equal('0')
      
      await Gathering.connect(owner).voteOnDoc(0, 1)

      // doc should be approved now
      expect((await Gathering.docs(0)).approved).to.equal(true)

      // submitter should be rewarded with tokens
      expect(await Gathering.balanceOf(account1.address)).to.equal('100000000000000000000')

      // docsToVoteOn now should only have one doc
      expect((await Gathering.docsToVoteOn())[0]).to.equal('1')
    })
  })
})
