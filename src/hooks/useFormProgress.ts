
import { useMemo } from 'react';

interface FormField {
  name: string;
  required?: boolean;
  value: any;
}

interface UseFormProgressOptions {
  fields: FormField[];
  totalSteps?: number;
  currentStep?: number;
}

export function useFormProgress({ 
  fields, 
  totalSteps = 1, 
  currentStep = 1 
}: UseFormProgressOptions) {
  const progress = useMemo(() => {
    const requiredFields = fields.filter(field => field.required !== false);
    const completedFields = requiredFields.filter(field => {
      const value = field.value;
      
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      
      if (typeof value === 'boolean') {
        return true; // Boolean fields are always considered complete
      }
      
      return value !== null && value !== undefined && value !== '';
    });

    const fieldProgress = requiredFields.length > 0 
      ? (completedFields.length / requiredFields.length) * 100 
      : 100;

    const stepProgress = totalSteps > 1 
      ? ((currentStep - 1 + fieldProgress / 100) / totalSteps) * 100
      : fieldProgress;

    return {
      fieldProgress: Math.round(fieldProgress),
      stepProgress: Math.round(stepProgress),
      completedFields: completedFields.length,
      totalFields: requiredFields.length,
      currentStep,
      totalSteps,
      isComplete: completedFields.length === requiredFields.length
    };
  }, [fields, totalSteps, currentStep]);

  return progress;
}
