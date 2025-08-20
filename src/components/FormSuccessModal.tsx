
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Phone, Mail, MessageSquare } from "lucide-react";
import { CONTACT_INFO } from "@/lib/contactInfo";

interface FormSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  nextSteps?: string[];
  showContactInfo?: boolean;
  onContinue?: () => void;
  continueText?: string;
}

export function FormSuccessModal({
  isOpen,
  onClose,
  title = "Form Submitted Successfully!",
  message = "Thank you for your submission. Our team will review your information and contact you soon.",
  nextSteps = [
    "Our team will review your submission within 24 hours",
    "You'll receive a confirmation email shortly",
    "We'll contact you to discuss the next steps"
  ],
  showContactInfo = true,
  onContinue,
  continueText = "Continue Exploring"
}: FormSuccessModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto max-h-[90vh] overflow-y-auto bg-white"
        style={{ 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          zIndex: 100
        }}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-600" />
              What happens next?
            </h4>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          {showContactInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Need immediate assistance?</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Call: {CONTACT_INFO.phoneFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Email: {CONTACT_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>{t('components.formsuccessmodal.text1')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Fixed visibility */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1 min-h-[44px] border-2 hover:bg-gray-50"
            >
              Close
            </Button>
            {onContinue && (
              <Button 
                onClick={onContinue}
                className="flex-1 min-h-[44px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                {continueText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
