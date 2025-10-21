import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  delay?: number;
}

const StatCard = memo(({ title, value, icon: Icon, description, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="glass-card-hover p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Icon size={24} className="text-primary" />
        </div>
      </div>

      <h3 className="text-sm text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-orbitron font-bold text-foreground mb-1">{value}</p>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
