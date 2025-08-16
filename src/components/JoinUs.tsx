import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, Building, MapPin, Phone, Mail, User, Briefcase, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ruralShopOwner from "@/assets/rural-shop-owner.jpg";

const JoinUs = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    
    // Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    
    // Business Information
    businessType: "",
    experienceYears: "",
    currentOccupation: "",
    annualIncome: "",
    
    // ATM Franchise Details
    investmentCapacity: "",
    preferredLocation: "",
    locationOwnership: "",
    expectedFootfall: "",
    nearbyBanks: "",
    competitorATMs: "",
    
    // Financial Information
    bankName: "",
    accountType: "",
    panCard: "",
    gstNumber: "",
    
    // Additional Information
    referenceSource: "",
    previousFranchise: "",
    timelineToStart: "",
    additionalComments: "",
    
    // Agreements
    agreedToTerms: false,
    agreedToMarketing: false,
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please agree to terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Application Submitted Successfully!",
      description: "Our franchise team will review your application and contact you within 24-48 hours.",
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      businessType: "",
      experienceYears: "",
      currentOccupation: "",
      annualIncome: "",
      investmentCapacity: "",
      preferredLocation: "",
      locationOwnership: "",
      expectedFootfall: "",
      nearbyBanks: "",
      competitorATMs: "",
      bankName: "",
      accountType: "",
      panCard: "",
      gstNumber: "",
      referenceSource: "",
      previousFranchise: "",
      timelineToStart: "",
      additionalComments: "",
      agreedToTerms: false,
      agreedToMarketing: false,
    });
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const benefits = [
    {
      icon: IndianRupee,
      title: "High ROI Potential",
      description: "Earn up to 50% return on investment with transparent revenue sharing"
    },
    {
      icon: Building,
      title: "Low Competition", 
      description: "Only 15 ATMs per 1 lakh people - huge market opportunity"
    },
    {
      icon: CheckCircle,
      title: "Complete Support",
      description: "End-to-end assistance from setup to operations"
    },
    {
      icon: User,
      title: "Proven Track Record",
      description: "Join 500+ successful franchisees across India"
    }
  ];

  const jobOpportunities = [
    {
      icon: User,
      title: "Join as Agent",
      description: "Become a field sales agent and earn commission",
      link: "/join-us/agent"
    },
    {
      icon: Building,
      title: "Join as Franchise", 
      description: "Start your own ATM business",
      link: "/become-franchise"
    },
    {
      icon: Briefcase,
      title: "Join as Employee",
      description: "Build your career with full-time positions",
      link: "/join-us/jobs"
    }
  ];

  return (
    <section id="join-us" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Join the
            <span className="bg-gradient-hero bg-clip-text text-transparent"> ATM Franchise </span>
            Revolution
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Choose your path to success with ATM Franchise India
          </p>
          
          {/* Job Opportunities Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            {jobOpportunities.map((opportunity, index) => {
              const IconComponent = opportunity.icon;
              return (
                <div 
                  key={index} 
                  className="bg-gradient-card rounded-xl p-8 shadow-soft animate-scale-in hover:shadow-professional transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => window.location.href = opportunity.link}
                >
                  <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{opportunity.title}</h3>
                  <p className="text-muted-foreground mb-6">{opportunity.description}</p>
                  <ArrowRight className="w-5 h-5 text-primary mx-auto group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              );
            })}
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index} 
                  className="bg-gradient-card rounded-xl p-6 shadow-soft animate-scale-in"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-0 shadow-professional animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-primary" />
                  ATM Franchise Application Form
                </CardTitle>
                <p className="text-muted-foreground">
                  Please provide accurate information. All fields marked with * are mandatory.
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Alternate Phone
                        </label>
                        <Input
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={(e) => handleChange('alternatePhone', e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Date of Birth *
                        </label>
                        <Input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      Address Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address Line 1 *
                        </label>
                        <Input
                          value={formData.addressLine1}
                          onChange={(e) => handleChange('addressLine1', e.target.value)}
                          placeholder="House/Building number, Street name"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address Line 2
                        </label>
                        <Input
                          value={formData.addressLine2}
                          onChange={(e) => handleChange('addressLine2', e.target.value)}
                          placeholder="Area, Landmark"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State *
                        </label>
                        <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="bihar">Bihar</SelectItem>
                            <SelectItem value="gujarat">Gujarat</SelectItem>
                            <SelectItem value="haryana">Haryana</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="kerala">Kerala</SelectItem>
                            <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="odisha">Odisha</SelectItem>
                            <SelectItem value="punjab">Punjab</SelectItem>
                            <SelectItem value="rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="telangana">Telangana</SelectItem>
                            <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="west-bengal">West Bengal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          PIN Code *
                        </label>
                        <Input
                          value={formData.pincode}
                          onChange={(e) => handleChange('pincode', e.target.value)}
                          placeholder="Enter 6-digit PIN code"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <Building className="w-5 h-5 mr-2 text-primary" />
                      Business Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Business Type *
                        </label>
                        <Select value={formData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="proprietorship">Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="private-limited">Private Limited</SelectItem>
                            <SelectItem value="llp">LLP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Business Experience *
                        </label>
                        <Select value={formData.experienceYears} onValueChange={(value) => handleChange('experienceYears', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-5">2-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="11-15">11-15 years</SelectItem>
                            <SelectItem value="15+">15+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current Occupation *
                        </label>
                        <Input
                          value={formData.currentOccupation}
                          onChange={(e) => handleChange('currentOccupation', e.target.value)}
                          placeholder="e.g., Shop Owner, Farmer, Employee"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Annual Income Range *
                        </label>
                        <Select value={formData.annualIncome} onValueChange={(value) => handleChange('annualIncome', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below-2l">Below ₹2 Lakhs</SelectItem>
                            <SelectItem value="2l-5l">₹2-5 Lakhs</SelectItem>
                            <SelectItem value="5l-10l">₹5-10 Lakhs</SelectItem>
                            <SelectItem value="10l-25l">₹10-25 Lakhs</SelectItem>
                            <SelectItem value="25l+">₹25+ Lakhs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* ATM Franchise Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      ATM Franchise Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Investment Capacity *
                        </label>
                        <Select value={formData.investmentCapacity} onValueChange={(value) => handleChange('investmentCapacity', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select investment range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-3l">₹2-3 Lakhs</SelectItem>
                            <SelectItem value="3-4l">₹3-4 Lakhs</SelectItem>
                            <SelectItem value="4-5l">₹4-5 Lakhs</SelectItem>
                            <SelectItem value="5l+">₹5+ Lakhs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Preferred ATM Location *
                        </label>
                        <Input
                          value={formData.preferredLocation}
                          onChange={(e) => handleChange('preferredLocation', e.target.value)}
                          placeholder="Area/Village where you want ATM"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Location Ownership *
                        </label>
                        <Select value={formData.locationOwnership} onValueChange={(value) => handleChange('locationOwnership', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Do you own the location?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owned">I own the location</SelectItem>
                            <SelectItem value="can-arrange">I can arrange the location</SelectItem>
                            <SelectItem value="need-help">Need help finding location</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expected Daily Footfall
                        </label>
                        <Select value={formData.expectedFootfall} onValueChange={(value) => handleChange('expectedFootfall', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Expected daily visitors" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50-100">50-100 people</SelectItem>
                            <SelectItem value="100-200">100-200 people</SelectItem>
                            <SelectItem value="200-500">200-500 people</SelectItem>
                            <SelectItem value="500+">500+ people</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nearby Banks
                        </label>
                        <Input
                          value={formData.nearbyBanks}
                          onChange={(e) => handleChange('nearbyBanks', e.target.value)}
                          placeholder="Names of banks within 5km"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Competitor ATMs
                        </label>
                        <Input
                          value={formData.competitorATMs}
                          onChange={(e) => handleChange('competitorATMs', e.target.value)}
                          placeholder="Number of ATMs in 2km radius"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <IndianRupee className="w-5 h-5 mr-2 text-primary" />
                      Financial Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Primary Bank *
                        </label>
                        <Input
                          value={formData.bankName}
                          onChange={(e) => handleChange('bankName', e.target.value)}
                          placeholder="Bank name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Account Type *
                        </label>
                        <Select value={formData.accountType} onValueChange={(value) => handleChange('accountType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="current">Current Account</SelectItem>
                            <SelectItem value="cc-od">CC/OD Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          PAN Card Number *
                        </label>
                        <Input
                          value={formData.panCard}
                          onChange={(e) => handleChange('panCard', e.target.value)}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          GST Number (if applicable)
                        </label>
                        <Input
                          value={formData.gstNumber}
                          onChange={(e) => handleChange('gstNumber', e.target.value)}
                          placeholder="GST registration number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      Additional Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          How did you hear about us? *
                        </label>
                        <Select value={formData.referenceSource} onValueChange={(value) => handleChange('referenceSource', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="social-media">Social Media</SelectItem>
                            <SelectItem value="friend-referral">Friend/Family Referral</SelectItem>
                            <SelectItem value="newspaper">Newspaper/Magazine</SelectItem>
                            <SelectItem value="search-engine">Search Engine</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Previous Franchise Experience
                        </label>
                        <Select value={formData.previousFranchise} onValueChange={(value) => handleChange('previousFranchise', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any previous franchise?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes-successful">Yes, successful experience</SelectItem>
                            <SelectItem value="yes-challenges">Yes, faced challenges</SelectItem>
                            <SelectItem value="no">No previous experience</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timeline to Start *
                        </label>
                        <Select value={formData.timelineToStart} onValueChange={(value) => handleChange('timelineToStart', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="When can you start?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="2-3-months">2-3 months</SelectItem>
                            <SelectItem value="3-6-months">3-6 months</SelectItem>
                            <SelectItem value="6-months+">6+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional Comments/Questions
                      </label>
                      <Textarea
                        value={formData.additionalComments}
                        onChange={(e) => handleChange('additionalComments', e.target.value)}
                        placeholder="Any specific questions or additional information you'd like to share..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4 border-t border-border pt-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleChange('agreedToTerms', !!checked)}
                      />
                      <label htmlFor="terms" className="text-sm text-foreground leading-relaxed">
                        I agree to the <span className="text-primary font-medium">Terms & Conditions</span> and confirm that all information provided is accurate and complete. I understand that providing false information may result in application rejection.
                      </label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketing"
                        checked={formData.agreedToMarketing}
                        onCheckedChange={(checked) => handleChange('agreedToMarketing', !!checked)}
                      />
                      <label htmlFor="marketing" className="text-sm text-foreground">
                        I agree to receive marketing communications and updates about ATM franchise opportunities.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-accent-light-blue text-primary-foreground shadow-professional hover:shadow-lg transition-all"
                    >
                      Submit Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Our team will review your application within 24-48 hours and contact you with next steps.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Side Information */}
          <div className="space-y-8 animate-slide-in-right">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <img
                  src={ruralShopOwner}
                  alt="Successful ATM Franchise Owner"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Join 500+ Successful Franchisees
                </h3>
                <p className="text-muted-foreground mb-6">
                  "Starting my ATM franchise was the best business decision I made. The support team guided me through every step, and now I earn steady passive income while serving my community."
                </p>
                <div className="text-sm text-foreground">
                  <strong>Rajesh Kumar</strong><br />
                  <span className="text-muted-foreground">ATM Franchise Owner, Bihar</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-success text-secondary-foreground border-0 shadow-success">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Application Process</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span>Submit detailed application</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span>Initial screening & verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span>Personal interview & site visit</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <span>Approval & agreement signing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <span>Setup, training & launch</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Call Us</p>
                      <p className="text-sm text-muted-foreground">+91 7003554455</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email Us</p>
                      <p className="text-sm text-muted-foreground">contact@atmfranchiseindia.in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;