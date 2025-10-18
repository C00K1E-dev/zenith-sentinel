// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISSTLToken {
    function mintPoUW(address to, uint256 amount) external;
}

contract AIAuditAgentGateway is AccessControl {
    bytes32 public constant MCP_OPERATOR_ROLE = keccak256("MCP_OPERATOR_ROLE");

    IERC20 public sstlToken;            // For receiving payments (just for accounting)
    ISSTLToken public sstlTokenContract; // SSTL token contract to mint new tokens
    address public pouwPool;             // PoUWPool where minted tokens go
    address public serviceOwner = 0x46e451d555ebCB4ccE5087555a07F6e69D017b05; // your wallet

    uint256 public constant REWARD_PER_JOB = 67 * 10**18; // Fixed 67 SSTL per job

    event TaskStarted(address indexed user, uint256 amountPaid);
    event PoUWMinted(address indexed pool, uint256 amount);
    event PaymentReceived(address indexed user, uint256 amount);

    constructor(address _sstlToken, address _sstlTokenContract, address _pouwPool) {
        sstlToken = IERC20(_sstlToken);
        sstlTokenContract = ISSTLToken(_sstlTokenContract);
        pouwPool = _pouwPool;

        // Use grantRole instead of _setupRole
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice User pays for audit service, triggers AI task and mints fixed SSTL to PoUWPool
     * @param amount Amount the user pays (goes directly to serviceOwner)
     */
    function payAndRunAudit(uint256 amount) external {
        // Transfer payment directly to the service owner
        require(sstlToken.transferFrom(msg.sender, serviceOwner, amount), "Payment failed");
        emit PaymentReceived(msg.sender, amount);
        emit TaskStarted(msg.sender, amount);

        // AI task runs off-chain here

        // Mint fixed 67 SSTL tokens into PoUWPool
        sstlTokenContract.mintPoUW(pouwPool, REWARD_PER_JOB);
        emit PoUWMinted(pouwPool, REWARD_PER_JOB);
    }

    // Optional: helper to assign MCP_OPERATOR_ROLE to an address (only admin can call)
    function assignOperator(address operator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MCP_OPERATOR_ROLE, operator);
    }
}
