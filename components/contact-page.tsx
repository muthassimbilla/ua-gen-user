"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, User, Send, ExternalLink } from "lucide-react";

export function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@ugenpro.com",
      description: "Get help with your account and technical issues",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      actionText: "Send Email",
      actionLink: "mailto:support@ugenpro.com",
      actionIcon: Mail
    },
    {
      icon: MessageCircle,
      title: "Telegram Channel",
      value: "@ugenpro_support",
      description: "Join our community for updates and discussions",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      actionText: "Join Channel",
      actionLink: "https://t.me/ugenpro_support",
      actionIcon: ExternalLink
    },
    {
      icon: User,
      title: "Admin Account",
      value: "@ugenpro_admin",
      description: "Direct contact with our admin team",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      actionText: "Contact Admin",
      actionLink: "https://t.me/ugenpro_admin",
      actionIcon: ExternalLink
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/15 to-tertiary/15 rounded-full blur-2xl animate-pulse opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-tertiary/20 to-primary/20 rounded-full blur-xl animate-pulse opacity-40" />
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className={`relative overflow-hidden glass hover:glass-strong shadow-glow hover:shadow-glow-accent border-2 ${contact.borderColor} rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:-translate-y-2`}>
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Animated border glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${contact.color} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Icon with enhanced styling */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${contact.color} mb-6 shadow-glow group-hover:shadow-glow-accent transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Title with gradient text */}
                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text transition-all duration-300">
                      {contact.title}
                    </h3>
                    
                    {/* Description with better typography */}
                    <p className="text-base text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {contact.description}
                    </p>
                    
                    {/* Enhanced contact info section */}
                    <div className="space-y-4">
                      <div className="relative">
                        <span className="block font-mono text-base bg-gradient-to-r from-card to-card/80 px-4 py-3 rounded-xl border-2 border-border/50 group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-glow">
                          {contact.value}
                        </span>
                      </div>
                      
                      {/* Action button */}
                      <a
                        href={contact.actionLink}
                        target={contact.actionLink.startsWith('http') ? '_blank' : '_self'}
                        rel={contact.actionLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group/btn relative w-full p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary hover:to-accent border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-glow-accent"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <contact.actionIcon className="w-5 h-5 text-primary group-hover/btn:text-white transition-colors duration-200" />
                          <span className="text-base font-bold text-primary group-hover/btn:text-white transition-colors duration-200">
                            {contact.actionText}
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent/20 rounded-full group-hover:bg-accent/40 transition-colors duration-300" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>


        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="glass shadow-glow border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="gradient-text-rainbow">Need Immediate Help?</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              For urgent issues, join our Telegram channel or contact our admin directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/ugenpro_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Join Telegram
              </a>
              <a
                href="mailto:support@ugenpro.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-glow hover:shadow-glow-accent transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
