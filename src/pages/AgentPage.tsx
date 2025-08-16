
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Target, CheckCircle, MapPin, Phone, Mail, Building, Award, ArrowUp, Shield } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import { AgentFormProgressive } from "@/components/AgentFormProgressive";
import { SocialProofElements } from "@/components/SocialProofElements";

const AgentPage = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join the <span className="text-primary font-bold">Sahasra Network Agent Team</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            We are on a mission to build India's largest independent ATM franchise network — and we're looking for passionate, 
            driven agents to be part of this journey. As a Sahasra Network Agent, you'll play a key role in expanding financial 
            inclusion by helping entrepreneurs set up White Label ATMs in their communities.
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
            <Badge variant="secondary" className="bg-gradient-success text-secondary-foreground">
              <Users className="w-4 h-4 mr-1" />
              Growing Agent Network
            </Badge>
            <Badge variant="secondary" className="bg-gradient-success text-secondary-foreground">
              <Award className="w-4 h-4 mr-1" />
              4+ Years Experience
            </Badge>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={businessGrowth}
              alt="ATM Agent Network Growth"
              className="w-full h-[200px] sm:h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="text-white p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">Represent a Trusted Brand</h3>
                <p className="text-sm opacity-90">Earn attractive commissions and make meaningful impact while growing your career with us</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits for Agents */}
        <div className="mb-8">
          <div className="bg-muted/50 border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="relative p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Benefits for Agents Who Join the Sahasra Network</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Attractive Earning Potential</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Earn competitive commissions for every successful franchise onboarding. The more you help build the network, the more you earn.</p>
                </div>
                
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Flexible Work Opportunity</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Work at your own pace, full-time or part-time, in your preferred region.</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">National Mission Impact</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Help expand India's largest independent ATM franchise network and promote financial inclusion.</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Training & Marketing Support</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Access professional training, marketing tools, and digital resources to help you succeed.</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Strong Brand Backing</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">ATM Franchise India with 4+ years experience and partnerships with trusted RBI-licensed WLA operators.</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ArrowUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Growth Path</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">High performers can advance to regional coordinator or master agent roles, unlocking even greater rewards and leadership opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progressive Form Section */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Social Proof */}
          <div className="lg:col-span-1 space-y-6">
            <SocialProofElements variant="compact" />
            <SocialProofElements variant="stats" />
            <SocialProofElements variant="testimonials" />
            <SocialProofElements variant="trust-signals" />
          </div>

          {/* Main Column - Progressive Form */}
          <div className="lg:col-span-3">
            <AgentFormProgressive />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-gradient-card border-0 shadow-soft text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Call Us</h4>
              <p className="text-muted-foreground text-sm mb-2">Speak with our experts</p>
              <p className="font-medium text-primary">+91 9072380076</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Email Us</h4>
              <p className="text-muted-foreground text-sm mb-2">Get detailed information</p>
              <p className="font-medium text-primary">atmfranchise@pixellpay.com</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Visit Office</h4>
              <p className="text-muted-foreground text-sm mb-2">Meet our team</p>
              <p className="font-medium text-primary">Bangalore, Karnataka</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
