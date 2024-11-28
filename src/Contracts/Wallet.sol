// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletMultisig {
    address[] public owners;
    uint public requiredApprovals;
    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;
        uint amount;
        uint approvalCount;
        bool executed;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approvals;

    event Deposit(address indexed sender, uint amount);
    event TransactionSubmitted(uint indexed transactionId, address indexed to, uint amount);
    event TransactionApproved(uint indexed transactionId, address indexed owner);
    event TransactionExecuted(uint indexed transactionId, address indexed to, uint amount);

    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(_owners.length > 0, "Debes tener owners");
        require(_requiredApprovals > 0 && _requiredApprovals <= _owners.length, "Numero invalido de aprobaciones");
        for (uint i = 0; i < _owners.length; i++) {
            require(!isOwner[_owners[i]], "Owner duplicado");
            isOwner[_owners[i]] = true;
            owners.push(_owners[i]);
        }
        requiredApprovals = _requiredApprovals;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "No es un owner");
        _;
    }

    function submitTransaction(address _to, uint _amount) public onlyOwner {
        require(_to != address(0), "Direccion invalida");
        require(_amount > 0, "Monto debe ser mayor a 0");
        transactions.push(Transaction({
            to: _to,
            amount: _amount,
            approvalCount: 0,
            executed: false
        }));
        emit TransactionSubmitted(transactions.length - 1, _to, _amount);
    }

    function approveTransaction(uint _transactionId) public onlyOwner {
        require(_transactionId < transactions.length, "ID de transaccion invalido");
        Transaction storage transaction = transactions[_transactionId];
        require(!transaction.executed, "Transaccion ya ejecutada");
        require(!approvals[_transactionId][msg.sender], "Ya aprobada");
        approvals[_transactionId][msg.sender] = true;
        transaction.approvalCount += 1;
        emit TransactionApproved(_transactionId, msg.sender);
    }

    function executeTransaction(uint _transactionId) public onlyOwner {
        require(_transactionId < transactions.length, "ID de transaccion invalido");
        Transaction storage transaction = transactions[_transactionId];
        require(transaction.approvalCount >= requiredApprovals, "No suficientes aprobaciones");
        require(!transaction.executed, "Transaccion ya ejecutada");
        require(address(this).balance >= transaction.amount, "Fondos insuficientes");

        transaction.executed = true;
        payable(transaction.to).transfer(transaction.amount);
        emit TransactionExecuted(_transactionId, transaction.to, transaction.amount);
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function deposit() public payable {
        require(msg.value > 0, "Debes mandar ether");
        emit Deposit(msg.sender, msg.value);
    }
}
