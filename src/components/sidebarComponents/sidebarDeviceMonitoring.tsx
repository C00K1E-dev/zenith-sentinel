import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import StatCard from '@/components/StatCard';

const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="glass-card p-12 text-center">
      <h1 className="text-3xl font-orbitron font-bold mb-4 neon-glow">{title}</h1>
      <p className="text-xl text-muted-foreground">Coming Soon</p>
    </div>
  );
};

const SidebarDeviceMonitoring = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          My Devices
        </h2>
      </motion.div>
      <ComingSoon title="Device Monitoring" />
    </div>
  );
};

export default SidebarDeviceMonitoring;