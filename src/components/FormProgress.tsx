
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Save } from "lucide-react";

interface FormProgressProps {
  progress: number;
  completedFields: number;
  totalFields: number;
  currentStep?: number;
  totalSteps?: number;
  isAutoSaving?: boolean;
  lastSaved?: Date | null;
  className?: string;
}

export function FormProgress({
  progress,
  completedFields,
  totalFields,
  currentStep = 1,
  totalSteps = 1,
  isAutoSaving = false,
  lastSaved,
  className = ""
}: FormProgressProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          Form Progress
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-600">
          {isAutoSaving && (
            <div className="flex items-center gap-1 text-blue-600">
              <Save className="w-3 h-3 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
          
          {lastSaved && !isAutoSaving && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Saved {formatLastSaved(lastSaved)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {completedFields} of {totalFields} fields completed
          </span>
          <span className="font-medium text-blue-600">{progress}%</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {totalSteps > 1 && (
          <div className="text-xs text-gray-500 text-center">
            Step {currentStep} of {totalSteps}
          </div>
        )}
      </div>
    </div>
  );
}
