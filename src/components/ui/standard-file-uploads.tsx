// Quick update script for the other forms to use the same pattern
// Since the Agent form is now fully standardized, let me create a standardized template component

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFileUploadManager } from '@/components/ui/file-upload-manager';
import { DirectFileUpload } from '@/components/ui/direct-file-upload';

// Standard File Upload Hook Template
export const useStandardFileUploads = (formName: string) => {
  const { t } = useTranslation('forms');
  const panDocumentManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log(`📁 ${formName} - PAN document updated:`, file?.name)
  });
  
  const aadhaarFrontManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log(`📁 ${formName} - Aadhaar front updated:`, file?.name)
  });
  
  const aadhaarBackManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    onFileChange: (file) => console.log(`📁 ${formName} - Aadhaar back updated:`, file?.name)
  });
  
  const photoManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => console.log(`📁 ${formName} - Photo updated:`, file?.name)
  });

  const cvFileManager = useFileUploadManager({ 
    maxSizeInMB: 10,
    acceptedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    onFileChange: (file) => console.log(`📁 ${formName} - CV updated:`, file?.name)
  });

  const buildingPhotoManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => console.log(`📁 ${formName} - Building photo updated:`, file?.name)
  });

  const roomPhotoManager = useFileUploadManager({ 
    maxSizeInMB: 5,
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    onFileChange: (file) => console.log(`📁 ${formName} - Room photo updated:`, file?.name)
  });

  return {
    panDocumentManager,
    aadhaarFrontManager,
    aadhaarBackManager,
    photoManager,
    cvFileManager,
    buildingPhotoManager,
    roomPhotoManager,
    clearAllFiles: () => {
      panDocumentManager.clearFile();
      aadhaarFrontManager.clearFile();
      aadhaarBackManager.clearFile();
      photoManager.clearFile();
      cvFileManager.clearFile();
      buildingPhotoManager.clearFile();
      roomPhotoManager.clearFile();
    }
  };
};

// Standard File Upload Components
export const StandardDocumentUploads = ({ managers, hasError }: { 
  managers: ReturnType<typeof useStandardFileUploads>, 
  hasError: boolean 
}) => (
  <>
    <div className="grid md:grid-cols-2 gap-4">
      <DirectFileUpload
        id="panDocument"
        label="PAN Document Upload"
        accept="image/jpeg,image/jpg,image/png,.pdf"
        onFileSelect={managers.panDocumentManager.setFile}
        description="Upload JPG or PDF (Max 5MB)"
        hasError={!managers.panDocumentManager.uploadState.file && hasError}
      />
      
      <DirectFileUpload
        id="photo"
        label="Passport Size Photo"
        accept="image/*"
        onFileSelect={managers.photoManager.setFile}
        description="Recent photo (Max 5MB)"
        hasError={!managers.photoManager.uploadState.file && hasError}
      />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <DirectFileUpload
        id="aadhaarFront"
        label="Aadhaar Front Side"
        accept="image/jpeg,image/jpg,image/png,.pdf"
        onFileSelect={managers.aadhaarFrontManager.setFile}
        description="Front side (Max 5MB)"
        hasError={!managers.aadhaarFrontManager.uploadState.file && hasError}
      />
      
      <DirectFileUpload
        id="aadhaarBack"
        label="Aadhaar Back Side"
        accept="image/jpeg,image/jpg,image/png,.pdf"
        onFileSelect={managers.aadhaarBackManager.setFile}
        description="Back side (Max 5MB)"
        hasError={!managers.aadhaarBackManager.uploadState.file && hasError}
      />
    </div>
  </>
);