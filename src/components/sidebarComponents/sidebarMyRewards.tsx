import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarMyRewards = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
        My Rewards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Rewards"
          value="0"
          icon={Award}
          description="Rewards earned"
          delay={0.1}
        />
      </div>
      <div className="text-center py-12">
        <Award size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-orbitron font-bold mb-2">My Rewards</h3>
        <p className="text-muted-foreground">
          Complete tasks and contribute to earn SSTL token rewards
        </p>
      </div>
    </motion.div>
  );
};

export default SidebarMyRewards;