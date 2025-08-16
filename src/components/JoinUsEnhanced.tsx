import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, Building, MapPin, Phone, Mail, User, Briefcase, DollarSign, Users, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ruralShopOwner from "@/assets/rural-shop-owner.jpg";
import secureATMKiosk from "@/assets/secure-atm-kiosk.jpg";

const JoinUsEnhanced = () => {
  const [activeTab, setActiveTab] = useState("franchise");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    country: "",
    atmCount: "",
    message: "",
    terms: false,
  });
  
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your submission was successful.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          city: "",
          state: "",
          country: "",
          atmCount: "",
          message: "",
          terms: false,
        });
      } else {
        toast({
          title: "Error!",
          description: "There was an error submitting the form.",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Network error occurred.",
      });
    }
  };

  return (
    <section id="join-us" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Join Our
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Growing Network</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Multiple opportunities to partner with us and build a successful business in the ATM industry
          </p>
        </div>

        {/* Tabs for different join options */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="franchise" className="text-sm sm:text-base">
                <Building className="w-4 h-4 mr-2" />
                Become Franchise
              </TabsTrigger>
              <TabsTrigger value="agent" className="text-sm sm:text-base">
                <Users className="w-4 h-4 mr-2" />
                Become Agent
              </TabsTrigger>
              <TabsTrigger value="influencer" className="text-sm sm:text-base">
                <Target className="w-4 h-4 mr-2" />
                Become Influencer
              </TabsTrigger>
            </TabsList>

            {/* Franchise Content */}
            <TabsContent value="franchise" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="bg-gradient-card border-0 shadow-professional">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Building className="w-6 h-6 mr-3 text-primary" />
                      ATM Franchise Opportunity
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Own and operate your ATM business with complete support from our team.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-hero rounded-lg text-primary-foreground">
                        <div className="text-2xl font-bold">₹2-5L</div>
                        <div className="text-sm opacity-90">Investment</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-success rounded-lg text-secondary-foreground">
                        <div className="text-2xl font-bold">50%</div>
                        <div className="text-sm opacity-90">ROI Potential</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Complete ATM setup and installation",
                        "RBI licensed partner selection",
                        "Site evaluation and approval",
                        "Training and ongoing support",
                        "Marketing and branding assistance"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-foreground text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <img
                    src={secureATMKiosk}
                    alt="Secure ATM Kiosk Setup"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <Card className="bg-gradient-card border-0 shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Requirements for Franchise
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Investment capacity of ₹2-5 lakhs</p>
                        <p>• Suitable location for ATM installation</p>
                        <p>• Basic business understanding</p>
                        <p>• Commitment to long-term partnership</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Agent Content */}
            <TabsContent value="agent" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="bg-gradient-card border-0 shadow-professional">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Users className="w-6 h-6 mr-3 text-primary" />
                      Become Our Sales Agent
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Earn commissions by referring customers to our ATM franchise program.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-success rounded-lg text-secondary-foreground">
                        <div className="text-2xl font-bold">₹5-15K</div>
                        <div className="text-sm opacity-90">Per Referral</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-accent rounded-lg text-accent-foreground">
                        <div className="text-2xl font-bold">No</div>
                        <div className="text-sm opacity-90">Investment</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Earn commission for every successful referral",
                        "Flexible working hours and location",
                        "Complete sales training provided",
                        "Marketing materials and support",
                        "Performance-based incentives"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-foreground text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <img
                    src={ruralShopOwner}
                    alt="Sales Agent Opportunity"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <Card className="bg-gradient-card border-0 shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Agent Requirements
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Good communication skills</p>
                        <p>• Local network and connections</p>
                        <p>• Basic understanding of business</p>
                        <p>• Commitment to ethical practices</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Influencer Content */}
            <TabsContent value="influencer" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="bg-gradient-card border-0 shadow-professional">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Target className="w-6 h-6 mr-3 text-primary" />
                      Digital Influencer Program
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Leverage your social media presence to promote ATM franchise opportunities.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-accent rounded-lg text-accent-foreground">
                        <div className="text-2xl font-bold">₹2-10K</div>
                        <div className="text-sm opacity-90">Per Post</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-hero rounded-lg text-primary-foreground">
                        <div className="text-2xl font-bold">20%</div>
                        <div className="text-sm opacity-90">Revenue Share</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Content creation support and guidelines",
                        "Revenue sharing on conversions",
                        "Social media strategy assistance",
                        "Exclusive promotional materials",
                        "Performance tracking and analytics"
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-foreground text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div className="bg-gradient-card rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-foreground mb-4">Social Media Reach</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">1K+</div>
                        <div className="text-sm text-muted-foreground">Minimum Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary">5%+</div>
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-gradient-card border-0 shadow-soft">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        Influencer Requirements
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Active social media presence</p>
                        <p>• Content creation skills</p>
                        <p>• Audience interested in business opportunities</p>
                        <p>• Consistent posting schedule</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-0 shadow-soft text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Call Us</h4>
                <p className="text-muted-foreground text-sm mb-2">Speak with our experts</p>
                <p className="font-medium text-primary">+91 9072380076</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-soft text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Email Us</h4>
                <p className="text-muted-foreground text-sm mb-2">Get detailed information</p>
                <p className="font-medium text-primary">atmfranchise@pixellpay.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-soft text-center">
              <CardContent className="p-6">
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
    </section>
  );
};

export default JoinUsEnhanced;
