import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Loader } from 'lucide-react';
import {
  GENESIS_CONTRACT_ADDRESS,
  GENESIS_CHAIN_ID,
  GENESIS_ABI,
  AI_AUDIT_CONTRACT_ADDRESS,
  AI_AUDIT_CHAIN_ID,
  AI_AUDIT_ABI,
} from '@/contracts';
import { formatContractAddress, getTokenExplorerUrl } from '@/lib/utils';

const SidebarMyNFTs = ({ onSendNFT }: { onSendNFT?: (tokenId: bigint, tokenName: string, imgSrc: string, contractAddress: string, chainId: number, abi: any) => void }) => {
  const { address, isConnected } = useAccount();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch tokens for Genesis
  const { data: genesisTokenIds, refetch: refetchGenesisTokens } = useReadContract({
    address: GENESIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: GENESIS_ABI as any,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    chainId: GENESIS_CHAIN_ID,
    query: { enabled: !!address, staleTime: 0, refetchOnWindowFocus: true }
  });

  // Fetch tokens for AI Audit
  const { data: aiAuditTokenIds, refetch: refetchAiAuditTokens } = useReadContract({
    address: AI_AUDIT_CONTRACT_ADDRESS as `0x${string}`,
    abi: AI_AUDIT_ABI as any,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    chainId: AI_AUDIT_CHAIN_ID,
    query: { enabled: !!address, staleTime: 0, refetchOnWindowFocus: true }
  });

  // Force refetch when needed (can add refreshKey if needed)
  useEffect(() => {
    if (address) {
      refetchGenesisTokens();
      refetchAiAuditTokens();
    }
  }, [address, refetchGenesisTokens, refetchAiAuditTokens]);

  const genesisIds: bigint[] = Array.isArray(genesisTokenIds) ? (genesisTokenIds as bigint[]) : [];
  const aiAuditIds: bigint[] = Array.isArray(aiAuditTokenIds) ? (aiAuditTokenIds as bigint[]) : [];

  // Collection information
  const collections = [
    {
      name: 'SmartSentinels Genesis',
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      chainId: GENESIS_CHAIN_ID,
      abi: GENESIS_ABI,
      nfts: genesisIds
    },
    {
      name: 'SmartSentinels AI Audit',
      contractAddress: AI_AUDIT_CONTRACT_ADDRESS,
      chainId: AI_AUDIT_CHAIN_ID,
      abi: AI_AUDIT_ABI,
      nfts: aiAuditIds
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
        My NFTs
      </h2>
      <div className="nft-collections-container">
        {(!isConnected || !address) && (<div className="hub-placeholder"><p>Connect your wallet to view NFTs</p></div>)}
        {address && isConnected && collections.every(col => col.nfts.length === 0) && (
          <div className="hub-placeholder">
            <p>No NFTs found</p>
            <p className="text-sm text-muted-foreground mt-2">
              If you own SmartSentinels NFTs, make sure they are imported in your wallet app. 
              In MetaMask mobile, go to NFTs tab → Import NFTs → Add the contract addresses: 
              {GENESIS_CONTRACT_ADDRESS} (Genesis) or {AI_AUDIT_CONTRACT_ADDRESS} (AI Audit).
            </p>
          </div>
        )}

        {collections.map((collection) => (
          collection.nfts.length > 0 && (
            <div key={collection.contractAddress} className="nft-collection-group">
              <div className="collection-header">
                <div className="collection-info">
                  <h4 className="collection-name">{collection.name}</h4>
                  <p className="collection-address">
                    Contract: <code>{formatContractAddress(collection.contractAddress, isMobile)}</code>
                  </p>
                </div>
              </div>

              <div className="nft-grid">
                {collection.nfts.map((id) => (
                  <NFTCard key={`${collection.contractAddress}-${id.toString()}`} tokenId={id} contractAddress={collection.contractAddress} abi={collection.abi} chainId={collection.chainId} onSendNFT={onSendNFT} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

const NFTCard = ({ tokenId, contractAddress, abi, chainId, onSendNFT }: { tokenId: bigint; contractAddress: string; abi: any; chainId: number; onSendNFT?: (tokenId: bigint, tokenName: string, imgSrc: string, contractAddress: string, chainId: number, abi: any) => void }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fetch token URI from contract
  const { data: tokenURI } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi as any,
    functionName: 'tokenURI',
    args: [tokenId],
    chainId: chainId,
  });

  // Fetch collection name from contract
  const { data: collectionName } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: abi as any,
    functionName: 'name',
    chainId: chainId,
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) {
        console.log('❌ No token URI available for token:', tokenId.toString());
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching metadata from URI:', tokenURI);
        
        // Convert IPFS URI to HTTP gateway if needed - using custom Pinata gateway
        let metadataUrl = tokenURI as string;
        if (metadataUrl.startsWith('ipfs://')) {
          // Use your custom Pinata gateway as primary
          metadataUrl = metadataUrl.replace('ipfs://', 'https://sapphire-peculiar-shark-548.mypinata.cloud/ipfs/');
        }

        console.log('🌐 Converted metadata URL:', metadataUrl);

        const response = await fetch(metadataUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const metadata = await response.json();
        console.log('✅ Metadata fetched for token', tokenId.toString(), ':', metadata);

        // Set token name from metadata
        if (metadata.name) {
          setTokenName(metadata.name);
        } else {
          setTokenName(`${collectionName || 'NFT'} #${tokenId.toString()}`);
        }

        // Priority: animation_url (video) > image
        let mediaUrl = '';
        let isVideoFile = false;
        
        if (metadata.animation_url) {
          mediaUrl = metadata.animation_url;
          isVideoFile = true;
          console.log('🎬 Found animation_url (video):', mediaUrl);
        } else if (metadata.image) {
          mediaUrl = metadata.image;
          // Check if image URL is actually a video file (some NFTs incorrectly put videos in image field)
          isVideoFile = mediaUrl.toLowerCase().includes('.mp4') || 
                       mediaUrl.toLowerCase().includes('.webm') || 
                       mediaUrl.toLowerCase().includes('.mov') ||
                       mediaUrl.toLowerCase().includes('.avi');
          console.log(isVideoFile ? '🎬 Found video in image field:' : '🖼️ Found image:', mediaUrl);
        }

        // Convert IPFS URL to HTTP gateway if needed
        if (mediaUrl.startsWith('ipfs://')) {
          mediaUrl = mediaUrl.replace('ipfs://', 'https://sapphire-peculiar-shark-548.mypinata.cloud/ipfs/');
          console.log('🔄 Converted media URL:', mediaUrl);
        }

        if (mediaUrl) {
          console.log('✅ Setting media URL for token', tokenId.toString(), ':', mediaUrl);
          setImgSrc(mediaUrl);
          setIsVideo(isVideoFile);
          setHasError(false);
        } else {
          console.log('⚠️ No media URL found in metadata for token:', tokenId.toString());
          setImgSrc('/assets/img/hub/smartsentinels-hero.png');
          setIsVideo(false);
          setHasError(false);
        }
        
      } catch (error) {
        console.error('❌ Error fetching metadata for token', tokenId.toString(), ':', error);
        setTokenName(`${collectionName || 'NFT'} #${tokenId.toString()}`);
        setImgSrc('/assets/img/hub/smartsentinels-hero.png');
        setIsVideo(false);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    if (tokenURI) {
      fetchMetadata();
    } else {
      setTokenName(`${collectionName || 'NFT'} #${tokenId.toString()}`);
      setLoading(false);
    }
  }, [tokenURI, tokenId, collectionName]);

  const name = tokenName || `${collectionName || 'NFT'} #${tokenId.toString()}`;
  const explorer = getTokenExplorerUrl(tokenId, chainId, contractAddress);

  const handleVideoError = (e: any) => {
    console.error('❌ Video failed to load:', imgSrc);
    console.log('🔄 Trying alternative IPFS gateway...');
    
    // Try alternative IPFS gateways
    if (imgSrc.includes('sapphire-peculiar-shark-548.mypinata.cloud')) {
      const altUrl = imgSrc.replace('sapphire-peculiar-shark-548.mypinata.cloud', 'gateway.pinata.cloud');
      console.log('🔄 Trying gateway.pinata.cloud:', altUrl);
      setImgSrc(altUrl);
    } else if (imgSrc.includes('gateway.pinata.cloud')) {
      const altUrl = imgSrc.replace('gateway.pinata.cloud', 'ipfs.io');
      console.log('🔄 Trying ipfs.io gateway:', altUrl);
      setImgSrc(altUrl);
    } else if (imgSrc.includes('ipfs.io')) {
      const altUrl = imgSrc.replace('ipfs.io/ipfs/', 'cf-ipfs.com/ipfs/');
      console.log('🔄 Trying cf-ipfs.com gateway:', altUrl);
      setImgSrc(altUrl);
    } else {
      console.log('❌ All gateways failed, using fallback image');
      setIsVideo(false);
      setImgSrc('/assets/img/hub/smartsentinels-hero.png');
      setHasError(true);
    }
  };

  const handleImageError = (e: any) => {
    console.error('❌ Image failed to load:', imgSrc);
    if (!hasError) {
      console.log('🔄 Trying alternative IPFS gateway...');
      
      // Try alternative IPFS gateways
      if (imgSrc.includes('sapphire-peculiar-shark-548.mypinata.cloud')) {
        const altUrl = imgSrc.replace('sapphire-peculiar-shark-548.mypinata.cloud', 'gateway.pinata.cloud');
        console.log('🔄 Trying gateway.pinata.cloud:', altUrl);
        setImgSrc(altUrl);
      } else if (imgSrc.includes('gateway.pinata.cloud')) {
        const altUrl = imgSrc.replace('gateway.pinata.cloud', 'ipfs.io');
        console.log('🔄 Trying ipfs.io gateway:', altUrl);
        setImgSrc(altUrl);
      } else if (imgSrc.includes('ipfs.io')) {
        const altUrl = imgSrc.replace('ipfs.io/ipfs/', 'cf-ipfs.com/ipfs/');
        console.log('🔄 Trying cf-ipfs.com gateway:', altUrl);
        setImgSrc(altUrl);
      } else {
        console.log('❌ All gateways failed, using fallback image');
        (e.target as HTMLImageElement).src = '/assets/img/hub/smartsentinels-hero.png';
        setHasError(true);
      }
    } else {
      (e.target as HTMLImageElement).src = '/assets/img/hub/smartsentinels-hero.png';
    }
  };

  return (
    <div className="nft-card">
      <div className="nft-media">
        {loading ? (
          <div className="nft-loading">
            <Loader className="spin" size={24} />
            <span>Loading metadata...</span>
          </div>
        ) : isVideo ? (
          <video
            src={imgSrc}
            className="nft-video"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={handleVideoError}
            onLoadStart={() => console.log('🎬 Video loading started for token:', tokenId.toString())}
            onLoadedData={() => console.log('✅ Video loaded successfully for token:', tokenId.toString())}
          />
        ) : (
          <img
            src={imgSrc || '/assets/img/hub/smartsentinels-hero.png'}
            className="nft-image"
            alt={name}
            width={350}
            height={280}
            onError={handleImageError}
            onLoad={() => {
              console.log('✅ Image loaded successfully for token:', tokenId.toString());
            }}
          />
        )}
        
      </div>
      <div className="nft-info">
        <div className="nft-title">{name}</div>
        <div className="nft-sub">Token ID: {tokenId.toString()}</div>
        <div className="nft-actions">
          <a href={explorer} target="_blank" rel="noreferrer" className="nft-link">View on Explorer</a>
          {onSendNFT && (
            <button
              className="nft-send-btn"
              onClick={() => onSendNFT(tokenId, name, imgSrc, contractAddress, chainId, abi)}
              title="Send NFT to another wallet"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarMyNFTs;