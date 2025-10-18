import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import founder_data from '@/data/team';

const Team = () => {
  return (
    <section id="team" className="py-20 px-4">
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
            Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the visionaries driving SmartSentinels forward - experts in AI, blockchain, and decentralized systems
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {founder_data.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="w-full max-w-sm"
            >
              <div className="glass-card-hover p-6 text-center group">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary/50 transition-all duration-300">
                    <img
                      src={member.thumb}
                      alt={`${member.title} - ${member.designasion}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Member Info */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-orbitron font-bold text-foreground neon-glow">
                    {member.title}
                  </h3>
                  <p className="text-primary font-semibold text-sm md:text-base">
                    {member.designasion}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 mt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card-hover p-2 rounded-full text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                        aria-label={`${member.title} LinkedIn`}
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card-hover p-2 rounded-full text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                        aria-label={`${member.title} Twitter`}
                      >
                        <FontAwesomeIcon icon={faXTwitter} size="lg" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="glass-card-hover p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4 neon-glow">
              Join Our Mission
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals who share our vision of decentralized AI. If you're passionate about blockchain, AI, or Web3, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:team@smartsentinels.ai"
                className="glass-card-hover px-6 py-3 rounded-lg bg-primary/20 text-primary font-orbitron font-bold hover:bg-primary/30 transition-all duration-300"
              >
                Contact Us
              </a>
              <Link
                to="/hub"
                className="glass-card-hover px-6 py-3 rounded-lg border border-primary/30 text-primary font-orbitron font-bold hover:bg-primary/10 transition-all duration-300"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;