import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import vakrangeeLogo from "@/assets/vakrangee-logo.png";
import findiLogo from "@/assets/findi-logo.png";

const WLAOperators = () => {
  const { t } = useTranslation('franchise');
  const operators = [
    {
      name: "EPS BANCS",
      logo: "https://via.placeholder.com/200x80/ffffff/333333?text=EPS+BANCS",
      alt: "EPS BANCS White Label ATM"
    },
    {
      name: "FINDI",
      logo: findiLogo,
      alt: "FINDI White Label ATM"
    },
    {
      name: "India1",
      logo: "https://via.placeholder.com/200x80/ffffff/333333?text=India1",
      alt: "India1 White Label ATM"
    },
    {
      name: "Vakrangee",
      logo: vakrangeeLogo,
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