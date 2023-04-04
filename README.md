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
  
  - Coverage (Close npx hardhat node first.)
  
  ```
  npx hardhat coverage --testfiles "./tests/factorytest.js"
  ```

  <img width="636" alt="螢幕擷取畫面 2023-04-03 234410" src="https://user-images.githubusercontent.com/87816657/229562528-55347ad2-43ac-4411-82ec-fd0f68f0c332.png">

### I write a better test file on 4/4. [better version](https://github.com/C1em3nt/0813378-bdaf-lab4/blob/main/tests/factorytest_better.js)

  Here are the gas report and coverage. 
  - Gas report
  <img width="652" alt="螢幕擷取畫面 2023-04-04 223510" src="https://user-images.githubusercontent.com/87816657/229829224-a1420ee2-b9f9-49b1-ac49-a09f845b8d73.png">

  <img width="832" alt="螢幕擷取畫面 2023-04-04 223533" src="https://user-images.githubusercontent.com/87816657/229829370-30402965-1439-4ee9-852d-1bb514bb8bb4.png">

  <img width="826" alt="螢幕擷取畫面 2023-04-04 223550" src="https://user-images.githubusercontent.com/87816657/229829396-19c136db-c60b-459b-950a-bb9fdfc238e8.png">

  - Coverage
  <img width="608" alt="螢幕擷取畫面 2023-04-04 223833" src="https://user-images.githubusercontent.com/87816657/229829439-609ed303-8789-4391-b6ec-9893f66c7731.png">

  
