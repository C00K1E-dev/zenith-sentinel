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
    <div className="min-h-screen flex gradient-animate overflow-x-hidden relative">
      {/* Blockchain & AI Themed Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hub-circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="none"/>
                <circle cx="10" cy="10" r="1" fill="rgba(248, 244, 66, 0.3)"/>
                <line x1="10" y1="10" x2="20" y2="10" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
                <line x1="10" y1="10" x2="10" y2="0" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hub-circuit)"/>
          </svg>
        </div>

        {/* Neural Network Connections */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Neural Network Nodes */}
            <circle cx="150" cy="100" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="350" cy="150" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="550" cy="200" r="3" fill="rgba(248, 244, 66, 0.5)" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="750" cy="130" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="950" cy="170" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite"/>
            </circle>

            {/* Connection Lines */}
            <line x1="150" y1="100" x2="350" y2="150" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse">
              <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>
            </line>
            <line x1="350" y1="150" x2="550" y2="200" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite"/>
            </line>
            <line x1="550" y1="200" x2="750" y2="130" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite"/>
            </line>
            <line x1="750" y1="130" x2="950" y2="170" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>

        {/* Blockchain Chain Links */}
        <div className="absolute top-32 right-10 opacity-20">
          <svg width="100" height="60" viewBox="0 0 100 60">
            <ellipse cx="15" cy="15" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="15" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="15" cy="45" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="40" cy="22.5" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="40" cy="37.5" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="65" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="90" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
          </svg>
        </div>

        {/* Data Flow Streams */}
        <div className="absolute bottom-40 left-20 opacity-15">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse"></div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse mt-2" style={{ animationDelay: '1s' }}></div>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-primary/35 to-transparent animate-pulse mt-2" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* AI Processing Nodes */}
        <div className="absolute top-1/2 left-16 opacity-10">
          <svg width="80" height="60" viewBox="0 0 80 60">
            <path d="M40 8 Q25 8 25 23 Q25 38 40 38 Q55 38 55 23 Q55 8 40 8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="1"/>
            <circle cx="30" cy="18" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse"/>
            <circle cx="40" cy="28" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            <circle cx="50" cy="18" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '2s' }}/>
          </svg>
        </div>

        {/* Digital Data Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/2 w-0.5 h-0.5 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

        {/* Large Background Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/4 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

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
