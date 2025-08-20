import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card } from './card';
import { Upload, Camera, File, X, CheckCircle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFileUploadManager } from './file-upload-manager';

interface EnhancedFileUploadProps {
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

export const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
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
  const [dragActive, setDragActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Use the file upload manager for consistent handling
  const fileManager = useFileUploadManager({
    maxSizeInMB,
    acceptedTypes: accept.split(',').map(type => type.trim()),
    onFileChange: (file) => {
      console.log('📁 Enhanced upload calling onFileSelect:', {
        file: file ? { name: file.name, type: file.type, size: file.size } : null
      });
      onFileSelect(file);
    }
  });

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      fileManager.setFile(files[0]).then(result => {
        if (!result.success && result.error) {
          toast({
            title: "Invalid File",
            description: result.error,
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const openFileSelector = () => {
    console.log('📱 Upload button clicked:', { isMobile, accept });
    
    if (isMobile) {
      setShowOptions(true);
    } else {
      fileManager.openFileSelector();
    }
  };

  const selectFromCamera = () => {
    console.log('📱 Camera capture initiated');
    fileManager.openCameraSelector();
    setShowOptions(false);
  };

  const selectFromFiles = () => {
    fileManager.openFileSelector();
    setShowOptions(false);
  };

  const { uploadState } = fileManager;
  const selectedFile = uploadState.file;
  const preview = uploadState.preview;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Mobile Options Modal */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          onClick={() => setShowOptions(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 transform transition-all duration-300 ease-out scale-100 opacity-100" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-center">{t('components.enhanced-file-upload.text1')}</h3>
              <p className="text-blue-100 text-center text-sm mt-1">{t('components.enhanced-file-upload.text2')}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <Button 
                onClick={selectFromCamera} 
                className="w-full flex items-center justify-center gap-3 h-14 text-lg font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <Camera className="h-6 w-6" />
                📸 Take Photo
              </Button>
              
              <Button 
                onClick={selectFromFiles} 
                className="w-full flex items-center justify-center gap-3 h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <File className="h-6 w-6" />
                📁 Choose File
              </Button>
              
              <Button 
                onClick={() => setShowOptions(false)} 
                className="w-full h-12 text-gray-600 hover:text-gray-800 rounded-xl border border-gray-300 hover:border-gray-400 transition-all"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200 min-h-[120px]",
          dragActive && "border-primary bg-primary/5",
          selectedFile && "border-green-500 bg-green-50/50",
          hasError && "border-red-500 bg-red-50/50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
      >
        <div className="p-4 sm:p-6">
          {!selectedFile ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {isMobile ? (
                  <Smartphone className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {isMobile 
                    ? "Tap to upload file" 
                    : "Drop your file here or click to select"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Max: {maxSizeInMB}MB • Required
                  {isMobile ? " • Camera + File options" : " • File browser"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={openFileSelector}
                className="flex items-center gap-2 min-h-[48px] px-6"
              >
                {isMobile ? <Upload className="h-4 w-4" /> : <File className="h-4 w-4" />}
                <span>{isMobile ? 'Upload File' : 'Select File'}</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
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
                  onClick={fileManager.clearFile}
                  className="text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px] flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-lg border mx-auto"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file inputs */}
      <Input
        ref={fileManager.fileInputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            fileManager.setFile(file).then(result => {
              if (!result.success && result.error) {
                toast({
                  title: "Invalid File",
                  description: result.error,
                  variant: "destructive",
                });
              }
            });
          }
        }}
        required={required}
      />
      
      <Input
        ref={fileManager.cameraInputRef}
        id={`${id}-camera`}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          console.log('📱 Camera file captured:', {
            file: file ? {
              name: file.name,
              type: file.type,
              size: file.size,
              hasEmptyType: !file.type || file.type === ''
            } : null
          });
          
          if (file) {
            fileManager.setFile(file).then(result => {
              if (!result.success && result.error) {
                toast({
                  title: "Camera Error",
                  description: result.error,
                  variant: "destructive",
                });
              }
            });
          }
          
          // Reset input
          e.target.value = '';
        }}
      />
    </div>
  );
};