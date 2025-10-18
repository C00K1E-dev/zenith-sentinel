import { Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import SidebarSeedFundingTokenSale from '@/components/sidebarComponents/sidebarSeedFundingTokenSale';
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
  return (
    <div className="min-h-screen flex gradient-animate overflow-x-hidden relative">
      {/* Blockchain & AI Themed Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hub-circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="none"/>
                <circle cx="10" cy="10" r="1" fill="rgba(248, 244, 66, 0.3)"/>
                <line x1="10" y1="10" x2="20" y2="10" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
                <line x1="10" y1="10" x2="10" y2="0" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hub-circuit)"/>
          </svg>
        </div>

        {/* Neural Network Connections */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Neural Network Nodes */}
            <circle cx="150" cy="100" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="350" cy="150" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="550" cy="200" r="3" fill="rgba(248, 244, 66, 0.5)" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="750" cy="130" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="950" cy="170" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite"/>
            </circle>

            {/* Connection Lines */}
            <line x1="150" y1="100" x2="350" y2="150" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse">
              <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>
            </line>
            <line x1="350" y1="150" x2="550" y2="200" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite"/>
            </line>
            <line x1="550" y1="200" x2="750" y2="130" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite"/>
            </line>
            <line x1="750" y1="130" x2="950" y2="170" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>

        {/* Blockchain Chain Links */}
        <div className="absolute top-32 right-10 opacity-20">
          <svg width="100" height="60" viewBox="0 0 100 60">
            <ellipse cx="15" cy="15" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="15" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="15" cy="45" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="40" cy="22.5" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="40" cy="37.5" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="65" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="90" cy="30" rx="12" ry="6" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
          </svg>
        </div>

        {/* Data Flow Streams */}
        <div className="absolute bottom-40 left-20 opacity-15">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse"></div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse mt-2" style={{ animationDelay: '1s' }}></div>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-primary/35 to-transparent animate-pulse mt-2" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* AI Processing Nodes */}
        <div className="absolute top-1/2 left-16 opacity-10">
          <svg width="80" height="60" viewBox="0 0 80 60">
            <path d="M40 8 Q25 8 25 23 Q25 38 40 38 Q55 38 55 23 Q55 8 40 8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="1"/>
            <circle cx="30" cy="18" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse"/>
            <circle cx="40" cy="28" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            <circle cx="50" cy="18" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '2s' }}/>
          </svg>
        </div>

        {/* Digital Data Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/2 w-0.5 h-0.5 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

        {/* Large Background Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/4 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <Routes>
            <Route index element={<SidebarGeneralStats />} />
            <Route path="my-nfts" element={<SidebarMyNFTs />} />
            <Route path="my-agents" element={<SidebarMyAgents />} />
            <Route path="my-devices" element={<SidebarMyDevices />} />
            <Route path="my-rewards" element={<SidebarMyRewards />} />
            <Route path="general-stats" element={<SidebarGeneralStats />} />
            <Route path="funding" element={<SidebarSeedFundingTokenSale />} />
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
