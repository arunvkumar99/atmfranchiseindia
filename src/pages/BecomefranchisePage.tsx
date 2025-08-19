
import React from "react";
import { useTranslation } from "react-i18next";
import BecomefranchiseHero from "@/components/BecomefranchiseHero";
import WhyATM from "@/components/WhyATM";
import WLAOperators from "@/components/WLAOperators";
import Services from "@/components/Services";
import FranchiseModelsComparison from "@/components/FranchiseModelsComparison";
import FAQ from "@/components/FAQ";
import GetStarted from "@/components/GetStarted";

import { EnquiryFormProgressive } from "@/components/EnquiryFormProgressive";
import { useTranslation } from 'react-i18next';

const BecomefranchisePage = () => {
  const { t } = useTranslation('franchise');
  
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <BecomefranchiseHero />
      
      {/* Why ATM Section */}
      <WhyATM />
      
      {/* Services Section */}
      <Services />
      
      {/* WLA Operators Comparison */}
      <WLAOperators />
      
      {/* Franchise Comparison */}
      <FranchiseModelsComparison />
      
      {/* Enhanced Enquiry Form Section */}
      <section id="enquiry-form" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('enquiryForm.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('enquiryForm.subtitle')}
            </p>
          </div>
          
          <EnquiryFormProgressive />
        </div>
      </section>
    </div>
  );
};

export default BecomefranchisePage;
