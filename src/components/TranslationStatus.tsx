// Enterprise Translation Status Component
import React, { useState, useEffect } from 'react';
import { enterpriseTranslationSystem } from '@/lib/enterpriseTranslationSystem';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface LanguageStats {
  language_code: string;
  total: number;
  completed: number;
  completion_percentage: number;
}

const TranslationStatus: React.FC = () => {
  const [stats, setStats] = useState<LanguageStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // Use direct query instead of RPC function
      const { data, error } = await supabase
        .from('website_translations')
        .select('language_code, translated_text')
        .neq('language_code', 'en');

      if (error) throw error;

      if (data) {
        // Group by language and calculate stats
        const languageStats: { [key: string]: { total: number; completed: number } } = {};
        
        data.forEach(row => {
          if (!languageStats[row.language_code]) {
            languageStats[row.language_code] = { total: 0, completed: 0 };
          }
          languageStats[row.language_code].total++;
          if (row.translated_text) {
            languageStats[row.language_code].completed++;
          }
        });

        const statsWithPercentage = Object.entries(languageStats).map(([language_code, stats]) => ({
          language_code,
          total: stats.total,
          completed: stats.completed,
          completion_percentage: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0
        }));
        
        setStats(statsWithPercentage);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    setIsLoading(false);
  };

  const runBatchCompletion = async () => {
    setIsBatchRunning(true);
    try {
      await supabase.functions.invoke('batch-translate-missing');
      await loadStats(); // Reload stats after completion
    } catch (error) {
      console.error('Batch completion failed:', error);
    }
    setIsBatchRunning(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Hide from all users - admin only component
  return null;

  return (
    <div className="fixed bottom-4 left-4 bg-background border rounded-lg shadow-lg p-4 max-w-md z-50" data-no-translate>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Translation Coverage</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadStats}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            onClick={runBatchCompletion}
            disabled={isBatchRunning}
            className="bg-primary text-primary-foreground"
          >
            {isBatchRunning ? 'Running...' : 'Complete Missing'}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {stats
          .sort((a, b) => b.completion_percentage - a.completion_percentage)
          .map(stat => (
          <div key={stat.language_code} className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase">{stat.language_code}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    stat.completion_percentage >= 95 ? 'bg-green-500' :
                    stat.completion_percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.completion_percentage}%` }}
                />
              </div>
              <span className="w-12 text-right">
                {stat.completion_percentage}%
              </span>
              {stat.completion_percentage >= 95 ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationStatus;