import { useTranslation } from 'react-i18next';
import { AgentFormSinglePage } from "./AgentFormSinglePage";


export function AgentFormProgressive() {
  const { t } = useTranslation();
  // Use the new single page component
  return <AgentFormSinglePage />;
}