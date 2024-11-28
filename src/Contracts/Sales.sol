// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sales is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _salesIds;

    struct Sale {
        uint256 saleId;
        uint256 vehicleId;
        address seller;
        address buyer;
        uint256 price;
    }

    mapping(uint256 => Sale) public sales;

    event SaleRegistered(uint256 indexed saleId, uint256 vehicleId, address indexed seller, address indexed buyer, uint256 price);

    function registerSale(
        uint256 vehicleId,
        address seller,
        address buyer,
        uint256 price
    ) public onlyOwner returns (uint256) {
        require(buyer != address(0), "Direccion del comprador no valida");
        require(seller != address(0), "Direccion del vendedor no valida");
        require(price > 0, "El precio debe ser mayor a cero");

        _salesIds.increment();
        uint256 newSaleId = _salesIds.current();
        sales[newSaleId] = Sale(newSaleId, vehicleId, seller, buyer, price);

        emit SaleRegistered(newSaleId, vehicleId, seller, buyer, price);
        return newSaleId;
    }

    function getSale(uint256 saleId) public view returns (Sale memory) {
        return sales[saleId];
    }
}
