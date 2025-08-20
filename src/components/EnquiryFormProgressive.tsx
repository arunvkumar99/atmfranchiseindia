import { EnquiryFormSinglePage } from "./EnquiryFormSinglePage";
import { useTranslation } from 'react-i18next';

export function EnquiryFormProgressive() {
  const { t } = useTranslation();
  // Use the new single page component
  return <EnquiryFormSinglePage />;
}