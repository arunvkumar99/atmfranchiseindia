import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Users, Banknote, Target, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import heroRuralATM from "@/assets/hero-rural-atm.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative py-20 bg-gradient-modern-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-3xl shadow-modern border border-white/10">
              <img
                src={heroRuralATM}
                alt="Young Rural ATM Business Owner in India"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                <div className="text-white p-12 max-w-3xl">
                  <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                    Start Your ATM 
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                      Franchise Business!
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed opacity-90">
                    Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Button size="lg" className="bg-gradient-accent-blue hover:shadow-glow-modern text-white px-8 py-6 text-lg rounded-full shadow-glass border border-white/20 backdrop-blur-sm transition-all duration-500 hover:scale-105" asChild>
                      <Link to="/become-franchise">Get Started</Link>
                    </Button>
                    <Button size="lg" className="bg-gradient-accent-purple hover:shadow-glow-modern text-white px-8 py-6 text-lg rounded-full shadow-glass border border-white/20 backdrop-blur-sm transition-all duration-500 hover:scale-105" asChild>
                      <Link to="/submit-location">Submit Location</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="group bg-gradient-glass backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-glass hover:shadow-glow-modern transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-2">50%</div>
              <div className="text-blue-100 font-medium">Return on Investment</div>
            </div>
            
            <div className="group bg-gradient-glass backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-glass hover:shadow-glow-modern transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-2">200+</div>
              <div className="text-blue-100 font-medium">ATMs Installed</div>
            </div>
            
            <div className="group bg-gradient-glass backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-glass hover:shadow-glow-modern transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-accent-green rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-2">100%</div>
              <div className="text-blue-100 font-medium">Transparent Process</div>
            </div>
            
            <div className="group bg-gradient-glass backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-glass hover:shadow-glow-modern transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-white mb-2">24/7</div>
              <div className="text-blue-100 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ATM Franchise India - Simple Text Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why ATM Franchise India ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Trusted expertise and comprehensive support for your ATM franchise journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Trusted ATM Franchise Information</h3>
                    <p className="text-muted-foreground">
                      Gain accurate and verified insights into the ATM industry. As a regulated sector, the ATM business often sees widespread misinformation. Our representatives ensure you receive reliable, fact-based guidance to make informed franchise decisions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Expert Guidance on WLA Operators</h3>
                    <p className="text-muted-foreground">
                      Let us help you choose the right White Label ATM partner. Many operators exaggerate their offerings and mislead investors. We provide unbiased comparisons of all major WLA operators—highlighting their strengths and weaknesses—to ensure you find the perfect fit for your business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Boost Your Digital Presence</h3>
                    <p className="text-muted-foreground">
                      Already running an ATM franchise? Register with us to increase your digital reach and enhance your online branding. Connect with more customers and grow your visibility in the market.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">End-to-End Franchise Support</h3>
                    <p className="text-muted-foreground">
                      With 4+ years of experience across all WLA brands, we handle everything: Franchise onboarding, Training & operational setup, Local promotions & brand visibility, Technical support & troubleshooting, Bank account settlements, Dispute resolution with WLA operators. We're your one-stop solution for ATM business success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Banner */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-primary-foreground border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">
                 <div className="flex items-center justify-center gap-4 mb-4">
                   <img 
                     src="/lovable-uploads/56a47420-a61b-4533-8c38-19991c252f62.png" 
                     alt="ATM Franchise India Logo" 
                     className="h-16 w-auto object-contain"
                   />
                   <span className="text-2xl font-bold">Entering New Horizons with 200+ ATM across South India</span>
                 </div>
              </h3>
              <p className="text-xl mb-6 opacity-90">
                Start, Grow, and Succeed with ATM Franchise India!
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/become-franchise" className="flex items-center gap-2">
                  Get Started Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;