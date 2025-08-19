import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Building, 
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";
import { JobApplicationProgressive } from "@/components/JobApplicationProgressive";

const JobsPage = () => {
  const { t } = useTranslation('jobs');
  const jobListings = [
    {
      id: "1",
      title: "Sales Manager – Agent Network Development",
      location: "Vytilla, Ernakulam (Work from Office)",
      type: "Full-time",
      salary: "₹35,000 – ₹40,000 Gross per month + Attractive Incentives on Sales",
      experience: "Minimum 5 years",
      department: "Sales",
      description: "We are seeking experienced and proactive Sales Managers to recruit, train, and manage a high-performing network of field agents under the Sahasra Network Program. The role focuses on expanding regional reach, ensuring effective onboarding, driving agent performance, and achieving consistent sales targets.",
      requirements: [
        "Bachelor's degree in any discipline (preferably in Business, Commerce, or related field)",
        "Minimum 5 years of experience in sales, preferably managing agents, channel partners, or sales teams",
        "Excellent leadership and communication skills in English and Hindi (mandatory); Malayalam is an added advantage",
        "Strong reporting, tracking, and goal-setting abilities",
        "Proficient in MS Office (Excel, Word, PowerPoint)",
        "Must be based in or willing to relocate to Vytilla, Ernakulam, and work from office full-time"
      ],
      responsibilities: [
        "Agent Recruitment: Identify, screen, and onboard qualified sales agents within the assigned territory",
        "Training & Onboarding: Deliver structured training and orientation to ensure agents are well-prepared and productive from Day 1",
        "Performance Monitoring: Regularly track and assess agent performance, provide coaching as needed, and ensure alignment with sales goals",
        "Target Achievement: Motivate and support agents in meeting and exceeding individual and regional sales targets",
        "Reporting & Compliance: Maintain accurate records and performance data. Submit periodic reports to the VP – Sales / Chief Business Officer and ensure compliance with company policies"
      ],
      benefits: [
        "Gross Salary: ₹35,000 – ₹40,000 per month",
        "Incentives: Performance-based monthly incentives on agent sales",
        "Career growth within a rapidly expanding fintech network",
        "Training and support from national leadership team"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t('content.join_our_growing_team', 'Join Our Growing Team')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Build Your Career in
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ATM Industry
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Join India's fastest-growing ATM franchise network. We're looking for passionate individuals 
              to help expand financial inclusion across the country.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                onClick={() => document.getElementById('job-application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Open Positions
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
                onClick={() => document.getElementById('job-application')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Current Openings */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('content.current_job_openings', 'Current Job Openings')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore exciting career opportunities in India's growing ATM franchise sector
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {jobListings.map((job) => (
              <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <Badge variant="secondary" className="text-xs">
                          {job.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-gray-900 mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-4 h-4 text-center font-semibold">₹</span>
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.experience}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('content.key_requirements', 'Key Requirements:')}</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('content.key_responsibilities', 'Key Responsibilities:')}</h4>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('content.benefits_perks', 'Benefits & Perks:')}</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={() => document.getElementById('job-application')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Apply for this Position
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Contact Section */}
        <div className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-2">{t('content.have_questions', 'Have Questions?')}</h3>
            <p className="text-blue-700 mb-6">
              Contact our HR team for more information about career opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{t('content.contact_hr_team', 'Contact HR Team')}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-blue-800">
                <Mail className="w-4 h-4" />
                <span className="font-medium">{t('content.apply_through_the_form_below', 'Apply through the form below')}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Job Application Form */}
        <div id="job-application">
          <JobApplicationProgressive jobs={jobListings} />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
