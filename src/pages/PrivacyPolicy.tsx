import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, FileText, Shield, Eye, Users, Clock, Database, Key } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium animate-fade-in shadow-lg">
                <Shield className="w-4 h-4" />
                Privacy Protection
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in">
              Privacy Policy
            </h1>
            <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Your privacy and data protection are our priorities
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
                At ATM Franchise India, operated by PixellPay Innovations Pvt Ltd, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
              </p>

              {/* Information We Collect */}
              <Card className="border-2 border-blue-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Information We Collect</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We collect information you provide directly to us, such as when you create an account, submit a franchise application, or contact us for support.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">Personal Information includes:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        Name, email address, phone number
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        Business information and financial details
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        Location and address information
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                        Documentation for verification purposes
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card className="border-2 border-green-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">How We Use Your Information</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect to provide, maintain, and improve our services.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">We use your information to:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        Process franchise applications and agreements
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        Provide customer support and respond to inquiries
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        Send important updates about our services
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        Verify identity and prevent fraud
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        Comply with legal obligations
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Information Sharing */}
              <Card className="border-2 border-orange-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Information Sharing</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">We may share information with:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        RBI licensed banking partners for ATM operations
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        Service providers who assist in our operations
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        Legal authorities when required by law
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                        Professional advisors and auditors
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card className="border-2 border-purple-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Security</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">Security measures include:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                        Encryption of sensitive data
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                        Secure data transmission protocols
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                        Limited access to personal information
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                        Regular security audits and updates
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card className="border-2 border-teal-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Rights</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    You have certain rights regarding your personal information, subject to applicable laws.
                  </p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">Your rights include:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                        Access to your personal information
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                        Correction of inaccurate information
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                        Deletion of your personal information
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                        Objection to processing in certain circumstances
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                        Data portability where applicable
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Us */}
              <Card className="border-2 border-red-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-3 text-gray-700 mb-4">
                    <p><strong>Email:</strong> <a href="mailto:atmfranchise@pixellpay.com" className="text-blue-600 hover:text-blue-700">atmfranchise@pixellpay.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+919072380076" className="text-blue-600 hover:text-blue-700">+91 9072380076</a></p>
                  </div>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;