
import React from "react";
import BecomefranchiseHero from "@/components/BecomefranchiseHero";
import WhyATM from "@/components/WhyATM";
import WLAOperators from "@/components/WLAOperators";
import Services from "@/components/Services";
import FranchiseModelsComparison from "@/components/FranchiseModelsComparison";
import FAQ from "@/components/FAQ";
import GetStarted from "@/components/GetStarted";

import { EnquiryFormProgressive } from "@/components/EnquiryFormProgressive";

const BecomefranchisePage = () => {
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
              Start Your ATM Franchise Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out our detailed enquiry form to get personalized information about ATM franchise opportunities in your area.
            </p>
          </div>
          
          <EnquiryFormProgressive />
        </div>
      </section>
    </div>
  );
};

export default BecomefranchisePage;
