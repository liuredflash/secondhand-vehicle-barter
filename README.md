## second-vehicle-barter

### Aim

This project aims to build a barter application for second-hand vehicle that the history of vehicles will be transparent and shared. No severe frauds will be conducted, and users can browse the second-hand vehicle information on the application and assess its value before engaging in a barter-based exchange of vehicles. In order to achieve this, the project will be divided into two parts, one part is to find a way to store vehicle’s history securely and transparently, and the other part is to build a trading platform that users can barter vehicles.

### How to run

1. Make sure you have yarn installed

2. Install the dependency  
   `yarn install --dev`

3. Create .env file and input correct value
   you can rename .env.sample or create a new .env file
   then write correct vlues into the file accroding to the sample file

4. Complile contracts  
   `yarn hardhat complile`
5. Run test  
   `yarn hardhat test`
6. Depoly  
   `yarn hardhat run deploy/01-deploy-marketplace.js`  
   `yarn hardhat run deploy/02-deploy-second-hand-nft.js`
