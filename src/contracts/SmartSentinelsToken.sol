// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SmartSentinelsToken is ERC20, AccessControl {
    // Roles
    bytes32 public constant MCP_OPERATOR_ROLE = keccak256("MCP_OPERATOR_ROLE");

    // Max supply
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million SSTL tokens

    // Track total minted
    uint256 public totalMinted;

    // Track initial allocations minted (to prevent over-allocation)
    uint256 public initialAllocationsMinted;

    // Max initial allocations (60M tokens)
    uint256 public constant MAX_INITIAL_ALLOCATIONS = 60_000_000 * 10**18;

    constructor() ERC20("SmartSentinelsToken", "SSTL") {
        // Grant deployer the admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Mint initial allocations (team, reserve, etc.) to specified addresses.
     * @param to The destination wallet.
     * @param amount Amount to mint (with 18 decimals).
     */
    function mintInitialAllocation(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(initialAllocationsMinted + amount <= MAX_INITIAL_ALLOCATIONS, "SSTL: initial allocations exceeded");
        initialAllocationsMinted += amount;
        totalMinted += amount;
        _mint(to, amount);
    }

    /**
     * @notice Mint new SSTL tokens (PoUW) to any address.
     * @param to The destination wallet or pool.
     * @param amount Amount to mint (with 18 decimals).
     */
    function mintPoUW(address to, uint256 amount) external onlyRole(MCP_OPERATOR_ROLE) {
        require(totalMinted + amount <= MAX_SUPPLY, "SSTL: max supply exceeded");
        totalMinted += amount;
        _mint(to, amount);
    }
}
