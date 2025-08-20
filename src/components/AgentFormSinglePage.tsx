import { useState, useEffect } from "react";
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
import { FormProgress } from "@/components/FormProgress";
import { CaptchaProtection } from "./ui/captcha-protection";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { useFormProgress } from "@/hooks/useFormProgress";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, WHATSAPP_VALIDATION, PAN_VALIDATION, AADHAAR_VALIDATION } from "@/hooks/useFormValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function AgentFormSinglePage() {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [captchaVerified, setCaptchaVerified] = useState(false);
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
    joiningAs: "",
    whyJoin: "",
    languages: [] as string[],
  });

  // Unified file upload managers
  const panDocumentManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 PAN document updated:', file?.name)
  });
  
  const aadhaarFrontManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 Aadhaar front updated:', file?.name)
  });
  
  const aadhaarBackManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log('📁 Aadhaar back updated:', file?.name)
  });
  
  const photoManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => console.log('📁 Photo updated:', file?.name)
  });

  const { trackFieldError, trackFormSubmit } = useFormAnalytics({
    formType: 'agent_application',
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
    { field: 'permanentAddress', required: true, minLength: 10, errorMessage: t('validation.enterCompletePermanentAddress', 'Please enter complete permanent address (minimum 10 characters)') },
    { field: 'currentAddress', required: true, minLength: 10, errorMessage: t('validation.enterCompleteCurrentAddress', 'Please enter complete current address (minimum 10 characters)') },
    { field: 'state', required: true, errorMessage: 'Please select your state' },
    { field: 'district', required: true, errorMessage: 'Please enter your district' },
    { field: 'joiningAs', required: true, errorMessage: 'Please select joining option' },
    { field: 'whyJoin', required: true, minLength: 20, errorMessage: 'Please explain why you want to join (minimum 20 characters)' },
    { field: 'languages', customValidator: (value) => {
        const langs = formData.languages || [];
        return langs.length === 0 ? 'Please select at least one language' : null;
      }, errorMessage: 'Please select at least one language' }
  ];

  const { errors, validateForm, validateSingleField, clearFieldError } = useFormValidation({
    rules: validationRules
  });

  // Progress tracking with file managers
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
    { name: 'joiningAs', required: true, value: formData.joiningAs },
    { name: 'whyJoin', required: true, value: formData.whyJoin },
    { name: 'languages', required: true, value: formData.languages },
    { name: 'panDocument', required: true, value: panDocumentManager.uploadState.file },
    { name: 'aadhaarFront', required: true, value: aadhaarFrontManager.uploadState.file },
    { name: 'aadhaarBack', required: true, value: aadhaarBackManager.uploadState.file },
    { name: 'photo', required: true, value: photoManager.uploadState.file },
    { name: 'whatsappPhone', required: false, value: formData.whatsappPhone },
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
    const newLanguages = checked 
      ? [...formData.languages, language]
      : formData.languages.filter(l => l !== language);
    
    setFormData(prev => ({
      ...prev,
      languages: newLanguages
    }));
    
    // console.log('🗣️ Languages updated:', newLanguages);
    
    if (errors.languages) {
      clearFieldError('languages');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Agent form submission started');
    
    setIsSubmitting(true);

    try {
      // 1. Check CAPTCHA first
      if (!captchaVerified) {
        console.log('❌ CAPTCHA not verified');
        trackFieldError('captcha', 'CAPTCHA verification required');
        toast({
          title: "Security Verification Required",
          description: "Please complete the security verification before submitting.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      console.log('✅ CAPTCHA verified');

      // 2. Validate form using the validation hook
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
        joiningAs: formData.joiningAs,
        whyJoin: formData.whyJoin,
        languages: formData.languages.length > 0 ? 'selected' : '' // Convert array to validation-friendly format
      };

      console.log('🔍 Starting form validation...');
      console.log('Form data for validation:', formDataForValidation);
      const isValid = validateForm(formDataForValidation);
      console.log('Form validation result:', { isValid, errors });

      if (!isValid) {
        const errorFields = Object.keys(errors).filter(key => errors[key]);
        const errorMessage = errorFields.length > 0 
          ? `${t('forms.validation.correctFields')}: ${errorFields.join(', ')}`
          : 'Please fill all required fields correctly';
        
        // if (import.meta.env.DEV) { console.error('❌ Form validation failed:', { errors, errorFields, formDataForValidation }); }
        
        // Show detailed validation errors in console for debugging
        errorFields.forEach(field => {
          // if (import.meta.env.DEV) { console.error(`Field '${field}' error: ${errors[field]}`); }
        });
        
        toast({
          title: "❌ Validation Failed", 
          description: errorMessage,
          variant: "destructive",
          duration: 8000
        });
        setIsSubmitting(false);
        return;
      }
      console.log('✅ Form validation passed');
      
      // 3. Check file uploads
      const fileErrors = [];
      
      console.log('📁 Checking file uploads:', {
        panDocument: { 
          hasFile: !!panDocumentManager.uploadState.file, 
          fileName: panDocumentManager.uploadState.file?.name,
          error: panDocumentManager.uploadState.error 
        },
        aadhaarFront: { 
          hasFile: !!aadhaarFrontManager.uploadState.file, 
          fileName: aadhaarFrontManager.uploadState.file?.name,
          error: aadhaarFrontManager.uploadState.error 
        },
        aadhaarBack: { 
          hasFile: !!aadhaarBackManager.uploadState.file, 
          fileName: aadhaarBackManager.uploadState.file?.name,
          error: aadhaarBackManager.uploadState.error 
        },
        photo: { 
          hasFile: !!photoManager.uploadState.file, 
          fileName: photoManager.uploadState.file?.name,
          error: photoManager.uploadState.error 
        }
      });
      
      // Check for validation errors in file managers
      if (panDocumentManager.uploadState.error) {
        fileErrors.push(`PAN Document: ${panDocumentManager.uploadState.error}`);
      } else if (!panDocumentManager.uploadState.file) {
        fileErrors.push('PAN Document Upload');
      }
      
      if (aadhaarFrontManager.uploadState.error) {
        fileErrors.push(`Aadhaar Front: ${aadhaarFrontManager.uploadState.error}`);
      } else if (!aadhaarFrontManager.uploadState.file) {
        fileErrors.push('Aadhaar Front Upload');
      }
      
      if (aadhaarBackManager.uploadState.error) {
        fileErrors.push(`Aadhaar Back: ${aadhaarBackManager.uploadState.error}`);
      } else if (!aadhaarBackManager.uploadState.file) {
        fileErrors.push('Aadhaar Back Upload');
      }
      
      if (photoManager.uploadState.error) {
        fileErrors.push(`Photo: ${photoManager.uploadState.error}`);
      } else if (!photoManager.uploadState.file) {
        fileErrors.push('Passport Size Photo Upload');
      }

      if (fileErrors.length > 0) {
        // if (import.meta.env.DEV) { console.error('❌ File validation failed:', fileErrors); } // Silenced for production
        toast({
          title: "Missing Required Documents",
          description: `Please upload: ${fileErrors.join(', ')}`,
          variant: "destructive",
          duration: 8000
        });
        setIsSubmitting(false);
        return;
      }
      console.log('✅ All files validated');

      // 4. Upload files to Supabase Storage
      console.log('🔄 Starting file uploads...');
      
      let panUpload, aadhaarFrontUpload, aadhaarBackUpload, photoUpload;
      
      try {
        console.log('📤 Uploading PAN document...');
        panUpload = await uploadFile(panDocumentManager.uploadState.file!, 'atmfranchiseforms', 'agent-documents');
        console.log('✅ PAN document uploaded:', panUpload.url);
        
        console.log('📤 Uploading Aadhaar front...');
        aadhaarFrontUpload = await uploadFile(aadhaarFrontManager.uploadState.file!, 'atmfranchiseforms', 'agent-documents');
        console.log('✅ Aadhaar front uploaded:', aadhaarFrontUpload.url);
        
        console.log('📤 Uploading Aadhaar back...');
        aadhaarBackUpload = await uploadFile(aadhaarBackManager.uploadState.file!, 'atmfranchiseforms', 'agent-documents');
        console.log('✅ Aadhaar back uploaded:', aadhaarBackUpload.url);
        
        console.log('📤 Uploading photo...');
        photoUpload = await uploadFile(photoManager.uploadState.file!, 'atmfranchiseforms', 'agent-documents');
        console.log('✅ Photo uploaded:', photoUpload.url);
        
      } catch (uploadError) {
        // if (import.meta.env.DEV) { console.error('❌ File upload failed:', uploadError); } // Silenced for production
        toast({
          title: "File Upload Failed",
          description: "Unable to upload one or more files. Please try again.",
          variant: "destructive",
          duration: 8000
        });
        setIsSubmitting(false);
        return;
      }
      
      // 5. Prepare submission data
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
        joining_as: formData.joiningAs,
        why_join: formData.whyJoin,
        languages: formData.languages,
        pan_document_url: panUpload.url,
        aadhaar_front_url: aadhaarFrontUpload.url,
        aadhaar_back_url: aadhaarBackUpload.url,
        photo_url: photoUpload.url,
      };

      console.log('📤 Submitting to Supabase via edge function...');
      console.log('Submission data:', submissionData);
      
      // 6. Submit to Supabase via edge function
      const { data: response, error: submissionError } = await supabase.functions.invoke('form-submission', {
        body: {
          formType: 'agent_submissions',
          data: submissionData,
          userAgent: navigator.userAgent,
          ipAddress: undefined
        }
      });

      console.log('Edge function response:', { response, submissionError });

      if (submissionError) {
        // if (import.meta.env.DEV) { console.error('❌ Edge function error:', submissionError); } // Silenced for production
        throw new Error(submissionError.message || 'Submission failed via edge function');
      }

      if (response?.error) {
        // if (import.meta.env.DEV) { console.error('❌ Response contained error:', response.error); }
        throw new Error(response.error);
      }

      if (!response?.success) {
        // if (import.meta.env.DEV) { console.error('❌ Submission was not successful:', response); }
        throw new Error('Submission was not marked as successful');
      }

      console.log('✅ Agent application submitted successfully!');
      trackFormSubmit(true);
      
      // 7. Show success message
      toast({
        title: t('applicationSubmittedSuccessfully', '✅ Application Submitted Successfully!'),
        description: "Thank you! We'll contact you within 24 hours.",
        variant: "default",
        duration: 6000
      });
      
      setIsSubmitted(true);
      
      // Scroll to top and focus on success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const successElement = document.querySelector('[data-success-message]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      // 8. Reset form
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
        joiningAs: "",
        whyJoin: "",
        languages: [],
      });
      
      // Clear all file managers
      panDocumentManager.clearFile();
      aadhaarFrontManager.clearFile();
      aadhaarBackManager.clearFile();
      photoManager.clearFile();
      
      setCaptchaVerified(false);

    } catch (error) {
      // if (import.meta.env.DEV) { console.error('❌ Complete submission error:', error); }
      // if (import.meta.env.DEV) {
      //   console.error('Error details:', {
      //     name: error.name,
      //     message: error.message,
      //     stack: error.stack
      //   });
      // } // Silenced for production
      
      trackFormSubmit(false, error.message);
      
      let errorMessage = t('forms.error.tryAgainOrContact');
      
      if (error.message.includes('email')) {
        errorMessage = t('forms.validation.email');
      } else if (error.message.includes('phone')) {
        errorMessage = t('forms.validation.phone');
      } else if (error.message.includes('PAN')) {
        errorMessage = t('forms.validation.pan');
      } else if (error.message.includes('Aadhaar')) {
        errorMessage = t('forms.validation.aadhaar');
      } else if (error.message.includes('upload') || error.message.includes('file')) {
        errorMessage = t('forms.error.fileUpload');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = t('forms.error.network');
      }
      
      toast({
        title: "Submission Failed ❌",
        description: errorMessage,
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
                <CardTitle className="text-2xl font-bold text-green-600">{t('agentApplication.submitted', 'Agent Application Submitted!')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  {t('agentApplication.thankYou', 'Thank you for joining our agent network. We\'ll contact you within 24 hours to discuss next steps.')}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('agentApplication.nextSteps', 'Next Steps:')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ {t('agentApplication.step1', 'Verification of your documents')}</li>
                    <li>✓ {t('agentApplication.step2', 'Training schedule coordination')}</li>
                    <li>✓ {t('agentApplication.step3', 'Territory assignment discussion')}</li>
                    <li>✓ {t('agentApplication.step4', 'Commission structure briefing')}</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    window.location.href = '/';
                  }}
                  className="w-full"
                >
                  {t('buttons.continue', 'Continue')}
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
          <h1 className="text-xl font-bold">{t('components.agentformsinglepage.text1')}</h1>
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
              Join Our <span className="text-gradient">{t('components.agentformsinglepage.text2')}</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our network and start earning commissions by helping entrepreneurs set up ATM franchises
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t("sections.personal")}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.agentformsinglepage.text3')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('labels.fullName', 'Full Name')} *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder={t('placeholders.full_name_pan', 'Enter your full name as per PAN card')} 
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
                      <label className="block text-sm font-medium text-foreground mb-2">{t("fields.email")} *</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('placeholders.email', 'Enter your email address')} 
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

                  <div className="space-y-2">
                    <Label>{t('forms.gender.label')} *</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => handleInputChange('gender', value)}
                      className="flex gap-4 sm:gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">{t('components.agentformsinglepage.text4')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">{t('components.agentformsinglepage.text5')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">{t('components.agentformsinglepage.text6')}</Label>
                      </div>
                    </RadioGroup>
                    {errors.gender && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t('labels.dateOfBirthPan', 'Date of Birth as in PAN Card')} *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Select value={formData.dateOfBirth.day} onValueChange={(value) => handleDateChange('day', value)}>
                        <SelectTrigger className={errors['dateOfBirth.day'] ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('forms.dateOfBirth.day')} />
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
                          <SelectItem value="1">{t('components.agentformsinglepage.text7')}</SelectItem>
                          <SelectItem value="2">{t('components.agentformsinglepage.text8')}</SelectItem>
                          <SelectItem value="3">{t('components.agentformsinglepage.text9')}</SelectItem>
                          <SelectItem value="4">{t('components.agentformsinglepage.text10')}</SelectItem>
                          <SelectItem value="5">{t('forms.months.may')}</SelectItem>
                          <SelectItem value="6">{t('components.agentformsinglepage.text11')}</SelectItem>
                          <SelectItem value="7">{t('components.agentformsinglepage.text12')}</SelectItem>
                          <SelectItem value="8">{t('components.agentformsinglepage.text13')}</SelectItem>
                          <SelectItem value="9">{t('components.agentformsinglepage.text14')}</SelectItem>
                          <SelectItem value="10">{t('components.agentformsinglepage.text15')}</SelectItem>
                          <SelectItem value="11">{t('components.agentformsinglepage.text16')}</SelectItem>
                          <SelectItem value="12">{t('components.agentformsinglepage.text17')}</SelectItem>
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
                    {(errors['dateOfBirth.day'] || errors['dateOfBirth.month'] || errors['dateOfBirth.year']) && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors['dateOfBirth.day'] || errors['dateOfBirth.month'] || errors['dateOfBirth.year']}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground mb-2">{t("fields.phone")} *</label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('placeholders.phone_primary', 'Primary contact number')} 
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
                        placeholder={t('forms.whatsapp.placeholder')} 
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">{t('forms.pan.labelWithFormat')} *</Label>
                      <Input 
                        id="panNumber" 
                        value={formData.panNumber}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                          handleInputChange('panNumber', value);
                        }}
                        placeholder={t('forms.pan.placeholder')} 
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
                      <Label htmlFor="aadhaarNumber">{t('labels.aadhaarNumber', 'Aadhaar Card Number (12 digits)')} *</Label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('forms.state.label')} *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder={t('forms.state.placeholder')} />
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
                      <Label htmlFor="district">{t('labels.districtOfResidence', 'District of Residence')} *</Label>
                      <Input 
                        id="district" 
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder={t('placeholders.enterYourDistrict')} 
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
                      <Label htmlFor="permanentAddress">{t('labels.permanentAddress', 'Permanent Address')} *</Label>
                      <Textarea 
                        id="permanentAddress" 
                        value={formData.permanentAddress}
                        onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                        placeholder={t('placeholders.enterYourPermanentAddress')} 
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
                      <Label htmlFor="currentAddress">{t('labels.currentAddress', 'Current Address')} *</Label>
                      <Textarea 
                        id="currentAddress" 
                        value={formData.currentAddress}
                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                        placeholder={t('placeholders.enterYourCurrentAddress')} 
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

                {/* Professional Details Section */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('labels.professionalDetails', 'Professional Details & Documents')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.agentformsinglepage.text18')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('labels.joiningAs', 'Are you Joining As (Please choose from Below):')} *</Label>
                    <RadioGroup 
                      value={formData.joiningAs} 
                      onValueChange={(value) => handleInputChange('joiningAs', value)}
                      className="flex gap-4 sm:gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">{t('components.agentformsinglepage.text19')}</Label>  
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business-owner" id="business-owner" />
                        <Label htmlFor="business-owner">{t('components.agentformsinglepage.text20')}</Label>
                      </div>
                    </RadioGroup>
                    {errors.joiningAs && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.joiningAs}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whyJoin">{t('labels.whyJoinAgent', 'Why do you want to Join Sahasra Network as Agent')} *</Label>
                    <Textarea 
                      id="whyJoin" 
                      value={formData.whyJoin}
                      onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                      placeholder={t('placeholders.motivationAndGoals', 'Tell us about your motivation and goals as an agent')} 
                      className={`min-h-[100px] ${errors.whyJoin ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                    />
                    {errors.whyJoin && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.whyJoin}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>{t('labels.languagesYouSpeak', 'Languages You Can Speak')} *</Label>
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

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Document Uploads *</Label>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-3">
                         <Label htmlFor="panDocument" className="flex items-center gap-2">
                           {t('labels.panDocumentUpload', 'PAN Document Upload')}
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
                           {t('labels.passportPhoto', 'Passport Size Photo')}
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
                           {t('labels.aadhaarFront', 'Aadhaar Front Side')}
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
                           {t('labels.aadhaarBack', 'Aadhaar Back Side')}
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

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{t('components.agentformsinglepage.text21')}</Label>
                    <CaptchaProtection 
                      onVerify={setCaptchaVerified}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !captchaVerified}
                  className="w-full bg-primary hover:bg-primary/90 min-h-[48px] font-semibold" 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('buttons.submitting', 'Submitting...')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('buttons.submitAgentApplication', 'Submit Agent Application')}
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