"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, User, ExternalLink } from "lucide-react";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@ugenpro.com",
      description: "Get help with your account and technical issues",
      color: "from-blue-500 to-blue-600",
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
    <section id="contact" className="relative py-16 md:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent/15 to-tertiary/15 rounded-full blur-2xl animate-pulse opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-tertiary/20 to-primary/20 rounded-full blur-xl animate-pulse opacity-40" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border-2 border-primary/60 hover:border-primary text-sm font-bold mb-6 transition-all duration-300 hover:scale-105">
            <MessageCircle className="w-4 h-4 text-primary" />
            Contact Us
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            <span className="text-shadow-lg">Get in</span>
            <span className="gradient-text-rainbow text-shadow-lg ml-4">Touch</span>
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're here to help you succeed. Reach out to our team through any of the channels below.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="group relative overflow-hidden cursor-pointer transition-all duration-500 border-2 border-border rounded-2xl bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 h-full">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="p-6 space-y-4 h-full flex flex-col relative z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3 flex-1">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground">
                        {contact.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {contact.description}
                      </p>
                      
                      {/* Contact info */}
                      <div className="space-y-2">
                        <span className="block font-mono text-xs bg-card/50 px-2 py-1 rounded border border-border/50">
                          {contact.value}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <a
                      href={contact.actionLink}
                      target={contact.actionLink.startsWith('http') ? '_blank' : '_self'}
                      rel={contact.actionLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group/btn relative w-full p-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary hover:to-accent border border-primary/20 hover:border-primary transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <contact.actionIcon className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors duration-200" />
                        <span className="text-xs font-semibold text-primary group-hover/btn:text-white transition-colors duration-200">
                          {contact.actionText}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
