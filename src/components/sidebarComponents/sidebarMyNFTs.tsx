import { useState, useEffect } from 'react';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { getContract, readContract } from 'thirdweb';
import { Loader } from 'lucide-react';
import { bsc, bscTestnet } from 'thirdweb/chains';
import { createThirdwebClient } from 'thirdweb';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  GENESIS_CONTRACT_ADDRESS,
  GENESIS_CHAIN_ID,
  GENESIS_ABI,
  AI_AUDIT_CONTRACT_ADDRESS,
  AI_AUDIT_CHAIN_ID,
  AI_AUDIT_ABI,
} from '@/contracts';
import { formatContractAddress, getTokenExplorerUrl } from '@/lib/utils';

const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

const SidebarMyNFTs = ({ onSendNFT }: { onSendNFT?: (tokenId: bigint, tokenName: string, imgSrc: string, contractAddress: string, chainId: number, abi: any) => void }) => {
  const account = useActiveAccount();
  const isMobile = useIsMobile();

  const address = account?.address;
  const isConnected = !!account;

  // Debug logging for mobile wallet detection
  useEffect(() => {
    console.log('🔍 Wallet connection status:', { address, isConnected, isMobile });
    if (address) {
      console.log('✅ Connected wallet address:', address);
    } else {
      console.log('❌ No wallet address detected');
    }
  }, [address, isConnected, isMobile]);

  // Define contracts
  const genesisContract = getContract({ client: thirdwebClient, address: GENESIS_CONTRACT_ADDRESS, chain: GENESIS_CHAIN_ID === 56 ? bsc : bscTestnet });
  const aiAuditContract = getContract({ client: thirdwebClient, address: AI_AUDIT_CONTRACT_ADDRESS, chain: AI_AUDIT_CHAIN_ID === 97 ? bscTestnet : bsc });

  // States for balances and token IDs
  const [genesisBalance, setGenesisBalance] = useState<bigint | null>(null);
  const [aiAuditBalance, setAiAuditBalance] = useState<bigint | null>(null);
  const [genesisBalanceLoading, setGenesisBalanceLoading] = useState(false);
  const [aiAuditBalanceLoading, setAiAuditBalanceLoading] = useState(false);
  const [genesisIds, setGenesisIds] = useState<bigint[]>([]);
  const [aiAuditIds, setAiAuditIds] = useState<bigint[]>([]);

  // Fetch balances using readContract for better mobile compatibility
  useEffect(() => {
    if (address) {
      setGenesisBalanceLoading(true);
      readContract({
        contract: genesisContract,
        method: 'balanceOf',
        params: [address] as any,
      } as any).then(result => {
        console.log('✅ Genesis balance fetched:', result);
        setGenesisBalance(result as unknown as bigint);
        setGenesisBalanceLoading(false);
      }).catch(error => {
        console.error('❌ Error fetching genesis balance:', error);
        setGenesisBalance(BigInt(0));
        setGenesisBalanceLoading(false);
      });
    } else {
      setGenesisBalance(null);
      setGenesisBalanceLoading(false);
    }
  }, [address, genesisContract]);

  useEffect(() => {
    if (address) {
      setAiAuditBalanceLoading(true);
      readContract({
        contract: aiAuditContract,
        method: 'balanceOf',
        params: [address] as any,
      } as any).then(result => {
        console.log('✅ AI Audit balance fetched:', result);
        setAiAuditBalance(result as unknown as bigint);
        setAiAuditBalanceLoading(false);
      }).catch(error => {
        console.error('❌ Error fetching AI Audit balance:', error);
        setAiAuditBalance(BigInt(0));
        setAiAuditBalanceLoading(false);
      });
    } else {
      setAiAuditBalance(null);
      setAiAuditBalanceLoading(false);
    }
  }, [address, aiAuditContract]);

  // Fetch token IDs when balance is available
  useEffect(() => {
    if (genesisBalance && address && Number(genesisBalance) > 0) {
      console.log('🔍 Fetching Genesis token IDs for balance:', genesisBalance.toString());
      const promises = Array.from({ length: Number(genesisBalance) }, (_, i) =>
        readContract({
          contract: genesisContract,
          method: 'tokenOfOwnerByIndex',
          params: [address, BigInt(i)] as any,
        } as any)
      );
      Promise.all(promises).then(results => {
        const ids = results.map(r => r as unknown as bigint);
        console.log('✅ Genesis token IDs fetched:', ids);
        setGenesisIds(ids);
      }).catch(error => {
        console.error('❌ Error fetching Genesis token IDs:', error);
        setGenesisIds([]);
      });
    } else {
      setGenesisIds([]);
    }
  }, [genesisBalance, address, genesisContract]);

  useEffect(() => {
    if (aiAuditBalance && address && Number(aiAuditBalance) > 0) {
      console.log('🔍 Fetching AI Audit token IDs for balance:', aiAuditBalance.toString());
      const promises = Array.from({ length: Number(aiAuditBalance) }, (_, i) =>
        readContract({
          contract: aiAuditContract,
          method: 'tokenOfOwnerByIndex',
          params: [address, BigInt(i)] as any,
        } as any)
      );
      Promise.all(promises).then(results => {
        const ids = results.map(r => r as unknown as bigint);
        console.log('✅ AI Audit token IDs fetched:', ids);
        setAiAuditIds(ids);
      }).catch(error => {
        console.error('❌ Error fetching AI Audit token IDs:', error);
        setAiAuditIds([]);
      });
    } else {
      setAiAuditIds([]);
    }
  }, [aiAuditBalance, address, aiAuditContract]);

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

      {/* Debug Panel for Mobile Testing */}
      {isMobile && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono">
          <div className="font-bold mb-2">🔧 Debug Info (Mobile):</div>
          <div>Connected: {isConnected ? '✅' : '❌'}</div>
          <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
          <div>Genesis Loading: {genesisBalanceLoading ? '⏳' : '✅'}</div>
          <div>Genesis Balance: {genesisBalance?.toString() || '0'}</div>
          <div>AI Audit Loading: {aiAuditBalanceLoading ? '⏳' : '✅'}</div>
          <div>AI Audit Balance: {aiAuditBalance?.toString() || '0'}</div>
          <div>Genesis NFTs: {genesisIds.length}</div>
          <div>AI Audit NFTs: {aiAuditIds.length}</div>
        </div>
      )}
      
      <div className="nft-collections-container">
        {(!isConnected || !address) && (<div className="hub-placeholder"><p>Connect your wallet to view NFTs</p></div>)}
        {(genesisBalanceLoading || aiAuditBalanceLoading) && (<div className="hub-placeholder"><p>Loading NFTs...</p></div>)}
        {address && isConnected && !genesisBalanceLoading && !aiAuditBalanceLoading && collections.every(col => col.nfts.length === 0) && (
          <div className="hub-placeholder">
            <p>No NFTs found</p>
            <p className="text-sm text-muted-foreground mt-2">
              If you own SmartSentinels NFTs, make sure they are imported in your wallet app.
              In MetaMask mobile, go to NFTs tab → Import NFTs → Add the contract addresses:
              {GENESIS_CONTRACT_ADDRESS} (Genesis on BSC Mainnet) or {AI_AUDIT_CONTRACT_ADDRESS} (AI Audit on BSC Testnet).
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Debug:</strong> Check if your address owns NFTs from these contracts on BSC Scan:
              <br />
              <a href={`https://bscscan.com/token/${GENESIS_CONTRACT_ADDRESS}?a=${address}`} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                Genesis Contract on Mainnet
              </a>
              <br />
              <a href={`https://testnet.bscscan.com/token/${AI_AUDIT_CONTRACT_ADDRESS}?a=${address}`} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                AI Audit Contract on Testnet
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Mobile Debug Info:</strong>
              <br />
              Connected Address: {address}
              <br />
              Genesis Balance: {genesisBalance?.toString() || 'Loading...'}
              <br />
              AI Audit Balance: {aiAuditBalance?.toString() || 'Loading...'}
              <br />
              Is Mobile: {isMobile ? 'Yes' : 'No'}
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

  const nftContract = getContract({ client: thirdwebClient, address: contractAddress, chain: chainId === 56 ? bsc : bscTestnet });

  // Fetch token URI from contract
  const { data: tokenURI } = useReadContract({
    contract: nftContract,
    method: 'tokenURI',
    params: [tokenId.toString()],
  } as any);

  // Fetch collection name from contract
  const { data: collectionName } = useReadContract({
    contract: nftContract,
    method: 'name',
    params: [],
  } as any);

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
        let metadataUrl = tokenURI as unknown as string;
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