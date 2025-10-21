import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Rocket } from 'lucide-react';
import road_map_data from '@/data/roadmap';

const Roadmap = () => {
  const getStatusIcon = (index: number) => {
    if (index === 0) return <Clock size={16} className="text-primary" />;
    if (index < 3) return <Rocket size={16} className="text-primary" />;
    return <CheckCircle size={16} className="text-muted-foreground" />;
  };

  const getStatusColor = (index: number) => {
    if (index === 0) return 'border-primary bg-primary/5';
    if (index < 3) return 'border-primary/50 bg-primary/5';
    return 'border-muted-foreground/20 bg-muted/5';
  };

  return (
    <section id="roadmap" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 neon-glow">
            Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our strategic journey to revolutionize decentralized AI infrastructure
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {road_map_data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <div className={`glass-card-hover p-6 h-full flex flex-col border-2 ${getStatusColor(index)} transition-all duration-300 hover:shadow-lg hover:shadow-primary/10`}>
                {/* Status Icon & Quarter */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(index)}
                    <span className="text-xs font-orbitron font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {item.sub_title}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Phase {index + 1}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-orbitron font-bold text-foreground mb-3 leading-tight flex-grow">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {item.desc}
                </p>

                {/* Progress Indicator */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${index === 0 ? 'text-primary' : index < 3 ? 'text-primary/70' : 'text-muted-foreground'}`}>
                      {index === 0 ? 'In Progress' : index < 3 ? 'Upcoming' : 'Planned'}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i <= index ? 'bg-primary' : 'bg-muted-foreground/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Stay updated with our latest developments
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-primary">
            <Clock size={14} />
            <span>Last updated: October 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;