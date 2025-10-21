import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { memo } from 'react';
import faq_data from '@/data/faq';

const FAQ = memo(() => {
  const [activeTab, setActiveTab] = useState('home_1');

  // Filter FAQs by active tab
  const filteredFaqs = faq_data.filter(faq => faq.page === activeTab);

  const tabs = [
    { id: 'home_1', label: 'Token & Technology', description: 'Learn about SSTL tokens, PoUW, and AI agents' },
    { id: 'home_2', label: 'Getting Started', description: 'Basics about SmartSentinels and participation' }
  ];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-glow">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about SmartSentinels, SSTL tokens, and Proof of Useful Work
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-6 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'glass-card-hover border-primary/50 bg-primary/5'
                  : 'glass-card hover:bg-white/5'
              }`}
            >
              <div className="text-center">
                <h3 className={`text-xl font-orbitron font-bold mb-2 ${
                  activeTab === tab.id ? 'text-primary neon-glow' : 'text-foreground'
                }`}>
                  {tab.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tab.description}
                </p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          key={activeTab} // Re-animate when tab changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="glass-card-hover border border-white/10 rounded-2xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-6 text-left hover:no-underline group">
                  <div className="flex items-start gap-4 w-full">
                    <HelpCircle size={24} className="text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-orbitron font-bold text-foreground group-hover:text-primary transition-colors pr-4">
                        {faq.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="ml-10">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.desc}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="glass-card-hover p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4 neon-glow">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our community and team are here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/SmartSentinelsCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-hover px-6 py-3 rounded-lg bg-primary/20 text-primary font-orbitron font-bold hover:bg-primary/30 transition-all duration-300"
              >
                Join Telegram
              </a>
              <a
                href="mailto:support@smartsentinels.ai"
                className="glass-card-hover px-6 py-3 rounded-lg border border-primary/30 text-primary font-orbitron font-bold hover:bg-primary/10 transition-all duration-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default FAQ;