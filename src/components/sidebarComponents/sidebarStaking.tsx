import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Target, Zap, Shield, Coins, Lock } from 'lucide-react';

const StakingPoolCard = ({
  name,
  apy,
  duration,
  minStake,
  rewards,
  icon: Icon,
  isPopular = false
}: {
  name: string;
  apy: number;
  duration: string;
  minStake: string;
  rewards: string;
  icon: any;
  isPopular?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-6 relative ${isPopular ? 'ring-2 ring-primary' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
          Popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">APY</span>
          <span className="font-bold text-green-400">{apy}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Min Stake</span>
          <span className="font-medium">{minStake} SSTL</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Rewards</span>
          <span className="font-medium">{rewards}</span>
        </div>
      </div>

      <button
        className="w-full mt-4 px-4 py-2 bg-muted text-muted-foreground cursor-not-allowed rounded-lg font-medium"
        disabled
      >
        Stake (Coming Soon)
      </button>
    </motion.div>
  );
};

const SidebarStaking = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const stakingPools = [
    {
      id: 'flexible',
      name: 'Flexible Staking',
      apy: 8.5,
      duration: 'Flexible',
      minStake: '100',
      rewards: 'Daily',
      icon: Zap,
      description: 'Stake anytime, unstake anytime with competitive APY'
    },
    {
      id: '30days',
      name: '30-Day Lock',
      apy: 12.5,
      duration: '30 Days',
      minStake: '500',
      rewards: 'End of period',
      icon: Clock,
      isPopular: true,
      description: 'Higher APY for committed stakers'
    },
    {
      id: '90days',
      name: '90-Day Lock',
      apy: 18.0,
      duration: '90 Days',
      minStake: '1000',
      rewards: 'End of period',
      icon: Shield,
      description: 'Maximum rewards for long-term holders'
    },
    {
      id: 'nft-boost',
      name: 'NFT Boost Pool',
      apy: 25.0,
      duration: 'Flexible',
      minStake: '100',
      rewards: 'Daily + NFT Bonus',
      icon: Target,
      description: 'Extra rewards for NFT holders'
    }
  ];

  const totalStaked = 125000; // Example data
  const totalStakers = 1250;
  const averageAPY = 15.2;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          Staking Dashboard
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="text-primary" size={18} />
              <span className="text-sm font-medium">Total Staked</span>
            </div>
            <div className="text-2xl font-bold">{totalStaked.toLocaleString()} SSTL</div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-primary" size={18} />
              <span className="text-sm font-medium">Active Stakers</span>
            </div>
            <div className="text-2xl font-bold">{totalStakers.toLocaleString()}</div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-primary" size={18} />
              <span className="text-sm font-medium">Average APY</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{averageAPY}%</div>
          </div>
        </div>

        {/* Staking Pools */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock size={20} />
            Staking Pools
          </h3>
          <p className="text-muted-foreground mb-6">
            Choose a staking pool that fits your investment strategy. Higher lock periods offer better APY rates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakingPools.map((pool) => (
              <StakingPoolCard
                key={pool.id}
                name={pool.name}
                apy={pool.apy}
                duration={pool.duration}
                minStake={pool.minStake}
                rewards={pool.rewards}
                icon={pool.icon}
                isPopular={pool.isPopular}
              />
            ))}
          </div>
        </div>

        {/* Staking Benefits */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Staking Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Earn Passive Income</h4>
                <p className="text-sm text-muted-foreground">
                  Generate SSTL rewards automatically through staking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield size={16} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Secure the Network</h4>
                <p className="text-sm text-muted-foreground">
                  Help maintain network security and stability
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target size={16} className="text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">NFT Boost Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Additional rewards for AI Audit NFT holders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Zap size={16} className="text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Flexible Options</h4>
                <p className="text-sm text-muted-foreground">
                  Choose between flexible or locked staking periods
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedPool && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-primary/50"
          >
            <h4 className="text-lg font-semibold mb-2">Selected Pool</h4>
            <p className="text-muted-foreground">
              {stakingPools.find(p => p.id === selectedPool)?.name} - Ready for staking
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SidebarStaking;