import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  SmoothScroll, 
  ParallaxSection, 
  GlassCard, 
  AnimatedGradient,
  Skeleton,
  MagneticButton,
  Card3D,
  TextReveal,
  FloatingElement,
  PageTransition,
  Spotlight,
  MorphingShapes
} from '@/components/VisualPolish';
import {
  RippleButton,
  InteractiveInput,
  LikeButton,
  StarRating,
  AnimatedToggle,
  LoadingButton,
  SparkleEffect,
  ConfettiButton
} from '@/components/MicroInteractions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function VisualShowcase() {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(3);
  const [toggle, setToggle] = useState(false);
  const [email, setEmail] = useState('');

  const handleLoadingClick = () => {
  const { t } = useTranslation();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SmoothScroll>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          {/* Hero Section with Parallax */}
          <ParallaxSection className="relative h-screen flex items-center justify-center overflow-hidden">
            <AnimatedGradient />
            <MorphingShapes className="opacity-30" />
            
            <div className="relative z-10 text-center px-4">
              <TextReveal 
                text="Visual Polish Showcase" 
                className="text-6xl font-bold mb-4 text-gradient-animate"
              />
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Experience premium animations and micro-interactions
              </motion.p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <MagneticButton className="btn-premium bg-primary text-white px-8 py-3 rounded-lg">
                  Magnetic Button
                </MagneticButton>
                
                <RippleButton 
                  variant="primary"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg"
                >
                  Ripple Effect
                </RippleButton>
                
                <ConfettiButton className="btn-glow bg-purple-600 text-white px-8 py-3 rounded-lg relative">
                  Confetti Button
                </ConfettiButton>
              </div>
            </div>
          </ParallaxSection>

          {/* Glass Cards Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Glass Morphism Cards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Spotlight>
                  <GlassCard className="p-8">
                    <FloatingElement>
                      <div className="text-6xl mb-4">✨</div>
                    </FloatingElement>
                    <h3 className="text-2xl font-bold mb-2">Premium Design</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Beautiful glass morphism effect with backdrop blur
                    </p>
                  </GlassCard>
                </Spotlight>

                <Card3D>
                  <Card className="p-8 card-hover">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-2xl font-bold mb-2">3D Transform</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Hover to see 3D tilt effect with smooth transitions
                    </p>
                  </Card>
                </Card3D>

                <GlassCard blur="xl" className="p-8">
                  <SparkleEffect>
                    <div className="text-6xl mb-4">🌟</div>
                  </SparkleEffect>
                  <h3 className="text-2xl font-bold mb-2">Sparkle Effect</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Automatic sparkle animations for emphasis
                  </p>
                </GlassCard>
              </div>
            </div>
          </section>

          {/* Interactive Components */}
          <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-2xl">
              <h2 className="text-4xl font-bold text-center mb-12">Interactive Components</h2>
              
              <div className="space-y-8">
                {/* Interactive Input */}
                <InteractiveInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholders.email', 'Enter your email')}
                />

                {/* Rating Component */}
                <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-lg font-medium">Rate your experience:</span>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-lg font-medium">Enable notifications</span>
                  <AnimatedToggle 
                    checked={toggle} 
                    onChange={setToggle}
                  />
                </div>

                {/* Like Button */}
                <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-lg font-medium">Did you like this?</span>
                  <LikeButton />
                </div>

                {/* Loading Button */}
                <LoadingButton
                  loading={loading}
                  onClick={handleLoadingClick}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium"
                  loadingText="Processing..."
                >
                  Submit Form
                </LoadingButton>
              </div>
            </div>
          </section>

          {/* Loading States */}
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">Loading States</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="p-6">
                  <Skeleton variant="circular" className="mb-4" />
                  <Skeleton className="mb-2" />
                  <Skeleton variant="text" className="mb-2" />
                  <Skeleton variant="text" />
                </Card>

                <Card className="p-6">
                  <div className="skeleton-pulse h-12 w-12 rounded-full mb-4" />
                  <div className="skeleton-pulse h-4 w-full mb-2" />
                  <div className="skeleton-pulse h-4 w-3/4 mb-2" />
                  <div className="skeleton-pulse h-4 w-1/2" />
                </Card>
              </div>
            </div>
          </section>

          {/* Animation Classes Demo */}
          <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">CSS Animation Classes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 card-hover hover-lift">
                  <h3 className="text-xl font-bold mb-2">Hover Lift</h3>
                  <p>Card lifts on hover with shadow</p>
                </Card>

                <Card className="p-8 card-3d">
                  <h3 className="text-xl font-bold mb-2">3D Tilt</h3>
                  <p>Hover for 3D perspective effect</p>
                </Card>

                <Card className="p-8 card-glass">
                  <h3 className="text-xl font-bold mb-2">Glass Effect</h3>
                  <p>Glassmorphism with backdrop blur</p>
                </Card>
              </div>

              <div className="mt-12 flex justify-center gap-4 flex-wrap">
                <Button className="btn-premium">Premium Button</Button>
                <Button className="btn-glow relative">Glow Button</Button>
                <Button className="btn-press">Press Effect</Button>
                <Button className="pulse">Pulse Animation</Button>
              </div>
            </div>
          </section>

          {/* Gradient Text Demo */}
          <section className="py-20 px-4">
            <div className="container mx-auto text-center">
              <h2 className="text-6xl font-bold mb-8 text-gradient-animate">
                Animated Gradient Text
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Beautiful animated gradient text that shifts colors smoothly for a premium feel
              </p>
            </div>
          </section>

          {/* Background Effects */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="bg-gradient-animate absolute inset-0 opacity-10" />
            <div className="container mx-auto relative z-10">
              <h2 className="text-4xl font-bold text-center mb-12">Background Effects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-animate opacity-20" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Animated Gradient</h3>
                    <p>Shifting gradient background animation</p>
                  </div>
                </Card>

                <Card className="p-8 relative overflow-hidden">
                  <MorphingShapes className="opacity-20" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Morphing Shapes</h3>
                    <p>Organic shape animations in background</p>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
    </SmoothScroll>
  );
}