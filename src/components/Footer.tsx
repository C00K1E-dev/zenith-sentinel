import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faTiktok, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { Github, Linkedin } from 'lucide-react';
const ssIcon = "/ss-icon.svg";

// Twitter Icon Component
const TwitterIcon = ({ size, className }: { size?: number; className?: string }) => (
  <FontAwesomeIcon icon={faXTwitter} className={className} />
);

// TikTok Icon Component
const TikTokIcon = ({ size, className }: { size?: number; className?: string }) => (
  <FontAwesomeIcon icon={faTiktok} className={className} />
);

// Telegram Icon Component
const TelegramIcon = ({ size, className }: { size?: number; className?: string }) => (
  <FontAwesomeIcon icon={faTelegram} className={className} />
);

const Footer = () => {
  const socialLinks = [
    { icon: TwitterIcon, label: 'X (Twitter)', href: '#' },
    { icon: TelegramIcon, label: 'Telegram', href: 'https://t.me/SmartSentinelsCommunity' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/smartsentinels/' },
    { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@smartsentinels_official' },
  ];

  return (
    <footer className="glass-card border-t neon-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <img src={ssIcon} alt="SmartSentinels" className="w-8 h-8" />
              <span className="font-orbitron font-bold text-foreground">SmartSentinels</span>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-muted-foreground">
                © SmartSentinels 2025 — All Rights Reserved
              </p>
              <div className="flex items-center space-x-6">
                <a
                  href="/documents/Terms and Conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms and Conditions
                </a>
                <a
                  href="/documents/Privacy Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/documents/Disclaimer.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Disclaimer
                </a>
              </div>
            </div>
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
                  target="_blank"
                  rel="noopener noreferrer"
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
