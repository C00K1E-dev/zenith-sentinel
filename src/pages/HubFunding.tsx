import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';

const HubFunding = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-orbitron font-bold mb-2 neon-glow">
          Seed Funding / Token Sale
        </h1>
        <p className="text-muted-foreground">
          Participate in the SmartSentinels token sale and secure your position in the ecosystem
        </p>
      </motion.div>

      {/* Funding Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Raised"
          value="$0"
          icon={DollarSign}
          description="Current funding"
          delay={0.1}
        />
        <StatCard
          title="Token Price"
          value="$0.10"
          icon={TrendingUp}
          description="Current price"
          delay={0.2}
        />
        <StatCard
          title="Participants"
          value="0"
          icon={Users}
          description="Total investors"
          delay={0.3}
        />
        <StatCard
          title="Time Remaining"
          value="TBA"
          icon={Clock}
          description="Until sale ends"
          delay={0.4}
        />
      </div>

      {/* Token Sale Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card p-8 text-center"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4">Token Sale Coming Soon</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          The SSTL token sale will be announced soon. Join our community to stay updated on the launch date and early access opportunities.
        </p>
        <Button variant="hero" size="lg">
          Join Waitlist
        </Button>
      </motion.div>
    </div>
  );
};

export default HubFunding;
