"use client";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { AI_AUDIT_ABI, AI_AUDIT_CONTRACT_ADDRESS, AI_AUDIT_CHAIN_ID, SSTL_TOKEN_ADDRESS } from "../contracts/index";

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
  const { isConnected, address, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [authMessage, setAuthMessage] = useState("");
  const [minting, setMinting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<bigint | null>(null);
  const [callbackTriggered, setCallbackTriggered] = useState(false);

  // Check SSTL allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: SSTL_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && AI_AUDIT_CONTRACT_ADDRESS ? [address, AI_AUDIT_CONTRACT_ADDRESS] : undefined,
    chainId: AI_AUDIT_CHAIN_ID,
    query: { enabled: !!address }
  });

  // Check SSTL balance
  const { data: sstlBalanceData } = useReadContract({
    address: SSTL_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: AI_AUDIT_CHAIN_ID,
    query: { enabled: !!address }
  });

  const handleMint = useCallback(async () => {
    if (!isConnected || !address) {
      setAuthMessage("Please connect your wallet to mint.");
      return;
    }
    if (chain?.id !== AI_AUDIT_CHAIN_ID) {
      setAuthMessage(`Please switch to BSC Testnet to mint.`);
      return;
    }

    try {
      setMinting(true);
      setAuthMessage(""); // Clear any previous messages

      // Check current allowance and balance
      const currentAllowance = allowanceData ? BigInt(allowanceData.toString()) : BigInt(0);
      const userBalance = sstlBalanceData ? BigInt(sstlBalanceData.toString()) : BigInt(0);

      // Check if user has enough SSTL to mint
      if (userBalance < MINT_AMOUNT) {
        setAuthMessage(`Insufficient SSTL balance. You need ${MINT_AMOUNT.toString()} SSTL but only have ${userBalance.toString()}.`);
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

        await writeContractAsync({
          address: SSTL_ADDRESS,
          abi: erc20Abi,
          functionName: 'approve',
          args: [AI_AUDIT_CONTRACT_ADDRESS, approvalAmount],
          chainId: AI_AUDIT_CHAIN_ID,
          chain: bscTestnet,
          account: address,
        });

        setAuthMessage("Approval complete. Minting NFT...");
        // Refetch allowance after approval
        refetchAllowance();
      } else {
        setAuthMessage("Minting NFT...");
      }

      // Now mint the NFT
      const txHash = await writeContractAsync({
        address: AI_AUDIT_CONTRACT_ADDRESS as `0x${string}`,
        abi: AI_AUDIT_ABI,
        functionName: 'publicMint',
        args: [],
        chainId: AI_AUDIT_CHAIN_ID,
        chain: bscTestnet,
        account: address,
      });

      setMintTxHash(txHash);
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
  }, [isConnected, address, chain, writeContractAsync, allowanceData, sstlBalanceData, refetchAllowance]);

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
        return log.address?.toLowerCase?.() === AI_AUDIT_CONTRACT_ADDRESS.toLowerCase() && log.topics?.[0] === transferTopic;
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

        // Fetch tokenURI from contract
        const tokenURIResponse = await fetch(`/api/tokenURI?contract=${AI_AUDIT_CONTRACT_ADDRESS}&tokenId=${lastMintedTokenId}&chainId=${AI_AUDIT_CHAIN_ID}`);
        if (!tokenURIResponse.ok) throw new Error('Failed to fetch tokenURI');
        const { tokenURI } = await tokenURIResponse.json();

        let metadataUrl = tokenURI;
        if (metadataUrl.startsWith('ipfs://')) {
          metadataUrl = metadataUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }

        const response = await fetch(metadataUrl);
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const metadata = await response.json();

        const mediaUrl = metadata.animation_url || metadata.image || '';

        if (onMinted) {
          onMinted({
            tokenId: lastMintedTokenId,
            txHash: mintTxHash,
            imageUrl: mediaUrl
          });
        }
      } catch (e) {
        console.error('Error in mint callback:', e);
        // Fallback
        if (onMinted) {
          onMinted({
            tokenId: lastMintedTokenId,
            txHash: mintTxHash,
            imageUrl: '/assets/img/hub/smartsentinels-hero.png'
          });
        }
      }
    };

    // Small delay to ensure contract state is updated
    const timer = setTimeout(fetchMetadata, 1000);
    return () => clearTimeout(timer);
  }, [lastMintedTokenId, mintTxHash, callbackTriggered, onMinted]);

  // Format SSTL balance for display
  const formatSSTLBalance = () => {
    if (!sstlBalanceData) return '0';
    const balance = Number(BigInt(sstlBalanceData.toString())) / 1e18;
    return balance.toFixed(2);
  };

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
    </>
  );
}