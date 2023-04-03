# 0813378-bdaf-lab4

## Setting
  - [Dependencies](https://github.com/C1em3nt/0813378-bdaf-lab3/blob/main/package.json)
  
  - Default network is hardhat.
  
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
  npx hardhat test test/factorytest.js --network localhost
  ```
  - Test and gas report
  <img width="377" alt="螢幕擷取畫面 2023-04-03 233952" src="https://user-images.githubusercontent.com/87816657/229562086-9c297a21-f06e-451d-94a6-1a99041a0481.png">
