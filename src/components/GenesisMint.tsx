"use client";
import { useState, useEffect, useCallback } from "react";
import { useActiveAccount, useSendTransaction, useReadContract } from "thirdweb/react";
import { prepareContractCall, getContract, createThirdwebClient } from "thirdweb";
import { bsc } from "thirdweb/chains";
import { parseEther } from "viem";
import { GENESIS_ABI, GENESIS_CONTRACT_ADDRESS, GENESIS_CHAIN_ID } from "../contracts/index";

const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

export default function GenesisMint({ onMinted }: { onMinted?: (args: { tokenId?: bigint, txHash?: string, imageUrl?: string }) => void }) {
    const account = useActiveAccount();
    const { mutateAsync: sendTransaction } = useSendTransaction();
    const [authMessage, setAuthMessage] = useState("");
    const [minting, setMinting] = useState(false);
    const [mintTxHash, setMintTxHash] = useState<string | null>(null);
    const [lastMintedTokenId, setLastMintedTokenId] = useState<bigint | null>(null);
    const [callbackTriggered, setCallbackTriggered] = useState(false);

    const isConnected = !!account;
    const address = account?.address;

    // Get contract
    const genesisContract = getContract({
      address: GENESIS_CONTRACT_ADDRESS,
      abi: GENESIS_ABI as any,
      chain: bsc,
      client: thirdwebClient,
    } as any);

   // Read mint price from contract
   const { data: mintPriceData } = useReadContract({
     contract: genesisContract,
     method: 'mintPrice',
   } as any);

  const handleMint = useCallback(async (quantity: number) => {
    if (!isConnected || !address) {
      setAuthMessage("Please connect your wallet to mint.");
      return;
    }
    // For now, we'll skip chain checking as thirdweb handles this
    
    // Get dynamic mint price or fallback
    let valueWei: bigint;
    if (mintPriceData && typeof mintPriceData === 'bigint') {
      valueWei = mintPriceData;
    } else if (mintPriceData && typeof mintPriceData === 'string') {
      valueWei = BigInt(mintPriceData);
    } else {
      // Fallback price
      valueWei = parseEther("0.074");
    }
    
    try {
      setMinting(true);
      setAuthMessage("");
      setMintTxHash(null);
      setLastMintedTokenId(null);
      setCallbackTriggered(false);
      
      const mintTx = prepareContractCall({
        contract: genesisContract,
        method: 'publicMint',
        params: [],
        value: valueWei,
      } as any);
      const txResult = await sendTransaction(mintTx);
      const txHash = txResult.transactionHash;
      setMintTxHash(txHash);
    } catch (e) {
      console.error('Mint failed', e);
      setAuthMessage('Mint failed. Please try again.');
    } finally {
      setMinting(false);
    }
  }, [isConnected, address, sendTransaction, mintPriceData]);

  // For now, we'll use a simple timeout to simulate waiting for the transaction
  // In a real implementation, you'd use thirdweb's transaction receipt hooks

  useEffect(() => {
    if (!mintTxHash || !address) return;
    // For now, we'll use a simple approach to get the token ID
    // In a real implementation, you'd parse the transaction receipt
    // For simplicity, we'll assume the token ID is available after a delay
    const timer = setTimeout(() => {
      // This is a placeholder - in real implementation you'd parse the receipt
      // For now, we'll just trigger the callback with a dummy token ID
      if (mintTxHash && !lastMintedTokenId) {
        // You might want to fetch the latest token ID from the contract
        // For now, we'll use a placeholder
        setLastMintedTokenId(BigInt(1)); // Placeholder
      }
    }, 5000); // Wait 5 seconds for transaction to be mined

    return () => clearTimeout(timer);
  }, [mintTxHash, address, lastMintedTokenId]);

  // Fetch image URL from metadata and trigger onMinted callback
  useEffect(() => {
    if (!lastMintedTokenId || !mintTxHash || callbackTriggered) return;

    const fetchMetadata = async () => {
      try {
        console.log('Triggering mint callback for token:', lastMintedTokenId.toString());
        setCallbackTriggered(true);
        
        // Since all NFTs use the same media, use the fixed URL
        const fixedMediaUrl = 'https://sapphire-peculiar-shark-548.mypinata.cloud/ipfs/bafybeiha5tkjbjz5czjtu3nyldovsc6kdlqcf5ebstirvj4mi26wio2lmi/genesisNFT.mp4';
        
        if (onMinted) {
          onMinted({ 
            tokenId: lastMintedTokenId, 
            txHash: mintTxHash,
            imageUrl: fixedMediaUrl
          });
        }
      } catch (e) {
        console.error('Error in mint callback:', e);
      }
    };

    // Small delay to ensure contract state is updated
    const timer = setTimeout(fetchMetadata, 1000);
    return () => clearTimeout(timer);
  }, [lastMintedTokenId, mintTxHash, callbackTriggered, onMinted]);

  return (
    <>
      <button className={`nft-mint-btn ${minting ? 'disabled' : ''}`} onClick={() => handleMint(1)} disabled={minting}>
        {minting ? 'Minting…' : 'Mint Genesis'}
      </button>
      {authMessage && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{authMessage}</p>
        </div>
      )}
    </>
  );
}
