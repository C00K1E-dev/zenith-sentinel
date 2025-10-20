"use client";
import { useState, useEffect, useCallback } from "react";
import { useActiveAccount, useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall, getContract, createThirdwebClient, readContract } from "thirdweb";
import { bscTestnet } from "thirdweb/chains";
import { AI_AUDIT_ABI, AI_AUDIT_CONTRACT_ADDRESS, AI_AUDIT_CHAIN_ID, SSTL_TOKEN_ADDRESS, SSTL_TOKEN_ABI } from "../contracts/index";
import MintSuccessOverlay from "./MintSuccessOverlay";

const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

const SSTL_ADDRESS = SSTL_TOKEN_ADDRESS as `0x${string}`; // Use updated address from index
const MINT_AMOUNT = BigInt(100) * BigInt("1000000000000000000"); // 100 SSTL (matches deployed contract)

const erc20Abi = [
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
];

export default function AIAuditMint({ onMinted }: { onMinted?: (args: { tokenId?: bigint, txHash?: string, imageUrl?: string }) => void }) {
   const account = useActiveAccount();
   const { mutateAsync: sendTransaction } = useSendTransaction();
   const [authMessage, setAuthMessage] = useState("");
   const [minting, setMinting] = useState(false);
   const [approving, setApproving] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [mintTxHash, setMintTxHash] = useState<string | null>(null);
   const [lastKnownTokenId, setLastKnownTokenId] = useState<bigint>(BigInt(20)); // Start from 20 since user mentioned minting 20
   const [lastMintedTokenId, setLastMintedTokenId] = useState<bigint | null>(null);
   const [callbackTriggered, setCallbackTriggered] = useState(false);
   const [overlayShown, setOverlayShown] = useState(false);
   const [metadataImageUrl, setMetadataImageUrl] = useState<string>('');
   const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

   const isConnected = !!account;
   const address = account?.address;

   // Get contracts
   const sstlContract = getContract({
     address: SSTL_ADDRESS,
     abi: SSTL_TOKEN_ABI as any,
     chain: bscTestnet,
     client: thirdwebClient,
   } as any);

   const aiAuditContract = getContract({
     address: AI_AUDIT_CONTRACT_ADDRESS,
     abi: AI_AUDIT_ABI as any,
     chain: bscTestnet,
     client: thirdwebClient,
   } as any);

   // Check SSTL allowance
   const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
     contract: sstlContract,
     method: 'allowance',
     params: address && AI_AUDIT_CONTRACT_ADDRESS ? [address, AI_AUDIT_CONTRACT_ADDRESS] : undefined,
     abi: SSTL_TOKEN_ABI,
   } as any);

   // Check SSTL balance
   const { data: sstlBalanceData, isLoading: balanceLoading, error: balanceError } = useReadContract({
     contract: sstlContract,
     method: 'balanceOf',
     params: address ? [address] : undefined,
     abi: SSTL_TOKEN_ABI,
   } as any);

   // Get total supply to determine next token ID
   const { data: totalSupplyData, isLoading: totalSupplyLoading, error: totalSupplyError, refetch: refetchTotalSupply } = useReadContract({
     contract: aiAuditContract,
     method: 'totalSupply',
     abi: AI_AUDIT_ABI,
   } as any);

   // Update last known token ID when total supply changes
   useEffect(() => {
     if (totalSupplyData && typeof totalSupplyData === 'bigint') {
       setLastKnownTokenId(totalSupplyData);
     }
   }, [totalSupplyData]);

   // Get user's NFT balance
   const { data: userNFTBalance, refetch: refetchNFTBalance } = useReadContract({
     contract: aiAuditContract,
     method: 'balanceOf',
     params: address ? [address] : undefined,
     abi: AI_AUDIT_ABI,
   } as any);

   // Get token URI for the minted token
   const { data: tokenURIData } = useReadContract({
     contract: aiAuditContract,
     method: 'tokenURI',
     params: lastMintedTokenId ? [lastMintedTokenId] : undefined,
     abi: AI_AUDIT_ABI,
   } as any);

  const handleMint = useCallback(async () => {
    if (!isConnected || !address) {
      setAuthMessage("Please connect your wallet to mint.");
      return;
    }
    if (!address) {
      setAuthMessage(`Please connect your wallet to mint.`);
      return;
    }

    try {
      setMinting(true);
      setAuthMessage(""); // Clear any previous messages

      // Reset flags for new mint
      setCallbackTriggered(false);
      setOverlayShown(false);
      setLastMintedTokenId(null);
      setMetadataImageUrl('');

      // Check current allowance and balance
      const currentAllowance = allowanceData ? BigInt(allowanceData as any) : BigInt(0);
      const userBalance = sstlBalanceData ? BigInt(sstlBalanceData as any) : BigInt(0);

      // Check if user has enough SSTL to mint
      const userBalanceFormatted = Number(userBalance) / 1e18;
      const mintAmountFormatted = Number(MINT_AMOUNT) / 1e18;
      if (userBalance < MINT_AMOUNT) {
        setAuthMessage(`Insufficient SSTL balance. You need ${mintAmountFormatted} SSTL but only have ${userBalanceFormatted}.`);
        // Clear error message after 5 seconds
        setTimeout(() => setAuthMessage(""), 5000);
        return;
      }

      // If allowance is insufficient, approve what they need
      if (currentAllowance < MINT_AMOUNT) {
        setApproving(true);
        setAuthMessage("Approving SSTL for minting...");

        // Approve enough for 10 mints or their full balance, whichever is smaller
        const approvalAmount = userBalance < MINT_AMOUNT * BigInt(10)
          ? userBalance
          : MINT_AMOUNT * BigInt(10);

        const approveTx = prepareContractCall({
          contract: sstlContract,
          method: 'approve',
          params: [AI_AUDIT_CONTRACT_ADDRESS, approvalAmount],
        } as any);
        await sendTransaction(approveTx);

        setAuthMessage("Approval complete. Minting NFT...");
        // Refetch allowance after approval
        refetchAllowance();
      } else {
        setAuthMessage("Minting NFT...");
      }

      // Calculate expected token ID before minting
      const currentTotalSupply = totalSupplyData ? BigInt(totalSupplyData.toString()) : BigInt(0);
      const expectedTokenId = currentTotalSupply + BigInt(1);

      console.log('=== MINT DEBUG ===');
      console.log('totalSupplyData:', totalSupplyData);
      console.log('totalSupplyData type:', typeof totalSupplyData);
      console.log('currentTotalSupply:', currentTotalSupply.toString());
      console.log('expectedTokenId:', expectedTokenId.toString());
      console.log('==================');

      // If totalSupply is not available or seems wrong, use fallback
      if (!totalSupplyData || currentTotalSupply === BigInt(0)) {
        console.log('totalSupply not available or zero, trying to refetch...');
        try {
          await refetchTotalSupply();
          // Wait a bit for refetch
          await new Promise(resolve => setTimeout(resolve, 1000));
          const refetchedTotalSupply = totalSupplyData ? BigInt(totalSupplyData.toString()) : BigInt(0);
          console.log('Refetched totalSupply:', refetchedTotalSupply.toString());

          if (refetchedTotalSupply > BigInt(0)) {
            const correctedTokenId = refetchedTotalSupply + BigInt(1);
            setLastMintedTokenId(correctedTokenId);
            setLastKnownTokenId(correctedTokenId);
            console.log('Using refetched totalSupply, token ID:', correctedTokenId.toString());
          } else {
            // Still no data, use incremental fallback
            const fallbackTokenId = lastKnownTokenId + BigInt(1);
            setLastMintedTokenId(fallbackTokenId);
            setLastKnownTokenId(fallbackTokenId);
            console.log('Using incremental fallback token ID:', fallbackTokenId.toString());
          }
        } catch (error) {
          console.error('Error refetching totalSupply:', error);
          const fallbackTokenId = lastKnownTokenId + BigInt(1);
          setLastMintedTokenId(fallbackTokenId);
          setLastKnownTokenId(fallbackTokenId);
          console.log('Using incremental fallback token ID after error:', fallbackTokenId.toString());
        }
      } else {
        // Set the expected token ID immediately
        setLastMintedTokenId(expectedTokenId);
        setLastKnownTokenId(expectedTokenId);
        console.log('Set lastMintedTokenId to expected ID:', expectedTokenId.toString());
      }

      // Now mint the NFT
      console.log('Attempting to mint NFT...');
      console.log('User balance:', userBalance.toString());
      console.log('Allowance:', currentAllowance.toString());
      console.log('Mint amount needed:', MINT_AMOUNT.toString());

      const mintTx = prepareContractCall({
        contract: aiAuditContract,
        method: 'publicMint',
        params: [],
        abi: AI_AUDIT_ABI,
      } as any);
      console.log('Prepared mint transaction:', mintTx);
      const txResult = await sendTransaction(mintTx);
      const txHash = txResult.transactionHash;

      setMintTxHash(txHash);
      // Set the expected token ID immediately
      setLastMintedTokenId(expectedTokenId);
      setLastKnownTokenId(expectedTokenId);
      console.log('Set lastMintedTokenId to expected ID:', expectedTokenId.toString());

      // Set up verification after transaction broadcast
      console.log('Transaction sent, setting up verification...');
        
      // Initial verification after a short delay for the transaction to propagate
      setTimeout(async () => {
        try {
          console.log('Performing initial supply verification...');
          await refetchTotalSupply();
          const newTotalSupply = totalSupplyData ? BigInt(totalSupplyData.toString()) : BigInt(0);
          console.log('Initial verified totalSupply:', newTotalSupply.toString());

          if (newTotalSupply > expectedTokenId) {
            console.log('Supply increased, updating token ID to:', newTotalSupply.toString());
            setLastMintedTokenId(newTotalSupply);
            setLastKnownTokenId(newTotalSupply);
          }
          
          // Additional verification after a longer delay
          setTimeout(async () => {
            try {
              console.log('Performing final supply verification...');
              await refetchTotalSupply();
              const finalTotalSupply = totalSupplyData ? BigInt(totalSupplyData.toString()) : BigInt(0);
              console.log('Final verified totalSupply:', finalTotalSupply.toString());
              
              if (finalTotalSupply > newTotalSupply) {
                console.log('Final supply update detected:', finalTotalSupply.toString());
                setLastMintedTokenId(finalTotalSupply);
                setLastKnownTokenId(finalTotalSupply);
              }
            } catch (error) {
              console.error('Error in final supply verification:', error);
            }
          }, 10000); // 10 seconds for final verification
        } catch (error) {
          console.error('Error in initial supply verification:', error);
        }
      }, 3000); // 3 seconds for initial verification

      // Clear all messages after successful mint
      setTimeout(() => setAuthMessage(""), 2000);

    } catch (e) {
      console.error('Mint failed', e);
      setAuthMessage('Mint failed. Please try again.');
      // Clear error message after 5 seconds
      setTimeout(() => setAuthMessage(""), 5000);
    } finally {
      setMinting(false);
      setApproving(false);
    }
  }, [isConnected, address, sendTransaction, allowanceData, sstlBalanceData, refetchAllowance]);

  // The token ID is set immediately in handleMint, no need for additional logic here

  // Fetch metadata when we have tokenURI
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURIData && lastMintedTokenId && !metadataImageUrl) {
        // Only fetch if we haven't set a custom image URL yet
        const tokenURIString = tokenURIData.toString();
        console.log('=== METADATA FETCH ===');
        console.log('Token ID:', lastMintedTokenId.toString());
        console.log('Token URI:', tokenURIString);

        // Add a small delay to ensure token exists
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          // If tokenURI is an IPFS URL or HTTP URL, fetch the metadata
          if (tokenURIString.startsWith('http') || tokenURIString.startsWith('ipfs://')) {
            let metadataUrl = tokenURIString;
            if (tokenURIString.startsWith('ipfs://')) {
              // Convert IPFS URL to HTTP gateway
              metadataUrl = tokenURIString.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }

            console.log('Fetching metadata from:', metadataUrl);
            const response = await fetch(metadataUrl);
            const metadata = await response.json();
            console.log('Fetched metadata:', metadata);

            // Extract image URL from metadata
            if (metadata.image) {
              let imageUrl = metadata.image;
              if (imageUrl.startsWith('ipfs://')) {
                imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
              }

              // Only update if we got a valid-looking URL
              if (imageUrl.startsWith('http') || imageUrl.startsWith('https://')) {
                setMetadataImageUrl(imageUrl);
                console.log('Set metadata image URL:', imageUrl);
              } else {
                console.log('Invalid image URL in metadata:', imageUrl);
                // Don't update - keep the fallback
              }
            } else {
              // No image in metadata, keep the fallback
              console.log('No image in metadata, keeping fallback');
            }
          } else {
            // If it's not a URL, assume it's a data URI or direct image
            console.log('Token URI is not a URL, using as direct image');
            setMetadataImageUrl(tokenURIString);
          }
        } catch (error) {
          console.error('Error fetching metadata:', error);
          // Keep the fallback image
          console.log('Metadata fetch failed, keeping fallback');
        }
        console.log('=== METADATA FETCH END ===');
      } else {
        console.log('Metadata fetch skipped - tokenURIData:', !!tokenURIData, 'lastMintedTokenId:', lastMintedTokenId, 'metadataImageUrl:', metadataImageUrl);
      }
    };

    fetchMetadata();
  }, [tokenURIData, lastMintedTokenId, metadataImageUrl]);

  // Show success overlay when we have a successful mint (only once)
  useEffect(() => {
    if (lastMintedTokenId && mintTxHash && !callbackTriggered && !overlayShown) {
      console.log('Showing success overlay for token:', lastMintedTokenId.toString());
      setShowSuccessOverlay(true);
      setOverlayShown(true);

      // Trigger onMinted callback
      if (onMinted) {
        setCallbackTriggered(true);
        onMinted({
          tokenId: lastMintedTokenId,
          txHash: mintTxHash,
          imageUrl: metadataImageUrl || '/assets/AIAudit.mp4'
        });
      }
    }
  }, [lastMintedTokenId, mintTxHash, onMinted, callbackTriggered, overlayShown, metadataImageUrl]);

  // Debug showSuccessOverlay state changes
  useEffect(() => {
    console.log('showSuccessOverlay changed to:', showSuccessOverlay);
  }, [showSuccessOverlay]);

  // Format SSTL balance for display
  const formatSSTLBalance = () => {
    if (!sstlBalanceData) return '0';
    const balance = Number(BigInt(sstlBalanceData as any)) / 1e18;
    return balance.toFixed(2);
  };

  // Debug logging
  useEffect(() => {
    console.log('SSTL Balance Data:', sstlBalanceData);
    console.log('Balance Loading:', balanceLoading);
    console.log('Balance Error:', balanceError);
    console.log('Allowance Data:', allowanceData);
    console.log('MINT_AMOUNT:', MINT_AMOUNT.toString());
    console.log('Address:', address);
    console.log('SSTL_ADDRESS:', SSTL_ADDRESS);
    console.log('AI_AUDIT_CONTRACT_ADDRESS:', AI_AUDIT_CONTRACT_ADDRESS);
  }, [sstlBalanceData, balanceLoading, balanceError, allowanceData, address]);

  return (
    <>
      <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
          ⚠️ <strong>Testnet Only:</strong> This NFT is currently only available on BSC Testnet
        </p>
      </div>
      <div className="mb-2 p-2 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Your SSTL Balance: <strong className="text-foreground">{formatSSTLBalance()}</strong></p>
        <p className="text-xs text-muted-foreground">Cost: <strong className="text-foreground">100 SSTL</strong></p>
      </div>
      <button className={`nft-mint-btn ${minting || approving ? 'disabled' : ''}`} onClick={handleMint} disabled={minting || approving}>
        {approving ? 'Approving SSTL…' : minting ? 'Minting NFT…' : 'Mint AI Audit NFT'}
      </button>
      {authMessage && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{authMessage}</p>
        </div>
      )}

      <MintSuccessOverlay
        isOpen={showSuccessOverlay}
        onClose={() => {
          console.log('onClose called, setting showSuccessOverlay to false');
          setShowSuccessOverlay(false);
        }}
        tokenId={lastMintedTokenId}
        txHash={mintTxHash}
        imageUrl={metadataImageUrl || '/assets/AIAudit.mp4'}
        collectionName="AI Audit NFT"
      />
    </>
  );
}