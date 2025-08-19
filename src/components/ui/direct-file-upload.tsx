import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card } from './card';
import { Camera, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DirectFileUploadProps {
  id: string;
  label: string;
  accept?: string;
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  className?: string;
  description?: string;
  maxSizeInMB?: number;
  showPreview?: boolean;
  hasError?: boolean;
}

export const DirectFileUpload: React.FC<DirectFileUploadProps> = ({
  id,
  label,
  accept = "image/jpeg,image/jpg,image/png,.pdf",
  required = true,
  onFileSelect,
  className,
  description,
  maxSizeInMB = 5,
  showPreview = true,
  hasError = false
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
  const { t } = useTranslation('forms');
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             ('ontouchstart' in window) || 
             (navigator.maxTouchPoints > 0);
    };
    setIsMobile(checkMobile());
  }, []);

  const validateFile = (file: File): string | null => {
    console.log('🔍 File validation (permissive mode):', {
      name: file.name,
      type: file.type,
      size: file.size,
      acceptedTypes: accept.split(',').map(type => type.trim())
    });

    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    // Check for empty files
    if (file.size === 0) {
      return 'File appears to be empty';
    }

    // Accept ALL files - very permissive validation
    console.log('✅ File accepted with permissive validation');
    return null;
  };

  const generatePreview = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      // Only generate preview for images
      if (file.type.startsWith('image/') || !file.type || file.type === 'image/*') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const processFile = async (file: File) => {
    console.log('📁 Processing file:', {
      file: { name: file.name, type: file.type, size: file.size }
    });

    // Use the original file - validation will handle camera files appropriately
    const processedFile = file;

    // Validate file
    const validationError = validateFile(processedFile);
    if (validationError) {
      console.error('❌ File validation failed:', validationError);
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Generate preview
    const previewUrl = await generatePreview(processedFile);

    // Update state
    setSelectedFile(processedFile);
    setPreview(previewUrl);
    onFileSelect(processedFile);

    console.log('✅ File successfully processed:', {
      name: processedFile.name,
      type: processedFile.type,
      hasPreview: !!previewUrl,
      size: processedFile.size
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input
    event.target.value = '';
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('📱 Camera file captured:', {
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        hasEmptyType: !file.type || file.type === ''
      } : null
    });
    
    if (file) {
      processFile(file);
    }
    // Reset input
    event.target.value = '';
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelect(null);
    
    // Clear input values
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const openCameraSelector = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={id} className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          selectedFile && "border-green-500 bg-green-50/50",
          hasError && "border-red-500 bg-red-50/50",
        )}
      >
        <div className="p-4">
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <File className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Upload Required Document
                </p>
                <p className="text-xs text-muted-foreground">
                  Max: {maxSizeInMB}MB • Supported formats: {accept}
                </p>
              </div>
              
              {/* Direct action buttons */}
              <div className="flex gap-2">
                {isMobile && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCameraSelector}
                    className="flex-1 flex items-center gap-2 min-h-[40px]"
                  >
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFileSelector}
                  className="flex-1 flex items-center gap-2 min-h-[40px]"
                >
                  <File className="h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-destructive min-h-[40px] min-w-[40px] flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {preview && showPreview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-32 rounded-lg border mx-auto"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file inputs */}
      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
        required={required}
      />
      
      {isMobile && (
        <Input
          ref={cameraInputRef}
          id={`${id}-camera`}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraCapture}
        />
      )}
    </div>
  );
};