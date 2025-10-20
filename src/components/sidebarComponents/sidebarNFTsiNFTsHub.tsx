import { motion } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Bot, Zap, Crown, DollarSign, Search, Rocket, Target } from 'lucide-react';
import { useReadContract } from 'wagmi';
import { GENESIS_CONTRACT_ADDRESS, GENESIS_CHAIN_ID, GENESIS_ABI, AI_AUDIT_CONTRACT_ADDRESS, AI_AUDIT_CHAIN_ID, AI_AUDIT_ABI } from '../../contracts/index';
import StatCard from '@/components/StatCard';
import GenesisMint from '@/components/GenesisMint';
import AIAuditMint from '@/components/AIAuditMint';

const SidebarNFTsiNFTsHub = () => {
  // Read total supply for Genesis collection
  const { data: genesisTotalSupply } = useReadContract({
    address: GENESIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: GENESIS_ABI,
    functionName: 'totalSupply',
    chainId: GENESIS_CHAIN_ID,
  });

  // Read total supply for AI Audit collection
  const { data: aiAuditTotalSupply } = useReadContract({
    address: AI_AUDIT_CONTRACT_ADDRESS as `0x${string}`,
    abi: AI_AUDIT_ABI,
    functionName: 'totalSupply',
    chainId: AI_AUDIT_CHAIN_ID,
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <ImageIcon size={24} className="text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground">
            NFTs & iNFTs Hub
          </h2>
        </div>

        {/* Hub Info - Moved to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 rounded-xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon size={24} className="text-primary" />
            <h4 className="text-xl md:text-2xl font-orbitron font-bold text-foreground">About SmartSentinels NFTs</h4>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 font-medium">
            More than digital art - your gateway to AI-powered ownership with real utility and benefits.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground font-medium">
              <Bot size={16} className="text-primary" />
              <span>AI Access</span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground font-medium">
              <Sparkles size={16} className="text-primary" />
              <span>Rewards</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="space-y-6">

        {/* Genesis Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="nft-compact-card group"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="nft-preview">
              <video
                src="/assets/genesis.mp4"
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="nft-overlay group-hover:opacity-0 transition-opacity duration-300">
                <Crown size={16} className="text-primary" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="mb-2">
                <h4 className="text-base md:text-lg font-orbitron font-bold text-foreground">
                  Genesis Collection
                </h4>
                <div className="flex items-center gap-1 text-sm md:text-base text-primary font-medium mt-1">
                  <Sparkles size={12} />
                  LEGENDARY
                </div>
              </div>

              <p className="text-sm md:text-base text-muted-foreground mb-3 line-clamp-2">
                The original SmartSentinels NFT collection featuring 1,000 Genesis NFTs. Genesis holders enjoy exclusive early supporter benefits including revenue sharing, 2x AI token generation.
              </p>

              <div className="mb-3 space-y-1">
                <div className="text-sm md:text-base text-muted-foreground">Total Supply: 1,000</div>
                <div className="text-sm md:text-base font-orbitron font-bold text-primary">Price: 0.074 BNB</div>
                <div className="text-sm md:text-base text-muted-foreground">Minted: {genesisTotalSupply ? Number(genesisTotalSupply) : 0} / 1,000</div>
                <div className="text-sm md:text-base text-muted-foreground">Network: BSC Mainnet</div>
                <div className="text-sm md:text-base text-muted-foreground">
                  Contract: <a 
                    href="https://bscscan.com/address/0xA9C9b3BfdDbb761ea82272787abD61beddC15382" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:text-primary/80 underline"
                  >
                    0xA9C9...382
                  </a>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="text-sm md:text-base font-orbitron font-bold text-foreground mb-2">Benefits:</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <DollarSign size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm md:text-base font-medium text-foreground">10% Revenue Share</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Divided among all Genesis holders</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Bot size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm md:text-base font-medium text-foreground">2x AI Token Generation</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Double rewards from AI tasks</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <GenesisMint />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Audit Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="nft-compact-card group"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="nft-preview">
              <video
                src="/assets/AIAudit.mp4"
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="nft-overlay group-hover:opacity-0 transition-opacity duration-300">
                <Bot size={16} className="text-primary" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="mb-2">
                <h4 className="text-base md:text-lg font-orbitron font-bold text-foreground">
                  AI Audit Collection
                </h4>
                <div className="flex items-center gap-1 text-sm md:text-base text-primary font-medium mt-1">
                  <Bot size={12} />
                  UTILITY
                </div>
              </div>

              <p className="text-sm md:text-base text-muted-foreground mb-3 line-clamp-2">
                Get access to our AI Agent that performs smart contract auditing services. This AI Agent runs on our device infrastructure and conducts professional audit work across the blockchain ecosystem. When the AI Agent audits smart contracts and generates tokens, these tokens are automatically distributed among all NFT holders from this collection.
              </p>

              <div className="mb-3 space-y-1">
                <div className="text-sm md:text-base text-muted-foreground">Total Supply: 1,000</div>
                <div className="text-sm md:text-base font-orbitron font-bold text-primary">Price: 100 SSTL</div>
                <div className="text-sm md:text-base text-muted-foreground">Minted: {aiAuditTotalSupply ? Number(aiAuditTotalSupply) : 0} / 1,000</div>
                <div className="text-sm md:text-base text-muted-foreground">Network: BSC Testnet</div>
                <div className="text-sm md:text-base text-muted-foreground">
                  Contract: <a 
                    href="https://testnet.bscscan.com/address/0x9C4d0aa26f3697C30e8D69A0d8d29baAE7027c1c" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:text-primary/80 underline"
                  >
                    0x9C4d...E7027c1c
                  </a>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="text-sm md:text-base font-orbitron font-bold text-foreground mb-2">Benefits:</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Search size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm md:text-base font-medium text-foreground">Access to AI Audit Agent Services</div>
                      <div className="text-sm md:text-base text-muted-foreground">Get access to our AI Agent running on device infrastructure - performing professional smart contract audits</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm md:text-base font-medium text-foreground">Token Distribution from AI Agent Work</div>
                      <div className="text-sm md:text-base text-muted-foreground">When our AI Agent audits contracts and generates tokens, they're automatically distributed among all collection holders</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <AIAuditMint />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AIDA Collection - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="nft-compact-card coming-soon group"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="nft-preview">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Zap size={24} className="text-primary/60 mx-auto mb-2" />
                  <div className="text-sm md:text-base text-primary/60 font-orbitron font-bold">AIDA</div>
                </div>
              </div>
              <div className="nft-overlay group-hover:opacity-0 transition-opacity duration-300">
                <Zap size={16} className="text-primary/60" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="mb-2">
                <h4 className="text-base md:text-lg font-orbitron font-bold text-foreground/60">
                  AIDA Collection
                </h4>
                <div className="flex items-center gap-1 text-sm md:text-base text-primary/60 font-medium mt-1">
                  <Zap size={12} />
                  COMING SOON
                </div>
              </div>

              <p className="text-sm md:text-base text-muted-foreground/60 mb-3 line-clamp-2">
                Artificial Intelligence for Doctors and Assistants - The next evolution in SmartSentinels NFTs.
              </p>

              <div className="mb-3 space-y-1">
                <div className="text-sm md:text-base text-muted-foreground/60">Total Supply: TBA</div>
                <div className="text-sm md:text-base font-orbitron font-bold text-primary/60">Price: TBA</div>
                <div className="text-sm md:text-base text-muted-foreground/60">Release: Q1 2026</div>
                <div className="text-sm md:text-base text-muted-foreground/60">Network: TBA</div>
                <div className="text-sm md:text-base text-muted-foreground/60 font-mono">Contract: TBA</div>
              </div>

              <div className="nft-benefits">
                <div className="benefit-tag coming-soon">
                  <Rocket size={12} className="text-primary/60" />
                  <span className="text-sm md:text-base">Next Gen</span>
                </div>
                <div className="benefit-tag coming-soon">
                  <Target size={12} className="text-primary/60" />
                  <span className="text-sm md:text-base">Advanced AI</span>
                </div>
              </div>

              <div className="mt-3">
                <button className="nft-mint-btn disabled" disabled>
                  <Zap size={14} />
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SidebarNFTsiNFTsHub;