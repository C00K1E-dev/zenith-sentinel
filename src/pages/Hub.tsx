import { motion } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Image as ImageIcon, Bot, HardDrive, TrendingUp, Wallet, Zap, Award } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HubFunding from './HubFunding';

const HubDashboard = () => {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-orbitron font-bold mb-2 neon-glow">
          SmartSentinels Hub
        </h1>
        <p className="text-muted-foreground">
          Manage your AI agents, NFTs, and rewards all in one place
        </p>
      </motion.div>

      {/* General Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          General Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="NFT Collections"
            value="2"
            icon={ImageIcon}
            description="Active collections"
            delay={0.1}
          />
          <StatCard
            title="Active Agents"
            value="1"
            icon={Bot}
            description="AI agents deployed"
            delay={0.2}
          />
          <StatCard
            title="Connected Devices"
            value="1"
            icon={HardDrive}
            description="Hardware devices"
            delay={0.3}
          />
          <StatCard
            title="Total Value"
            value="$0"
            icon={TrendingUp}
            description="Portfolio value"
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* My Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          My Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="My NFTs"
            value="0"
            icon={ImageIcon}
            description="NFTs owned"
            delay={0.5}
          />
          <StatCard
            title="My Agents"
            value="0"
            icon={Bot}
            description="Agents created"
            delay={0.6}
          />
          <StatCard
            title="My Devices"
            value="0"
            icon={HardDrive}
            description="Devices registered"
            delay={0.7}
          />
        </div>
      </motion.div>

      {/* Dashboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card p-6"
      >
        <Tabs defaultValue="nfts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="rewards">My Rewards</TabsTrigger>
            <TabsTrigger value="activity">Wallet Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nfts" className="mt-6">
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-orbitron font-bold mb-2">No NFTs Yet</h3>
              <p className="text-muted-foreground">
                Start collecting NFTs to participate in the SmartSentinels ecosystem
              </p>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <div className="text-center py-12">
              <Bot size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-orbitron font-bold mb-2">No Agents Created</h3>
              <p className="text-muted-foreground">
                Create your first AI agent to start earning rewards
              </p>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-orbitron font-bold mb-2">No Rewards Yet</h3>
              <p className="text-muted-foreground">
                Complete tasks and contribute to earn SSTL token rewards
              </p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-12">
              <Wallet size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-orbitron font-bold mb-2">No Activity</h3>
              <p className="text-muted-foreground">
                Connect your wallet to see transaction history
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="glass-card p-12 text-center">
      <h1 className="text-3xl font-orbitron font-bold mb-4 neon-glow">{title}</h1>
      <p className="text-xl text-muted-foreground">Coming Soon</p>
    </div>
  );
};

const Hub = () => {
  return (
    <div className="min-h-screen flex gradient-animate overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Routes>
            <Route index element={<HubDashboard />} />
            <Route path="funding" element={<HubFunding />} />
            <Route path="nfts" element={<ComingSoon title="NFTs & iNFTs Hub" />} />
            <Route path="audit" element={<ComingSoon title="AI Audit - Smart Contract Analysis" />} />
            <Route path="devices" element={<ComingSoon title="Device Monitoring" />} />
            <Route path="create-agent" element={<ComingSoon title="Create Agent" />} />
            <Route path="marketplace" element={<ComingSoon title="Marketplace" />} />
            <Route path="staking" element={<ComingSoon title="Staking" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Hub;
