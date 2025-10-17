import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Ethereum } from "@thirdweb-dev/chains";
import Index from "./pages/Index";
import Hub from "./pages/Hub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThirdwebProvider
        activeChain={Ethereum}
        clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
        supportedChains={[Ethereum]}
        queryClient={queryClient}
      >
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hub/*" element={<Hub />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThirdwebProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
