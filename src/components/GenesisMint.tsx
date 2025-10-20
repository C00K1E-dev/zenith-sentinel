"use client";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { GENESIS_ABI, GENESIS_CONTRACT_ADDRESS, GENESIS_CHAIN_ID } from "../contracts/index";

export default function GenesisMint({ onMinted }: { onMinted?: (args: { tokenId?: bigint, txHash?: string, imageUrl?: string }) => void }) {
  const { isConnected, address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [authMessage, setAuthMessage] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<bigint | null>(null);
  const [callbackTriggered, setCallbackTriggered] = useState(false);

  // Read mint price from contract
  const { data: mintPriceData } = useReadContract({
    address: GENESIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: GENESIS_ABI,
    functionName: 'mintPrice',
    chainId: GENESIS_CHAIN_ID,
  });

  const handleMint = useCallback(async (quantity: number) => {
    if (!isConnected || !address) {
      setAuthMessage("Please connect your wallet to mint.");
      return;
    }
    if (chain?.id !== GENESIS_CHAIN_ID) {
      setAuthMessage(`Please switch to BSC ${GENESIS_CHAIN_ID === 56 ? 'Mainnet' : 'Testnet'} to mint.`);
      return;
    }
    
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
      
      const txHash = await writeContractAsync({
        address: GENESIS_CONTRACT_ADDRESS as `0x${string}`,
        abi: GENESIS_ABI,
        functionName: 'publicMint',
        args: [],
        value: valueWei,
        chain: chain,
        account: address,
      });
      setMintTxHash(txHash);
    } catch (e) {
      console.error('Mint failed', e);
      setAuthMessage('Mint failed. Please try again.');
    } finally {
      setMinting(false);
    }
  }, [isConnected, address, chain, writeContractAsync, mintPriceData]);

  const { data: mintReceipt } = useWaitForTransactionReceipt({
    hash: mintTxHash as `0x${string}` | undefined,
    query: { enabled: !!mintTxHash }
  });

  useEffect(() => {
    if (!mintReceipt || !address) return;
    try {
      const logs = (mintReceipt as { logs?: readonly unknown[] })?.logs || [];
      const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
      const targetLogs = logs.filter((l) => {
        const log = l as { address?: string; topics?: readonly string[] };
        return log.address?.toLowerCase?.() === GENESIS_CONTRACT_ADDRESS.toLowerCase() && log.topics?.[0] === transferTopic;
      });
      for (const log of targetLogs) {
        const typedLog = log as { address?: string; topics?: readonly string[] };
        const toTopic = typedLog.topics?.[2];
        const tokenIdTopic = typedLog.topics?.[3];
        if (toTopic && tokenIdTopic && toTopic.toLowerCase().endsWith(address.slice(2).toLowerCase())) {
          const tokenId = BigInt(tokenIdTopic);
          setLastMintedTokenId(tokenId);
        }
      }
    } catch (e) {
      console.error('Error parsing mint receipt:', e);
    }
  }, [mintReceipt, address]);

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
