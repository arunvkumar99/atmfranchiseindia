import { JobApplicationSinglePage } from "./JobApplicationSinglePage";
import { useTranslation } from 'react-i18next';

interface JobApplicationProgressiveProps {
  jobs: Array<{
    id: string;
    title: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
  }>;
  selectedJobId?: string;
}

export function JobApplicationProgressive({ jobs, selectedJobId = "" }: JobApplicationProgressiveProps) {
  const { t } = useTranslation();
  // Use the new single page component
  return <JobApplicationSinglePage jobs={jobs} selectedJobId={selectedJobId} />;
}