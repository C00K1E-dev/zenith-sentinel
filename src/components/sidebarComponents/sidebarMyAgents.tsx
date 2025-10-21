import { motion } from 'framer-motion';
import { Bot, Sparkles, Cpu, Shield, TrendingUp, Play, Pause, Square, Settings, Plus, Zap } from 'lucide-react';
import StatCard from '@/components/StatCard';

interface AgentCardProps {
  name: string;
  type: string;
  status: 'running' | 'idle' | 'stopped';
  performance: string;
  earnings: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
}

const AgentCard = ({ name, type, status, performance, earnings, icon: Icon }: AgentCardProps) => {
  const statusConfig = {
    running: { color: 'text-green-400', bgColor: 'bg-green-400/20', icon: Play, label: 'Running' },
    idle: { color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', icon: Pause, label: 'Idle' },
    stopped: { color: 'text-red-400', bgColor: 'bg-red-400/20', icon: Square, label: 'Stopped' }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 cursor-not-allowed opacity-75"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon size={24} className="text-primary" />
          <div>
            <h3 className="font-orbitron font-semibold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{type}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor}`}>
          <StatusIcon size={12} className={config.color} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <span className="text-xs text-muted-foreground">Performance</span>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-sm font-orbitron font-bold text-green-400">{performance}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Earnings (24h)</span>
          <span className="text-sm font-orbitron font-bold text-primary">{earnings}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          disabled
          className="flex-1 px-3 py-2 bg-primary/20 text-primary/60 border border-primary/30 rounded-lg font-orbitron text-xs cursor-not-allowed"
        >
          Manage
        </button>
        <button
          disabled
          className="px-3 py-2 bg-muted/20 text-muted-foreground/60 border border-muted/30 rounded-lg cursor-not-allowed"
        >
          <Settings size={14} />
        </button>
      </div>
    </motion.div>
  );
};

const SidebarMyAgents = () => {
  const myAgents = [
    {
      name: 'Contract Guardian',
      type: 'Smart Contract Monitor',
      status: 'running' as const,
      performance: '98.5%',
      earnings: '67 SSTL',
      icon: Shield
    },
    {
      name: 'Market Oracle',
      type: 'DeFi Price Analyzer',
      status: 'running' as const,
      performance: '95.2%',
      earnings: '89 SSTL',
      icon: TrendingUp
    },
    {
      name: 'Security Sentinel',
      type: 'Threat Detection AI',
      status: 'idle' as const,
      performance: '87.3%',
      earnings: '34 SSTL',
      icon: Zap
    },
    {
      name: 'Liquidity Watcher',
      type: 'Pool Monitor Agent',
      status: 'stopped' as const,
      performance: '92.1%',
      earnings: '0 SSTL',
      icon: Cpu
    }
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          My Agents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="opacity-75">
            <StatCard
              title="Active Agents"
              value="4"
              icon={Bot}
              description="Running agents"
              delay={0.1}
            />
          </div>
          <div className="opacity-75">
            <StatCard
              title="Total Earnings"
              value="190 SSTL"
              icon={Sparkles}
              description="Last 24 hours"
              delay={0.2}
            />
          </div>
          <div className="opacity-75">
            <StatCard
              title="Avg. Performance"
              value="93.3%"
              icon={TrendingUp}
              description="Success rate"
              delay={0.3}
            />
          </div>
          <div className="opacity-75">
            <StatCard
              title="Tasks Completed"
              value="1,247"
              icon={Zap}
              description="This month"
              delay={0.4}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-orbitron font-semibold text-primary">
            Agent Management
          </h3>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary/60 border border-primary/30 rounded-lg font-orbitron text-sm cursor-not-allowed"
          >
            <Plus size={16} />
            Create Agent
          </button>
        </div>

        <div className="grid gap-4">
          {myAgents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AgentCard {...agent} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6 text-center cursor-not-allowed opacity-75"
        >
          <h3 className="font-orbitron font-bold text-lg mb-2">AI Agent Creation</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create and customize your own AI agents to monitor smart contracts, analyze market data, detect threats, and protect your assets through intelligent automation.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="benefit-tag coming-soon">
              <Bot className="benefit-icon" />
              <span>Custom AI Agents</span>
            </span>
            <span className="benefit-tag coming-soon">
              <Sparkles className="benefit-icon" />
              <span>Automated Tasks</span>
            </span>
            <span className="benefit-tag coming-soon">
              <Shield className="benefit-icon" />
              <span>Smart Contract Monitoring</span>
            </span>
            <span className="benefit-tag coming-soon">
              <Sparkles className="benefit-icon" />
              <span>Coming Q4 2025</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SidebarMyAgents;