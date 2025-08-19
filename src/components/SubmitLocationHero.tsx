import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CheckCircle, TrendingUp, Shield, Award, Star, Users, Zap, Target, BarChart3, ArrowRight, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets
import passiveIncomeIcon from "@/assets/passive-income-icon.jpg";

const SubmitLocationHero = () => {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    locationDescription: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('location_submissions')
        .insert({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          location_description: formData.locationDescription,
          whatsapp_phone: formData.phone,
          location_type: "Commercial",
          monthly_footfall: "Unknown",
          nearby_competition: "Unknown", 
          space_ownership: "Unknown",
          space_size: "Unknown"
        });

      if (error) throw error;

      toast({
        title: "Location Submitted Successfully!",
        description: "Thank you! Our team will analyze your location and contact you soon.",
      });

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        state: "",
        city: "",
        locationDescription: ""
      });
    } catch (error) {
      console.error('Error submitting location:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen pt-14">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image with Overlay */}
        <div className="relative h-[500px] md:h-[600px]">
          <div className="absolute inset-0">
            <img
              src={passiveIncomeIcon}
              alt="ATM Location Success"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3 mb-6">
                <Target className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-medium text-blue-100">Expert Location Analysis</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Submit Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Perfect Location
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                Get professional location analysis and maximize your ATM business potential with our expert evaluation.
              </p>
              
              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                  onClick={() => document.getElementById('location-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm">Trusted by 1000+ partners</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Stats */}
          <div className="absolute bottom-8 right-8 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Benefits Strip */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Expert Analysis</h3>
                <p className="text-gray-600">Professional evaluation of your location's ATM potential at no cost</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ROI Projection</h3>
                <p className="text-gray-600">Detailed revenue forecasts and potential analysis reports</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Turnaround</h3>
                <p className="text-gray-600">Professional response and analysis within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Why Location Analysis Matters */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 bg-blue-600 text-white rounded-full px-8 py-4 mb-6 shadow-lg">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Why Location Analysis Matters</h2>
                </div>
                <p className="text-lg text-blue-800 max-w-3xl mx-auto">
                  Strategic location selection is the foundation of ATM business success. Our data-driven analysis ensures optimal placement for maximum returns.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">3-5x Higher Transactions</h3>
                  <p className="text-blue-700 leading-relaxed">Strategic locations generate significantly more daily transactions than poorly chosen sites, ensuring better revenue streams.</p>
                </div>
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Predictable Revenue</h3>
                  <p className="text-blue-700 leading-relaxed">Well-positioned ATMs ensure consistent monthly income and faster return on investment with reliable cash flow.</p>
                </div>
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Risk-Free Validation</h3>
                  <p className="text-blue-700 leading-relaxed">Avoid costly mistakes by validating location viability before investing, saving thousands in potential losses.</p>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-8 py-4 shadow-lg">
                  <p className="font-semibold text-lg">
                    Our Mission: Maximize your ROI through proven ATM placement strategies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Analysis Form */}
        <div id="location-form" className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Quick Submission</span>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Submit Your Location</CardTitle>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill out the form below and receive professional analysis within 24-48 hours
              </p>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold text-gray-800">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder={t('placeholders.fullName', 'Enter your full name')}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-semibold text-gray-800">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder={t('placeholders.phone', 'Enter your phone number')}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-800">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-colors"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base">
                        <SelectValue placeholder={t('placeholders.state', 'Select your state')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-semibold text-gray-800">City</Label>
                    <Input 
                      id="city" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={t('placeholders.city', 'Enter your city')}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-base transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location" className="text-base font-semibold text-gray-800">Location Description</Label>
                  <Textarea 
                    id="location" 
                    value={formData.locationDescription}
                    onChange={(e) => handleInputChange('locationDescription', e.target.value)}
                    placeholder="Describe your proposed ATM location with details about footfall, nearby businesses, accessibility, and why you think it's ideal..."
                    className="border-2 border-gray-200 focus:border-blue-500 rounded-xl min-h-[120px] text-base transition-colors resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl shadow-xl transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <MapPin className="w-6 h-6 mr-3" />
                  Submit for Expert Analysis
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700">Trusted by 1000+ Partners</span>
            </div>
            <blockquote className="text-lg text-gray-700 max-w-3xl mx-auto mb-4 italic">
              "The location analysis was incredibly thorough and professional. My ATM generates 40% more transactions than initially projected. Outstanding service and expertise!"
            </blockquote>
            <cite className="text-sm text-gray-500 font-medium">— Rajesh Kumar, ATM Franchise Partner, Mumbai</cite>
            
            {/* Contact Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Need Help? Contact Us</h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-blue-800">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 8089447171</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>pixellpay.co.in@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitLocationHero;
