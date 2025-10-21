"use client";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { Loader, Gift, TrendingUp, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

// Import contract ABIs and addresses
import { POUW_POOL_ADDRESS, POUW_POOL_ABI, AI_AUDIT_CONTRACT_ADDRESS, AI_AUDIT_ABI, GENESIS_CONTRACT_ADDRESS, GENESIS_ABI } from "../../contracts/index";

// Contract addresses
const POUW_ADDRESS = POUW_POOL_ADDRESS;
const AI_AUDIT_ADDRESS = AI_AUDIT_CONTRACT_ADDRESS;
const GENESIS_ADDRESS = GENESIS_CONTRACT_ADDRESS;

interface RewardsSectionProps {
  refreshTrigger?: number;
}

export default function SidebarMyRewards({ refreshTrigger = 0 }: RewardsSectionProps) {
  const { address, isConnected, chain } = useAccount();
  
  // State
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [userTotalEarned, setUserTotalEarned] = useState(0);
  const [userPendingRewards, setUserPendingRewards] = useState(0);
  const [userNFTs, setUserNFTs] = useState<bigint[]>([]);
  const [internalRefreshTrigger, setInternalRefreshTrigger] = useState<number>(0);

  const publicClient = usePublicClient();

  // Calculate user earnings and pending rewards
  useEffect(() => {
    if (!address || userNFTs.length === 0 || !publicClient) {
      setUserTotalEarned(0);
      setUserPendingRewards(0);
      return;
    }

    const calculateUserStats = async () => {
      let totalEarned = BigInt(0);
      let totalPending = BigInt(0);

      for (const tokenId of userNFTs) {
        try {
          // Get claimed amount
          const claimed = await publicClient.readContract({
            address: POUW_ADDRESS as `0x${string}`,
            abi: POUW_POOL_ABI,
            functionName: 'claimedPerNFT',
            args: [tokenId],
          } as any) as bigint;
          totalEarned += claimed;

          // Get pending amount
          const pending = await publicClient.readContract({
            address: POUW_ADDRESS as `0x${string}`,
            abi: POUW_POOL_ABI,
            functionName: 'pendingReward',
            args: [tokenId],
          } as any) as bigint;
          totalPending += pending;
        } catch (error) {
          console.error('Error calculating stats for token', tokenId.toString(), error);
        }
      }

      setUserTotalEarned(Number(formatEther(totalEarned)));
      setUserPendingRewards(Number(formatEther(totalPending)));
    };

    calculateUserStats();
  }, [address, userNFTs, publicClient, refreshTrigger, internalRefreshTrigger]);

  // Read global stats from PoUW contract with real-time updates
  const { data: totalJobs } = useReadContract({
    address: POUW_ADDRESS as `0x${string}`,
    abi: POUW_POOL_ABI as any,
    functionName: 'totalJobs',
    chainId: chain?.id,
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
      staleTime: 0,
    },
  });

  const { data: totalMinted } = useReadContract({
    address: POUW_ADDRESS as `0x${string}`,
    abi: POUW_POOL_ABI as any,
    functionName: 'totalMinted',
    chainId: chain?.id,
    query: {
      refetchInterval: 5000,
      staleTime: 0,
    },
  });

  const { data: totalNFTRewards } = useReadContract({
    address: POUW_ADDRESS as `0x${string}`,
    abi: POUW_POOL_ABI as any,
    functionName: 'totalNFTRewards',
    chainId: chain?.id,
    query: {
      refetchInterval: 5000,
      staleTime: 0,
    },
  });

  // Read user's NFT holdings
  const { data: genesisNFTs } = useReadContract({
    address: GENESIS_ADDRESS as `0x${string}`,
    abi: GENESIS_ABI as any,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    chainId: chain?.id,
    query: { enabled: !!address && isConnected }
  });

  const { data: aiAuditNFTs } = useReadContract({
    address: AI_AUDIT_ADDRESS as `0x${string}`,
    abi: AI_AUDIT_ABI as any,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    chainId: chain?.id,
    query: { enabled: !!address && isConnected }
  });

  // Read total supply for debugging
  const { data: aiAuditTotalSupply } = useReadContract({
    address: AI_AUDIT_ADDRESS as `0x${string}`,
    abi: AI_AUDIT_ABI as any,
    functionName: 'totalSupply',
    chainId: chain?.id,
  });

  const { data: genesisTotalSupply } = useReadContract({
    address: GENESIS_ADDRESS as `0x${string}`,
    abi: GENESIS_ABI as any,
    functionName: 'totalSupply',
    chainId: chain?.id,
  });

  // Calculate user's NFT holdings
  useEffect(() => {
    if (!genesisNFTs && !aiAuditNFTs) return;

    const genesis = Array.isArray(genesisNFTs) ? (genesisNFTs as bigint[]) : [];
    const aiAudit = Array.isArray(aiAuditNFTs) ? (aiAuditNFTs as bigint[]) : [];
    const allNFTs = [...genesis, ...aiAudit];
    setUserNFTs(allNFTs);
  }, [genesisNFTs, aiAuditNFTs]);

  // Trigger user stats recalculation when global rewards change (new audits)
  useEffect(() => {
    if (totalNFTRewards && address && userNFTs.length > 0) {
      // Trigger recalculation of user earnings when new rewards are distributed
      setInternalRefreshTrigger(prev => prev + 1);
    }
  }, [totalNFTRewards, address, userNFTs.length]);

  // Write contract for claiming rewards
  const { writeContract, data: claimTxHash, error: claimTxError, isPending: isClaimPending } = useWriteContract();

  // Wait for claim transaction
  const { isLoading: isClaimConfirming, isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  // Handle claim transaction confirmation
  useEffect(() => {
    if (isClaimConfirmed && claimTxHash) {
      setClaimSuccess(true);
      setIsClaiming(false);
      // Trigger refresh of user stats
      setInternalRefreshTrigger((prev: number) => prev + 1);

      // Reset success message after 5 seconds
      setTimeout(() => setClaimSuccess(false), 5000);
    }
  }, [isClaimConfirmed, claimTxHash]);

  // Handle claim errors
  useEffect(() => {
    if (claimTxError) {
      setClaimError(claimTxError.message);
      setIsClaiming(false);
    }
  }, [claimTxError]);

  // Handle claim rewards
  const handleClaimRewards = async () => {
    if (!address || !isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (userPendingRewards <= 0) {
      alert('No rewards to claim');
      return;
    }

    try {
      setIsClaiming(true);
      setClaimError(null);
      console.log('Starting claim process for NFTs:', userNFTs);

      // Claim rewards for each NFT that has pending rewards
      let claimedCount = 0;
      for (const tokenId of userNFTs) {
        try {
          const pending = await publicClient!.readContract({
            address: POUW_ADDRESS as `0x${string}`,
            abi: POUW_POOL_ABI,
            functionName: 'pendingReward',
            args: [tokenId],
          } as any) as bigint;

          console.log(`Token ${tokenId}: pending = ${pending}`);

          if (pending > BigInt(0)) {
            console.log(`Claiming for token ${tokenId}...`);
            const txHash = await writeContract({
              address: POUW_ADDRESS as `0x${string}`,
              abi: POUW_POOL_ABI as any,
              functionName: 'claimReward',
              args: [tokenId],
              chain: chain,
              account: address
            });
            console.log(`Claim tx for token ${tokenId}:`, txHash);
            claimedCount++;
          }
        } catch (error) {
          console.error('Error claiming for token', tokenId.toString(), error);
        }
      }

      console.log(`Claim process complete. Claimed for ${claimedCount} NFTs`);
    } catch (error: any) {
      console.error('Claim error:', error);
      setClaimError(error.message || 'Failed to claim rewards');
      setIsClaiming(false);
    }
  };

  // User stats
  const holdsNFT = userNFTs.length > 0;
  const totalEarned = userTotalEarned;
  const pendingRewards = userPendingRewards;

  // Global PoUW stats from contract
  const totalAuditsCompleted = totalJobs ? Number(totalJobs) : 0;
  const totalMintedTokens = totalMinted ? Number(formatEther(totalMinted as bigint)) : 0;
  const totalDistributed = totalNFTRewards ? Number(formatEther(totalNFTRewards as bigint)) : 0;
  const totalBurned = totalMintedTokens * 0.1; // 10% burned

  const formattedTotalEarned = totalEarned.toFixed(4);
  const formattedPendingRewards = pendingRewards.toFixed(4);

  console.log('User Earnings:', {
    totalEarned,
    pendingRewards,
    holdsNFT,
    nftCount: userNFTs.length,
    aiAuditTotalSupply: aiAuditTotalSupply ? Number(aiAuditTotalSupply) : 0,
    genesisTotalSupply: genesisTotalSupply ? Number(genesisTotalSupply) : 0,
    totalNFTRewards: totalNFTRewards ? Number(formatEther(totalNFTRewards as bigint)) : 0
  });

  // Get explorer URL
  const getExplorerUrl = (txHash: string) => {
    const baseUrl = chain?.id === 56 ? 'https://bscscan.com' : 'https://testnet.bscscan.com';
    return `${baseUrl}/tx/${txHash}`;
  };

  return (
    <div className="rewards-section">
      <div className="rewards-header">
        <Gift size={32} className="rewards-icon" />
        <div>
          <h3>My Rewards Dashboard</h3>
          <p className="rewards-subtitle">
            {holdsNFT 
              ? "You're eligible for PoUW rewards from completed audits" 
              : "Mint an AI Audit NFT to start earning rewards"}
          </p>
        </div>
      </div>

      {!isConnected && (
        <div className="rewards-message warning">
          <AlertCircle size={20} />
          <span>Please connect your wallet to view your rewards</span>
        </div>
      )}

      {isConnected && !holdsNFT && (
        <div className="rewards-message info">
          <AlertCircle size={20} />
          <span>You need to mint an AI Audit NFT to be eligible for PoUW rewards</span>
        </div>
      )}

      {isConnected && (
        <>
          {/* Reward Stats Grid */}
          <div className="rewards-stats-grid">
            <div className="reward-stat-card primary">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">
                  Total Earned
                  <span className="info-tooltip" title="Your total claimed rewards from all your NFTs">ℹ️</span>
                </span>
                <span className="stat-value">{formattedTotalEarned} SSTL</span>
                <span className="stat-subtitle">Your claimed rewards</span>
              </div>
            </div>
            {pendingRewards > 0 && (
              <div className="reward-stat-card secondary">
                <div className="stat-icon">
                  <Gift size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">
                    Pending Rewards
                    <span className="info-tooltip" title="Rewards available to claim from your NFTs">ℹ️</span>
                  </span>
                  <span className="stat-value">{formattedPendingRewards} SSTL</span>
                  <span className="stat-subtitle">Available to claim</span>
                </div>
              </div>
            )}
          </div>

          {/* Claim Rewards Button */}
          {pendingRewards > 0 && (
            <div className="claim-section">
              <button
                className="claim-rewards-btn"
                onClick={handleClaimRewards}
                disabled={isClaiming}
              >
                {isClaiming ? (
                  <>
                    <Loader size={16} className="spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift size={16} />
                    Claim Rewards ({formattedPendingRewards} SSTL)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Success Message */}
          {claimSuccess && claimTxHash && (
            <div className="rewards-message success">
              <CheckCircle size={20} />
              <span>Rewards claimed successfully!</span>
              <a href={getExplorerUrl(claimTxHash)} target="_blank" rel="noopener noreferrer" className="view-tx-link">
                View Transaction <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Error Message */}
          {claimError && (
            <div className="rewards-message error">
              <AlertCircle size={20} />
              <span>{claimError}</span>
            </div>
          )}

          {/* How Rewards Work */}
          <div className="rewards-info-box">
            <h4>How PoUW Rewards Work</h4>
            <ul>
              <li>When any user completes an AI audit, 67 SSTL tokens are minted via Proof of Useful Work</li>
              <li>60% (40.2 SSTL) distributed equally to all AI Audit NFT holders</li>
              <li>Genesis NFTs receive double rewards compared to regular AI Audit NFTs</li>
              <li>20% goes to treasury, 10% is burned, 10% to business client</li>
              <li>Rewards accumulate automatically - claim them using the button above</li>
            </ul>
          </div>

          {/* Global Stats */}
          <div className="global-stats">
            <h4>Global PoUW Statistics</h4>
            <div className="global-stat-item">
              <span className="global-stat-label">Total Audits Completed:</span>
              <span className="global-stat-value">{totalAuditsCompleted}</span>
            </div>
            <div className="global-stat-item">
              <span className="global-stat-label">Total SSTL Minted:</span>
              <span className="global-stat-value">{totalMintedTokens.toFixed(2)} SSTL</span>
            </div>
            <div className="global-stat-item">
              <span className="global-stat-label">Total Distributed (90%):</span>
              <span className="global-stat-value">{totalDistributed.toFixed(2)} SSTL</span>
            </div>
            <div className="global-stat-item">
              <span className="global-stat-label">Total Burned (10%):</span>
              <span className="global-stat-value">{totalBurned.toFixed(2)} SSTL</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}