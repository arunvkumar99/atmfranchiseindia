import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, SUBJECT_VALIDATION, MESSAGE_VALIDATION } from "@/hooks/useFormValidation";
import { CONTACT_INFO } from "@/lib/contactInfo";
import { supabase } from "@/integrations/supabase/client";

const ContactUsSupabase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const { 
    errors, 
    validateForm, 
    validateSingleField, 
    clearFieldError
  } = useFormValidation({ 
    rules: [
      NAME_VALIDATION,
      EMAIL_VALIDATION, 
      PHONE_VALIDATION,
      SUBJECT_VALIDATION,
      MESSAGE_VALIDATION
    ]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation when user types (immediate feedback)
    if (value.trim()) {
      validateSingleField(field, value);
    } else if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(formData)) {
      const errorFields = Object.keys(errors).filter(key => errors[key]);
      const errorMessage = errorFields.length > 0 
        ? `Please correct the following fields: ${errorFields.join(', ')}`
        : 'Please fill all required fields correctly';
      
      toast({
        title: "❌ Validation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Submitting contact form to Supabase:', formData);

      // Submit to Supabase
      const { data: submissionData, error: submissionError } = await supabase
        .from('contact_submissions')
        .insert([formData])
        .select()
        .single();

      if (submissionError) {
        console.error('❌ Supabase submission error:', submissionError);
        throw new Error('Failed to submit form to database');
      }

      console.log('✅ Successfully submitted to Supabase:', submissionData);

      // Send to Google Sheets
      try {
        const { error: sheetsError } = await supabase.functions.invoke('google-sheets-integration', {
          body: {
            tableName: 'contact_submissions',
            data: formData
          }
        });

        if (sheetsError) {
          console.warn('⚠️ Google Sheets sync failed:', sheetsError);
          // Don't fail the main submission for Google Sheets errors
        } else {
          console.log('✅ Successfully synced to Google Sheets');
        }
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets integration error:', sheetsError);
        // Don't fail the main submission for Google Sheets errors
      }
      
      setIsSubmitted(true);
      
      // Scroll to top and focus on success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const successElement = document.querySelector('[data-success-message]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      toast({
        title: "✅ Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        duration: 6000
      });
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      toast({
        title: "❌ Submission Failed",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-14">
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Contact Us</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional animate-fade-in" data-success-message>
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  Message Sent Successfully!
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="min-h-[48px]"
                  >
                    Send Another Message
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="min-h-[48px]"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-14">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Contact Us</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to start your ATM franchise journey? Have questions about our services? 
              We're here to help you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
                <CardHeader>
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-foreground">Call Us</h4>
                      <p className="font-body text-primary">{CONTACT_INFO.phoneFormatted}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-foreground">Email Us</h4>
                      <p className="font-body text-primary">{CONTACT_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-foreground mb-2">Visit Us</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <p className="font-semibold text-foreground">{CONTACT_INFO.corporateOffice.name}</p>
                          <p className="text-xs">{CONTACT_INFO.corporateOffice.cin}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Corporate Office:</p>
                          <p className="whitespace-pre-line">{CONTACT_INFO.corporateOffice.address}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Registered Office:</p>
                          <p className="whitespace-pre-line">{CONTACT_INFO.registeredOffice.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Section */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
                <CardHeader>
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">Our Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-64 rounded-lg overflow-hidden relative cursor-pointer group">
                    <img 
                      src="/lovable-uploads/a497de35-26bb-4c39-bb24-b3b97ca585b7.png" 
                      alt="Google Maps view of Kochi, Kerala showing PIXELLPAY Corporate Office location"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => window.open('https://maps.google.com/?q=Kochi,Kerala,India', '_blank')}
                    />
                    
                    {/* Location pin overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Location badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-foreground">PIXELLPAY Corporate Office</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Kochi, Kerala</p>
                    </div>
                    
                    {/* Click to view overlay */}
                    <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Click to view on Google Maps
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right - Contact Form */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-xl text-foreground">Send us a Message</CardTitle>
                <p className="font-body text-muted-foreground text-sm">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                        className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="10-digit mobile number"
                        required
                        className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="What can we help you with?"
                        required
                        className={errors.subject ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Please describe your inquiry in detail..."
                      className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full min-h-[48px] text-lg font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSupabase;