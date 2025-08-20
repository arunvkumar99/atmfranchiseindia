
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card } from './card';
import { Upload, Camera, File, X, CheckCircle, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  className?: string;
  description?: string;
  maxSizeInMB?: number;
  showPreview?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept = "image/jpeg,image/jpg,image/png,.pdf",
  required = true, // Changed default to true
  onFileSelect,
  className,
  description,
  maxSizeInMB = 5,
  showPreview = true
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect if user is on a mobile device
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

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }

    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith('image/') && showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
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
    // On mobile and accepts images, show contextual options
    if (isMobile && accept.includes('image')) {
      setShowOptions(true);
    } else {
      // On desktop or non-image files, directly open file browser
      fileInputRef.current?.click();
    }
  };

  const selectFromCamera = () => {
    cameraInputRef.current?.click();
    setShowOptions(false);
  };

  const selectFromFiles = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const removeFile = () => {
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getButtonText = () => {
    if (isMobile && accept.includes('image')) {
      return 'Upload File';
    }
    return accept.includes('image') ? 'Choose Photo' : 'Choose File';
  };

  const getButtonIcon = () => {
    if (isMobile && accept.includes('image')) {
      return <Upload className="h-4 w-4" />;
    }
    return accept.includes('image') ? <Camera className="h-4 w-4" /> : <File className="h-4 w-4" />;
  };

  return (
    <>
      {/* Add CSS for contextual animations and viewport safety */}
      <style>{`
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(-8px) scale(0.96); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0) scale(1); 
          }
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-out;
        }
        
        /* Ensure no horizontal overflow */
        body {
          overflow-x: hidden;
        }
      `}</style>
      
      <div className={cn("space-y-sm", className)}>
      <Label htmlFor={id} className="flex items-center gap-sm">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Mobile Options - Contextual Dropdown */}
      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40" 
            onClick={() => setShowOptions(false)}
          />
          
          {/* Contextual Menu - Professional design with semantic tokens */}
          <div className="relative">
            <div 
              className="absolute top-2 left-1/2 -translate-x-1/2 w-80 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-xl shadow-professional z-50 overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-primary px-lg py-base border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-primary-foreground">{t('components.file-upload.text1')}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOptions(false)}
                    className="h-6 w-6 p-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-primary-foreground/80 mt-1">Choose how you'd like to add your file</p>
              </div>
              
              {/* Options */}
              <div className="p-base space-y-sm">
                <Button 
                  onClick={selectFromCamera} 
                  className="w-full flex items-center justify-start gap-base h-12 text-sm font-medium bg-background hover:bg-secondary text-foreground border border-border hover:border-primary/20 transition-all duration-200"
                  variant="outline"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{t('components.file-upload.text2')}</div>
                    <div className="text-xs text-muted-foreground">{t('components.file-upload.text3')}</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={selectFromFiles} 
                  className="w-full flex items-center justify-start gap-base h-12 text-sm font-medium bg-background hover:bg-secondary text-foreground border border-border hover:border-success/20 transition-all duration-200"
                  variant="outline"
                >
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <File className="h-4 w-4 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{t('components.file-upload.text4')}</div>
                    <div className="text-xs text-muted-foreground">Browse gallery/files</div>
                  </div>
                </Button>
              </div>
              
              {/* Footer */}
              <div className="px-lg py-sm bg-secondary border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Maximum file size: {maxSizeInMB}MB • {accept.includes('image') ? 'Images' : 'Documents'} only
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200 min-h-[120px]",
          dragActive && "border-primary bg-primary/5",
          selectedFile && "border-success bg-success/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
      >
        <div className="p-lg">
          {!selectedFile ? (
            <div className="text-center space-y-lg">
              <div className="flex justify-center">
                {isMobile ? (
                  <Smartphone className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <Upload className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-sm">
                  {isMobile 
                    ? "Tap to upload file" 
                    : "Drop your file here or click to select"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Max: {maxSizeInMB}MB • Required
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={openFileSelector}
                className="flex items-center gap-sm min-h-[48px] px-xl"
              >
                {getButtonIcon()}
                <span>{getButtonText()}</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-base min-w-0 flex-1">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
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
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px] flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {preview && (
                <div className="mt-lg">
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

      {/* File input for regular file selection */}
      <Input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        required={required}
      />
      
      {/* Camera input for mobile devices */}
      {accept.includes('image') && (
        <Input
          ref={cameraInputRef}
          id={`${id}-camera`}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      )}
      </div>
    </>
  );
};
