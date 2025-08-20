import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFileUploadManager } from "@/components/ui/file-upload-manager";
import { FormSuccessModal } from "@/components/FormSuccessModal";
import { FormProgress } from "@/components/FormProgress";
import { CaptchaProtection } from "@/components/ui/captcha-protection";
import { CheckCircle, MapPin, Upload, Users, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormProgress } from "@/hooks/useFormProgress";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, WHATSAPP_VALIDATION, CITY_VALIDATION, STATE_VALIDATION, PINCODE_VALIDATION } from "@/hooks/useFormValidation";
import { useRateLimitedSubmission } from "@/hooks/useRateLimitedSubmission";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
// Supabase integration removed - now uses Google Sheets
import { uploadFile } from "@/lib/fileUpload";
import { INDIAN_STATES } from "@/lib/stateOptions";
import { useTranslation } from 'react-i18next';

const SubmitLocationSinglePage = () => {
  const { t } = useTranslation('forms');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    assistedByAgent: "no",
    agentCode: "",
    fullName: "",
    phone: "",
    whatsappPhone: "",
    email: "",
    state: "",
    city: "",
    address: "",
    locationName: "",
    district: "",
    pincode: "",
    googleMapLink: "",
    buildingPhoto: null as File | null,
    roomPhoto: null as File | null,
    additionalInfo: "",
  });

  const { toast } = useToast();
  const sessionId = `location-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const { 
    errors, 
    validateForm, 
    validateSingleField, 
    clearFieldError,
    hasErrors
  } = useFormValidation({ 
    rules: [
      FULL_NAME_VALIDATION,
      EMAIL_VALIDATION, 
      PHONE_VALIDATION,
      { ...WHATSAPP_VALIDATION, field: 'whatsappPhone' },
      CITY_VALIDATION,
      STATE_VALIDATION,
      PINCODE_VALIDATION,
      { field: 'address', required: true, minLength: 10, errorMessage: 'Please enter complete address (minimum 10 characters)' },
      { field: 'locationName', required: true, minLength: 2, errorMessage: 'Please enter location name (minimum 2 characters)' }
    ]
  });

  const {
    submitWithRateLimit,
    isSubmitting,
    isBlocked
  } = useRateLimitedSubmission({
    formType: 'location_submission',
    onError: (error) => {
      // if (import.meta.env.DEV) { console.error('Rate limit error:', error); }
    }
  });

  const { trackEvent } = useFormAnalytics({
    formType: 'location_submission',
    formData,
    enabled: true
  });

  // Progress tracking
  const fields = [
    { name: 'fullName', required: true, value: formData.fullName },
    { name: 'phone', required: true, value: formData.phone },
    { name: 'email', required: true, value: formData.email },
    { name: 'state', required: true, value: formData.state },
    { name: 'city', required: true, value: formData.city },
    { name: 'pincode', required: true, value: formData.pincode },
    { name: 'address', required: true, value: formData.address },
    { name: 'locationName', required: true, value: formData.locationName },
    { name: 'whatsappPhone', required: false, value: formData.whatsappPhone },
    { name: 'district', required: false, value: formData.district },
    { name: 'googleMapLink', required: false, value: formData.googleMapLink },
    { name: 'buildingPhoto', required: false, value: formData.buildingPhoto },
    { name: 'roomPhoto', required: false, value: formData.roomPhoto },
    { name: 'additionalInfo', required: false, value: formData.additionalInfo },
  ];

  const progress = useFormProgress({ fields });

  // Unified file upload managers
  const buildingPhotoManager = useFileUploadManager({ 
    maxSizeInMB: 10,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => {
      console.log('📁 Building photo updated:', file?.name);
      setFormData(prev => ({ ...prev, buildingPhoto: file }));
    }
  });
  
  const roomPhotoManager = useFileUploadManager({ 
    maxSizeInMB: 10,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => {
      console.log('📁 Room photo updated:', file?.name);
      setFormData(prev => ({ ...prev, roomPhoto: file }));
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
    
    trackEvent('field_complete', field);
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
        title: "Verification Required",
        description: "Please complete the security verification.",
        variant: "destructive",
      });
      return;
    }

    const validationErrors = validateForm({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      whatsappPhone: formData.whatsappPhone,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      address: formData.address,
      locationName: formData.locationName
    });
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and fix validation errors.",
        variant: "destructive",
      });
      return;
    }

    const success = await submitWithRateLimit(async () => {
      trackEvent('form_submit');

      let buildingPhotoUrl = null;
      let roomPhotoUrl = null;

      // Upload photos if provided using managers
      if (buildingPhotoManager.uploadState.file) {
        try {
          const uploadResult = await uploadFile(
            buildingPhotoManager.uploadState.file, 
            'location-photos',
            'building-photos'
          );
          buildingPhotoUrl = uploadResult.url;
        } catch (error) {
          // if (import.meta.env.DEV) { console.error('Building photo upload failed:', error); }
          toast({
            title: "Building Photo Upload Error",
            description: `Failed to upload building photo: ${error.message}. Please try again.`,
            variant: "destructive",
          });
          return false;
        }
      }

      if (roomPhotoManager.uploadState.file) {
        try {
          const uploadResult = await uploadFile(
            roomPhotoManager.uploadState.file, 
            'location-photos',
            'room-photos'
          );
          roomPhotoUrl = uploadResult.url;
        } catch (error) {
          // if (import.meta.env.DEV) { console.error('Room photo upload failed:', error); }
          toast({
            title: "Room Photo Upload Error", 
            description: `Failed to upload room photo: ${error.message}. Please try again.`,
            variant: "destructive",
          });
          return false;
        }
      }

      try {
        console.log('📤 Submitting location data...');
        
        const submissionData = {
          assisted_by_agent: formData.assistedByAgent === 'yes',
          agent_code: formData.assistedByAgent === 'yes' ? formData.agentCode : null,
          full_name: formData.fullName,
          phone: formData.phone,
          whatsapp_phone: formData.whatsappPhone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          location_name: formData.locationName,
          district: formData.district,
          pincode: formData.pincode,
          google_map_link: formData.googleMapLink,
          building_photo_url: buildingPhotoUrl,
          room_photo_url: roomPhotoUrl,
          additional_info: formData.additionalInfo
        };

        const { data, error } = await supabase.functions.invoke('form-submission', {
          body: {
            formType: 'location_submissions',
            data: submissionData,
            userAgent: navigator.userAgent,
            ipAddress: undefined
          }
        });

        if (error) {
          // if (import.meta.env.DEV) { console.error('Submission error:', error); }
          toast({
            title: "Submission Failed",
            description: `There was an error submitting your application: ${error.message}. Please try again.`,
            variant: "destructive",
          });
          return false;
        }

        if (data?.error) {
          // if (import.meta.env.DEV) { console.error('Data error:', data.error); }
          toast({
            title: "Submission Failed",
            description: `There was an error submitting your application: ${data.error}. Please try again.`,
            variant: "destructive",
          });
          return false;
        }

        trackEvent('form_submit');
        setIsSubmitted(true);
        
        // Scroll to top and focus on success message
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const successElement = document.querySelector('[data-success-message]');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        toast({
          title: "Location Submitted Successfully!",
          description: "Thank you for your submission. We'll review your location details and contact you soon.",
        });

        return true;
      } catch (error) {
        // if (import.meta.env.DEV) { console.error('Unexpected error:', error); }
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    });

    if (!success) {
      trackEvent('field_error', 'form_submission_failed');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-14">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-professional animate-fade-in" data-success-message>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">Location Submitted Successfully!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  Thank you for submitting your location details. Our team will review your submission and contact you within 24-48 hours to discuss the next steps.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold">Next Steps:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Location verification by our field team</li>
                    <li>✓ Feasibility assessment for ATM placement</li>
                    <li>✓ Commercial terms discussion</li>
                    <li>✓ Agreement and installation process</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">Need immediate assistance?</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Call: +91 9072380076</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Email: atmfranchise@pixellpay.com</span>
                    </div>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Sticky Progress Bar */}
        <div className="sticky top-0 z-10 mb-6">
          <FormProgress
            progress={progress.fieldProgress}
            completedFields={progress.completedFields}
            totalFields={progress.totalFields}
            className="shadow-lg"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Submit Your ATM Location
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your location details and become part of India's largest ATM network
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-foreground flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-3 text-primary" />
              Location Details Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Agent Assistance Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('components.submitlocationsinglepage.text1')}</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Were you assisted by one of our agents? *
                    </Label>
                    <RadioGroup
                      value={formData.assistedByAgent}
                      onValueChange={(value) => handleInputChange('assistedByAgent', value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="agent-yes" />
                        <Label htmlFor="agent-yes">Yes, I was assisted by an agent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="agent-no" />
                        <Label htmlFor="agent-no">No, I found this independently</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.assistedByAgent === 'yes' && (
                    <div className="space-y-2">
                      <Label htmlFor="agentCode" className="text-sm font-medium text-foreground">
                        Agent Code *
                      </Label>
                      <Input
                        id="agentCode"
                        type="text"
                        value={formData.agentCode}
                        onChange={(e) => handleInputChange('agentCode', e.target.value)}
                        placeholder="Enter agent code provided to you"
                        className="w-full"
                        required={formData.assistedByAgent === 'yes'}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('components.submitlocationsinglepage.text2')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Your complete name"
                      className="w-full"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('placeholders.email', 'your.email@example.com')}
                      className="w-full"
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Your 10-digit phone number"
                      className="w-full"
                      required
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappPhone" className="text-sm font-medium text-foreground">
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsappPhone"
                      type="tel"
                      value={formData.whatsappPhone}
                      onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                      placeholder="WhatsApp number (if different from phone)"
                      className="w-full"
                    />
                    {errors.whatsappPhone && (
                      <p className="text-sm text-destructive">{errors.whatsappPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('components.submitlocationsinglepage.text3')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-foreground">
                      State *
                    </Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('placeholders.state', 'Select your state')} />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Your city name"
                      className="w-full"
                      required
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium text-foreground">
                      District
                    </Label>
                    <Input
                      id="district"
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="District name"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium text-foreground">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="6-digit pincode"
                      className="w-full"
                      required
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">{errors.pincode}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Complete Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Complete address with landmarks"
                      className="w-full min-h-[80px]"
                      required
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationName" className="text-sm font-medium text-foreground">
                      Location Name *
                    </Label>
                    <Input
                      id="locationName"
                      type="text"
                      value={formData.locationName}
                      onChange={(e) => handleInputChange('locationName', e.target.value)}
                      placeholder="What do you call this location?"
                      className="w-full"
                      required
                    />
                    {errors.locationName && (
                      <p className="text-sm text-destructive">{errors.locationName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMapLink" className="text-sm font-medium text-foreground">
                      Google Maps Link
                    </Label>
                    <Input
                      id="googleMapLink"
                      type="url"
                      value={formData.googleMapLink}
                      onChange={(e) => handleInputChange('googleMapLink', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('components.submitlocationsinglepage.text4')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="buildingPhoto" className="flex items-center gap-2">
                      Building Photo
                      <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={buildingPhotoManager.openFileSelector}
                        className="flex-1"
                      >
                        Choose File
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={buildingPhotoManager.openCameraSelector}
                        className="flex-1"
                      >
                        Take Photo
                      </Button>
                    </div>
                    {buildingPhotoManager.uploadState.file && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">✅ {buildingPhotoManager.uploadState.file.name}</p>
                      </div>
                    )}
                    <input
                      ref={buildingPhotoManager.fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => buildingPhotoManager.setFile(e.target.files?.[0] || null)}
                    />
                    <input
                      ref={buildingPhotoManager.cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => buildingPhotoManager.setFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="roomPhoto" className="flex items-center gap-2">
                      Room/Space Photo
                      <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={roomPhotoManager.openFileSelector}
                        className="flex-1"
                      >
                        Choose File
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={roomPhotoManager.openCameraSelector}
                        className="flex-1"
                      >
                        Take Photo
                      </Button>
                    </div>
                    {roomPhotoManager.uploadState.file && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-700">✅ {roomPhotoManager.uploadState.file.name}</p>
                      </div>
                    )}
                    <input
                      ref={roomPhotoManager.fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => roomPhotoManager.setFile(e.target.files?.[0] || null)}
                    />
                    <input
                      ref={roomPhotoManager.cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => roomPhotoManager.setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('components.submitlocationsinglepage.text5')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-medium text-foreground">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any additional information about the location, foot traffic, accessibility, etc."
                    className="w-full min-h-[100px]"
                  />
                </div>
              </div>

              {/* Security and Submit */}
              <div className="space-y-6">
                <CaptchaProtection 
                  onVerify={setIsCaptchaVerified}
                />

                {isBlocked && (
                  <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg text-center">
                    Too many submission attempts. Please try again later.
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !isCaptchaVerified || isBlocked}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-professional"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Location...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Location Details
                    </>
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Secure & Confidential</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{t('components.submitlocationsinglepage.text6')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{t('components.submitlocationsinglepage.text7')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitLocationSinglePage;