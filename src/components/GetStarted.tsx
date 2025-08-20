import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets
import familyBusiness from "@/assets/family-business.jpg";
import successfulBusinessman from "@/assets/successful-businessman.jpg";
import { useTranslation } from 'react-i18next';

const GetStarted = () => {
  const { t } = useTranslation('franchise');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    investment: "",
    message: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting get started form submission...');
    
    try {
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        investment: formData.investment,
        message: formData.message || null
      };

      console.log('🚀 Submitting form to edge function...');
      console.log('📋 Submission data:', submissionData);

      // Submit through the form-submission edge function
      const { data, error } = await supabase.functions.invoke('form-submission', {
        body: {
          formType: 'get_started_submissions',
          data: submissionData,
          userAgent: navigator.userAgent,
          ipAddress: undefined // Will be determined server-side
        }
      });
      
      console.log('📡 Edge function response:', { data, error });

      if (error) {
        // console.error('Form submission error:', error); // Silenced for production
        throw error;
      }

      toast({
        title: "Form Submitted!",
        description: "Our team will contact you within 24 hours to discuss your ATM franchise opportunity.",
      });
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        location: "",
        investment: "",
        message: ""
      });
    } catch (error) {
      // console.error('Error submitting get started form:', error); // Silenced for production
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const processSteps = [
    {
      step: "1",
      title: t('buttons.submit', 'Submit Application'),
      description: "Fill out our simple form with your details and preferred location for ATM installation."
    },
    {
      step: "2", 
      title: "Consultation Call",
      description: "Our experts will call you within 24 hours to discuss opportunities and answer your questions."
    },
    {
      step: "3",
      title: "Site Evaluation",
      description: "We'll help you identify the best locations and evaluate foot traffic and business potential."
    },
    {
      step: "4",
      title: "Partner Selection", 
      description: "Choose from our verified WLA operators based on your investment capacity and business goals."
    },
    {
      step: "5",
      title: "Setup & Launch",
      description: "Complete documentation, ATM installation, and training to start earning passive income."
    }
  ];

  return (
    <section id="get-started" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Start Your
            <span className="bg-gradient-hero bg-clip-text text-transparent">{t('jsx-text_atm_business')}</span>
            Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take the first step towards financial freedom. Join hundreds of successful franchisees 
            earning passive income through ATM business in rural India.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Form Section */}
          <div>
            <Card className="bg-gradient-card border-0 shadow-professional animate-slide-in-left">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">{t('jsx-text_get_free_consultation')}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('placeholders.fullName', 'Enter your full name')}
                        required
                        className="border-border focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('placeholders.phone', '+91 98765 43210')}
                        required
                        className="border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('placeholders.email', 'your.email@example.com')}
                      required
                      className="border-border focus:border-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                        Preferred Location *
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder={t('prop-string_city_state')}
                        required
                        className="border-border focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="investment" className="block text-sm font-medium text-foreground mb-2">
                        Investment Capacity
                      </label>
                      <select
                        id="investment"
                        name="investment"
                        value={formData.investment}
                        onChange={handleChange}
                        className="w-full p-3 border border-border rounded-md focus:border-primary focus:outline-none bg-background text-foreground"
                      >
                        <option value="">{t('jsx-text_select_range')}</option>
                        <option value={t('prop-string_23lakhs')}>{t('jsx-text_23_lakhs')}</option>
                        <option value={t('prop-string_34lakhs')}>{t('jsx-text_34_lakhs')}</option>
                        <option value={t('prop-string_45lakhs')}>{t('jsx-text_45_lakhs')}</option>
                        <option value={t('prop-string_5pluslakhs')}>{t('jsx-text_5_lakhs')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Additional Information
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('prop-string_tell_us_about_your_business_goals_timeli')}
                      rows={4}
                      className="border-border focus:border-primary"
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full bg-gradient-hero text-primary-foreground shadow-professional">{t('jsx-text_get_free_consultation')}<ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
                
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>{t('jsx-text_100_free')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>{t('jsx-text_no_obligations')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>{t('jsx-text_expert_guidance')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process & Image Section */}
          <div className="space-y-8 animate-slide-in-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={familyBusiness}
                  alt={t('prop-string_rural_family_atm_business')}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h4 className="text-lg font-bold mb-1">{t('jsx-text_family_business_success')}</h4>
                    <p className="text-sm opacity-90">{t('jsx-text_building_generational_wealth')}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={successfulBusinessman}
                  alt={t('prop-string_successful_atm_franchise_owner')}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h4 className="text-lg font-bold mb-1">{t('jsx-text_individual_success')}</h4>
                    <p className="text-sm opacity-90">{t('jsx-text_your_entrepreneurial_journey')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">{t('jsx-text_simple_5step_process')}</h3>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <Card className="bg-gradient-card border-0 shadow-soft text-center hover:shadow-professional transition-all">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('jsx-text_call_us')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('jsx-text_speak_with_our_experts')}</p>
              <p className="font-medium text-primary">{t('jsx-text_91_9072380076')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center hover:shadow-success transition-all">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('jsx-text_email_us')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('jsx-text_get_detailed_information')}</p>
              <p className="font-medium text-primary">{t('jsx-text_atmfranchisepixellpaycom')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center hover:shadow-professional transition-all">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('jsx-text_visit_office')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('jsx-text_meet_our_team')}</p>
              <p className="font-medium text-primary">{t('testimonials.items.priya.location', 'Bangalore, Karnataka')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;