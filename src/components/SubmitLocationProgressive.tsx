import SubmitLocationSinglePage from "./SubmitLocationSinglePage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DirectFileUpload } from "@/components/ui/direct-file-upload";
import { FormProgress } from "@/components/FormProgress";
import { FormSuccessModal } from "@/components/FormSuccessModal";
import { CaptchaProtection } from "@/components/ui/captcha-protection";
import StickyHeader from "@/components/StickyHeader";
import { CheckCircle, MapPin, ArrowLeft, ArrowRight, Upload, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormProgress } from "@/hooks/useFormProgress";
import { useFormAutoSave } from "@/hooks/useFormAutoSave";
import { useRateLimitedSubmission } from "@/hooks/useRateLimitedSubmission";
import { useFormAnalytics } from "@/hooks/useFormAnalytics";
import { useFormValidation, FULL_NAME_VALIDATION, EMAIL_VALIDATION, PHONE_VALIDATION, WHATSAPP_VALIDATION, CITY_VALIDATION, STATE_VALIDATION, PINCODE_VALIDATION } from "@/hooks/useFormValidation";
// Supabase integration removed - now uses Google Sheets
import { uploadFile } from "@/lib/fileUpload";
import { INDIAN_STATES } from "@/lib/stateOptions";

const SubmitLocationProgressive = () => {
  // Use the new single page component
  return <SubmitLocationSinglePage />;
};

export default SubmitLocationProgressive;