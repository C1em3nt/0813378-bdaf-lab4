# 0813378-bdaf-lab4

## Setting
  - [Dependencies](https://github.com/C1em3nt/0813378-bdaf-lab3/blob/main/package.json)
  
  - Every libraries are in [node_modules](https://github.com/C1em3nt/0813378-bdaf-lab3/tree/main/node_modules).
  
  - Default network is goerli.
  
  - Change .env file.
    ```
    API_URL = "https://eth-goerli.g.alchemy.com/v2/your-api-key"
    API_KEY = "your-api-key"
    PRIVATE_KEY = "your-private-account-address"
    ```
## Test
### Test on network:
```
npx hardhat run scripts/deploy.js --network <your network>
```
### Test on localhost:
  
  ```
  npx hardhat node
  ```
  
  - Open another terminal:
  ```
  npx hardhat test test/test.js --network localhost
  ```

  ![image](https://user-images.githubusercontent.com/87816657/226351241-dad3e61f-4aa5-451e-b454-38ae59bc76a4.png)

## Deploy
```
npx hardhat run scripts/deploy.js --network goerli
```
[My SafeERC20 contract](https://goerli.etherscan.io/address/0x8d063dbEB60cE973443E096A932575a980EA8520)

[My ERC20 contract](https://goerli.etherscan.io/address/0x2883ef569838804b5b2a25fdc6ee3c543fd313d1) - Address: 0x2883ef569838804b5b2a25fdc6ee3c543fd313d1

Use **mint** function to get the token.
  
## Verify
```
npx hardhat verify --network goerli <DEPLOYED_CONTRACT_ADDRESS>
```

## Interact with contract (Should approve your token first)

### Etherscan
- Deposit
![image](https://user-images.githubusercontent.com/87816657/226358704-56c4a462-2f88-4a9b-a659-b0c5ec1a59c4.png)
- Withdraw
![image](https://user-images.githubusercontent.com/87816657/226358917-009d6b9d-510a-48ed-b526-a26a2fbaf754.png)
### Hardhat
```
    const { ethers } = require("hardhat");
    StoreFund = await ethers.getContractFactory('StoreFund');
    storeFund = await StoreFund.deploy();
```
- Deposit
  ```
  await storeFund.connect(<Signer>).deposit(<tokenaddress>, amount);
  ```
- Withdraw
  ```
  await storeFund.connect(<Signer>).withdraw(<tokenaddress>, amount);
  ```
