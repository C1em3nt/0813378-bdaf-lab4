const { expect } = require("chai");
const { ethers} = require("hardhat");

describe('All test', function () {
  beforeEach(async function() {
    [owner, wallet1, wallet2] = await ethers.getSigners();
    StoreFundv2 = await ethers.getContractFactory('StoreFund_v2', owner);
    StoreFundv3 = await ethers.getContractFactory('StoreFund_v3', owner);
    StoreFund = await ethers.getContractFactory('StoreFund', owner);
    TestCoin = await ethers.getContractFactory('testcoin', wallet1);
    SafeFactory = await ethers.getContractFactory('SafeFactory', wallet1);
    proxyTest = await ethers.getContractFactory('Proxy_contract', owner);

    storeFundv2 = await StoreFundv2.deploy();
    storeFundv3 = await StoreFundv3.deploy();
    storeFund = await StoreFund.deploy(owner.address);
    coin = await TestCoin.deploy();
    safeFactory = await SafeFactory.deploy(storeFundv2.address);
    proxycontract = await proxyTest.deploy(storeFundv2.address, owner.address);
    proxy = await storeFundv2.attach(proxycontract.address);

    coin.connect(wallet1).transfer(wallet2.address, 50000);
  });

  describe('SafeFactory', function () {
    it('deploy safe gas', async function () {
      // deploy safe
      await safeFactory.connect(wallet1).deploySafe();
      safeAddr = await safeFactory.getAddress();
      safeAttactch = await ethers.getContractFactory('StoreFund');
      safe = safeAttactch.attach(safeAddr);
      await expect(safeFactory.connect(wallet2).deploySafe()).to.be.revertedWith("Only Owner can use this function.");
    });

    it('check safe owner', async function () {
      own = await safe.owner();
      expect(own).to.equal(wallet1.address);
    });

    it('deploy SafeProxy gas', async function () {
      // deploy proxy
      await safeFactory.connect(wallet1).deploySafeProxy();
      proxyAddr = await safeFactory.getAddress();
      proxyAttactch = await ethers.getContractFactory('Proxy_contract');
      proxyContract = proxyAttactch.attach(proxyAddr);
      safeProxy = await storeFundv2.attach(proxyContract.address);
      await safeProxy.connect(wallet1).initialize(wallet1.address);
      await expect(safeFactory.connect(wallet2).deploySafeProxy()).to.be.revertedWith("Only Owner can use this function.");
    });

    it('check proxy owner', async function () {
      own = await proxyContract.getOwner();
      expect(own).to.equal(wallet1.address);
    });

    it('update implementation', async function () {
      await safeFactory.connect(wallet1).updateImplementation(storeFundv3.address)
      await safeFactory.connect(wallet1).deploySafeProxy();
      proxyAddr = await safeFactory.getAddress();
      proxyAttactch = await ethers.getContractFactory('Proxy_contract');
      proxyContract = proxyAttactch.attach(proxyAddr);
      safeProxy = await storeFundv2.attach(proxyContract.address);
      await safeProxy.connect(wallet1).initialize(wallet1.address);
      await expect(safeFactory.connect(wallet2).updateImplementation(storeFundv3.address)).to.be.revertedWith("Only Owner can use this function.");
      
      // storeFundv3 tax rate 0.2%
      await coin.connect(wallet1).approve(proxyAddr, 50000);
      await coin.connect(wallet2).approve(proxyAddr, 50000);
      await safeProxy.connect(wallet1).deposit(coin.address, 1534);
      expect(await coin.balanceOf(wallet1.address)).to.equal(48466);
      expect(await safeProxy.balances(wallet1.address, coin.address)).to.equal(1531);
      expect(await safeProxy.totalfee(coin.address)).to.equal(3);
    });

  })

  describe('proxy function', function () {
    it('valid update and chageowner', async function () {
      proxycontract.connect(owner).update(storeFundv3.address);
      proxycontract.connect(owner).changeOwner(wallet1.address);
    });

    it('invalid update and chageowner', async function () {
      await expect(proxycontract.connect(wallet2).update(storeFundv3.address)).to.be.revertedWith("Only Owner can use this function.");
      await expect(proxycontract.connect(wallet2).changeOwner(wallet1.address)).to.be.revertedWith("Only Owner can use this function.");
    });

    it('getowner', async function () {
      expect(await proxycontract.connect(wallet2).getOwner()).to.equal(owner.address);
    });

  })


  describe('SafeUpgradeable', function () {
    it("valid deposit and withdraw", async function () {
      await coin.connect(wallet1).approve(storeFundv2.address, 50000);
      await storeFundv2.connect(wallet1).deposit(coin.address, 1534);
      expect(await coin.balanceOf(wallet1.address)).to.equal(48466);

      // deposit less than 1000
      await storeFundv2.connect(wallet1).deposit(coin.address, 999);
      expect(await coin.balanceOf(wallet1.address)).to.equal(47467);

      expect(await storeFundv2.balances(wallet1.address, coin.address)).to.equal(2531);
      expect(await storeFundv2.totalfee(coin.address)).to.equal(2);

      await storeFundv2.connect(wallet1).withdraw(coin.address, 1500);
      expect(await storeFundv2.balances(wallet1.address, coin.address)).to.equal(1031);

    });

    it('invalid deposit and withdraw', async function () {
      await expect(storeFundv2.connect(wallet1).deposit(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFundv2.connect(wallet1).withdraw(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFundv2.connect(wallet1).withdraw(coin.address, 100)).to.be.revertedWithPanic(0x11);
    })

    it("init & take fee", async function () {
      await storeFundv2.connect(wallet1).initialize(wallet1.address);
      await expect(storeFundv2.connect(wallet1).initialize(wallet1.address)).to.be.revertedWith("already initialized");
      await storeFundv2.connect(wallet1).takefee(coin.address);
      await expect(storeFundv2.connect(wallet2).takefee(coin.address)).to.be.revertedWith("Only Owner can use this function.");
    });
  })

  describe('SafeUpgradeablev2', function () {
    it("valid deposit and withdraw", async function () {
      await coin.connect(wallet1).approve(storeFundv3.address, 50000);
      await storeFundv3.connect(wallet1).deposit(coin.address, 1534);

      // deposit less than 1000
      await storeFundv3.connect(wallet1).deposit(coin.address, 999);
      expect(await coin.balanceOf(wallet1.address)).to.equal(47467);

      expect(await storeFundv3.balances(wallet1.address, coin.address)).to.equal(2529);
      expect(await storeFundv3.totalfee(coin.address)).to.equal(4);

      await storeFundv3.connect(wallet1).withdraw(coin.address, 1500);
      expect(await storeFundv3.balances(wallet1.address, coin.address)).to.equal(1029);

    });

    it('invalid deposit and withdraw', async function () {
      await expect(storeFundv3.connect(wallet1).deposit(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFundv3.connect(wallet1).withdraw(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFundv3.connect(wallet1).withdraw(coin.address, 100)).to.be.revertedWithPanic(0x11);
    })

    it("init & take fee", async function () {
      await storeFundv3.connect(wallet1).initialize(wallet1.address);
      await expect(storeFundv3.connect(wallet1).initialize(wallet1.address)).to.be.revertedWith("already initialized");
      await storeFundv3.connect(wallet1).takefee(coin.address);
      await expect(storeFundv3.connect(wallet2).takefee(coin.address)).to.be.revertedWith("Only Owner can use this function.");
    });

  })


  describe('Original Safe', function () {
    it("valid deposit and withdraw", async function () {
      await coin.connect(wallet1).approve(storeFund.address, 50000);
      await storeFund.connect(wallet1).deposit(coin.address, 1534);
      // deposit less than 1000
      await storeFund.connect(wallet1).deposit(coin.address, 999);
      expect(await coin.balanceOf(wallet1.address)).to.equal(47467);

      expect(await storeFund.balances(wallet1.address, coin.address)).to.equal(2531);
      expect(await storeFund.totalfee(coin.address)).to.equal(2);

      await storeFund.connect(wallet1).withdraw(coin.address, 1500);
      expect(await storeFund.balances(wallet1.address, coin.address)).to.equal(1031);     
    });

    it('invalid deposit and withdraw', async function () {
      await expect(storeFund.connect(wallet1).deposit(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFund.connect(wallet1).withdraw(coin.address, 0)).to.be.revertedWith("Amount should be larger than 0.");
      await expect(storeFund.connect(wallet1).withdraw(coin.address, 100)).to.be.revertedWithPanic(0x11);
    })

    it("take fee", async function () {
      await storeFund.connect(owner).takefee(coin.address);
      await expect(storeFund.connect(wallet2).takefee(coin.address)).to.be.revertedWith("Only Owner can use this function.");
    });

  })
})