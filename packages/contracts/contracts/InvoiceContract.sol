// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceContract is Ownable {
    enum Status { Created, Paid, Cancelled }

    struct Invoice {
        string invoiceNumber;
        address issuer;
        address payer;
        uint256 amount;
        Status status;
        uint256 dueDate;
        uint256 createdAt;
        uint256 paidAt;
    }

    mapping(string => Invoice) public invoices;
    string[] public invoiceIds;
    IERC20 public paymentToken;

    event InvoiceCreated(string invoiceNumber, address issuer, address payer, uint256 amount, uint256 dueDate);
    event InvoicePaid(string invoiceNumber, address payer, uint256 amount, uint256 paidAt);
    event InvoiceCancelled(string invoiceNumber, uint256 timestamp);

    constructor(address initialOwner, address _paymentToken) Ownable(initialOwner) {
        paymentToken = IERC20(_paymentToken);
    }

    function createInvoice(
        string memory _invoiceNumber,
        address _payer,
        uint256 _amount,
        uint256 _dueDate
    ) external {
        require(invoices[_invoiceNumber].createdAt == 0, "Invoice already exists");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        require(_amount > 0, "Amount must be greater than 0");

        invoices[_invoiceNumber] = Invoice({
            invoiceNumber: _invoiceNumber,
            issuer: msg.sender,
            payer: _payer,
            amount: _amount,
            status: Status.Created,
            dueDate: _dueDate,
            createdAt: block.timestamp,
            paidAt: 0
        });

        invoiceIds.push(_invoiceNumber);

        emit InvoiceCreated(_invoiceNumber, msg.sender, _payer, _amount, _dueDate);
    }

    function payInvoice(string memory _invoiceNumber) external {
        Invoice storage invoice = invoices[_invoiceNumber];

        require(invoice.createdAt > 0, "Invoice does not exist");
        require(invoice.status == Status.Created, "Invoice is not in 'Created' status");
        require(block.timestamp <= invoice.dueDate, "Invoice is overdue");
        require(msg.sender == invoice.payer, "Only the payer can pay this invoice");

        uint256 amount = invoice.amount;

        require(paymentToken.transferFrom(msg.sender, invoice.issuer, amount), "Payment failed");

        invoice.status = Status.Paid;
        invoice.paidAt = block.timestamp;

        emit InvoicePaid(_invoiceNumber, msg.sender, amount, block.timestamp);
    }

    function cancelInvoice(string memory _invoiceNumber) external {
        Invoice storage invoice = invoices[_invoiceNumber];

        require(invoice.createdAt > 0, "Invoice does not exist");
        require(invoice.status == Status.Created, "Invoice is not in 'Created' status");
        require(msg.sender == invoice.issuer || msg.sender == owner(), "Only issuer or owner can cancel");

        invoice.status = Status.Cancelled;

        emit InvoiceCancelled(_invoiceNumber, block.timestamp);
    }

    function getInvoice(string memory _invoiceNumber) external view returns (
        string memory,
        address,
        address,
        uint256,
        Status,
        uint256,
        uint256,
        uint256
    ) {
        Invoice memory invoice = invoices[_invoiceNumber];
        require(invoice.createdAt > 0, "Invoice does not exist");

        return (
            invoice.invoiceNumber,
            invoice.issuer,
            invoice.payer,
            invoice.amount,
            invoice.status,
            invoice.dueDate,
            invoice.createdAt,
            invoice.paidAt
        );
    }

    function getInvoiceCount() external view returns (uint256) {
        return invoiceIds.length;
    }

    function setPaymentToken(address _paymentToken) external onlyOwner {
        paymentToken = IERC20(_paymentToken);
    }
}
