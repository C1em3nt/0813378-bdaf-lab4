const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Proxy delegatecall safe', function () {
  beforeEach(async function() {
    [owner, wallet1, wallet2] = await ethers.getSigners();
    StoreFundv2 = await ethers.getContractFactory('StoreFund_v2', owner);
    Test = await ethers.getContractFactory('testcoin', wallet1);
    Proxy_contract = await ethers.getContractFactory('Proxy_contract', owner);

    storeFundv2 = await StoreFundv2.deploy();
    test = await Test.deploy();
    proxy = await Proxy_contract.deploy(storeFundv2.address);
    pproxy = await storeFundv2.attach(proxy.address);

    test.connect(wallet1).transfer(wallet2.address, 50000);

    await test.connect(wallet1).approve(proxy.address, 50000);
    await test.connect(wallet2).approve(proxy.address, 50000);

    await pproxy.connect(wallet1).initialize(wallet1.address);

  });

  describe('Initialize', function () {
    it('should not allow initialize twice', async function () {
    own = await pproxy.owner();
    expect(own).to.equal(wallet1.address);
    expect(pproxy.connect(wallet2).initialize(wallet2.address)).to.be.revertedWith("already initialized");
    });

  })

  describe('Deposit', function () {
    it('deposit funds', async function () {
      await pproxy.connect(wallet1).deposit(test.address, 1534);
      await pproxy.connect(wallet2).deposit(test.address, 20000);

      expect(await test.balanceOf(wallet1.address)).to.equal(48466);
      expect(await test.balanceOf(wallet2.address)).to.equal(30000);

      expect(await pproxy.balances(wallet1.address, test.address)).to.equal(1533);
      expect(await pproxy.balances(wallet2.address, test.address)).to.equal(19980);
      expect(await pproxy.totalfee(test.address)).to.equal(21);
    });

    it("amount should be larger than 0", async function () {
      await expect(pproxy.connect(wallet1).withdraw(test.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
    });
  })

  describe('Withdraw', function () {
    it('withdraw funds', async function () {
      await pproxy.connect(wallet1).deposit(test.address, 50000);
      await pproxy.connect(wallet1).withdraw(test.address, 10000);

      expect(await test.balanceOf(wallet1.address)).to.equal(10000);
      expect(await pproxy.balances(wallet1.address, test.address)).to.equal(39950);
    })

    it("amount should be larger than 0", async function () {
      await expect(pproxy.connect(wallet1).withdraw(test.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
    });

    it('should not allow withdrawing more than has been deposited', async function () {
      await expect(pproxy.connect(wallet1).withdraw(test.address, 100000)).to.be.revertedWithPanic(0x11);
    })
  })

  describe('Takefee', function () {
    it('Owner can takefee', async function () {
      await pproxy.connect(wallet1).deposit(test.address, 50000);
      expect(await pproxy.totalfee(test.address)).to.equal(50);
      await pproxy.connect(wallet1).takefee(test.address);
      expect(await test.balanceOf(wallet1.address)).to.equal(50);
    });

    it('should not allow other users takefee', async function () {
      await pproxy.connect(wallet1).deposit(test.address, 50000);
      expect(await test.balanceOf(wallet1.address)).to.equal(0);
      expect(await pproxy.totalfee(test.address)).to.equal(50);
      await expect(pproxy.connect(wallet2).takefee(test.address)).to.be.revertedWith("Only Owner can use this function.");
    });
  })
})