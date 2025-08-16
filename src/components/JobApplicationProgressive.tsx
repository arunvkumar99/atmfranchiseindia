import { JobApplicationSinglePage } from "./JobApplicationSinglePage";

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
  // Use the new single page component
  return <JobApplicationSinglePage jobs={jobs} selectedJobId={selectedJobId} />;
}