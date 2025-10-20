import { motion } from 'framer-motion';
import { HardDrive, Sparkles, Cpu } from 'lucide-react';
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

        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="nft-compact-card coming-soon group"
          >
            <div className="flex items-center gap-4">
              <div className="nft-preview">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Cpu size={48} className="text-muted-foreground" />
                </div>
                {/* Removed redundant hover overlay */}
              </div>
              <div className="nft-content">
                <h3 className="font-orbitron font-bold text-lg mb-2">Device Registration - Coming Soon</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  Register and manage your devices to run AI agents, earn rewards through Proof of Useful Work (PoUW), and contribute to network security.
                </p>
                <div className="nft-benefits mt-3">
                  <span className="benefit-tag coming-soon">
                    <HardDrive className="benefit-icon" />
                    <span>Device Mining</span>
                  </span>
                  <span className="benefit-tag coming-soon">
                    <Sparkles className="benefit-icon" />
                    <span>Coming Q4 2025</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarMyDevices;