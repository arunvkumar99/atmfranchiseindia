
import { useState, useEffect, useCallback } from 'react';

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

  // Auto-save function - now uses localStorage
  const saveDraft = useCallback(async () => {
    if (!enabled || Object.keys(data).length === 0) return;

    try {
      setIsAutoSaving(true);
      
      const draftKey = `form_draft_${formType}_${sessionId}`;
      const draftData = {
        formType,
        sessionId,
        data,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      setLastSaved(new Date());
      setHasDraft(true);
      
      console.log('Draft saved to localStorage:', draftKey);
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
      const draftKey = `form_draft_${formType}_${sessionId}`;
      const storedDraft = localStorage.getItem(draftKey);
      
      if (storedDraft) {
        const draft = JSON.parse(storedDraft);
        setHasDraft(true);
        setLastSaved(new Date(draft.updated_at));
        return draft.data;
      }
    } catch (error) {
      console.warn('Load draft error:', error);
    }
    return null;
  }, [enabled, sessionId, formType]);

  // Clear draft after successful submission
  const clearDraft = useCallback(async () => {
    try {
      const draftKey = `form_draft_${formType}_${sessionId}`;
      localStorage.removeItem(draftKey);
      setHasDraft(false);
      setLastSaved(null);
      console.log('Draft cleared from localStorage:', draftKey);
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
