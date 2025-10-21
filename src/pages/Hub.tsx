import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import SidebarNFTsiNFTsHub from '@/components/sidebarComponents/sidebarNFTsiNFTsHub';
import SidebarCreateAgent from '@/components/sidebarComponents/sidebarCreateAgent';
import SidebarDeviceMonitoring from '@/components/sidebarComponents/sidebarDeviceMonitoring';
import SidebarMyNFTs from '@/components/sidebarComponents/sidebarMyNFTs';
import SidebarMyAgents from '@/components/sidebarComponents/sidebarMyAgents';
import SidebarMyDevices from '@/components/sidebarComponents/sidebarMyDevices';
import SidebarMyRewards from '@/components/sidebarComponents/sidebarMyRewards';
import SidebarGeneralStats from '@/components/sidebarComponents/sidebarGeneralStats';
import SidebarAIAuditSmartContract from '@/components/sidebarComponents/sidebarAIAuditSmartContract';
import SidebarMarketplace from '@/components/sidebarComponents/sidebarMarketplace';
import SidebarStaking from '@/components/sidebarComponents/sidebarStaking';

const Hub = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);
  const [manualCollapsed, setManualCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!manualCollapsed) {
        setCollapsed(window.innerWidth < 1024);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [manualCollapsed]);

  const handleSetCollapsed = (newCollapsed: boolean) => {
    setManualCollapsed(true);
    setCollapsed(newCollapsed);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-x-hidden overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5 animate-gradient-shift-reverse" />

        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="none"/>
                <circle cx="10" cy="10" r="1" fill="rgba(248, 244, 66, 0.2)"/>
                <line x1="10" y1="10" x2="20" y2="10" stroke="rgba(248, 244, 66, 0.1)" strokeWidth="0.5"/>
                <line x1="10" y1="10" x2="10" y2="0" stroke="rgba(248, 244, 66, 0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>

        {/* Animated Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-secondary/2 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/2 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-primary/2 rounded-full blur-3xl animate-float-reverse" />
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />

      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-20" : "ml-72")}>
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Routes>
            <Route index element={<SidebarGeneralStats />} />
            <Route path="my-nfts" element={<SidebarMyNFTs />} />
            <Route path="my-agents" element={<SidebarMyAgents />} />
            <Route path="my-devices" element={<SidebarMyDevices />} />
            <Route path="my-rewards" element={<SidebarMyRewards />} />
            <Route path="general-stats" element={<SidebarGeneralStats />} />
            <Route path="nfts" element={<SidebarNFTsiNFTsHub />} />
            <Route path="audit" element={<SidebarAIAuditSmartContract />} />
            <Route path="devices" element={<SidebarDeviceMonitoring />} />
            <Route path="create-agent" element={<SidebarCreateAgent />} />
            <Route path="marketplace" element={<SidebarMarketplace />} />
            <Route path="staking" element={<SidebarStaking />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Hub;
