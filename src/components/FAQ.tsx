import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, TrendingUp, Clock } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is the minimum investment required for an ATM franchise?",
      answer: "The investment typically ranges from ₹3-8 lakhs depending on the WLA partner and location. This includes machine cost, installation, and initial working capital. We provide detailed cost breakdowns for each partner."
    },
    {
      question: "How much monthly income can I expect?",
      answer: "Our partners typically earn ₹35,000-60,000 monthly. Income depends on location, footfall, and transaction volume. Rural areas often see ₹25-40K while urban locations can generate ₹50-80K monthly."
    },
    {
      question: "How long does it take to get ROI?",
      answer: "Most partners achieve ROI within 12-18 months. High-traffic locations can see returns in 8-12 months, while smaller towns typically take 15-20 months. We provide location analysis to optimize returns."
    },
    {
      question: "What are the ongoing operational costs?",
      answer: "Monthly costs include electricity (₹3-5K), cash loading (2-3% of transactions), maintenance (₹2-3K), and internet (₹1-2K). Total operational costs are typically 15-20% of gross revenue."
    },
    {
      question: "Do I need technical knowledge to operate an ATM?",
      answer: "No technical expertise required. WLA partners provide complete training, 24/7 technical support, and remote monitoring. You mainly handle cash loading and basic maintenance coordination."
    },
    {
      question: "How is cash management handled?",
      answer: "You'll load cash based on usage patterns (typically every 2-4 days). WLA partners provide cash forecasting tools and some offer cash logistics services. Insurance covers cash-in-transit risks."
    },
    {
      question: "What locations work best for ATM placement?",
      answer: "High-footfall areas like markets, bus stands, hospitals, colleges, and commercial complexes work best. We conduct detailed location surveys and provide site approval guidance from our experience."
    },
    {
      question: "Are there any hidden costs or fees?",
      answer: "We ensure complete transparency. All costs are disclosed upfront including machine cost, installation, annual maintenance, and revenue sharing. No hidden charges - what you see is what you pay."
    },
    {
      question: "What support do you provide after franchise setup?",
      answer: "We offer ongoing business consultation, performance optimization tips, troubleshooting support, and assistance with WLA partner coordination. Our relationship continues beyond just setup."
    },
    {
      question: "Can I operate multiple ATM franchises?",
      answer: "Yes, many successful partners operate 2-5 ATMs. After your first ATM stabilizes (6-12 months), we can help identify additional locations and streamline multi-location operations."
    }
  ];

  return (
    <section className="py-16 bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get answers to the most common questions about starting your ATM franchise business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl shadow-soft hover:shadow-professional transition-shadow duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:text-primary transition-colors duration-300 min-h-[44px] text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <Card className="text-center bg-card border border-border shadow-soft hover:shadow-professional transition-shadow duration-300">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">100% Transparent</h3>
              <p className="text-muted-foreground text-sm">No hidden costs or surprise fees. Complete transparency in all dealings.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-card border border-border shadow-soft hover:shadow-professional transition-shadow duration-300">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">Proven Results</h3>
              <p className="text-muted-foreground text-sm">95% partner success rate with average ROI in 12-18 months.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-card border border-border shadow-soft hover:shadow-professional transition-shadow duration-300">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">Quick Setup</h3>
              <p className="text-muted-foreground text-sm">Fast-track approval and installation within 30-45 days.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQ;