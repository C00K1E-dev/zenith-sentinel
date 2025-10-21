import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Cpu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentCard from '@/components/ContentCard';
import Roadmap from '@/components/Roadmap';
import Team from '@/components/Team';
import FAQ from '@/components/FAQ';
import PoweredBy from '@/components/PoweredBy';
import heroImage from '@/assets/ssv2hero.svg';

const Index = () => {
  return (
    <div className="min-h-screen gradient-animate relative">
      {/* Blockchain & AI Themed Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="none"/>
                <circle cx="10" cy="10" r="1" fill="rgba(248, 244, 66, 0.3)"/>
                <line x1="10" y1="10" x2="20" y2="10" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
                <line x1="10" y1="10" x2="10" y2="0" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>

        {/* Neural Network Connections */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Neural Network Nodes */}
            <circle cx="200" cy="150" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="400" cy="200" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="600" cy="250" r="3" fill="rgba(248, 244, 66, 0.5)" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="800" cy="180" r="2" fill="rgba(248, 244, 66, 0.3)" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="1000" cy="220" r="3" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4.5s" repeatCount="indefinite"/>
            </circle>

            {/* Connection Lines */}
            <line x1="200" y1="150" x2="400" y2="200" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse">
              <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/>
            </line>
            <line x1="400" y1="200" x2="600" y2="250" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite"/>
            </line>
            <line x1="600" y1="250" x2="800" y2="180" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="2.5s" repeatCount="indefinite"/>
            </line>
            <line x1="800" y1="180" x2="1000" y2="220" stroke="rgba(248, 244, 66, 0.2)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              <animate attributeName="stroke-opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite"/>
            </line>
          </svg>
        </div>

        {/* Blockchain Chain Links */}
        <div className="absolute top-20 left-10 opacity-20">
          <svg width="120" height="80" viewBox="0 0 120 80">
            <ellipse cx="20" cy="20" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="20" cy="40" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="20" cy="60" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="50" cy="30" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="50" cy="50" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="80" cy="25" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="80" cy="45" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
            <ellipse cx="110" cy="35" rx="15" ry="8" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="2"/>
          </svg>
        </div>

        {/* Data Flow Streams */}
        <div className="absolute bottom-32 right-16 opacity-15">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse"></div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse mt-2" style={{ animationDelay: '1s' }}></div>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-primary/35 to-transparent animate-pulse mt-2" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* AI Brain Pattern */}
        <div className="absolute top-1/3 right-20 opacity-10">
          <svg width="100" height="80" viewBox="0 0 100 80">
            <path d="M50 10 Q30 10 30 30 Q30 50 50 50 Q70 50 70 30 Q70 10 50 10" fill="none" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="1"/>
            <circle cx="35" cy="25" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse"/>
            <circle cx="50" cy="35" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            <circle cx="65" cy="25" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '2s' }}/>
          </svg>
        </div>

        {/* Digital Data Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/50 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/2 w-0.5 h-0.5 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

        {/* Large Background Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-primary/4 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Blockchain & AI Themed Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary Data Processing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />

          {/* Circuit-like Connections */}
          <div className="absolute top-16 left-16 w-24 h-24 opacity-20">
            <svg viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="3" fill="rgba(248, 244, 66, 0.5)" className="animate-pulse"/>
              <circle cx="50" cy="50" r="2" fill="rgba(248, 244, 66, 0.4)" className="animate-pulse" style={{ animationDelay: '1s' }}/>
              <circle cx="80" cy="80" r="3" fill="rgba(248, 244, 66, 0.5)" className="animate-pulse" style={{ animationDelay: '2s' }}/>
              <line x1="20" y1="20" x2="50" y2="50" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="1" className="animate-pulse"/>
              <line x1="50" y1="50" x2="80" y2="80" stroke="rgba(248, 244, 66, 0.3)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            </svg>
          </div>

          {/* Floating Data Nodes */}
          <div className="absolute top-32 right-20 w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-12 w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />

          {/* Neural Pathway Visualization */}
          <div className="absolute bottom-20 right-32 opacity-25">
            <svg width="150" height="100" viewBox="0 0 150 100">
              <path d="M10 50 Q40 20 70 50 T130 50" fill="none" stroke="rgba(248, 244, 66, 0.4)" strokeWidth="2" className="animate-pulse"/>
              <circle cx="10" cy="50" r="3" fill="rgba(248, 244, 66, 0.6)" className="animate-ping"/>
              <circle cx="70" cy="50" r="2" fill="rgba(248, 244, 66, 0.5)" className="animate-ping" style={{ animationDelay: '1s' }}/>
              <circle cx="130" cy="50" r="3" fill="rgba(248, 244, 66, 0.6)" className="animate-ping" style={{ animationDelay: '2s' }}/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-16 text-center"
            >
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
            </motion.div>
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
        <Roadmap />

        {/* Team Section */}
        <Team />

        {/* Powered By Section */}
        <PoweredBy />

        {/* FAQ Section */}
        <FAQ />

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-12 text-center neon-border"
        >
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
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
