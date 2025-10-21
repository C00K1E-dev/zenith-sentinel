import { ArrowRight, Zap, Shield, Cpu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentCard from '@/components/ContentCard';
import { Loading } from '@/components/ui/loading';
import heroImage from '@/assets/ssv2hero.svg';

const Roadmap = lazy(() => import('@/components/Roadmap'));
const Team = lazy(() => import('@/components/Team'));
const FAQ = lazy(() => import('@/components/FAQ'));
const PoweredBy = lazy(() => import('@/components/PoweredBy'));

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-x-hidden overflow-y-auto">
      {/* Optimized Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Static Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-primary/5" />

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

        {/* Reduced Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-secondary/2 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/2 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="glass-card p-16 text-center">
              <h1 className="text-2xl md:text-4xl font-orbitron font-bold mb-6 neon-glow">
                SmartSentinels
              </h1>
              <p className="text-2xl md:text-3xl text-foreground mb-4 font-orbitron">
                Decentralized AI Agents Powered by Proof of Useful Work
              </p>
              <p className="text-xl text-primary mb-8 font-semibold">
                AI Agents. Real Work. Real Rewards.
              </p>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Join the revolution where AI agents perform real work, devices earn rewards, 
                and you hold the key to the future of decentralized intelligence.
              </p>
              
              <div className="flex justify-center">
                <Link to="/hub" target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg" className="group">
                    Join the Network
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ContentCard
            title="A New Class of Digital Ownership"
            content="SmartSentinels delivers verifiable, low-cost AI services for businesses—from smart contract audits to intelligent assistants—while rewarding contributors with SSTL tokens. Edge-native, deflationary, and built for real impact."
            delay={0}
            icon={<Shield size={40} />}
          />
          
          <ContentCard
            title="Why It Matters"
            content="Instead of wasting energy like traditional mining, SmartSentinels puts computation to work. Investors back real-world utility, and contributors can stake hardware or mint NFTs to share in the generated rewards."
            delay={0.1}
            icon={<Zap size={40} />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ContentCard
            title="A New Model"
            content="Our ecosystem ties together AI, blockchain, and hardware ownership into one seamless experience—where every second of useful work by a Sentinel brings measurable value back to the community."
            delay={0.2}
            icon={<Cpu size={40} />}
          />
          
          <ContentCard
            title="Our Mission & Vision"
            content="To unlock the real-world value of AI by turning devices into autonomous workers. We empower contributors to earn through purpose-driven mining and give businesses access to decentralized, on-demand intelligence."
            delay={0.3}
            icon={<Target size={40} />}
          />
        </div>

        {/* Roadmap Section */}
        <Suspense fallback={<Loading />}>
          <Roadmap />
        </Suspense>

        {/* Team Section */}
        <Suspense fallback={<Loading />}>
          <Team />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <PoweredBy />
        </Suspense>

        {/* FAQ Section */}
        <Suspense fallback={<Loading />}>
          <FAQ />
        </Suspense>

        {/* Closing CTA */}
        <div className="glass-card p-12 text-center neon-border">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 neon-glow">
            Join the Decentralized Workforce Revolution
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Where AI works, devices earn, and you hold the key.
          </p>
          <Link to="/hub" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="lg" className="group">
              Get Started Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
