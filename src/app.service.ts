import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import * as NFTClaseArtifact from '../artifacts/src/Contracts/NFT.sol/NFTClase.json';
import * as VehicleRegistryArtifact from '../artifacts/src/Contracts/RegisterVehicule.sol/VehicleRegistry.json';
import * as SalesArtifact from '../artifacts/src/Contracts/Sales.sol/Sales.json';
import * as WalletMultisigArtifact from '../artifacts/src/Contracts/Wallet.sol/WalletMultisig.json';
import * as UsersArtifact from '../artifacts/src/Contracts/User.sol/Users.json';
import * as MaintenanceHistoryArtifact from '../artifacts/src/Contracts/MantenimientHistory.sol/MaintenanceHistory.json';

@Injectable()
export class DeployService {
  private readonly logger = new Logger(DeployService.name);

  private provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  private wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

  async deployContracts() {
    // Desplegar NFTClase
    this.logger.log('Desplegando NFTClase...');
    const NFTClaseFactory = new ethers.ContractFactory(
      NFTClaseArtifact.abi,
      NFTClaseArtifact.bytecode,
      this.wallet,
    );
    const nftClase = await NFTClaseFactory.deploy();
    await nftClase.deployed();
    this.logger.log(`NFTClase desplegado en: ${nftClase.address}`);

    // Desplegar Users
    this.logger.log('Desplegando Users...');
    const UsersFactory = new ethers.ContractFactory(
      UsersArtifact.abi,
      UsersArtifact.bytecode,
      this.wallet,
    );
    const users = await UsersFactory.deploy();
    await users.deployed();
    this.logger.log(`Users desplegado en: ${users.address}`);

    // Desplegar VehicleRegistry
    this.logger.log('Desplegando VehicleRegistry...');
    const VehicleRegistryFactory = new ethers.ContractFactory(
      VehicleRegistryArtifact.abi,
      VehicleRegistryArtifact.bytecode,
      this.wallet,
    );
    const vehicleRegistry = await VehicleRegistryFactory.deploy(
      nftClase.address,
    );
    await vehicleRegistry.deployed();
    this.logger.log(
      `VehicleRegistry desplegado en: ${vehicleRegistry.address}`,
    );

    // Desplegar MaintenanceHistory
    this.logger.log('Desplegando MaintenanceHistory...');
    const MaintenanceHistoryFactory = new ethers.ContractFactory(
      MaintenanceHistoryArtifact.abi,
      MaintenanceHistoryArtifact.bytecode,
      this.wallet,
    );
    const maintenanceHistory = await MaintenanceHistoryFactory.deploy();
    await maintenanceHistory.deployed();
    this.logger.log(
      `MaintenanceHistory desplegado en: ${maintenanceHistory.address}`,
    );

    // Desplegar Sales
    this.logger.log('Desplegando Sales...');
    const SalesFactory = new ethers.ContractFactory(
      SalesArtifact.abi,
      SalesArtifact.bytecode,
      this.wallet,
    );
    const sales = await SalesFactory.deploy(vehicleRegistry.address);
    await sales.deployed();
    this.logger.log(`Sales desplegado en: ${sales.address}`);

    // Desplegar WalletMultisig
    this.logger.log('Desplegando WalletMultisig...');
    const owners = ['0xOWNER1', '0xOWNER2']; // Reemplaza con direcciones reales
    const requiredApprovals = 2;
    const WalletMultisigFactory = new ethers.ContractFactory(
      WalletMultisigArtifact.abi,
      WalletMultisigArtifact.bytecode,
      this.wallet,
    );
    const walletMultisig = await WalletMultisigFactory.deploy(
      owners,
      requiredApprovals,
    );
    await walletMultisig.deployed();
    this.logger.log(`WalletMultisig desplegado en: ${walletMultisig.address}`);
  }
}
