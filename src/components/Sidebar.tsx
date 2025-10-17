import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DollarSign,
  Image as ImageIcon,
  Shield,
  Monitor,
  Bot,
  Store,
  Coins,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { ConnectWallet } from '@thirdweb-dev/react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    { name: 'Seed Funding / Token Sale', path: '/hub/funding', icon: DollarSign },
    { name: 'NFTs & iNFTs Hub', path: '/hub/nfts', icon: ImageIcon },
    { name: 'AI Audit - Smart Contract', path: '/hub/audit', icon: Shield },
    { name: 'Device Monitoring', path: '/hub/devices', icon: Monitor, badge: 'Soon' },
    { name: 'Create Agent', path: '/hub/create-agent', icon: Bot, badge: 'Soon' },
    { name: 'Marketplace', path: '/hub/marketplace', icon: Store, badge: 'Soon' },
    { name: 'Staking', path: '/hub/staking', icon: Coins, badge: 'Soon' },
    { name: 'General Stats', path: '/hub', icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        'glass-card border-r neon-border transition-all duration-300 h-screen sticky top-0 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 glass-card-hover p-1.5 rounded-full neon-border z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10">
        {!collapsed && (
          <h2 className="font-orbitron font-bold text-lg neon-glow">SmartSentinels Hub</h2>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-orbitron font-bold text-sm">SS</span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                active
                  ? 'bg-primary/20 text-primary neon-border'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                collapsed && 'justify-center'
              )}
            >
              <Icon size={20} className={cn(active && 'text-primary')} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-card border border-white/10 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Wallet Connection */}
      <div className="p-4 border-t border-white/10">
        {!collapsed ? (
          <ConnectWallet
            theme="dark"
            btnTitle="Connect Wallet"
            className="!w-full !bg-primary !text-primary-foreground !rounded-lg !font-medium hover:!opacity-90 transition-opacity"
          />
        ) : (
          <button className="w-full glass-card-hover p-2 rounded-lg flex items-center justify-center">
            <Wallet size={20} className="text-primary" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
