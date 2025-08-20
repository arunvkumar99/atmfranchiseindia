import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { CaptchaProtection } from "@/components/ui/captcha-protection";

import { useFileUploadManager } from "@/components/ui/file-upload-manager";
import { uploadFile } from "@/lib/fileUpload";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION } from "@/hooks/useFormValidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface JobApplicationSinglePageProps {
  jobs: Array<{
    id: string;
    title: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
  }>;
  selectedJobId?: string;
}

export function JobApplicationSinglePage({ jobs, selectedJobId = "" }: JobApplicationSinglePageProps) {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: selectedJobId ? jobs.find(j => j.id === selectedJobId)?.title || "" : "",
    candidateName: "",
    phone: "",
    email: "",
    experience: "",
    currentLocation: "",
    expectedSalary: "",
    noticePeriod: "",
    cvFile: null as File | null
  });

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const { trackFieldError, trackFormSubmit } = useFormAnalytics({
    formType: 'job_application',
    formData
  });

  // Form validation setup
  const validationRules = [
    { field: 'jobTitle', required: true, errorMessage: t('validation.selectJobPosition', 'Please select a job position') },
    { ...FULL_NAME_VALIDATION, field: 'candidateName' },
    { ...PHONE_VALIDATION, field: 'phone' },
    { ...EMAIL_VALIDATION, field: 'email' },
    { field: 'experience', required: true, errorMessage: t('validation.enterExperience', 'Please enter your experience') },
    { field: 'currentLocation', required: true, errorMessage: t('validation.enterLocation', 'Please enter your current location') },
    { field: 'expectedSalary', required: true, errorMessage: t('validation.enterSalary', 'Please enter expected salary') },
    { field: 'noticePeriod', required: true, errorMessage: t('validation.selectNoticePeriod', 'Please select notice period') }
  ];

  const { errors, validateForm, validateSingleField, clearFieldError } = useFormValidation({
    rules: validationRules
  });

  // Unified file upload manager for CV
  const cvFileManager = useFileUploadManager({ 
    maxSizeInMB: 10,
    acceptedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => {
      console.log('📁 CV file updated:', file?.name);
      setFormData(prev => ({ ...prev, cvFile: file }));
    }
  });

  const handleInputChange = (field: string, value: string) => {
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
        title: t('validation.securityVerificationRequired', 'Security Verification Required'),
        description: t('validation.completeSecurityVerification', 'Please complete the security verification before submitting.'),
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 Starting job application form submission...');
    
    // Validate required fields
    const formDataForValidation = {
      jobTitle: formData.jobTitle,
      candidateName: formData.candidateName,
      phone: formData.phone,
      email: formData.email,
      experience: formData.experience,
      currentLocation: formData.currentLocation,
      expectedSalary: formData.expectedSalary,
      noticePeriod: formData.noticePeriod
    };

    const isValid = validateForm(formDataForValidation);

    if (!cvFileManager.uploadState.file) {
      toast({
        title: "❌ Missing CV File",
        description: "Please upload your CV/Resume file.",
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
      
      console.log('📤 Uploading CV file...');
      const cvUpload = await uploadFile(cvFileManager.uploadState.file!, 'atmfranchiseforms', 'job-applications');
      
      const submissionData = {
        job_title: formData.jobTitle,
        candidate_name: formData.candidateName,
        phone: formData.phone,
        email: formData.email,
        experience: formData.experience,
        current_location: formData.currentLocation,
        expected_salary: formData.expectedSalary,
        notice_period: formData.noticePeriod,
        cv_file_url: cvUpload.url,
      };

      console.log('📤 Submitting job application...');
      
      // Submit to Google Sheets via API
      const response = await fetch('https://script.google.com/macros/s/AKfycbwQkurMjeYUR5xwrXyvcPRJN-P_XXGBxRYGZhQ4_fYPOYqQ3W6X_Xs5K2y_rRNhuxBGdQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'job_applications',
          data: submissionData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });

      // With no-cors, we can't read the response, so we assume success
      console.log('✅ Job application submitted successfully');

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
        jobTitle: "",
        candidateName: "",
        phone: "",
        email: "",
        experience: "",
        currentLocation: "",
        expectedSalary: "",
        noticePeriod: "",
        cvFile: null
      });
      cvFileManager.clearFile();
      setIsCaptchaVerified(false);

    } catch (error) {
      // if (import.meta.env.DEV) { console.error('❌ Error submitting job application:', error); } // Silenced for production
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
                <CardTitle className="text-2xl font-bold text-green-600">{t('jobApplicationSubmitted')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  {t('jobApplication.thankYouMessage', "Thank you for applying! We'll review your application and get back to you soon.")}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('jobApplication.nextSteps', 'Next Steps:')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ {t('jobApplication.step1', 'Application review by HR team')}</li>
                    <li>✓ {t('jobApplication.step2', 'Initial screening call (if shortlisted)')}</li>
                    <li>✓ {t('jobApplication.step3', 'Technical/HR interviews')}</li>
                    <li>✓ {t('jobApplication.step4', 'Final decision and offer letter')}</li>
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
          <h1 className="text-xl font-bold">{t('components.jobapplicationsinglepage.text1')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Apply for <span className="text-gradient">{t('components.jobapplicationsinglepage.text2')}</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('jobApplication.subtitle', 'Join our team and build your career with us')}
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Job Information */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.jobapplicationsinglepage.text3')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('jobApplication.selectPosition', 'Select the position you\'re applying for')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">{t('jobApplication.positionApplyingFor', 'Position Applying For')} *</Label>
                    <Select value={formData.jobTitle} onValueChange={(value) => handleInputChange('jobTitle', value)}>
                      <SelectTrigger className={errors.jobTitle ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('selectJobPosition')} />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.title}>
                            {job.title} - {job.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobTitle && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.jobapplicationsinglepage.text4')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.jobapplicationsinglepage.text5')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidateName">{t('labels.fullName', 'Full Name')} *</Label>
                      <Input 
                        id="candidateName" 
                        value={formData.candidateName}
                        onChange={(e) => handleInputChange('candidateName', e.target.value)}
                        placeholder={t('placeholders.fullName', 'Enter your full name')} 
                        className={errors.candidateName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.candidateName && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.candidateName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('jobApplication.emailAddress', 'Email Address')} *</Label>
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
                      <Label htmlFor="phone">{t('labels.phone', 'Phone Number')} *</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('contactNumberPlaceholder')} 
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
                      <Label htmlFor="currentLocation">{t('jobApplication.currentLocation', 'Current Location')} *</Label>
                      <Input 
                        id="currentLocation" 
                        value={formData.currentLocation}
                        onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        placeholder={t('cityStatePlaceholder')} 
                        className={errors.currentLocation ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.currentLocation && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.currentLocation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.jobapplicationsinglepage.text6')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.jobapplicationsinglepage.text7')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">{t('labels.totalExperience', 'Total Experience')} *</Label>
                      <Input 
                        id="experience" 
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder={t('placeholders.experience', 'e.g., 3 years, Fresher, etc.')} 
                        className={errors.experience ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.experience && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expectedSalary">{t('labels.expectedSalary', 'Expected Salary')} *</Label>
                      <Input 
                        id="expectedSalary" 
                        value={formData.expectedSalary}
                        onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                        placeholder={t('placeholders.salary', 'e.g., ₹5,00,000 per annum')} 
                        className={errors.expectedSalary ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        required
                      />
                      {errors.expectedSalary && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.expectedSalary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">{t('labels.noticePeriod')} *</Label>
                    <Select value={formData.noticePeriod} onValueChange={(value) => handleInputChange('noticePeriod', value)}>
                      <SelectTrigger className={errors.noticePeriod ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('placeholders.selectNoticePeriod')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">{t('components.jobapplicationsinglepage.text8')}</SelectItem>
                        <SelectItem value="15-days">{t('noticePeriod.15days')}</SelectItem>
                        <SelectItem value="1-month">{t('noticePeriod.1month')}</SelectItem>
                        <SelectItem value="2-months">{t('noticePeriod.2months')}</SelectItem>
                        <SelectItem value="3-months">{t('noticePeriod.3months')}</SelectItem>
                        <SelectItem value="more-than-3-months">{t('components.jobapplicationsinglepage.text9')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.noticePeriod && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.noticePeriod}
                      </p>
                    )}
                  </div>
                </div>

                {/* CV Upload */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('sections.resumeUpload', 'Resume/CV Upload')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.jobapplicationsinglepage.text10')}</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cvFile" className="flex items-center gap-2">
                      {t('labels.uploadCvResume', 'Upload CV/Resume')}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cvFileManager.openFileSelector}
                        className="flex-1"
                      >
                        {t('buttons.chooseFile', 'Choose File')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cvFileManager.openCameraSelector}
                        className="flex-1"
                      >
                        {t('buttons.takePhoto', 'Take Photo')}
                      </Button>
                    </div>
                    {cvFileManager.uploadState.file && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">✅ {cvFileManager.uploadState.file.name}</p>
                      </div>
                    )}
                    <input
                      ref={cvFileManager.fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => cvFileManager.setFile(e.target.files?.[0] || null)}
                    />
                    <input
                      ref={cvFileManager.cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => cvFileManager.setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                {/* Security Verification */}
                <div className="space-y-6">
                  <div className="border-b pb-3">
                    <h3 className="text-xl font-semibold text-foreground">{t('components.jobapplicationsinglepage.text11')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('components.jobapplicationsinglepage.text12')}</p>
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
                      {t('submittingApplication')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('submitJobApplication')}
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