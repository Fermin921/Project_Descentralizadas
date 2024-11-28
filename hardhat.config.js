require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
const PRIVATE_KEY =
  '95e41d9ce2a6a6deb17cbd23932ecd0aec2c0729be483ac200df4608459878f8';
const API_URL =
  'https://eth-sepolia.g.alchemy.com/v2/_bSHE45NaWcmavrbNjVHprqBHMZpBF3z';

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'sepolia',
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  paths: {
    sources: './src',
  },
};
