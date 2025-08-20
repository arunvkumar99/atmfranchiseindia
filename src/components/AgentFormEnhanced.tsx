import { useState } from "react";
import { INDIAN_STATES } from "@/lib/stateOptions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
// Supabase integration removed - now uses Google Sheets
import { DirectFileUpload } from "@/components/ui/direct-file-upload";
import { uploadFile } from "@/lib/fileUpload";
import { EnhancedFormWrapper } from "./EnhancedFormWrapper";
import { CaptchaProtection } from "./ui/captcha-protection";
import { SocialProofElements } from "./SocialProofElements";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { useTranslation } from 'react-i18next';

export function AgentFormEnhanced() {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
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
    joiningAs: "individual",
    whyJoin: "",
    languages: [] as string[],
    panDocument: null as File | null,
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    photo: null as File | null,
  });

  const { trackFieldError, trackFormSubmit } = useFormAnalytics({
    formType: 'agent_application',
    formData
  });

  // Convert formData to fields array for progress tracking
  const formFields = [
    { name: 'fullName', required: true, value: formData.fullName },
    { name: 'gender', required: true, value: formData.gender },
    { name: 'dateOfBirth', required: true, value: `${formData.dateOfBirth.day}${formData.dateOfBirth.month}${formData.dateOfBirth.year}` },
    { name: 'phone', required: true, value: formData.phone },
    { name: 'whatsappPhone', required: true, value: formData.whatsappPhone },
    { name: 'email', required: true, value: formData.email },
    { name: 'panNumber', required: true, value: formData.panNumber },
    { name: 'aadhaarNumber', required: true, value: formData.aadhaarNumber },
    { name: 'permanentAddress', required: true, value: formData.permanentAddress },
    { name: 'currentAddress', required: true, value: formData.currentAddress },
    { name: 'state', required: true, value: formData.state },
    { name: 'district', required: true, value: formData.district },
    { name: 'whyJoin', required: true, value: formData.whyJoin },
    { name: 'languages', required: true, value: formData.languages },
    { name: 'panDocument', required: true, value: formData.panDocument },
    { name: 'aadhaarFront', required: true, value: formData.aadhaarFront },
    { name: 'aadhaarBack', required: true, value: formData.aadhaarBack },
    { name: 'photo', required: true, value: formData.photo },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    console.log('📱 Agent Enhanced form file change:', {
      field,
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        isCameraCapture: file.name.includes('image_') || file.name.includes('IMG_') || file.type === ''
      } : null,
      timestamp: new Date().toISOString()
    });
    
    setFormData(prev => ({ ...prev, [field]: file }));
    
    if (file) {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isCameraCapture: file.name.includes('image_') || file.name.includes('IMG_') || file.type === ''
      };
      localStorage.setItem(`agent_enhanced_form_${field}`, JSON.stringify(fileData));
      console.log('📁 Agent Enhanced form file stored:', { field, fileData });
    } else {
      localStorage.removeItem(`agent_enhanced_form_${field}`);
    }
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: { ...prev.dateOfBirth, [field]: value }
    }));
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, language]
        : prev.languages.filter(l => l !== language)
    }));
  };

  const handleSubmit = async () => {
    // CAPTCHA check
    if (!captchaVerified) {
      trackFieldError('captcha', 'CAPTCHA verification required');
      toast({
        title: "Security Verification Required",
        description: "Please complete the security verification before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Validation logic (same as before)
    const { fullName, phone, whatsappPhone, email, panNumber, aadhaarNumber, permanentAddress, currentAddress, state, district, whyJoin } = formData;
    const { day, month, year } = formData.dateOfBirth;
    
    const missingFields = [];
    if (!fullName) missingFields.push('Full Name');
    if (!phone) missingFields.push('Phone Number');
    if (!whatsappPhone) missingFields.push('WhatsApp Number');
    if (!email) missingFields.push('Email Address');
    if (!panNumber) missingFields.push('PAN Number');
    if (!aadhaarNumber) missingFields.push('Aadhaar Number');
    if (!permanentAddress) missingFields.push('Permanent Address');
    if (!currentAddress) missingFields.push('Current Address');
    if (!state) missingFields.push('State');
    if (!district) missingFields.push('District');
    if (!whyJoin) missingFields.push('Why do you want to join');
    if (!day || !month || !year) missingFields.push('Date of Birth');
    if (formData.languages.length === 0) missingFields.push('Languages');
    if (!formData.panDocument) missingFields.push('PAN Document Upload');
    if (!formData.aadhaarFront) missingFields.push('Aadhaar Front Upload');
    if (!formData.aadhaarBack) missingFields.push('Aadhaar Back Upload');
    if (!formData.photo) missingFields.push('Passport Size Photo Upload');

    if (missingFields.length > 0) {
      trackFieldError('validation', `Missing fields: ${missingFields.join(', ')}`);
      toast({
        title: "Missing Required Fields",
        description: `Please fill: ${missingFields.join(', ')}`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    try {
      // File uploads
      console.log('🔄 Starting file uploads...');
      
      const panUpload = await uploadFile(formData.panDocument, 'atmfranchiseforms', 'agent-documents');
      const aadhaarFrontUpload = await uploadFile(formData.aadhaarFront, 'atmfranchiseforms', 'agent-documents');
      const aadhaarBackUpload = await uploadFile(formData.aadhaarBack, 'atmfranchiseforms', 'agent-documents');
      const photoUpload = await uploadFile(formData.photo, 'atmfranchiseforms', 'agent-documents');
      
      const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const submissionData = {
        full_name: fullName,
        gender: formData.gender,
        date_of_birth: dateOfBirth,
        phone,
        whatsapp_phone: whatsappPhone,
        email,
        pan_number: panNumber,
        aadhaar_number: aadhaarNumber,
        permanent_address: permanentAddress,
        current_address: currentAddress,
        state,
        district,
        joining_as: formData.joiningAs,
        why_join: whyJoin,
        languages: formData.languages,
        pan_document_url: panUpload.url,
        aadhaar_front_url: aadhaarFrontUpload.url,
        aadhaar_back_url: aadhaarBackUpload.url,
        photo_url: photoUpload.url,
      };

      // Submit to Google Sheets
      const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbxPgePeGgOOe7V9Q4CPSXhJ_xKLxNqMLk_2m0d1aFUFvMC9wFUFZNUKxTq-6AvL0wpK/exec';
      
      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'agent_submissions',
          timestamp: new Date().toISOString(),
          ...submissionData,
          userAgent: navigator.userAgent
        }),
        mode: 'no-cors'
      });

      console.log('Agent form submitted to Google Sheets');

      trackFormSubmit(true);
      
      // Show success message with proper mobile positioning
      toast({
        title: "✅ Application Submitted Successfully!",
        description: "Thank you! We'll contact you within 24 hours.",
        variant: "default",
        duration: 6000
      });
      
      // Prevent auto-scroll on mobile by maintaining current scroll position
      const currentScrollPosition = window.scrollY;
      
      // Reset form
      setFormData({
        fullName: "",
        gender: "male",
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
        joiningAs: "individual",
        whyJoin: "",
        languages: [],
        panDocument: null,
        aadhaarFront: null,
        aadhaarBack: null,
        photo: null,
      });
      
      // Restore scroll position after form reset to prevent mobile scroll jump
      setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
      }, 100);

    } catch (error) {
      console.error('Error submitting agent application:', error);
      trackFormSubmit(false, error.message);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2">
        <EnhancedFormWrapper
          formType="agent_application"
          formData={formData}
          fields={formFields}
          onSubmit={handleSubmit}
          successTitle="Agent Application Submitted!"
          successMessage="Thank you for joining our agent network. We'll contact you within 24 hours to discuss next steps."
          nextSteps={[
            "Verification of your documents",
            "Training schedule coordination", 
            "Territory assignment discussion",
            "Commission structure briefing"
          ]}
          className="space-y-6"
        >
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Agent Application Form</CardTitle>
              <CardDescription>
                Join our network and start earning commissions by helping entrepreneurs set up ATM franchises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name as per PAN card" 
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Your Gender *</Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange('gender', value)}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth as in PAN Card *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select value={formData.dateOfBirth.day} onValueChange={(value) => handleDateChange('day', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 31}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={formData.dateOfBirth.month} onValueChange={(value) => handleDateChange('month', value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('time.month', 'Month')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={formData.dateOfBirth.year} onValueChange={(value) => handleDateChange('year', value)}>
                      <SelectTrigger className="w-full">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Primary contact number" 
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input 
                      id="whatsapp" 
                      value={formData.whatsappPhone}
                      onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                      placeholder="WhatsApp active number" 
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address" 
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Card Number (Format: ABCDE1234F) *</Label>
                  <Input 
                    id="panNumber" 
                    value={formData.panNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                      handleInputChange('panNumber', value);
                    }}
                    placeholder="ABCDE1234F" 
                    maxLength={10}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    className="uppercase w-full" 
                    required
                  />
                  <p className="text-xs text-muted-foreground">Format: 5 letters + 4 numbers + 1 letter</p>
                </div>

                <DirectFileUpload
                  id="panDocument"
                  label="Upload Front Side of your PAN Card *"
                  accept="image/jpeg,image/jpg,image/png,.pdf"
                  onFileSelect={(file) => handleFileChange('panDocument', file)}
                  description="Upload clear JPG or PDF of PAN card front side (Required)"
                  maxSizeInMB={5}
                  className="w-full"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Card Number (12 digits) *</Label>
                  <Input 
                    id="aadhaarNumber" 
                    value={formData.aadhaarNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                      handleInputChange('aadhaarNumber', value);
                    }}
                    placeholder="123456789012 (12 digits only)" 
                    maxLength={12}
                    pattern="[0-9]{12}"
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter exactly 12 digits without spaces or hyphens</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <DirectFileUpload
                      id="aadhaarFront"
                      label="Upload Aadhaar Front Side *"
                      accept="image/jpeg,image/jpg,image/png,.pdf"
                      onFileSelect={(file) => handleFileChange('aadhaarFront', file)}
                      description="Upload JPG or PDF of Aadhaar front side (Required)"
                      maxSizeInMB={5}
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <DirectFileUpload
                      id="aadhaarBack"
                      label="Upload Aadhaar Back Side *"
                      accept="image/jpeg,image/jpg,image/png,.pdf"
                      onFileSelect={(file) => handleFileChange('aadhaarBack', file)}
                      description="Upload JPG or PDF of Aadhaar back side (Required)"
                      maxSizeInMB={5}
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">Permanent Address *</Label>
                  <Textarea 
                    id="permanentAddress" 
                    value={formData.permanentAddress}
                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                    placeholder="Enter your permanent address here" 
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAddress">Current Address *</Label>
                  <Textarea 
                    id="currentAddress" 
                    value={formData.currentAddress}
                    onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                    placeholder="Enter your current address here" 
                    className="w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Your State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Choose your state" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-lg z-50">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District of Residence *</Label>
                    <Input 
                      id="district" 
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Enter your district" 
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <DirectFileUpload
                  id="photo"
                  label="Upload Passport Size Photo *"
                  accept="image/*"
                  onFileSelect={(file) => handleFileChange('photo', file)}
                  description="Upload your recent passport size photo (Required)"
                  maxSizeInMB={5}
                  className="w-full"
                  required
                />
              </div>

              {/* Professional Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Professional Details</h3>
                
                <div className="space-y-2">
                  <Label>Are you Joining As (Please choose from Below): *</Label>
                  <RadioGroup 
                    value={formData.joiningAs} 
                    onValueChange={(value) => handleInputChange('joiningAs', value)}
                    className="flex gap-4 sm:gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business-owner" id="business-owner" />
                      <Label htmlFor="business-owner">Business Owner</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyJoin">Why do you want to Join Sahasra Network as Agent *</Label>
                  <Textarea 
                    id="whyJoin" 
                    value={formData.whyJoin}
                    onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                    placeholder="Tell us about your motivation and goals as an agent" 
                    className="min-h-[100px] w-full" 
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Languages You Can Speak (Please tick whichever apply) *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox 
                          id={language.toLowerCase()} 
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                        />
                        <Label htmlFor={language.toLowerCase()}>{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CAPTCHA Protection */}
              <CaptchaProtection 
                onVerify={setCaptchaVerified}
                className="mt-6"
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={!captchaVerified}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Submit Agent Application
                </Button>
                {!captchaVerified && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Please complete the security verification above to submit your application
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </EnhancedFormWrapper>
      </div>

      {/* Right Column - Social Proof & Information */}
      <div className="space-y-6">
        <SocialProofElements variant="compact" />
        <SocialProofElements variant="stats" />
        <SocialProofElements variant="testimonials" />
        <SocialProofElements variant="trust-signals" />
      </div>
    </div>
  );
}
