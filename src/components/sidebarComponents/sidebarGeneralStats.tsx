import { motion } from 'framer-motion';
import { Image as ImageIcon, Bot, HardDrive, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarGeneralStats = () => {
  return (
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
  );
};

export default SidebarGeneralStats;