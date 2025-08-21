import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { StatsGrid } from '@/components/ui/counting-number';
import { RatingDisplay, TrustRating } from '@/components/ui/rating';
import { GlassCard, GlassStatCard } from '@/components/ui/glass-card';
import { Shield, Award, Users, TrendingUp, CheckCircle, Star, Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample testimonials data
const testimonials = [
  {
    quote: "The ATM franchise transformed my small grocery store into a profitable business hub. The additional footfall alone increased my store sales by 40%.",
    name: "Rajesh Kumar",
    designation: "Franchise Owner",
    location: "Mumbai, Maharashtra",
    src: "/assets/successful-businessman.jpg",
    rating: 5,
    investment: "₹2.5 Lakhs",
    revenue: "₹45,000"
  },
  {
    quote: "Professional support from day one. The team helped with location selection, installation, and continues to provide excellent technical support.",
    name: "Priya Sharma",
    designation: "Business Owner",
    location: "Delhi NCR",
    src: "/assets/young-business-owner.jpg",
    rating: 5,
    investment: "₹3 Lakhs",
    revenue: "₹52,000"
  },
  {
    quote: "Best passive income investment I've made. The ATM runs itself, and I get consistent monthly returns without any operational hassles.",
    name: "Amit Patel",
    designation: "Entrepreneur",
    location: "Ahmedabad, Gujarat",
    src: "/assets/young-atm-entrepreneur.jpg",
    rating: 5,
    investment: "₹2 Lakhs",
    revenue: "₹38,000"
  },
  {
    quote: "Rural area ATM deployment was a game-changer for our village. We're serving 500+ families daily and earning substantial commission.",
    name: "Suresh Reddy",
    designation: "Village Entrepreneur",
    location: "Warangal, Telangana",
    src: "/assets/rural-shop-owner.jpg",
    rating: 5,
    investment: "₹1.8 Lakhs",
    revenue: "₹35,000"
  }
];

// Live statistics
const stats = [
  {
    value: 15000,
    label: "Active ATMs",
    description: "Across India",
    icon: <Building className="w-5 h-5 text-primary" />,
    prefix: "",
    suffix: "+",
    trend: { value: 23, isPositive: true }
  },
  {
    value: 850,
    label: "Cities Covered",
    description: "Pan India presence",
    icon: <MapPin className="w-5 h-5 text-primary" />,
    prefix: "",
    suffix: "+",
    trend: { value: 15, isPositive: true }
  },
  {
    value: 45000,
    label: "Avg. Monthly Income",
    description: "Per ATM",
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    prefix: "₹",
    suffix: "",
    trend: { value: 12, isPositive: true }
  },
  {
    value: 98,
    label: "Customer Satisfaction",
    description: "Based on 5000+ reviews",
    icon: <Star className="w-5 h-5 text-primary" />,
    prefix: "",
    suffix: "%",
    trend: { value: 2, isPositive: true }
  }
];

// Partner logos
const partners = [
  { name: "Vakrangee", logo: "/assets/Vakrangee_Limited_Logo.png", description: "Market Leader" },
  { name: "Findi", logo: "/assets/findi.png", description: "Fast Growing" },
  { name: "India One", logo: "/assets/India1Logo.jpg", description: "Reliable Network" },
  { name: "EPS Bancs", logo: "/assets/EPS.png", description: "Proven Track Record" }
];

// Trust badges
const trustBadges = [
  { icon: <Shield />, label: "RBI Compliant", description: "100% regulatory compliance" },
  { icon: <Award />, label: "Industry Leader", description: "15+ years of excellence" },
  { icon: <Users />, label: "24/7 Support", description: "Dedicated customer service" },
  { icon: <CheckCircle />, label: "Guaranteed Returns", description: "Assured monthly income" }
];

export const PremiumTrustSignals: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-24 py-16">
      {/* Hero Trust Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent mb-4">
              Trusted by 15,000+ Franchise Owners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join India's fastest-growing ATM franchise network with guaranteed returns and professional support
            </p>
            
            {/* Overall Rating */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <RatingDisplay rating={4.8} reviews={5247} size="lg" showBadge />
            </div>
          </motion.div>

          {/* Live Statistics Dashboard */}
          <StatsGrid stats={stats} className="mb-16" />

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  variant="elevated" 
                  className="p-6 text-center hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    {React.cloneElement(badge.icon, { className: 'w-6 h-6 text-primary' })}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{badge.label}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real Success Stories from Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear directly from franchise owners who have transformed their financial future
          </p>
        </motion.div>

        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      {/* WLA Partner Showcase */}
      <section className="bg-gradient-to-r from-primary/5 to-gold/5 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Trusted WLA Partners
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partnering with India's leading White Label ATM operators for maximum reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto mx-auto mb-4 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <h4 className="font-semibold text-center">{partner.name}</h4>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {partner.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <TrustRating
            score={98}
            label="Operational Excellence"
            description="Industry-leading uptime and service quality"
            icon={<Shield className="w-5 h-5 text-primary" />}
          />
          <TrustRating
            score={95}
            label="Partner Satisfaction"
            description="Based on quarterly partner surveys"
            icon={<Users className="w-5 h-5 text-primary" />}
          />
          <TrustRating
            score={100}
            label="Compliance Score"
            description="Full RBI and regulatory compliance"
            icon={<CheckCircle className="w-5 h-5 text-primary" />}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <GlassCard variant="premium" className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Your Success Story?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 15,000+ successful franchise owners earning consistent monthly income
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Apply for Franchise
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Download Brochure
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
};

export default PremiumTrustSignals;