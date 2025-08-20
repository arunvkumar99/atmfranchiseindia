import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, Type, Layout, Smartphone, Zap, MousePointer, 
  Accessibility, CheckCircle, XCircle, AlertCircle, 
  Eye, Monitor, Tablet, Settings, Sparkles, TrendingUp,
  BarChart3, Users, Target, ArrowRight
} from 'lucide-react';

const DesignAudit = () => {
  const { t } = useTranslation();
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');
  const [contrastScore, setContrastScore] = useState(0);
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setCurrentBreakpoint('mobile');
      else if (width < 1024) setCurrentBreakpoint('tablet');
      else setCurrentBreakpoint('desktop');
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  const designMetrics = {
    consistency: {
      score: 78,
      issues: [
        'Inconsistent button sizes across pages',
        'Mixed card shadow styles',
        'Varying spacing patterns',
        'Different heading styles in sections'
      ],
      improvements: [
        'Standardize component library usage',
        'Create design tokens for spacing',
        'Implement consistent shadow system'
      ]
    },
    typography: {
      score: 85,
      issues: [
        'Font size variations in similar components',
        'Line height needs optimization for readability',
        'Heading hierarchy not always clear'
      ],
      improvements: [
        'Implement fluid typography scale',
        'Optimize line height for long-form content',
        'Use consistent font weights'
      ]
    },
    colors: {
      score: 72,
      issues: [
        'Some text lacks sufficient contrast',
        'Brand colors not consistently applied',
        'Dark mode support missing'
      ],
      improvements: [
        'Increase contrast ratios to WCAG AA',
        'Create comprehensive color palette',
        'Add dark mode theme'
      ]
    },
    responsive: {
      score: 80,
      issues: [
        'Some components not optimized for mobile',
        'Text too small on mobile devices',
        'Horizontal scrolling on some pages'
      ],
      improvements: [
        'Implement mobile-first approach',
        'Optimize touch targets for mobile',
        'Fix overflow issues'
      ]
    },
    performance: {
      score: 75,
      issues: [
        'Large image files need optimization',
        'Too many animations on initial load',
        'Bundle size can be reduced'
      ],
      improvements: [
        'Implement lazy loading for images',
        'Reduce animation complexity',
        'Code split large components'
      ]
    },
    interaction: {
      score: 82,
      issues: [
        'CTA buttons not prominent enough',
        'Form validation feedback unclear',
        'Navigation could be more intuitive'
      ],
      improvements: [
        'Make primary CTAs more prominent',
        'Add clear success/error states',
        'Simplify navigation structure'
      ]
    },
    accessibility: {
      score: 70,
      issues: [
        'Missing ARIA labels on interactive elements',
        'Keyboard navigation needs improvement',
        'Screen reader support incomplete'
      ],
      improvements: [
        'Add comprehensive ARIA labels',
        'Implement skip navigation links',
        'Test with screen readers'
      ]
    }
  };

  const colorPalette = {
    primary: [
      { name: 'Primary', value: '#2563eb', usage: 'Main brand color' },
      { name: 'Primary Dark', value: '#1e40af', usage: 'Hover states' },
      { name: 'Primary Light', value: '#3b82f6', usage: 'Backgrounds' }
    ],
    secondary: [
      { name: 'Secondary', value: '#8b5cf6', usage: 'Accent elements' },
      { name: 'Success', value: '#10b981', usage: 'Success states' },
      { name: 'Warning', value: '#f59e0b', usage: 'Warning messages' },
      { name: 'Error', value: '#ef4444', usage: 'Error states' }
    ],
    neutral: [
      { name: 'Text Primary', value: '#111827', usage: 'Main text' },
      { name: 'Text Secondary', value: '#6b7280', usage: 'Secondary text' },
      { name: 'Border', value: '#e5e7eb', usage: 'Borders and dividers' },
      { name: 'Background', value: '#f9fafb', usage: 'Page backgrounds' }
    ]
  };

  const typographyScale = [
    { name: 'Display', size: '72px', weight: '800', usage: 'Hero headlines' },
    { name: 'H1', size: '48px', weight: '700', usage: 'Page titles' },
    { name: 'H2', size: '36px', weight: '600', usage: 'Section headers' },
    { name: 'H3', size: '28px', weight: '600', usage: 'Subsections' },
    { name: 'H4', size: '24px', weight: '500', usage: 'Card titles' },
    { name: 'Body Large', size: '18px', weight: '400', usage: 'Intro text' },
    { name: 'Body', size: '16px', weight: '400', usage: 'Main content' },
    { name: 'Small', size: '14px', weight: '400', usage: 'Supporting text' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const overallScore = Math.round(
    Object.values(designMetrics).reduce((acc, metric) => acc + metric.score, 0) / 
    Object.values(designMetrics).length
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Design System Audit
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium UX Design Audit
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive analysis of design consistency, usability, and user experience
            </p>
          </div>
          
          {/* Overall Score */}
          <Card className="mb-8 border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overall Design Score</h2>
                  <p className="text-muted-foreground">Based on 7 key metrics</p>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">out of 100</div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">3 Strong Areas</div>
                  <div className="text-sm text-muted-foreground">Above 80 score</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-semibold">3 Need Attention</div>
                  <div className="text-sm text-muted-foreground">70-80 score</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="font-semibold">1 Critical</div>
                  <div className="text-sm text-muted-foreground">Below 70 score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="metrics" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="responsive">Responsive</TabsTrigger>
          </TabsList>
          
          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            {Object.entries(designMetrics).map(([key, metric]) => {
              const icons = {
                consistency: Layout,
                typography: Type,
                colors: Palette,
                responsive: Smartphone,
                performance: Zap,
                interaction: MousePointer,
                accessibility: Accessibility
              };
              const Icon = icons[key as keyof typeof icons];
              
              return (
                <Card key={key} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 capitalize">
                        <Icon className="w-6 h-6" />
                        {key}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(metric.score)}
                        <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-red-600">Issues Found</h4>
                        <ul className="space-y-2">
                          {metric.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">Recommended Improvements</h4>
                        <ul className="space-y-2">
                          {metric.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(colorPalette).map(([category, colors]) => (
                  <div key={category} className="mb-8">
                    <h3 className="font-semibold text-lg mb-4 capitalize">{category} Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {colors.map((color) => (
                        <div key={color.name} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div 
                            className="w-16 h-16 rounded-lg border-2"
                            style={{ backgroundColor: color.value }}
                          />
                          <div>
                            <div className="font-medium">{color.name}</div>
                            <div className="text-sm text-muted-foreground">{color.value}</div>
                            <div className="text-xs text-muted-foreground">{color.usage}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {typographyScale.map((type) => (
                    <div key={type.name} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{type.name}</span>
                          <span className="text-sm text-muted-foreground ml-4">
                            {type.size} / {type.weight} weight
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{type.usage}</span>
                      </div>
                      <div 
                        style={{ 
                          fontSize: type.size, 
                          fontWeight: type.weight as any,
                          lineHeight: 1.2
                        }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Responsive Tab */}
          <TabsContent value="responsive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsive Design Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Current Viewport: {currentBreakpoint}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Smartphone className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Mobile</div>
                      <div className="text-sm text-muted-foreground">&lt; 640px</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Tablet className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Tablet</div>
                      <div className="text-sm text-muted-foreground">640px - 1024px</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Monitor className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Desktop</div>
                      <div className="text-sm text-muted-foreground">&gt; 1024px</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Responsive Issues by Breakpoint</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="font-medium">Mobile Issues</span>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Navigation menu needs hamburger implementation</li>
                        <li>• Some buttons too small for touch targets</li>
                        <li>• Text sizing needs adjustment</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Tablet className="w-4 h-4" />
                        <span className="font-medium">Tablet Issues</span>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Grid layouts need optimization</li>
                        <li>• Some images not scaling properly</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="w-4 h-4" />
                        <span className="font-medium">Desktop</span>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Generally good, minor spacing adjustments needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Plan */}
        <Card className="max-w-6xl mx-auto mt-12 border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              Recommended Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Critical: Fix Accessibility Issues</h4>
                  <p className="text-sm text-muted-foreground">Add ARIA labels, improve keyboard navigation, ensure WCAG AA compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold mb-1">High: Improve Color Contrast</h4>
                  <p className="text-sm text-muted-foreground">Ensure all text meets WCAG contrast requirements, standardize color usage</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Medium: Optimize Performance</h4>
                  <p className="text-sm text-muted-foreground">Implement lazy loading, optimize images, reduce animation complexity</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold mb-1">Enhance Design Consistency</h4>
                  <p className="text-sm text-muted-foreground">Create design tokens, standardize components, document design system</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">5</div>
                <div>
                  <h4 className="font-semibold mb-1">Polish User Interactions</h4>
                  <p className="text-sm text-muted-foreground">Improve CTA prominence, add micro-interactions, enhance feedback</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesignAudit;