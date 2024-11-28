// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MaintenanceHistory is Ownable {
    struct MaintenanceRecord {
        uint256 vehicleId; // ID del vehículo
        uint256 date; // Fecha del mantenimiento (timestamp)
        string description; // Descripción del mantenimiento realizado
        uint256 cost; // Costo del mantenimiento en wei
    }

    mapping(uint256 => MaintenanceRecord[]) public maintenanceRecords; // Historial por vehículo

    event MaintenanceAdded(uint256 indexed vehicleId, uint256 date, string description, uint256 cost);

    function addMaintenance(
        uint256 vehicleId,
        string memory description,
        uint256 cost
    ) public onlyOwner {
        maintenanceRecords[vehicleId].push(MaintenanceRecord({
            vehicleId: vehicleId,
            date: block.timestamp,
            description: description,
            cost: cost
        }));

        emit MaintenanceAdded(vehicleId, block.timestamp, description, cost);
    }

    function getMaintenanceRecords(uint256 vehicleId) public view returns (MaintenanceRecord[] memory) {
        return maintenanceRecords[vehicleId];
    }
}
