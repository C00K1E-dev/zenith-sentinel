import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Shield, Code, Search, Star, Clock, DollarSign, MessageSquare, ShoppingCart } from 'lucide-react';

const AgentCard = ({
  name,
  creator,
  price,
  rating,
  capabilities,
  icon: Icon,
  isPopular = false
}: {
  name: string;
  creator: string;
  price: string;
  rating: number;
  capabilities: string[];
  icon: any;
  isPopular?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-6 relative ${isPopular ? 'ring-2 ring-primary' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
          Popular
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">by {creator}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {capabilities.map((cap, index) => (
          <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <DollarSign size={16} className="text-green-400" />
          <span className="font-bold text-lg">{price}</span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>
      </div>

      <button
        className="w-full px-4 py-2 bg-muted text-muted-foreground cursor-not-allowed rounded-lg font-medium"
        disabled
      >
        Rent Agent (Coming Soon)
      </button>
    </motion.div>
  );
};

const SidebarMarketplace = () => {
  const availableAgents = [
    {
      id: 'security-auditor',
      name: 'Security Auditor Pro',
      creator: 'BlockSecure Labs',
      price: '25',
      rating: 4.9,
      capabilities: ['Smart Contract Audit', 'Vulnerability Scan', 'Security Analysis'],
      icon: Shield,
      isPopular: true
    },
    {
      id: 'code-reviewer',
      name: 'Code Reviewer AI',
      creator: 'DevTools Inc',
      price: '15',
      rating: 4.7,
      capabilities: ['Code Review', 'Best Practices', 'Bug Detection'],
      icon: Code,
      isPopular: false
    },
    {
      id: 'research-assistant',
      name: 'Research Assistant',
      creator: 'AI Research Co',
      price: '20',
      rating: 4.8,
      capabilities: ['Research', 'Data Analysis', 'Report Generation'],
      icon: Search,
      isPopular: false
    },
    {
      id: 'trading-bot',
      name: 'DeFi Trading Bot',
      creator: 'CryptoAI Labs',
      price: '35',
      rating: 4.6,
      capabilities: ['Trading Analysis', 'Risk Assessment', 'Market Data'],
      icon: Zap,
      isPopular: false
    }
  ];

  const marketplaceStats = {
    totalAgents: 247,
    activeRentals: 89,
    totalRevenue: 15420,
    avgRating: 4.7
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-orbitron font-bold mb-4 text-foreground">
          AI Agent Marketplace
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Marketplace Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <Bot className="text-primary mx-auto mb-2" size={20} />
            <div className="text-2xl font-bold">{marketplaceStats.totalAgents}</div>
            <div className="text-xs text-muted-foreground">Available Agents</div>
          </div>
          <div className="glass-card p-4 text-center">
            <ShoppingCart className="text-primary mx-auto mb-2" size={20} />
            <div className="text-2xl font-bold">{marketplaceStats.activeRentals}</div>
            <div className="text-xs text-muted-foreground">Active Rentals</div>
          </div>
          <div className="glass-card p-4 text-center">
            <DollarSign className="text-primary mx-auto mb-2" size={20} />
            <div className="text-2xl font-bold">${marketplaceStats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Monthly Revenue</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Star className="text-primary mx-auto mb-2" size={20} />
            <div className="text-2xl font-bold">{marketplaceStats.avgRating}</div>
            <div className="text-xs text-muted-foreground">Avg Rating</div>
          </div>
        </div>

        {/* Available Agents */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bot size={20} />
            Available Agents
          </h3>
          <p className="text-muted-foreground mb-6">
            Rent pre-trained AI agents for specific tasks. All agents are vetted and regularly updated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                creator={agent.creator}
                price={agent.price}
                rating={agent.rating}
                capabilities={agent.capabilities}
                icon={agent.icon}
                isPopular={agent.isPopular}
              />
            ))}
          </div>
        </div>

        {/* Custom Request Section */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={20} />
            Custom Agent Requests
          </h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you need? Request a custom AI agent built specifically for your use case.
          </p>

          <div className="text-center py-8">
            <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
              <MessageSquare size={32} className="text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Custom Agent Requests</h4>
            <p className="text-muted-foreground mb-4">
              Request custom AI agents tailored to your specific requirements. Our team will build and deploy your agent.
            </p>
            <button
              className="px-6 py-2 bg-muted text-muted-foreground cursor-not-allowed rounded-lg font-medium"
              disabled
            >
              Request Custom Agent (Coming Soon)
            </button>
          </div>
        </div>

        {/* Marketplace Benefits */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Why Choose Our Marketplace?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Shield className="text-primary mx-auto mb-2" size={24} />
              <h4 className="font-medium mb-1">Vetted Agents</h4>
              <p className="text-sm text-muted-foreground">
                All agents are thoroughly tested and security-audited
              </p>
            </div>
            <div className="text-center">
              <Clock className="text-primary mx-auto mb-2" size={24} />
              <h4 className="font-medium mb-1">Pay Per Use</h4>
              <p className="text-sm text-muted-foreground">
                Only pay for the time you actually use the agents
              </p>
            </div>
            <div className="text-center">
              <Star className="text-primary mx-auto mb-2" size={24} />
              <h4 className="font-medium mb-1">High Quality</h4>
              <p className="text-sm text-muted-foreground">
                Average 4.7-star rating from satisfied customers
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SidebarMarketplace;