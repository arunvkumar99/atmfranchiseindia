import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, FileText, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const UpdatedPrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in shadow-lg">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in">
              Privacy Policy
            </h1>
            <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Your privacy is our priority - effective from May 1, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-8">
                <strong>Effective Date: 01 May 2025</strong>
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Welcome to ATM Franchise India, an exclusive brand of PixellPay Innovations Pvt Ltd. We respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy outlines how we collect, use, store, and protect your data when you interact with our website, services, or contact us through any digital means.
              </p>

              {/* Information We Collect */}
              <Card className="border-2 border-blue-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We may collect the following types of personal and non-personal information:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Name, contact number, email address, and postal address
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Business and location details related to franchise interest
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Information provided through forms, emails, or direct contact
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Technical data such as IP address, browser type, and cookies
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card className="border-2 border-green-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">Your information is used to:</p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Respond to your inquiries and franchise applications
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Process and evaluate ATM franchise eligibility
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Provide ongoing support and updates related to our services
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Improve our website functionality and user experience
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Comply with legal and regulatory requirements
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Sharing and Disclosure */}
              <Card className="border-2 border-purple-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Data Sharing and Disclosure</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We do not sell or trade your personal data. However, we may share your information:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      With our affiliated ATM service providers for onboarding and processing
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      With regulatory bodies if required by law
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      With technology partners for secure infrastructure management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card className="border-2 border-orange-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Data Security</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. However, no method of online transmission or storage is 100% secure.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies and Tracking */}
              <Card className="border-2 border-teal-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Cookies and Tracking</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Our website may use cookies and similar technologies to enhance your browsing experience. You may choose to disable cookies through your browser settings.
                  </p>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card className="border-2 border-indigo-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Your Rights</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    You may request access to, correction of, or deletion of your personal information by contacting us at the email address below. We will respond in accordance with applicable data protection laws.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to this Privacy Policy */}
              <Card className="border-2 border-red-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">7. Changes to this Privacy Policy</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    ATM Franchise India reserves the right to modify or update this Privacy Policy at any time. We encourage you to review this page periodically for any changes.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 border-cyan-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">8. Contact Us</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    If you have any questions regarding this Privacy Policy or your personal data, please contact:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>ATM Franchise India</strong></p>
                    <p>📧 Email: <a href="mailto:atmindiafranchise@gmail.com" className="text-blue-600 hover:text-blue-700">atmindiafranchise@gmail.com</a></p>
                    <p>🌐 Website: <a href="http://www.atmfranchiseindia.in/" className="text-blue-600 hover:text-blue-700">www.atmfranchiseindia.in</a></p>
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

export default UpdatedPrivacyPolicy;