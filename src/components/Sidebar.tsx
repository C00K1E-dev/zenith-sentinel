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
  Award,
  HardDrive,
} from 'lucide-react';
import { createThirdwebClient } from "thirdweb";
import { useConnectModal, ConnectButton } from "thirdweb/react";
import { cn } from '@/lib/utils';

const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

interface SidebarItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { connect } = useConnectModal();

  const menuItems: SidebarItem[] = [
    { name: 'General Stats', path: '/hub', icon: BarChart3 },
    { name: 'Seed Funding / Token Sale', path: '/hub/funding', icon: DollarSign },
    { name: 'NFTs & iNFTs Hub', path: '/hub/nfts', icon: ImageIcon },
    { name: 'AI Audit - Smart Contract', path: '/hub/audit', icon: Shield },
    { name: 'Device Monitoring', path: '/hub/devices', icon: Monitor, badge: 'Soon' },
    { name: 'Create Agent', path: '/hub/create-agent', icon: Bot, badge: 'Soon' },
    { name: 'Marketplace', path: '/hub/marketplace', icon: Store, badge: 'Soon' },
    { name: 'Staking', path: '/hub/staking', icon: Coins, badge: 'Soon' },
  ];

  const myStatsItems: SidebarItem[] = [
    { name: 'My NFTs', path: '/hub/nfts', icon: ImageIcon },
    { name: 'My Agents', path: '/hub/create-agent', icon: Bot },
    { name: 'My Devices', path: '/hub/devices', icon: HardDrive },
    { name: 'My Rewards', path: '/hub/rewards', icon: Award },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        'glass-card border-r border-yellow-400/20 transition-all duration-300 h-screen sticky top-0 flex flex-col overflow-hidden',
        collapsed ? 'w-20' : 'w-72'
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
          <div className="flex items-center gap-3">
            <img
              src="/ss-icon.svg"
              alt="SmartSentinels Logo"
              className="w-8 h-8"
            />
            <h2 className="font-orbitron font-bold text-lg neon-glow whitespace-nowrap">SmartSentinels Hub</h2>
          </div>
        )}
        {collapsed && (
          <img
            src="/ss-icon.svg"
            alt="SmartSentinels Logo"
            className="w-8 h-8 mx-auto"
          />
        )}
      </div>

      {/* Wallet Connection */}
      <div className="px-4 pt-4 pb-4">
          {!collapsed ? (
            <button
              onClick={() => connect({ client: thirdwebClient })}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(248,244,66,0.5)] hover:shadow-[0_0_30px_rgba(248,244,66,0.7)] font-orbitron font-bold transition-all duration-200"
            >
              <span className="text-primary-foreground font-orbitron font-bold text-sm neon-glow">
                Connect Wallet
              </span>
            </button>
          ) : (
            <button
              onClick={() => connect({ client: thirdwebClient })}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(248,244,66,0.5)] hover:shadow-[0_0_30px_rgba(248,244,66,0.7)] font-orbitron font-bold transition-all duration-200 mb-2">
              <Wallet size={20} className="text-primary-foreground" />
            </button>
          )}
      </div>

      {/* My Stats Section */}
      <div className="px-4 pt-3 pb-2">
        {!collapsed && (
          <h3 className="text-xs font-orbitron font-bold text-primary/70 uppercase tracking-wider mb-2">
            My Stats
          </h3>
        )}
        <div className="space-y-1">
          {myStatsItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm',
                  active
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon size={16} className={cn(active && 'text-primary')} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-card border border-white/10 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mx-4 mb-2"></div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 pt-3 pb-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                item.name === 'Seed Funding / Token Sale' && 'mt-1',
                active
                  ? 'bg-primary/20 text-primary border border-primary/30'
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
    </aside>
  );
};

export default Sidebar;
