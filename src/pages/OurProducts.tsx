import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, Globe, Package, MapPin, TrendingUp, Shield, Users, Star, ArrowRight, Zap, Award, Target, Sparkles, Clock, MoveRight, PhoneCall } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';

const OurProducts = () => {
  const { t } = useTranslation('products');
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t('hero.titles.solutions', 'Solutions'),
      t('hero.titles.advantage', 'Advantage'),
      t('hero.titles.products', 'Products'),
      t('hero.titles.success', 'Success'),
      t('hero.titles.excellence', 'Excellence')
    ],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Modern Hero Section with Animated Text */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center py-32">
            <motion.div 
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium mb-12 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              {t('hero.badge', 'Premium Business Solutions')}
              <Package className="w-5 h-5 text-purple-400 animate-pulse delay-500" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl max-w-5xl tracking-tighter text-center font-bold mx-auto mb-8 leading-tight">
              <motion.span 
                className="block text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {t('title', 'हमारे एटीएम उत्पाद और सेवाएं')}
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl leading-relaxed text-blue-100 max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t('subtitle', 'आपकी आवश्यकताओं के अनुरूप व्यापक एटीएम फ्रैंचाइज़ी समाधान')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Product 1: ATM Franchise */}
      <section className="relative py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('atm.title')}
                  </span>
                </h2>
                
                <p className="text-xl text-slate-600 leading-relaxed">
                  {t('atm.description')}
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">{t('atm.benefits.title')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{t('atm.benefits.passive')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{t('atm.benefits.commission')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{t('atm.benefits.footfall')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{t('atm.benefits.community')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{t('atm.benefits.support')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground text-center mb-8">{t('comparison.features')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="font-bold mb-2">{t('atm.features.installation')}</div>
                    </CardContent>
                  </Card>
                  <Card className="hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="font-bold mb-2">{t('atm.features.maintenance')}</div>
                    </CardContent>
                  </Card>
                  <Card className="hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="font-bold mb-2">{t('atm.features.cash')}</div>
                    </CardContent>
                  </Card>
                  <Card className="hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="font-bold mb-2">{t('atm.features.monitoring')}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product 2: Micro ATM Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('microAtm.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('microAtm.description')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">{t('microAtm.features.portable')}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">{t('microAtm.features.biometric')}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">{t('microAtm.features.cardless')}</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product 3: AEPS Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('aeps.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('aeps.description')}</p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{t('aeps.services.withdrawal')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{t('aeps.services.deposit')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{t('aeps.services.balance')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{t('aeps.services.miniStatement')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{t('aeps.services.transfer')}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product 4: DMT Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('dmt.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('dmt.description')}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-50 px-6 py-3 rounded-full">
                <span className="font-semibold">{t('dmt.features.instant')}</span>
              </div>
              <div className="bg-green-50 px-6 py-3 rounded-full">
                <span className="font-semibold">{t('dmt.features.secure')}</span>
              </div>
              <div className="bg-purple-50 px-6 py-3 rounded-full">
                <span className="font-semibold">{t('dmt.features.panIndia')}</span>
              </div>
              <div className="bg-yellow-50 px-6 py-3 rounded-full">
                <span className="font-semibold">{t('dmt.features.limits')}</span>
              </div>
              <div className="bg-red-50 px-6 py-3 rounded-full">
                <span className="font-semibold">{t('dmt.features.tracking')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product 5: Bill Payment Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('billPayment.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('billPayment.description')}</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.electricity')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.water')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.gas')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.mobile')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.dth')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold">{t('billPayment.services.broadband')}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('packages.title')}</h2>
              <p className="text-xl text-muted-foreground">{t('packages.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Basic Package */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('packages.basic.name')}</CardTitle>
                  <div className="text-2xl font-bold">{t('packages.basic.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['packages.basic.features.0', 'packages.basic.features.1', 'packages.basic.features.2', 'packages.basic.features.3'].map((key) => (
                      <li key={key} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Silver Package */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('packages.silver.name')}</CardTitle>
                  <div className="text-2xl font-bold">{t('packages.silver.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['packages.silver.features.0', 'packages.silver.features.1', 'packages.silver.features.2', 'packages.silver.features.3', 'packages.silver.features.4'].map((key) => (
                      <li key={key} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Gold Package */}
              <Card className="border-yellow-500 border-2">
                <CardHeader>
                  <CardTitle>{t('packages.gold.name')}</CardTitle>
                  <div className="text-2xl font-bold">{t('packages.gold.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['packages.gold.features.0', 'packages.gold.features.1', 'packages.gold.features.2', 'packages.gold.features.3', 'packages.gold.features.4', 'packages.gold.features.5'].map((key) => (
                      <li key={key} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Enterprise Package */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('packages.enterprise.name')}</CardTitle>
                  <div className="text-2xl font-bold">{t('packages.enterprise.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['packages.enterprise.features.0', 'packages.enterprise.features.1', 'packages.enterprise.features.2', 'packages.enterprise.features.3', 'packages.enterprise.features.4', 'packages.enterprise.features.5'].map((key) => (
                      <li key={key} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurProducts;