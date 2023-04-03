# 0813378-bdaf-lab4

## Setting
  - [Dependencies](https://github.com/C1em3nt/0813378-bdaf-lab4/blob/main/package.json)
  
  - Default network is hardhat.
  
## Test

### Test on localhost:
  
  ```
  npx hardhat node
  ```
  
  - Open another terminal:
  ```
  npx hardhat test test/factorytest.js --network localhost
  ```
  - Test and gas report
  <img width="377" alt="螢幕擷取畫面 2023-04-03 233952" src="https://user-images.githubusercontent.com/87816657/229562086-9c297a21-f06e-451d-94a6-1a99041a0481.png">
  
  ```
  npx hardhat coverage --testfiles "./tests/factorytest.js"
  ```
  
  - Coverage

  <img width="636" alt="螢幕擷取畫面 2023-04-03 234410" src="https://user-images.githubusercontent.com/87816657/229562528-55347ad2-43ac-4411-82ec-fd0f68f0c332.png">
