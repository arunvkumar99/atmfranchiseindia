import { useState } from "react";
import { INDIAN_STATES } from "@/lib/stateOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets

import { useFileUploadManager } from "@/components/ui/file-upload-manager";
import { uploadFile } from "@/lib/fileUpload";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { useFormProgress } from "@/hooks/useFormProgress";
import { FormProgress } from "@/components/FormProgress";
import { CaptchaProtection } from "@/components/ui/captcha-protection";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, WHATSAPP_VALIDATION, PAN_VALIDATION, AADHAAR_VALIDATION } from "@/hooks/useFormValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function InfluencerFormSinglePage() {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: { day: "", month: "", year: "" },
    phone: "",
    whatsappPhone: "",
    email: "",
    panNumber: "",
    aadhaarNumber: "",
    permanentAddress: "",
    currentAddress: "",
    state: "",
    district: "",
    languages: [] as string[],
    facebookLink: "",
    instagramLink: "",
    youtubeLink: "",
    linkedinLink: "",
    otherChannel1: "",
    otherChannel2: "",
  });

  // Unified file upload managers - EXACT same functionality as before
  const panDocumentManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 Influencer PAN document updated:', file?.name)
  });
  
  const aadhaarFrontManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 Influencer Aadhaar front updated:', file?.name)
  });
  
  const aadhaarBackManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 Influencer Aadhaar back updated:', file?.name)
  });
  
  const photoManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => console.log('📁 Influencer photo updated:', file?.name)
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const { trackFieldError, trackFormSubmit } = useFormAnalytics({
    formType: 'influencer_application',
    formData
  });

  // Form validation setup
  const validationRules = [
    { ...FULL_NAME_VALIDATION, field: 'fullName' },
    { ...PHONE_VALIDATION, field: 'phone' },
    { ...WHATSAPP_VALIDATION, field: 'whatsappPhone' },
    { ...EMAIL_VALIDATION, field: 'email' },
    { ...PAN_VALIDATION, field: 'panNumber' },
    { ...AADHAAR_VALIDATION, field: 'aadhaarNumber' },
    { field: 'gender', required: true, errorMessage: 'Please select your gender' },
    { field: 'dateOfBirth.day', required: true, errorMessage: 'Please select birth day' },
    { field: 'dateOfBirth.month', required: true, errorMessage: 'Please select birth month' },
    { field: 'dateOfBirth.year', required: true, errorMessage: 'Please select birth year' },
    { field: 'permanentAddress', required: true, minLength: 10, errorMessage: 'Please enter complete permanent address' },
    { field: 'currentAddress', required: true, minLength: 10, errorMessage: 'Please enter complete current address' },
    { field: 'state', required: true, errorMessage: 'Please select your state' },
    { field: 'district', required: true, errorMessage: 'Please enter your district' },
    { field: 'languages', customValidator: (value) => {
        const langs = formData.languages || [];
        return langs.length === 0 ? 'Please select at least one language' : null;
      }, errorMessage: 'Please select at least one language' }
  ];

  const { errors, validateForm, validateSingleField, clearFieldError } = useFormValidation({
    rules: validationRules
  });

  // Progress tracking
  const fields = [
    { name: 'fullName', required: true, value: formData.fullName },
    { name: 'gender', required: true, value: formData.gender },
    { name: 'dateOfBirth', required: true, value: `${formData.dateOfBirth.day}-${formData.dateOfBirth.month}-${formData.dateOfBirth.year}` },
    { name: 'phone', required: true, value: formData.phone },
    { name: 'email', required: true, value: formData.email },
    { name: 'panNumber', required: true, value: formData.panNumber },
    { name: 'aadhaarNumber', required: true, value: formData.aadhaarNumber },
    { name: 'permanentAddress', required: true, value: formData.permanentAddress },
    { name: 'currentAddress', required: true, value: formData.currentAddress },
    { name: 'state', required: true, value: formData.state },
    { name: 'district', required: true, value: formData.district },
    { name: 'languages', required: true, value: formData.languages },
    { name: 'panDocument', required: true, value: panDocumentManager.uploadState.file },
    { name: 'aadhaarFront', required: true, value: aadhaarFrontManager.uploadState.file },
    { name: 'aadhaarBack', required: true, value: aadhaarBackManager.uploadState.file },
    { name: 'photo', required: true, value: photoManager.uploadState.file },
    { name: 'whatsappPhone', required: false, value: formData.whatsappPhone },
    { name: 'facebookLink', required: false, value: formData.facebookLink },
    { name: 'instagramLink', required: false, value: formData.instagramLink },
    { name: 'youtubeLink', required: false, value: formData.youtubeLink },
    { name: 'linkedinLink', required: false, value: formData.linkedinLink },
    { name: 'otherChannel1', required: false, value: formData.otherChannel1 },
    { name: 'otherChannel2', required: false, value: formData.otherChannel2 },
  ];

  const progress = useFormProgress({ fields });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation when user types
    if (value.trim()) {
      validateSingleField(field, value);
    } else if (errors[field]) {
      clearFieldError(field);
    }
  };


  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [field]: value }
    }));
    const dateField = `dateOfBirth.${field}`;
    
    // Real-time validation for date fields
    if (value.trim()) {
      validateSingleField(dateField, value);
    } else if (errors[dateField]) {
      clearFieldError(dateField);
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, language]
        : prev.languages.filter(l => l !== language)
    }));
    if (errors.languages) {
      clearFieldError('languages');
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

    // Validate form
    const formDataForValidation = {
      fullName: formData.fullName,
      phone: formData.phone,
      whatsappPhone: formData.whatsappPhone,
      email: formData.email,
      panNumber: formData.panNumber,
      aadhaarNumber: formData.aadhaarNumber,
      gender: formData.gender,
      'dateOfBirth.day': formData.dateOfBirth.day,
      'dateOfBirth.month': formData.dateOfBirth.month,
      'dateOfBirth.year': formData.dateOfBirth.year,
      permanentAddress: formData.permanentAddress,
      currentAddress: formData.currentAddress,
      state: formData.state,
      district: formData.district,
      languages: formData.languages.join(',')
    };

    const isValid = validateForm(formDataForValidation);
    
    // File validation using managers - EXACT same validation as before
    const fileErrors = [];
    console.log('📁 Checking required files from managers:', {
      panDocument: !!panDocumentManager.uploadState.file,
      aadhaarFront: !!aadhaarFrontManager.uploadState.file,
      aadhaarBack: !!aadhaarBackManager.uploadState.file,
      photo: !!photoManager.uploadState.file
    });
    
    if (!panDocumentManager.uploadState.file) fileErrors.push('PAN Document Upload');
    if (!aadhaarFrontManager.uploadState.file) fileErrors.push('Aadhaar Front Upload');
    if (!aadhaarBackManager.uploadState.file) fileErrors.push('Aadhaar Back Upload');
    if (!photoManager.uploadState.file) fileErrors.push('Passport Size Photo Upload');

    if (fileErrors.length > 0) {
      toast({
        title: "Missing Required Documents",
        description: `Please upload: ${fileErrors.join(', ')}`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

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
      console.log('🔄 Starting file uploads from managers...');
      
      const panUpload = await uploadFile(panDocumentManager.uploadState.file!, 'atmfranchiseforms', 'influencer-documents');
      const aadhaarFrontUpload = await uploadFile(aadhaarFrontManager.uploadState.file!, 'atmfranchiseforms', 'influencer-documents');
      const aadhaarBackUpload = await uploadFile(aadhaarBackManager.uploadState.file!, 'atmfranchiseforms', 'influencer-documents');
      const photoUpload = await uploadFile(photoManager.uploadState.file!, 'atmfranchiseforms', 'influencer-documents');
      
      const { day, month, year } = formData.dateOfBirth;
      const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const submissionData = {
        full_name: formData.fullName,
        gender: formData.gender,
        date_of_birth: dateOfBirth,
        phone: formData.phone,
        whatsapp_phone: formData.whatsappPhone,
        email: formData.email,
        pan_number: formData.panNumber,
        aadhaar_number: formData.aadhaarNumber,
        permanent_address: formData.permanentAddress,
        current_address: formData.currentAddress,
        state: formData.state,
        district: formData.district,
        languages: formData.languages,
        facebook_link: formData.facebookLink,
        instagram_link: formData.instagramLink,
        youtube_link: formData.youtubeLink,
        linkedin_link: formData.linkedinLink,
        other_channel_1: formData.otherChannel1,
        other_channel_2: formData.otherChannel2,
        pan_document_url: panUpload.url,
        aadhaar_front_url: aadhaarFrontUpload.url,
        aadhaar_back_url: aadhaarBackUpload.url,
        photo_url: photoUpload.url,
      };

      const { data, error } = await supabase.functions.invoke('form-submission', {
        body: {
          formType: 'influencer_submissions',
          data: submissionData,
          userAgent: navigator.userAgent,
          ipAddress: undefined
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Submission failed');
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
      
      // Reset form
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: { day: "", month: "", year: "" },
        phone: "",
        whatsappPhone: "",
        email: "",
        panNumber: "",
        aadhaarNumber: "",
        permanentAddress: "",
        currentAddress: "",
        state: "",
        district: "",
        languages: [],
        facebookLink: "",
        instagramLink: "",
        youtubeLink: "",
        linkedinLink: "",
        otherChannel1: "",
        otherChannel2: "",
      });
      
      // Clear all file managers
      panDocumentManager.clearFile();
      aadhaarFrontManager.clearFile();
      aadhaarBackManager.clearFile();
      photoManager.clearFile();
      
      setIsCaptchaVerified(false);

    } catch (error) {
      // if (import.meta.env.DEV) { console.error('❌ Error submitting influencer application:', error); } // Silenced for production
      trackFormSubmit(false, error.message);
      
      toast({
        title: "Submission Failed ❌",
        description: "Please try again or contact us directly.",
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
                <CardTitle className="text-2xl font-bold text-green-600">Influencer Application Submitted!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  Thank you for joining our influencer network. We'll review your application and get back to you soon.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold">Next Steps:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Application review by our team</li>
                    <li>✓ Social media profile verification</li>
                    <li>✓ Partnership terms discussion</li>
                    <li>✓ Onboarding process initiation</li>
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
          <h1 className="text-xl font-bold">{t('components.influencerformsinglepage.text1')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Sticky Progress Bar */}
          <div className="sticky top-16 z-10 mb-6 bg-background/95 backdrop-blur-sm rounded-lg">
            <FormProgress
              progress={progress.fieldProgress}
              completedFields={progress.completedFields}
              totalFields={progress.totalFields}
              className="shadow-lg"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Join Our <span className="text-gradient">{t('components.influencerformsinglepage.text2')}</span>
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Partner with us to promote financial services and earn commissions
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
            <CardContent className="p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t("sections.personal")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.influencerformsinglepage.text3')}</p>
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
                      <Label>Gender *</Label>
                      <RadioGroup 
                        value={formData.gender} 
                        onValueChange={(value) => handleInputChange('gender', value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">{t('components.influencerformsinglepage.text4')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">{t('components.influencerformsinglepage.text5')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">{t('components.influencerformsinglepage.text6')}</Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Select value={formData.dateOfBirth.day} onValueChange={(value) => handleDateChange('day', value)}>
                        <SelectTrigger className={errors['dateOfBirth.day'] ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 31}, (_, i) => (
                            <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={formData.dateOfBirth.month} onValueChange={(value) => handleDateChange('month', value)}>
                        <SelectTrigger className={errors['dateOfBirth.month'] ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('time.month', 'Month')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">{t('components.influencerformsinglepage.text7')}</SelectItem>
                          <SelectItem value="2">{t('components.influencerformsinglepage.text8')}</SelectItem>
                          <SelectItem value="3">{t('components.influencerformsinglepage.text9')}</SelectItem>
                          <SelectItem value="4">{t('components.influencerformsinglepage.text10')}</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">{t('components.influencerformsinglepage.text11')}</SelectItem>
                          <SelectItem value="7">{t('components.influencerformsinglepage.text12')}</SelectItem>
                          <SelectItem value="8">{t('components.influencerformsinglepage.text13')}</SelectItem>
                          <SelectItem value="9">{t('components.influencerformsinglepage.text14')}</SelectItem>
                          <SelectItem value="10">{t('components.influencerformsinglepage.text15')}</SelectItem>
                          <SelectItem value="11">{t('components.influencerformsinglepage.text16')}</SelectItem>
                          <SelectItem value="12">{t('components.influencerformsinglepage.text17')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={formData.dateOfBirth.year} onValueChange={(value) => handleDateChange('year', value)}>
                        <SelectTrigger className={errors['dateOfBirth.year'] ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('time.year', 'Year')} />
                        </SelectTrigger>
                        <SelectContent>
                           {Array.from({length: 70}, (_, i) => (
                             <SelectItem key={2024-i} value={String(2024-i)}>{2024-i}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground mb-2">{t("fields.phone")} *</label>
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
                      <label className="block text-sm font-medium text-foreground mb-2">{t("fields.whatsapp")} *</label>
                      <Input 
                        id="whatsapp" 
                        value={formData.whatsappPhone}
                        onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                        placeholder="WhatsApp number" 
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground mb-2">{t("fields.email")} *</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address" 
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Card Number *</Label>
                      <Input 
                        id="panNumber" 
                        value={formData.panNumber}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                          handleInputChange('panNumber', value);
                        }}
                        placeholder="ABCDE1234F" 
                        maxLength={10}
                        className={`uppercase ${errors.panNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                      />
                      {errors.panNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.panNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                      <Input 
                        id="aadhaarNumber" 
                        value={formData.aadhaarNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                          handleInputChange('aadhaarNumber', value);
                        }}
                        placeholder="123456789012" 
                        maxLength={12}
                        className={errors.aadhaarNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.aadhaarNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.aadhaarNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
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
                      <Label htmlFor="district">District *</Label>
                      <Input 
                        id="district" 
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Enter your district" 
                        className={errors.district ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.district && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.district}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress">Permanent Address *</Label>
                      <Textarea 
                        id="permanentAddress" 
                        value={formData.permanentAddress}
                        onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                        placeholder="Enter your permanent address" 
                        className={errors.permanentAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        rows={3}
                        required
                      />
                      {errors.permanentAddress && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.permanentAddress}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentAddress">Current Address *</Label>
                      <Textarea 
                        id="currentAddress" 
                        value={formData.currentAddress}
                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                        placeholder="Enter your current address" 
                        className={errors.currentAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        rows={3}
                        required
                      />
                      {errors.currentAddress && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.currentAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media & Languages */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">Social Media & Skills</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.influencerformsinglepage.text18')}</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Languages You Can Speak *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia"].map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox 
                            id={language.toLowerCase()} 
                            checked={formData.languages.includes(language)}
                            onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                          />
                          <Label htmlFor={language.toLowerCase()} className="text-sm">{language}</Label>
                        </div>
                      ))}
                    </div>
                    {errors.languages && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.languages}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebookLink">{t('components.influencerformsinglepage.text19')}</Label>
                      <Input 
                        id="facebookLink" 
                        value={formData.facebookLink}
                        onChange={(e) => handleInputChange('facebookLink', e.target.value)}
                        placeholder="https://facebook.com/yourprofile" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagramLink">{t('components.influencerformsinglepage.text20')}</Label>
                      <Input 
                        id="instagramLink" 
                        value={formData.instagramLink}
                        onChange={(e) => handleInputChange('instagramLink', e.target.value)}
                        placeholder="https://instagram.com/yourprofile" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtubeLink">{t('components.influencerformsinglepage.text21')}</Label>
                      <Input 
                        id="youtubeLink" 
                        value={formData.youtubeLink}
                        onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                        placeholder="https://youtube.com/yourchannel" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedinLink">{t('components.influencerformsinglepage.text22')}</Label>
                      <Input 
                        id="linkedinLink" 
                        value={formData.linkedinLink}
                        onChange={(e) => handleInputChange('linkedinLink', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="otherChannel1">Other Channel/Platform 1</Label>
                      <Input 
                        id="otherChannel1" 
                        value={formData.otherChannel1}
                        onChange={(e) => handleInputChange('otherChannel1', e.target.value)}
                        placeholder="Any other social media platform" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherChannel2">Other Channel/Platform 2</Label>
                      <Input 
                        id="otherChannel2" 
                        value={formData.otherChannel2}
                        onChange={(e) => handleInputChange('otherChannel2', e.target.value)}
                        placeholder="Any other social media platform" 
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.influencerformsinglepage.text23')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.influencerformsinglepage.text24')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="panDocument" className="flex items-center gap-2">
                        PAN Document Upload
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={panDocumentManager.openFileSelector}
                          className="flex-1"
                        >
                          Choose File
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={panDocumentManager.openCameraSelector}
                          className="flex-1"
                        >
                          Take Photo
                        </Button>
                      </div>
                      {panDocumentManager.uploadState.file && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">✅ {panDocumentManager.uploadState.file.name}</p>
                        </div>
                      )}
                      <input
                        ref={panDocumentManager.fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,.pdf"
                        className="hidden"
                        onChange={(e) => panDocumentManager.setFile(e.target.files?.[0] || null)}
                      />
                      <input
                        ref={panDocumentManager.cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => panDocumentManager.setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="photo" className="flex items-center gap-2">
                        Passport Size Photo
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={photoManager.openFileSelector}
                          className="flex-1"
                        >
                          Choose File
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={photoManager.openCameraSelector}
                          className="flex-1"
                        >
                          Take Photo
                        </Button>
                      </div>
                      {photoManager.uploadState.file && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">✅ {photoManager.uploadState.file.name}</p>
                        </div>
                      )}
                      <input
                        ref={photoManager.fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => photoManager.setFile(e.target.files?.[0] || null)}
                      />
                      <input
                        ref={photoManager.cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => photoManager.setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="aadhaarFront" className="flex items-center gap-2">
                        Aadhaar Front Side
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={aadhaarFrontManager.openFileSelector}
                          className="flex-1"
                        >
                          Choose File
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={aadhaarFrontManager.openCameraSelector}
                          className="flex-1"
                        >
                          Take Photo
                        </Button>
                      </div>
                      {aadhaarFrontManager.uploadState.file && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">✅ {aadhaarFrontManager.uploadState.file.name}</p>
                        </div>
                      )}
                      <input
                        ref={aadhaarFrontManager.fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,.pdf"
                        className="hidden"
                        onChange={(e) => aadhaarFrontManager.setFile(e.target.files?.[0] || null)}
                      />
                      <input
                        ref={aadhaarFrontManager.cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => aadhaarFrontManager.setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="aadhaarBack" className="flex items-center gap-2">
                        Aadhaar Back Side
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={aadhaarBackManager.openFileSelector}
                          className="flex-1"
                        >
                          Choose File
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={aadhaarBackManager.openCameraSelector}
                          className="flex-1"
                        >
                          Take Photo
                        </Button>
                      </div>
                      {aadhaarBackManager.uploadState.file && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">✅ {aadhaarBackManager.uploadState.file.name}</p>
                        </div>
                      )}
                      <input
                        ref={aadhaarBackManager.fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,.pdf"
                        className="hidden"
                        onChange={(e) => aadhaarBackManager.setFile(e.target.files?.[0] || null)}
                      />
                      <input
                        ref={aadhaarBackManager.cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => aadhaarBackManager.setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Verification */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.influencerformsinglepage.text25')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.influencerformsinglepage.text26')}</p>
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
                      Submit Influencer Application
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

export default InfluencerFormSinglePage;