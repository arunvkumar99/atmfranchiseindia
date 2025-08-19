
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProgress } from './FormProgress';
import { FormSuccessModal } from './FormSuccessModal';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';
import { useFormProgress } from '@/hooks/useFormProgress';
import { useRateLimitedSubmission } from '@/hooks/useRateLimitedSubmission';

interface FormField {
  name: string;
  required?: boolean;
  value: any;
}

interface EnhancedFormWrapperProps {
  children: React.ReactNode;
  formType: string;
  formData: Record<string, any>;
  fields: FormField[];
  onSubmit: () => Promise<any>;
  showProgress?: boolean;
  enableAutoSave?: boolean;
  successTitle?: string;
  successMessage?: string;
  nextSteps?: string[];
  onFormComplete?: () => void;
  className?: string;
}

export function EnhancedFormWrapper({
  children,
  formType,
  formData,
  fields,
  onSubmit,
  showProgress = true,
  enableAutoSave = true,
  successTitle,
  successMessage,
  nextSteps,
  onFormComplete,
  className = ""
}: EnhancedFormWrapperProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);

  // Form progress tracking
  const progress = useFormProgress({ fields });
  
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

  // Load draft on component mount
  useEffect(() => {
    const loadSavedDraft = async () => {
      if (enableAutoSave) {
        const draft = await loadDraft();
        if (draft && Object.keys(formData).length === 0) {
          // Only load draft if form is empty
          console.log('Draft available:', draft);
        }
      }
    };
    
    loadSavedDraft();
  }, [loadDraft, enableAutoSave, formData]);

  const handleSubmit = async () => {
    await submitWithRateLimit(onSubmit);
  };

  const handleSuccessModalClose = () => {
  const { t } = useTranslation('forms');
    setShowSuccessModal(false);
    onFormComplete?.();
  };

  return (
    <div className={className}>
      {/* Progress Bar */}
      {showProgress && (
        <FormProgress
          progress={progress.fieldProgress}
          completedFields={progress.completedFields}
          totalFields={progress.totalFields}
          isAutoSaving={isAutoSaving}
          lastSaved={lastSaved}
          className="mb-6"
        />
      )}

      {/* Draft Notification */}
      {hasDraft && !isAutoSaving && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-700">
            📄 We found a saved draft from your previous session. Your progress has been preserved.
          </p>
        </div>
      )}

      {/* Form Content */}
      <div className="relative">
        {children}
        
        {/* Overlay when submitting */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Submitting your form...</p>
            </div>
          </div>
        )}
      </div>

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
