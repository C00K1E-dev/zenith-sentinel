import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarMyDevices = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Devices"
            value="0"
            icon={HardDrive}
            description="Devices registered"
            delay={0.1}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarMyDevices;