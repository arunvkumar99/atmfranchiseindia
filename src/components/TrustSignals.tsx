import React from 'react';
import { Shield, Award, Users, Clock } from 'lucide-react';

interface TrustMetric {
  icon: React.ElementType;
  value: string;
  label: string;
}

const trustMetrics: TrustMetric[] = [
  { icon: Users, value: "1000+", label: "Active Partners" },
  { icon: Shield, value: "99.9%", label: "Uptime Guarantee" },
  { icon: Award, value: "5+ Years", label: "Industry Experience" },
  { icon: Clock, value: "24/7", label: "Customer Support" },
];

export default function TrustSignals() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Businesses Nationwide</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful partners who trust us with their ATM business operations
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <metric.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}