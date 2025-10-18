import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import road_map_data from '@/data/roadmap';

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-glow">
            Roadmap
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our journey to revolutionize AI agent deployment and create a decentralized marketplace
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 transform md:-translate-x-0.5"></div>

          <div className="space-y-12">
            {road_map_data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-card transform md:-translate-x-2 z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-pulse"></div>
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card-hover p-6 md:p-8"
                  >
                    {/* Quarter Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={16} className="text-primary" />
                      <span className="text-sm font-orbitron font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {item.sub_title}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-orbitron font-bold text-foreground mb-4 neon-glow">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {item.desc}
                    </p>

                    {/* Arrow indicator for mobile */}
                    <div className="md:hidden flex justify-end">
                      <ChevronRight size={20} className="text-primary" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-card-hover p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4 neon-glow">
              Join Our Journey
            </h3>
            <p className="text-muted-foreground mb-6">
              Be part of the future of decentralized AI. Follow our progress and get involved in shaping the SmartSentinels ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#hub"
                className="glass-card-hover px-6 py-3 rounded-lg bg-primary/20 text-primary font-orbitron font-bold hover:bg-primary/30 transition-all duration-300"
              >
                Explore Hub
              </a>
              <a
                href="#whitepaper"
                className="glass-card-hover px-6 py-3 rounded-lg border border-primary/30 text-primary font-orbitron font-bold hover:bg-primary/10 transition-all duration-300"
              >
                Read Whitepaper
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;