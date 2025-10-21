import { motion } from 'framer-motion';
import { memo } from 'react';

const PoweredBy = memo(() => {
  const technologies = [
    { name: 'BNB Chain', logo: '/assets/bnb-chain-logo.svg' },
    { name: 'NVIDIA', logo: '/assets/nvidia-logo.svg' },
    { name: 'Thirdweb', logo: '/assets/thirdweb-logo.svg' },
    { name: 'Google Cloud', logo: '/assets/google-cloud-logo.svg' },
    { name: 'AMD', logo: '/assets/amd-logo.svg' },

  ];

  const partners = [
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
    { name: 'Get featured here', logo: '', isText: true },
  ] as Array<{ name: string; logo: string; isText?: boolean }>;

  const Marquee = ({ items, direction = 'left' }: { items: Array<{ name: string; logo: string; isText?: boolean }>; direction?: 'left' | 'right' }) => {
    const duplicatedItems = [...items, ...items, ...items]; // Triple for seamless loop
    return (
      <div className="relative overflow-hidden py-4">
        <motion.div
          className="flex items-center gap-8"
          animate={{
            x: direction === 'left' ? [-100 * items.length, 0] : [0, -100 * items.length]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30, // Increased from 20 to 30 for better performance
              ease: "linear",
            },
          }}
        >
          {duplicatedItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center min-w-[120px]">
              {item.isText ? (
                <div className="h-10 flex items-center justify-center mb-2">
                  <span className="text-sm font-semibold text-primary">{item.name}</span>
                </div>
              ) : (
                <img
                  src={item.logo}
                  alt={item.name}
                  className={item.name === 'AMD' ? "h-20 w-20 object-contain -mb-6 -mt-2" : "h-10 w-10 object-contain mb-2"}
                />
              )}
              {!item.isText && <span className="text-xs text-muted-foreground font-medium">{item.name}</span>}
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="py-12">
      <h2 className="text-center text-2xl font-orbitron font-bold mb-6 text-foreground">Powered By</h2>
      <Marquee items={technologies} direction="left" />
      <h3 className="text-center text-lg font-orbitron font-semibold mt-10 mb-4 text-foreground">Partners</h3>
      <Marquee items={partners} direction="right" />
    </section>
  );
});

PoweredBy.displayName = 'PoweredBy';

export default PoweredBy;
