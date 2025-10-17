import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Cpu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentCard from '@/components/ContentCard';
import heroImage from '@/assets/ssv2hero.svg';

const Index = () => {
  return (
    <div className="min-h-screen gradient-animate">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="group">
                  Join the Network
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/hub">
                  <Button variant="glass" size="lg">
                    Launch Hub
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
          <Link to="/hub">
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
