import { motion } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Bot, Zap, Crown } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarNFTsiNFTsHub = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <ImageIcon size={20} className="text-primary" />
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-foreground">
            NFTs & iNFTs Hub
          </h2>
        </div>

        {/* Hub Info - Moved to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4 rounded-xl mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon size={16} className="text-primary" />
            <h4 className="text-sm font-orbitron font-bold text-foreground">About SmartSentinels NFTs</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            More than digital art - your gateway to AI-powered ownership with real utility and benefits.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Bot size={12} />
              <span>AI Access</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles size={12} />
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
              <div className="nft-overlay">
                <Crown size={16} className="text-primary" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-orbitron font-bold text-foreground">
                  Genesis Collection
                </h4>
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  <Sparkles size={12} />
                  LEGENDARY
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                The original SmartSentinels collection with exclusive benefits and revenue sharing.
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="nft-stats">
                  <span className="text-xs text-muted-foreground">1,000 NFTs</span>
                  <span className="text-xs font-orbitron font-bold text-primary ml-2">TBA</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  0 / 1,000 minted
                </div>
              </div>

              <div className="nft-benefits">
                <div className="benefit-tag">
                  <span className="benefit-icon">💰</span>
                  <span className="text-xs">Revenue Share</span>
                </div>
                <div className="benefit-tag">
                  <span className="benefit-icon">🤖</span>
                  <span className="text-xs">2x Boost</span>
                </div>
              </div>

              <div className="mt-3">
                {/* GenesisMint component would go here */}
                <button className="nft-mint-btn">
                  <Crown size={14} />
                  Mint Genesis
                </button>
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
              <div className="nft-overlay">
                <Bot size={16} className="text-primary" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-orbitron font-bold text-foreground">
                  AI Audit Collection
                </h4>
                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                  <Bot size={12} />
                  UTILITY
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                Access professional AI-powered smart contract auditing services and earn from AI work.
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="nft-stats">
                  <span className="text-xs text-muted-foreground">1,000 NFTs</span>
                  <span className="text-xs font-orbitron font-bold text-primary ml-2">1000 SSTL</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  0 / 1,000 minted
                </div>
              </div>

              <div className="nft-benefits">
                <div className="benefit-tag">
                  <span className="benefit-icon">🔍</span>
                  <span className="text-xs">AI Audit Access</span>
                </div>
                <div className="benefit-tag">
                  <span className="benefit-icon">⚡</span>
                  <span className="text-xs">Token Rewards</span>
                </div>
              </div>

              <div className="mt-3">
                {/* AIAuditMint component would go here */}
                <button className="nft-mint-btn">
                  <Bot size={14} />
                  Mint AI Audit
                </button>
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
                  <div className="text-xs text-primary/60 font-orbitron font-bold">AIDA</div>
                </div>
              </div>
              <div className="nft-overlay">
                <Zap size={16} className="text-primary/60" />
              </div>
            </div>

            <div className="flex-1 nft-content">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-orbitron font-bold text-foreground/60">
                  AIDA Collection
                </h4>
                <div className="flex items-center gap-1 text-xs text-primary/60 font-medium">
                  <Zap size={12} />
                  COMING SOON
                </div>
              </div>

              <p className="text-xs text-muted-foreground/60 mb-3 line-clamp-2">
                Advanced Intelligent Digital Assets - The next evolution in SmartSentinels NFTs.
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="nft-stats">
                  <span className="text-xs text-muted-foreground/60">TBA NFTs</span>
                  <span className="text-xs font-orbitron font-bold text-primary/60 ml-2">TBA</span>
                </div>
                <div className="text-xs text-muted-foreground/60">
                  Q4 2025
                </div>
              </div>

              <div className="nft-benefits">
                <div className="benefit-tag coming-soon">
                  <span className="benefit-icon">🚀</span>
                  <span className="text-xs">Next Gen</span>
                </div>
                <div className="benefit-tag coming-soon">
                  <span className="benefit-icon">🎯</span>
                  <span className="text-xs">Advanced AI</span>
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