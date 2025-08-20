import { InfluencerFormSinglePage } from "./InfluencerFormSinglePage";
import { useTranslation } from 'react-i18next';

export function InfluencerFormProgressive() {
  const { t } = useTranslation();
  // Use the new single page component
  return <InfluencerFormSinglePage />;
}