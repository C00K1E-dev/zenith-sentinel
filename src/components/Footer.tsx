import { Twitter, MessageCircle, Github } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
  ];

  return (
    <footer className="glass-card border-t neon-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-orbitron font-bold">SS</span>
              </div>
              <span className="font-orbitron font-bold text-foreground">SmartSentinels</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © SmartSentinels 2025 — All Rights Reserved
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="glass-card-hover p-3 rounded-lg"
                >
                  <Icon size={20} className="text-muted-foreground hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
