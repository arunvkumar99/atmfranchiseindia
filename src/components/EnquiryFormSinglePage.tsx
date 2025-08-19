import { useState } from "react";
import { INDIAN_STATES } from "@/lib/stateOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { useFormProgress } from "@/hooks/useFormProgress";
import { FormProgress } from "@/components/FormProgress";
import { CaptchaProtection } from "@/components/ui/captcha-protection";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, WHATSAPP_VALIDATION, CITY_VALIDATION, STATE_VALIDATION, PINCODE_VALIDATION } from "@/hooks/useFormValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function EnquiryFormSinglePage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsappPhone: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    investmentRange: "",
    timelineToStart: "",
    hearAboutUs: "",
    additionalComments: ""
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const { trackFieldError, trackFormSubmit } = useFormAnalytics({
    formType: 'atm_enquiry_submissions',
    formData
  });

  // Form validation setup
  const validationRules = [
    { ...FULL_NAME_VALIDATION, field: 'fullName' },
    { ...PHONE_VALIDATION, field: 'phone' },
    { ...WHATSAPP_VALIDATION, field: 'whatsappPhone' },
    { ...EMAIL_VALIDATION, field: 'email' },
    { ...CITY_VALIDATION, field: 'city' },
    { ...STATE_VALIDATION, field: 'state' },
    { ...PINCODE_VALIDATION, field: 'pincode' },
    { field: 'businessType', required: true, errorMessage: 'Please select your business type' },
    { field: 'investmentRange', required: true, errorMessage: 'Please select your investment range' },
    { field: 'timelineToStart', required: true, errorMessage: 'Please select your timeline to start' }
  ];

  const { errors, validateForm, validateSingleField, clearFieldError } = useFormValidation({
    rules: validationRules
  });

  // Progress tracking
  const fields = [
    { name: 'fullName', required: true, value: formData.fullName },
    { name: 'phone', required: true, value: formData.phone },
    { name: 'email', required: true, value: formData.email },
    { name: 'city', required: true, value: formData.city },
    { name: 'state', required: true, value: formData.state },
    { name: 'pincode', required: true, value: formData.pincode },
    { name: 'businessType', required: true, value: formData.businessType },
    { name: 'investmentRange', required: true, value: formData.investmentRange },
    { name: 'timelineToStart', required: true, value: formData.timelineToStart },
    { name: 'whatsappPhone', required: false, value: formData.whatsappPhone },
    { name: 'hearAboutUs', required: false, value: formData.hearAboutUs },
    { name: 'additionalComments', required: false, value: formData.additionalComments },
  ];

  const progress = useFormProgress({ fields });

  const handleInputChange = (field: string, value: string) => {
  const { t } = useTranslation('forms');
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation when user types
    if (value.trim()) {
      validateSingleField(field, value);
    } else if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CRITICAL FIX: Force blur any focused element before submission (fixes mobile camera focus trap)
    if (document.activeElement instanceof HTMLElement) {
      console.log('🔄 Blurring focused element:', document.activeElement.tagName);
      document.activeElement.blur();
    }
    
    // Add small delay to ensure blur is processed
    await new Promise(resolve => setTimeout(resolve, 50));

    if (!isCaptchaVerified) {
      toast({
        title: "Security Verification Required",
        description: "Please complete the security verification before submitting.",
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 Starting enquiry form submission...');
    
    // Validate form using the validation hook
    const isValid = validateForm(formData);
    
    if (!isValid) {
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

    try {
      setIsSubmitting(true);

      // Submit to Google Sheets
      const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbxPgePeGgOOe7V9Q4CPSXhJ_xKLxNqMLk_2m0d1aFUFvMC9wFUFZNUKxTq-6AvL0wpK/exec';
      
      const submissionData = {
        formType: 'atm_enquiry_submissions',
        timestamp: new Date().toISOString(),
        full_name: formData.fullName,
        phone: formData.phone,
        whatsapp_number: formData.whatsappPhone,
        email: formData.email,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        occupation: formData.businessType,
        enquiry_purpose: formData.timelineToStart,
        has_own_space: formData.investmentRange === "own-space" ? "yes" : "no",
        additional_query: formData.additionalQuery,
        userAgent: navigator.userAgent
      };

      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        mode: 'no-cors' // Required for Google Apps Script
      });

      // Since we're using no-cors mode, we can't check the response
      // We'll assume success if no error is thrown
      console.log('Form submitted to Google Sheets');
      
      // Simulate success for now
      const error = null;
      
      if (error) {
        console.error('Enquiry form submission error:', error);
        
        let errorMessage = 'Failed to submit enquiry. Please try again.';
        
        if (typeof error === 'object' && error !== null && 'message' in error) {
          if (error.message.includes('email_format') || error.message.includes('email')) {
            errorMessage = 'Please enter a valid email address (e.g., example@email.com)';
          } else if (error.message.includes('phone')) {
            errorMessage = 'Please enter a valid 10-digit phone number';
          } else if (error.message.includes('duplicate') || error.message.includes('already')) {
            errorMessage = 'This enquiry has already been submitted';
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      if (data?.error) {
        console.error('Enquiry data error:', data.error);
        throw new Error(data.error);
      }

      trackFormSubmit(true);
      setIsSubmitted(true);
      
      // Scroll to top and focus on success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const successElement = document.querySelector('[data-success-message]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Reset form on success
      setFormData({
        fullName: "",
        phone: "",
        whatsappPhone: "",
        email: "",
        city: "",
        state: "",
        pincode: "",
        businessType: "",
        investmentRange: "",
        timelineToStart: "",
        hearAboutUs: "",
        additionalComments: ""
      });
      setIsCaptchaVerified(false);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed ❌",
        description: error.message,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success modal component
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-14">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional animate-fade-in" data-success-message>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">Business Enquiry Submitted!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  Thank you for your interest in our business opportunities. Our team will review your enquiry and contact you within 24 hours with detailed information.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold">Next Steps:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Initial consultation with our business development team</li>
                    <li>✓ Detailed business model presentation</li>
                    <li>✓ Investment planning discussion</li>
                    <li>✓ Documentation and agreement process</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    window.location.href = '/';
                  }}
                  className="w-full"
                >
                  Continue
                </Button>
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
          <h1 className="text-xl font-bold">Business Enquiry Form</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Sticky Progress Bar */}
          <div className="sticky top-0 z-10 mb-6">
            <FormProgress
              progress={progress.fieldProgress}
              completedFields={progress.completedFields}
              totalFields={progress.totalFields}
              className="shadow-lg"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Business <span className="text-gradient">Enquiry</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your journey with us by sharing your business interests and contact information
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal & Contact Information */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">Personal & Contact Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">Let us know who you are and how to reach you</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder={t('placeholders.fullName', 'Enter your full name')} 
                        className={errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.fullName}
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
                        placeholder={t('placeholders.email', 'your.email@example.com')} 
                        className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Primary contact number" 
                        className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                      <Input 
                        id="whatsapp" 
                        value={formData.whatsappPhone}
                        onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                        placeholder="WhatsApp contact number" 
                        className={errors.whatsappPhone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.whatsappPhone && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.whatsappPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Your city" 
                        className={errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Choose your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input 
                        id="pincode" 
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="6-digit pincode" 
                        className={errors.pincode ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.pincode && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information & Preferences */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">Business Information & Preferences</h3>
                    <p className="text-sm text-muted-foreground mt-1">Tell us about your business interests and investment preferences</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Type of Business Interest *</Label>
                      <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                        <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="atm-franchise">ATM Franchise</SelectItem>
                          <SelectItem value="retail-outlet">Retail Outlet Partnership</SelectItem>
                          <SelectItem value="distribution">Distribution Partnership</SelectItem>
                          <SelectItem value="other">Other Business Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessType && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.businessType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentRange">Investment Range *</Label>
                      <Select value={formData.investmentRange} onValueChange={(value) => handleInputChange('investmentRange', value)}>
                        <SelectTrigger className={errors.investmentRange ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select investment range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3-lakhs">{t('investment.1to3L', '₹1 - 3 Lakhs')}</SelectItem>
                          <SelectItem value="3-5-lakhs">{t('investment.3to5L', '₹3 - 5 Lakhs')}</SelectItem>
                          <SelectItem value="5-10-lakhs">₹5 - 10 Lakhs</SelectItem>
                          <SelectItem value="10-15-lakhs">₹10 - 15 Lakhs</SelectItem>
                          <SelectItem value="15-25-lakhs">₹15 - 25 Lakhs</SelectItem>
                          <SelectItem value="above-25-lakhs">Above ₹25 Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.investmentRange && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.investmentRange}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timelineToStart">Timeline to Start *</Label>
                      <Select value={formData.timelineToStart} onValueChange={(value) => handleInputChange('timelineToStart', value)}>
                        <SelectTrigger className={errors.timelineToStart ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately</SelectItem>
                          <SelectItem value="1-month">Within 1 Month</SelectItem>
                          <SelectItem value="3-months">Within 3 Months</SelectItem>
                          <SelectItem value="6-months">Within 6 Months</SelectItem>
                          <SelectItem value="exploring">Just Exploring</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timelineToStart && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.timelineToStart}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hearAboutUs">How did you hear about us? (Optional)</Label>
                      <Select value={formData.hearAboutUs} onValueChange={(value) => handleInputChange('hearAboutUs', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google-search">Google Search</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                          <SelectItem value="referral">Friend/Family Referral</SelectItem>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="business-event">Business Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalComments">Additional Comments (Optional)</Label>
                    <Textarea 
                      id="additionalComments" 
                      value={formData.additionalComments}
                      onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                      placeholder="Any specific questions or requirements?" 
                      rows={4}
                    />
                  </div>
                </div>

                {/* Security Verification */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">Security Verification</h3>
                    <p className="text-sm text-muted-foreground mt-1">Complete security verification to submit</p>
                  </div>
                  <CaptchaProtection 
                    onVerify={setIsCaptchaVerified}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isCaptchaVerified}
                  className="w-full bg-primary hover:bg-primary/90 min-h-[48px] font-semibold" 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Business Enquiry
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}