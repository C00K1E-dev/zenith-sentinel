import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { MetaTags } from './components/MetaTags';
import { HelmetProvider } from 'react-helmet-async';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';
import Index from "./pages/Index";
import Hub from "./pages/Hub";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <MetaTags />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/hub/*" element={<Hub />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  </QueryClientProvider>
  <Analytics />
  </HelmetProvider>
);

export default App;
