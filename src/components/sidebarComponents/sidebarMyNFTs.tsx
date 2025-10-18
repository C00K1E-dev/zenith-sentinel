import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import StatCard from '@/components/StatCard';

const SidebarMyNFTs = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          My NFTs
        </h2>
        <div className="flex justify-center">
          <div className="w-80">
            <StatCard
              title="My NFTs"
              value="0"
              icon={ImageIcon}
              description="NFTs owned"
              delay={0.1}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarMyNFTs;