import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectWallet } from '@thirdweb-dev/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hub', path: '/hub' },
    { name: 'Roadmap', path: '#roadmap' },
    { name: 'Team', path: '#team' },
    { name: 'Whitepaper', path: '#whitepaper' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b neon-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-orbitron font-bold text-xl">SS</span>
            </div>
            <span className="font-orbitron font-bold text-xl text-foreground neon-glow">
              SmartSentinels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-primary neon-glow'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <ConnectWallet 
              theme="dark"
              btnTitle="Connect Wallet"
              className="!bg-primary !text-primary-foreground !rounded-lg !font-medium hover:!opacity-90 transition-opacity"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg glass-card"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              <ConnectWallet 
                theme="dark"
                btnTitle="Connect Wallet"
                className="!w-full !bg-primary !text-primary-foreground !rounded-lg !font-medium"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
