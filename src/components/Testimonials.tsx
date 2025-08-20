import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      name: t('testimonials.items.rajesh.name', 'Rajesh Kumar'),
      location: t('testimonials.items.rajesh.location', 'Mumbai, Maharashtra'),
      business: t('testimonials.items.rajesh.business', 'EPS ATM Franchise'),
      rating: 5,
      revenue: t('testimonials.items.rajesh.revenue', '₹45,000/month'),
      testimonial: t('testimonials.items.rajesh.testimonial', 'ATM Franchise India guided me through every step. Within 8 months, I\'m earning ₹45,000 monthly with minimal effort. Best investment decision ever!'),
      months: 8
    },
    {
      name: t('testimonials.items.priya.name', 'Priya Sharma'),
      location: t('testimonials.items.priya.location', 'Bangalore, Karnataka'),
      business: t('testimonials.items.priya.business', 'Vakrangee Partnership'),
      rating: 5,
      revenue: t('testimonials.items.priya.revenue', '₹38,000/month'),
      testimonial: t('testimonials.items.priya.testimonial', "The team's expertise in WLA partnerships is unmatched. My ATM is generating consistent ₹38,000 monthly income in just 6 months."),
      months: 6
    },
    {
      name: t('testimonials.items.amit.name', 'Amit Patel'),
      location: t('testimonials.items.amit.location', 'Ahmedabad, Gujarat'),
      business: t('testimonials.items.amit.business', 'Indicash Franchise'),
      rating: 5,
      revenue: t('testimonials.items.amit.revenue', '₹52,000/month'),
      testimonial: t('testimonials.items.amit.testimonial', 'Professional guidance and complete transparency. ROI achieved in 14 months with ₹52,000 monthly passive income. Highly recommended!'),
      months: 14
    },
    {
      name: t('testimonials.items.sanjay.name', 'Sanjay Verma'),
      location: t('testimonials.items.sanjay.location', 'Pune, Maharashtra'),
      business: t('testimonials.items.sanjay.business', 'Hitachi ATM Partner'),
      rating: 5,
      revenue: t('testimonials.items.sanjay.revenue', '₹42,000/month'),
      testimonial: t('testimonials.items.sanjay.testimonial', 'Excellent support from start to finish. The team helped me select the perfect location and WLA partner. Now earning steady passive income with minimal daily involvement.'),
      months: 10
    }
  ];

  return (
    <section className="py-16 bg-background" style={{ scrollBehavior: 'smooth' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            {t('testimonials.badge', 'Success Stories')}
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-6">
            {t('testimonials.title', 'Real Results from Our Partners')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('testimonials.subtitle', 'Don\'t just take our word for it. Here are genuine success stories from our franchise partners across India.')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group bg-card border border-border shadow-professional hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="w-6 h-6 text-blue-500 mb-4 opacity-60" />
                
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.testimonial}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                      <p className="text-xs text-blue-600 font-medium">{testimonial.business}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{testimonial.revenue}</div>
                      <div className="text-xs text-gray-500">{t('testimonials.monthsLabel', 'in {{months}} months', { months: testimonial.months })}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="font-bold text-xl text-gray-900 mb-2">{t('testimonials.performance.title', 'Average Partner Performance')}</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹45K+</div>
                <div className="text-sm text-gray-600">{t('testimonials.performance.income', 'Avg Monthly Income')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12-18</div>
                <div className="text-sm text-gray-600">{t('testimonials.performance.roi', 'Months to ROI')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">{t('testimonials.performance.success', 'Success Rate')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;