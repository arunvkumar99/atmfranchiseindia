
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseFormAutoSaveOptions {
  formType: string;
  sessionId: string;
  data: Record<string, any>;
  enabled?: boolean;
  interval?: number; // Auto-save interval in milliseconds
}

export function useFormAutoSave({
  formType,
  sessionId,
  data,
  enabled = true,
  interval = 30000 // 30 seconds default
}: UseFormAutoSaveOptions) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Auto-save function - simplified to avoid unique constraint issues
  const saveDraft = useCallback(async () => {
    if (!enabled || Object.keys(data).length === 0) return;

    try {
      setIsAutoSaving(true);
      
      // First, try to update existing draft
      const { data: existingDraft } = await supabase
        .from('form_drafts')
        .select('id')
        .eq('session_id', sessionId)
        .eq('form_type', formType)
        .maybeSingle();

      if (existingDraft) {
        // Update existing draft
        const { error } = await supabase
          .from('form_drafts')
          .update({
            draft_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id);

        if (!error) {
          setLastSaved(new Date());
          setHasDraft(true);
        } else {
          console.warn('Auto-save update failed:', error);
        }
      } else {
        // Insert new draft
        const { error } = await supabase
          .from('form_drafts')
          .insert({
            session_id: sessionId,
            form_type: formType,
            draft_data: data,
            updated_at: new Date().toISOString()
          });

        if (!error) {
          setLastSaved(new Date());
          setHasDraft(true);
        } else {
          console.warn('Auto-save insert failed:', error);
        }
      }
    } catch (error) {
      console.warn('Auto-save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [enabled, data, sessionId, formType]);

  // Load existing draft
  const loadDraft = useCallback(async () => {
    if (!enabled) return null;

    try {
      const { data: draft, error } = await supabase
        .from('form_drafts')
        .select('draft_data, updated_at')
        .eq('session_id', sessionId)
        .eq('form_type', formType)
        .maybeSingle();

      if (!error && draft) {
        setHasDraft(true);
        setLastSaved(new Date(draft.updated_at));
        return draft.draft_data;
      }
    } catch (error) {
      console.warn('Load draft error:', error);
    }
    return null;
  }, [enabled, sessionId, formType]);

  // Clear draft after successful submission
  const clearDraft = useCallback(async () => {
    try {
      await supabase
        .from('form_drafts')
        .delete()
        .eq('session_id', sessionId)
        .eq('form_type', formType);
      
      setHasDraft(false);
      setLastSaved(null);
    } catch (error) {
      console.warn('Clear draft error:', error);
    }
  }, [sessionId, formType]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(saveDraft, interval);
    return () => clearInterval(timer);
  }, [saveDraft, interval, enabled]);

  return {
    isAutoSaving,
    lastSaved,
    hasDraft,
    saveDraft,
    loadDraft,
    clearDraft
  };
}
