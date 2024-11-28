const hre = require('hardhat');

async function main() {
  // Desplegar NFTClase
  const NFTClase = await hre.ethers.getContractFactory('NFTClase');
  const nftClase = await NFTClase.deploy();
  await nftClase.deployed();
  console.log('NFTClase desplegado en:', nftClase.address);

  // Desplegar Users
  const Users = await hre.ethers.getContractFactory('Users');
  const users = await Users.deploy();
  await users.deployed();
  console.log('Users desplegado en:', users.address);

  // Desplegar VehicleRegistry
  const VehicleRegistry =
    await hre.ethers.getContractFactory('VehicleRegistry');
  const vehicleRegistry = await VehicleRegistry.deploy(nftClase.address);
  await vehicleRegistry.deployed();
  console.log('VehicleRegistry desplegado en:', vehicleRegistry.address);

  // Desplegar MaintenanceHistory
  const MaintenanceHistory =
    await hre.ethers.getContractFactory('MaintenanceHistory');
  const maintenanceHistory = await MaintenanceHistory.deploy();
  await maintenanceHistory.deployed();
  console.log('MaintenanceHistory desplegado en:', maintenanceHistory.address);

  // Desplegar Sales
  const Sales = await hre.ethers.getContractFactory('Sales');
  const sales = await Sales.deploy(vehicleRegistry.address);
  await sales.deployed();
  console.log('Sales desplegado en:', sales.address);

  // Desplegar WalletMultisig
  const WalletMultisig = await hre.ethers.getContractFactory('WalletMultisig');
  const owners = ['0xOWNER1', '0xOWNER2']; // Reemplaza con direcciones reales
  const requiredApprovals = 2;
  const walletMultisig = await WalletMultisig.deploy(owners, requiredApprovals);
  await walletMultisig.deployed();
  console.log('WalletMultisig desplegado en:', walletMultisig.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
