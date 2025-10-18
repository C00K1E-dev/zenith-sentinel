// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title SmartSentinels Proof of Useful Work Pool
/// @notice Handles AI reward distribution and Genesis NFT revenue sharing
/// @dev Uses AccessControl for role management, SafeERC20 for secure token transfers
contract SmartSentinelsPoUW is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Token & NFT collections
    IERC20 public immutable sstlToken;
    IERC721Enumerable public immutable nftCollection;        // Regular AI NFT collection
    IERC721Enumerable public immutable genesisCollection;    // Genesis NFT collection

    // Wallets
    address public immutable burnWallet = 0x000000000000000000000000000000000000dEaD;
    address public treasuryWallet;

    // AI Rewards
    uint256 public totalNFTRewards;
    mapping(uint256 => uint256) public claimedPerNFT;

    // Genesis Revenue Share
    uint256 public totalRevenue;
    mapping(uint256 => uint256) public claimedRevenuePerGenesisNFT;

    // Dashboard stats
    uint256 public totalJobs;
    uint256 public totalMinted;

    // Events
    event RewardsDistributed(
        uint256 totalAmount, 
        uint256 nftShare, 
        uint256 treasuryShare, 
        uint256 burnShare, 
        uint256 clientShare
    );
    event RewardClaimed(address indexed user, uint256 tokenId, uint256 amount);
    event RevenueClaimed(address indexed user, uint256 tokenId, uint256 amount);
    event TreasuryUpdated(address indexed oldWallet, address indexed newWallet);

    /// @notice Constructor to initialize pools and roles
    /// @param _sstlToken Address of the SSTL ERC20 token
    /// @param _nftCollection Address of the AI NFT collection (ERC721Enumerable)
    /// @param _genesisCollection Address of the Genesis NFT collection (ERC721Enumerable)
    /// @param _treasuryWallet Address of the treasury wallet for reward shares
    /// @param admin Address to receive ADMIN_ROLE and DEFAULT_ADMIN_ROLE
    constructor(
        address _sstlToken,
        address _nftCollection,
        address _genesisCollection,
        address _treasuryWallet,
        address admin
    ) {
        require(_sstlToken != address(0) && _nftCollection != address(0) && _genesisCollection != address(0) && _treasuryWallet != address(0), "Zero address");
        require(_nftCollection != _genesisCollection, "NFT collections must differ");

        sstlToken = IERC20(_sstlToken);
        nftCollection = IERC721Enumerable(_nftCollection);
        genesisCollection = IERC721Enumerable(_genesisCollection);
        treasuryWallet = _treasuryWallet;

        // Grant roles properly
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        grantRole(ADMIN_ROLE, admin); // emits proper event
    }

    // ------------------- ADMIN FUNCTIONS -------------------

    /// @notice Update treasury wallet address
    /// @param _treasuryWallet New treasury wallet address
    function setTreasuryWallet(address _treasuryWallet) external onlyRole(ADMIN_ROLE) {
        require(_treasuryWallet != address(0), "Zero address");
        emit TreasuryUpdated(treasuryWallet, _treasuryWallet);
        treasuryWallet = _treasuryWallet;
    }

    /// @notice Distribute AI rewards for completed tasks
    /// @param totalAmount Total SSTL tokens to distribute
    /// @param businessClient Address of the client receiving their share
    function distributeRewards(uint256 totalAmount, address businessClient) external onlyRole(ADMIN_ROLE) {
        require(totalAmount > 0, "Amount must be > 0");
        require(businessClient != address(0), "Invalid client");

        uint256 nftShare = (totalAmount * 60) / 100;
        uint256 treasuryShare = (totalAmount * 20) / 100;
        uint256 burnShare = (totalAmount * 10) / 100;
        uint256 clientShare = totalAmount - nftShare - treasuryShare - burnShare;

        totalNFTRewards += nftShare;

        sstlToken.safeTransfer(treasuryWallet, treasuryShare);
        sstlToken.safeTransfer(burnWallet, burnShare);
        sstlToken.safeTransfer(businessClient, clientShare);

        unchecked {
            totalJobs += 1;
            totalMinted += totalAmount;
        }

        emit RewardsDistributed(totalAmount, nftShare, treasuryShare, burnShare, clientShare);
    }

    /// @notice Distribute revenue for Genesis NFT holders
    /// @param amount Amount of SSTL tokens to distribute
    function distributeRevenue(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount > 0, "Amount must be > 0");
        totalRevenue += amount;
        sstlToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    // ------------------- CLAIM FUNCTIONS -------------------

    /// @notice Claim AI rewards for a regular NFT
    /// @param tokenId NFT token ID
    function claimReward(uint256 tokenId) external nonReentrant {
        require(msg.sender != address(0), "Zero address caller");
        require(nftCollection.ownerOf(tokenId) == msg.sender, "Not NFT owner");

        uint256 totalNFTs = nftCollection.totalSupply();
        require(totalNFTs > 0, "No NFTs exist");

        uint256 baseReward = totalNFTRewards / totalNFTs;
        if (_isGenesis(tokenId)) {
            baseReward *= 2;
        }

        uint256 alreadyClaimed = claimedPerNFT[tokenId];
        uint256 claimable = baseReward > alreadyClaimed ? baseReward - alreadyClaimed : 0;
        require(claimable > 0, "No reward to claim");

        claimedPerNFT[tokenId] += claimable;
        sstlToken.safeTransfer(msg.sender, claimable);

        emit RewardClaimed(msg.sender, tokenId, claimable);
    }

    /// @notice View pending AI reward for a regular NFT
    /// @param tokenId NFT token ID
    /// @return Pending reward amount
    function pendingReward(uint256 tokenId) external view returns (uint256) {
        uint256 totalNFTs = nftCollection.totalSupply();
        if (totalNFTs == 0) return 0;

        uint256 baseReward = totalNFTRewards / totalNFTs;
        if (_isGenesis(tokenId)) {
            baseReward *= 2;
        }

        uint256 alreadyClaimed = claimedPerNFT[tokenId];
        return baseReward > alreadyClaimed ? baseReward - alreadyClaimed : 0;
    }

    /// @notice Claim Genesis revenue share
    /// @param tokenId Genesis NFT token ID
    function claimRevenue(uint256 tokenId) external nonReentrant {
        require(msg.sender != address(0), "Zero address caller");
        require(genesisCollection.ownerOf(tokenId) == msg.sender, "Not Genesis owner");

        uint256 totalGenesis = genesisCollection.totalSupply();
        require(totalGenesis > 0, "No Genesis NFTs");

        uint256 perNFT = totalRevenue / totalGenesis;
        uint256 alreadyClaimed = claimedRevenuePerGenesisNFT[tokenId];
        uint256 claimable = perNFT > alreadyClaimed ? perNFT - alreadyClaimed : 0;
        require(claimable > 0, "No revenue to claim");

        claimedRevenuePerGenesisNFT[tokenId] += claimable;
        sstlToken.safeTransfer(msg.sender, claimable);

        emit RevenueClaimed(msg.sender, tokenId, claimable);
    }

    /// @notice View pending revenue for a Genesis NFT
    /// @param tokenId Genesis NFT token ID
    /// @return Pending revenue amount
    function pendingRevenue(uint256 tokenId) external view returns (uint256) {
        uint256 totalGenesis = genesisCollection.totalSupply();
        if (totalGenesis == 0) return 0;

        uint256 perNFT = totalRevenue / totalGenesis;
        uint256 alreadyClaimed = claimedRevenuePerGenesisNFT[tokenId];
        return perNFT > alreadyClaimed ? perNFT - alreadyClaimed : 0;
    }

    // ------------------- INTERNAL -------------------

    /// @dev Check if a tokenId exists in Genesis collection
    /// @param tokenId Token ID to check
    /// @return True if Genesis exists
    function _isGenesis(uint256 tokenId) internal view returns (bool) {
        try genesisCollection.ownerOf(tokenId) returns (address owner) {
            return owner != address(0);
        } catch {
            return false;
        }
    }
}
