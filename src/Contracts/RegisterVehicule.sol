// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFT.sol";

contract VehicleRegistry is Ownable {
    NFTClase private nftContract;

    struct Vehicle {
        uint256 tokenId; // ID del NFT asociado al vehículo
        string marca;
        string modelo;
        uint256 year;
        string vin; // Número de identificación del vehículo
        address currentOwner; // Dirección del propietario actual
    }

    mapping(uint256 => Vehicle) public vehicles;
    uint256 public vehicleCount;

    event VehicleRegistered(uint256 indexed vehicleId, uint256 tokenId, address indexed owner);
    event VehicleTransferred(uint256 indexed vehicleId, address indexed newOwner);

    constructor(address nftAddress) {
        nftContract = NFTClase(nftAddress);
    }

    function registerVehicle(
        string memory marca,
        string memory modelo,
        uint256 year,
        string memory vin,
        string memory tokenURI
    ) public returns (uint256) {
        // Crear el NFT en el contrato NFTClase
        uint256 tokenId = nftContract.mintNFT(msg.sender, tokenURI);

        // Registrar el vehículo
        vehicleCount++;
        vehicles[vehicleCount] = Vehicle(tokenId, marca, modelo, year, vin, msg.sender);

        emit VehicleRegistered(vehicleCount, tokenId, msg.sender);
        return vehicleCount;
    }

    function transferVehicle(uint256 vehicleId, address newOwner) public {
        Vehicle storage vehicle = vehicles[vehicleId];
        require(msg.sender == vehicle.currentOwner, "No eres el propietario actual del vehiculo");
        require(newOwner != address(0), "Nueva direccion no valida");
        // Transferir el NFT al nuevo propietario
        nftContract.safeTransferFrom(msg.sender, newOwner, vehicle.tokenId);

        // Actualizar el propietario del vehículo
        vehicle.currentOwner = newOwner;

        emit VehicleTransferred(vehicleId, newOwner);
    }

    function getVehicle(uint256 vehicleId) public view returns (Vehicle memory) {
        return vehicles[vehicleId];
    }
}
