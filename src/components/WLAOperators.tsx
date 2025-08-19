import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const WLAOperators = () => {
  const { t } = useTranslation('forms');
  const operators = [
    {
      name: "EPS BANCS",
      logo: "/lovable-uploads/6fa0c71a-d251-4135-91c4-5c01825640b7.png",
      alt: "EPS BANCS White Label ATM"
    },
    {
      name: "FINDI",
      logo: "/lovable-uploads/450ec6fe-1efb-4ba1-823b-12a69da1de75.png",
      alt: "FINDI White Label ATM"
    },
    {
      name: "India1",
      logo: "/lovable-uploads/4d8d6356-0d3e-4ee5-92bd-5543de99432a.png",
      alt: "India1 White Label ATM"
    },
    {
      name: "Vakrangee",
      logo: "/lovable-uploads/9e9f2bcc-4064-4a3b-841a-0ef244e69b37.png",
      alt: "Vakrangee White Label ATM"
    }
  ];

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground" id="wla-comparison">
              RBI Licensed WLA Operators
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Partner with trusted and RBI licensed White Label ATM operators
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
              {operators.map((operator, index) => (
                <div 
                  key={index}
                  className="group flex flex-col items-center justify-center p-6 bg-background rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border/50 w-full"
                >
                  <div className="w-full h-16 flex items-center justify-center mb-3">
                    <img
                      src={operator.logo}
                      alt={operator.alt}
                      className="max-h-12 max-w-full object-contain transition-transform group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-center text-foreground">{operator.name}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WLAOperators;