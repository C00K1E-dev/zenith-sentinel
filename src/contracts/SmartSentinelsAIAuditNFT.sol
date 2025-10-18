// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SmartSentinelsAIAudit
 * @author Andrei
 * @notice The SmartSentinels AI Audit NFT collection.
 * @dev This contract handles the public and owner minting of a fixed-supply ERC721 collection.
 */
contract SmartSentinelsAIAudit is ERC721Enumerable, Ownable, ReentrancyGuard {
    // Events for off-chain tracking
    event Minted(address indexed minter, uint256 tokenId, uint256 value);
    event PublicMintStatusChanged(bool status);
    event MintAmountUpdated(uint256 newAmount);
    event BaseURIUpdated(string newBaseURI);
    event BaseURIFrozen();
    event ContractURIUpdated(string newContractURI);
    event MediaBaseURIUpdated(string newMediaBaseURI);
    event MediaExtensionUpdated(string newMediaExtension);

    using Strings for uint256;

    uint256 private constant MAX_SUPPLY = 1000;

    // Token ID counter starting at 1
    uint256 private _nextTokenId = 1;

    // SSTL token
    IERC20 public constant SSTL = IERC20(0xf5450ff4de640b951a95D3aC4f9d6D7AAcACA948);

    // Metadata base URI
    string private _baseTokenURI;
    bool public baseURIFrozen;

    // Optional: collection-level metadata for marketplaces
    string private _contractURI;

    // Optional: direct media base
    string public mediaBaseURI;
    string public mediaExtension = ".mp4";

    // Public mint controls
    bool public publicMintEnabled;
    uint256 public mintAmount;

    // Payout recipients - changed to private to avoid public getters for gas savings
    address payable private constant PAYEE1 = payable(0xb792F3217bA6C35ED8670d48fc3aFB60Ad7d7356); // 15%
    address payable private constant PAYEE2 = payable(0x8D17d02c2E75aAB802CB4978bF0ec1251aAD511d); // 2%
    address payable private constant PAYEE3 = payable(0x9b2310b2043FD59bB1070016d1D02C976b46b0E1); // 10%
    address payable private constant PAYEE4 = payable(0x861e3Aef66B042387F32E7Fe6887f24E3cc0D16b); // 2%
    address payable private constant PAYEE5 = payable(0x72fCEd35A613186Bf50A63c9fc2415b0Af0ACf94); // 10%
    address payable private constant PAYEE6 = payable(0x4E21F74143660ee576F4D2aC26BD30729a849f55); // 61%

    /**
     * @dev The constructor sets the initial metadata URIs and minting parameters.
     * @notice The constructor initializes the contract with the collection's metadata.
     * @param initBaseURI The initial base URI for the token metadata.
     * @param initContractURI The initial contract-level metadata URI.
     * @param initMediaBaseURI The initial base URI for the token media.
     */
    constructor(
        string memory initBaseURI,
        string memory initContractURI,
        string memory initMediaBaseURI
    ) ERC721("SmartSentinels AI Audit", "SSTLAUDIT") Ownable(msg.sender) {
        require(bytes(initBaseURI).length != 0, "BaseURI required");
        _baseTokenURI = initBaseURI;
        _contractURI = initContractURI;
        mediaBaseURI = initMediaBaseURI;

        mintAmount = 100;
        publicMintEnabled = true;
    }

    // ------------------------
    // Minting
    // ------------------------

    /**
     * @notice Allows a user to mint one NFT by paying the designated mint amount in SSTL.
     * @dev This function checks for public minting status, token supply limits, and transfers SSTL before minting a token and distributing the funds.
     */
    function publicMint() external nonReentrant {
        require(publicMintEnabled, "Public mint disabled");
        require(totalSupply() < MAX_SUPPLY, "Exceeds MAX_SUPPLY");

        // Transfer SSTL from user
        require(SSTL.transferFrom(msg.sender, address(this), mintAmount), "SSTL transfer failed");

        uint256 tokenId = _nextTokenId;
        unchecked {
            _nextTokenId++;
        }
        _safeMint(msg.sender, tokenId);

        // Split funds based on the new percentages
        uint256 totalReceived = mintAmount;
        require(SSTL.transfer(PAYEE1, (totalReceived * 15) / 100), "Payout1 failed");
        require(SSTL.transfer(PAYEE2, totalReceived / 50), "Payout2 failed");
        require(SSTL.transfer(PAYEE3, totalReceived / 10), "Payout3 failed");
        require(SSTL.transfer(PAYEE4, totalReceived / 50), "Payout4 failed");
        require(SSTL.transfer(PAYEE5, totalReceived / 10), "Payout5 failed");
        require(SSTL.transfer(PAYEE6, (totalReceived * 61) / 100), "Payout6 failed");

        emit Minted(msg.sender, tokenId, mintAmount);
    }

    /**
     * @notice Allows the contract owner to mint one NFT for a specified address for free.
     * @param to The address to mint the NFT to.
     */
    function ownerMint(address to) external onlyOwner nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() < MAX_SUPPLY, "Exceeds MAX_SUPPLY");
        uint256 tokenId = _nextTokenId;
        unchecked {
            _nextTokenId++;
        }
        _safeMint(to, tokenId);
    }

    // ------------------------
    // Views
    // ------------------------

    /**
     * @notice Returns the metadata URI for a given token ID.
     * @dev This function overrides the default ERC721 implementation.
     * @param tokenId The ID of the token.
     * @return The URI for the token's metadata.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        // Return the single metadata JSON URI (no token-id appended)
        return _baseTokenURI;
    }

    /**
     * @notice Returns the base URI for the collection.
     */
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Returns the collection-level metadata URI.
     */
    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    /**
     * @notice Returns the direct media link for a given token ID.
     * @param tokenId The ID of the token.
     * @return The URI for the token's media file.
     */
    function tokenMediaURI(uint256 tokenId) external view returns (string memory) {
        _requireOwned(tokenId);
        require(bytes(mediaBaseURI).length != 0, "Media base not set");
        // In the single-file model mediaBaseURI can be the full link to the mp4
        return mediaBaseURI;
    }

    /**
     * @notice Returns an array of all token IDs owned by a specific address.
     * @param owner_ The address to query.
     * @return ids An array of token IDs.
     */
    function tokensOfOwner(address owner_) external view returns (uint256[] memory ids) {
        uint256 count = balanceOf(owner_);
        ids = new uint256[](count);
        for (uint256 i = 0; i < count; ) {
            ids[i] = tokenOfOwnerByIndex(owner_, i);
            unchecked {
                ++i;
            }
        }
    }

    // ------------------------
    // Admin
    // ------------------------

    /**
     * @notice Sets a new base URI for the collection.
     * @dev Checks if the base URI is frozen and if the new URI is different from the old one before updating.
     * @param newBase The new base URI.
     */
    function setBaseURI(string calldata newBase) external onlyOwner {
        if (baseURIFrozen) {
            revert("Base URI frozen");
        }
        if (bytes(newBase).length == 0) {
            revert("Empty base");
        }
        // Gas-efficient check for string equality
        if (keccak256(bytes(newBase)) != keccak256(bytes(_baseTokenURI))) {
            _baseTokenURI = newBase;
            emit BaseURIUpdated(newBase);
        }
    }

    /**
     * @notice Freezes the base URI, preventing future changes.
     */
    function freezeBaseURI() external onlyOwner {
        if (!baseURIFrozen) {
            baseURIFrozen = true;
            emit BaseURIFrozen();
        }
    }

    /**
     * @notice Sets a new contract-level metadata URI.
     * @dev Checks if the new URI is different from the old one before updating.
     * @param newContractURI The new contract URI.
     */
    function setContractURI(string calldata newContractURI) external onlyOwner {
        if (keccak256(bytes(newContractURI)) != keccak256(bytes(_contractURI))) {
            _contractURI = newContractURI;
            emit ContractURIUpdated(newContractURI);
        }
    }

    /**
     * @notice Sets a new base URI for the token media.
     * @dev Checks if the new URI is different from the old one before updating.
     * @param newMediaBaseURI The new media base URI.
     */
    function setMediaBaseURI(string calldata newMediaBaseURI) external onlyOwner {
        if (keccak256(bytes(newMediaBaseURI)) != keccak256(bytes(mediaBaseURI))) {
            mediaBaseURI = newMediaBaseURI;
            emit MediaBaseURIUpdated(newMediaBaseURI);
        }
    }

    /**
     * @notice Sets a new file extension for the token media.
     * @dev Checks if the new extension is different from the old one before updating.
     * @param newExt The new file extension.
     */
    function setMediaExtension(string calldata newExt) external onlyOwner {
        if (keccak256(bytes(newExt)) != keccak256(bytes(mediaExtension))) {
            require(bytes(newExt).length != 0, "Empty ext");
            mediaExtension = newExt;
            emit MediaExtensionUpdated(newExt);
        }
    }

    /**
     * @notice Toggles the public minting status.
     * @dev Checks if the new status is different from the current one before updating.
     * @param enabled The new public mint status.
     */
    function setPublicMintEnabled(bool enabled) external onlyOwner {
        if (publicMintEnabled != enabled) {
            publicMintEnabled = enabled;
            emit PublicMintStatusChanged(enabled);
        }
    }

    /**
     * @notice Sets a new mint amount.
     * @dev Checks if the new amount is different from the current one before updating.
     * @param newAmount The new mint amount in SSTL.
     */
    function setMintAmount(uint256 newAmount) external onlyOwner {
        if (mintAmount != newAmount) {
            mintAmount = newAmount;
            emit MintAmountUpdated(newAmount);
        }
    }

    /**
     * @notice Withdraws any leftover SSTL tokens from the contract.
     * @dev Checks that the recipient is not the zero address before transferring the balance.
     * @param to The address to send the tokens to.
     */
    function withdraw(address to) external onlyOwner {
        uint256 balance = SSTL.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(to != address(0), "Cannot withdraw to zero address");
        require(SSTL.transfer(to, balance), "Withdraw failed");
    }
}