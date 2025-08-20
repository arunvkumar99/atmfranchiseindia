
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormProgress } from './FormProgress';
import { FormSuccessModal } from './FormSuccessModal';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';
import { useFormProgress } from '@/hooks/useFormProgress';
import { useRateLimitedSubmission } from '@/hooks/useRateLimitedSubmission';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormField {
  name: string;
  required?: boolean;
  value: any;
}

interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
  component: React.ReactNode;
}

interface ProgressiveFormWrapperProps {
  title: string;
  description: string;
  sections: FormSection[];
  formType: string;
  formData: Record<string, any>;
  onSubmit: () => Promise<any>;
  enableAutoSave?: boolean;
  successTitle?: string;
  successMessage?: string;
  nextSteps?: string[];
  onFormComplete?: () => void;
  className?: string;
}

export function ProgressiveFormWrapper({
  title,
  description,
  sections,
  formType,
  formData,
  onSubmit,
  enableAutoSave = true,
  successTitle,
  successMessage,
  nextSteps,
  onFormComplete,
  className = ""
}: ProgressiveFormWrapperProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);

  // Get current section progress
  const currentSectionProgress = useFormProgress({ 
    fields: sections[currentSection]?.fields || [],
    totalSteps: sections.length,
    currentStep: currentSection + 1
  });

  // Overall form progress
  const allFields = sections.flatMap(section => section.fields);
  const overallProgress = useFormProgress({ fields: allFields });

  // Auto-save functionality
  const {
    isAutoSaving,
    lastSaved,
    hasDraft,
    loadDraft,
    clearDraft
  } = useFormAutoSave({
    formType,
    sessionId,
    data: formData,
    enabled: enableAutoSave
  });

  // Rate-limited submission
  const { submitWithRateLimit, isSubmitting } = useRateLimitedSubmission({
    formType,
    onSuccess: () => {
      setShowSuccessModal(true);
      clearDraft();
    }
  });

  // Check if current section can proceed
  const canProceed = useMemo(() => {
    const currentFields = sections[currentSection]?.fields || [];
    const requiredFields = currentFields.filter(field => field.required !== false);
    return requiredFields.every(field => {
      const value = field.value;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'boolean') return true;
      return value !== null && value !== undefined && value !== '';
    });
  }, [sections, currentSection, formData]);

  const handleNext = () => {
  const { t } = useTranslation();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    await submitWithRateLimit(onSubmit);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onFormComplete?.();
  };

  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className={className}>
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-4 mb-6">
        <div className="container mx-auto px-4">
          <FormProgress
            progress={overallProgress.fieldProgress}
            completedFields={overallProgress.completedFields}
            totalFields={overallProgress.totalFields}
            currentStep={currentSection + 1}
            totalSteps={sections.length}
            isAutoSaving={isAutoSaving}
            lastSaved={lastSaved}
          />
          
          {/* Section indicators */}
          <div className="flex items-center justify-center mt-4 gap-2">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSection
                    ? 'bg-primary w-8'
                    : index < currentSection
                    ? 'bg-green-500 w-4'
                    : 'bg-muted w-4'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Draft Notification */}
      {hasDraft && !isAutoSaving && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-700">
            📄 We found a saved draft from your previous session. Your progress has been preserved.
          </p>
        </div>
      )}

      {/* Main Form Card */}
      <Card className="shadow-professional max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          
          {/* Current Section Info */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg">{sections[currentSection]?.title}</h3>
            <p className="text-sm text-muted-foreground">{sections[currentSection]?.description}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Section Content */}
          <div className="relative min-h-[400px]">
            {sections[currentSection]?.component}
            
            {/* Overlay when submitting */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">{t('forms:buttons.submittingForm', 'Submitting your form...')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('forms:buttons.previous', 'Previous')}
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentSection + 1} of {sections.length}
            </div>

            {isLastSection ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit Application
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                {t('forms:buttons.next', 'Next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Help text */}
          {!canProceed && (
            <p className="text-sm text-muted-foreground text-center">
              Please fill all required fields to continue
            </p>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <FormSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={successTitle}
        message={successMessage}
        nextSteps={nextSteps}
        onContinue={() => {
          handleSuccessModalClose();
          window.location.href = '/';
        }}
      />
    </div>
  );
}
