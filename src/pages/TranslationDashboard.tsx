import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { translationJobRunner } from '@/lib/translationJobRunner';
import { toast } from 'sonner';
import { Loader2, Languages, Database, Globe, CheckCircle, AlertCircle } from 'lucide-react';

export const TranslationDashboard = () => {
  const [stats, setStats] = useState<{
    totalPages: number;
    totalLanguages: number;
    translationsPerLanguage: { [key: string]: number };
    completionPercentage: { [key: string]: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningJob, setIsRunningJob] = useState(false);
  const [jobResults, setJobResults] = useState<{
    success: boolean;
    totalTranslated: number;
    languageStats: { [key: string]: number };
    errors: string[];
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const translationStats = await translationJobRunner.getTranslationStats();
      setStats(translationStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load translation statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const runTranslationJob = async () => {
    try {
      setIsRunningJob(true);
      toast.info('Starting complete translation job... This may take a few minutes.');
      
      const results = await translationJobRunner.runCompleteTranslationJob();
      setJobResults(results);
      
      if (results.success) {
        toast.success(`Successfully translated ${results.totalTranslated} items!`);
        await loadStats(); // Reload stats
      } else {
        toast.error('Translation job completed with errors');
      }
    } catch (error) {
      console.error('Translation job failed:', error);
      toast.error('Translation job failed');
    } finally {
      setIsRunningJob(false);
    }
  };

  const getMissingTranslations = async () => {
    try {
      setIsLoading(true);
      const missing = await translationJobRunner.getMissingTranslations();
      console.log('Missing translations:', missing);
      
      const totalMissing = Object.values(missing).reduce((sum, arr) => sum + arr.length, 0);
      toast.info(`Found ${totalMissing} missing translations across all languages`);
    } catch (error) {
      console.error('Failed to check missing translations:', error);
      toast.error('Failed to check missing translations');
    } finally {
      setIsLoading(false);
    }
  };

  const languageNames: { [key: string]: string } = {
    'hi': 'Hindi (हिन्दी)',
    'bn': 'Bengali (বাংলা)',
    'ta': 'Tamil (தமிழ்)',
    'te': 'Telugu (తెలుగు)',
    'mr': 'Marathi (मराठी)',
    'gu': 'Gujarati (ગુજરાતી)',
    'ur': 'Urdu (اردو)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'or': 'Odia (ଓଡ଼ିଆ)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'as': 'Assamese (অসমীয়া)',
    'ml': 'Malayalam (മലയാളം)'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Languages className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Translation System Dashboard</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.totalPages as number) || 0}</div>
            <p className="text-xs text-muted-foreground">Website pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Supported languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Translations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? Object.values(stats.translationsPerLanguage).reduce((a: any, b: any) => a + b, 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Total stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Instant translation</p>
          </CardContent>
        </Card>
      </div>

      {/* Translation Job Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Translation Job Runner
          </CardTitle>
          <CardDescription>
            Run complete translation jobs to fill missing content across all languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={runTranslationJob} 
              disabled={isRunningJob}
              className="bg-primary text-primary-foreground"
            >
              {isRunningJob ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Translation Job...
                </>
              ) : (
                'Run Complete Translation Job'
              )}
            </Button>

            <Button 
              onClick={getMissingTranslations} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Check Missing Translations
            </Button>

            <Button 
              onClick={loadStats} 
              variant="outline"
              disabled={isLoading}
            >
              Refresh Stats
            </Button>
          </div>

          {jobResults && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {jobResults.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                Job Results
              </h4>
              <p>Total Translated: <strong>{jobResults.totalTranslated}</strong></p>
              {jobResults.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-600 font-medium">Errors:</p>
                  <ul className="list-disc list-inside">
                    {jobResults.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language-wise Translation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Coverage by Language</CardTitle>
          <CardDescription>
            Shows completion percentage for each supported language
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(languageNames).map(([code, name]) => {
                const count = stats?.translationsPerLanguage[code] || 0;
                const percentage = stats?.completionPercentage[code] || 0;
                
                return (
                  <div key={code} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={percentage > 80 ? "default" : percentage > 50 ? "secondary" : "destructive"}>
                          {count} items
                        </Badge>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationDashboard;