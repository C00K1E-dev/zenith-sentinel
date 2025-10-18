import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarMyAgents = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Agents"
            value="0"
            icon={Bot}
            description="Agents created"
            delay={0.1}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarMyAgents;