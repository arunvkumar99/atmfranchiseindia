import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2, Shield, TrendingUp, Zap, Award, CreditCard, IndianRupee, ArrowRight } from "lucide-react";
import youngEntrepreneurImage from "@/assets/young-atm-entrepreneur.jpg";
import modernAtmImage from "@/assets/modern-atm-kiosk.jpg";

const PixellpayAdvantage = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section - Optimized Height */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in shadow-lg">
              <Building2 className="w-4 h-4" />
              Powered by PixellPay
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 mb-4 leading-tight animate-fade-in">
              <span className="text-blue-600">PixellPay</span> <span className="text-purple-600">Advantage</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in mb-6">
              Comprehensive ATM franchise services with end-to-end support and proven expertise
            </p>
            
            {/* Success Story Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
              <img 
                src={youngEntrepreneurImage}
                alt="Young entrepreneur succeeding with ATM franchise business"
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h3 className="text-lg md:text-2xl font-bold mb-2">Your Success Starts Here</h3>
                  <p className="text-sm md:text-base opacity-90">
                    Join successful entrepreneurs building wealth through ATM franchises
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                ATM Franchise India – Your Trusted Partner in ATM Franchise Services
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-gray-900 mb-4">
                Our Key Services
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Powered by PixellPay | Partnered with RBI-Licensed WLA Companies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Google GMB Profile & Location Boosting */}
              <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Google GMB Profile & Location Boosting</h3>
                  <p className="text-gray-600 mb-4">Enhance your ATM visibility and online presence:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Creation of Google My Business (GMB) profile
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Location verification on Google
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Photo uploads for enhanced visibility
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      SEO optimization & meta tagging to boost search rankings
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Settlement Dispute Resolution */}
              <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Settlement Dispute Resolution</h3>
                  <p className="text-gray-600 mb-4">Smooth handling of operational issues:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Assistance in resolving settlement mismatches with WLA companies
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Customer dispute support for failed ATM withdrawals or non-dispensed cash
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Payout Delay & Calculation Discrepancy Support */}
              <Card className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Payout Delay & Calculation Discrepancy Support</h3>
                  <p className="text-gray-600 mb-4">Ensure you receive your rightful commission on time:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      Liaison with WLA companies for resolving payout delays
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      Clarification and resolution of payout calculation mismatches
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* ATM & Asset Troubleshooting */}
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">ATM & Asset Troubleshooting</h3>
                  <p className="text-gray-600 mb-4">End-to-end support for ATM hardware and network issues:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      Call log creation and tracking with WLA support
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      Assistance with escalations in case of delayed technician responses
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      Coordination with ATM, UPS/Battery, and Network teams for timely resolution
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Insurance Claim Settlement Assistance */}
              <Card className="border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Insurance Claim Settlement Assistance</h3>
                  <p className="text-gray-600 mb-4">Your backup during unforeseen incidents:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Support in case of theft or asset damage
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      Documentation & coordination with WLA company and insurance provider
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 194N TDS Tagging & Compliance */}
              <Card className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">194N TDS Tagging & Compliance</h3>
                  <p className="text-gray-600 mb-4">Avoid unnecessary TDS deductions on ATM operations:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      Assistance with TDS exemption tagging for ATM settlement accounts
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      Monthly/yearly TDS tagging with banks
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      Facilitation of Form 194N/194 TDS certificates and WLA company registration documentation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Prompt Support */}
              <Card className="border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Prompt Support</h3>
                  <p className="text-gray-600 mb-4">24/7 assistance for all your ATM business needs:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      Quick response to operational queries
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      Real-time assistance for urgent issues
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      Dedicated support team for franchise partners
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Settlement Account Opening */}
              <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">Settlement Account Opening</h3>
                  <p className="text-gray-600 mb-4">Get your ATM current account ready for operations:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                      Liaising with bank officials for current account setup
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                      Documentation and procedural support for faster approvals
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose ATM Franchise India - Enhanced with ATM Image */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                <h3 className="font-bold text-3xl text-gray-900 mb-4">Why Choose ATM Franchise India?</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  With deep expertise, a vast support network, and strong relationships with banks and WLA companies, we 
                  offer end-to-end assistance that simplifies and strengthens your ATM franchise journey.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We help navigate the complex backend processes so you can focus on growing your business and building your financial future.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={modernAtmImage}
                  alt="Modern ATM representing business opportunity"
                  className="w-full h-80 object-cover rounded-3xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-16">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-4">Important Disclaimer</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        ATM Franchise India is an assistance and facilitation partner. 
                        All ATM installation, payout, insurance, and compliance responsibilities lie with the respective WLA company 
                        and banking institution. We act as an intermediary, leveraging our network and experience to support our 
                        franchise partners. ATM Franchise India does not claim legal responsibility for the fulfilment of services under 
                        the direct scope of WLA companies or banks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PixellpayAdvantage;
