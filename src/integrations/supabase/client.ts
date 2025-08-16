/**
 * TEMPORARY STUB FILE
 * This file exists only to prevent build errors while migrating away from Supabase
 * ALL COMPONENTS SHOULD BE UPDATED TO USE googleSheetsService INSTEAD
 * 
 * @deprecated Use googleSheetsService for all form submissions
 */

// Stub Supabase client that does nothing
export const supabase = {
  auth: {
    signIn: async () => ({ error: new Error('Supabase removed - use simpleAuth') }),
    signUp: async () => ({ error: new Error('Supabase removed - use simpleAuth') }),
    signOut: async () => ({ error: new Error('Supabase removed - use simpleAuth') }),
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: new Error('Use googleSheetsService instead') }),
    update: () => Promise.resolve({ data: null, error: new Error('Use googleSheetsService instead') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Use googleSheetsService instead') })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ error: new Error('File upload removed - use Google Drive API') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  functions: {
    invoke: () => Promise.resolve({ data: null, error: new Error('Use API routes instead') })
  },
  rpc: () => Promise.resolve({ data: null, error: new Error('Database removed') })
};

// Log warning in development
if (import.meta.env.DEV) {
  console.warn(
    '⚠️ SUPABASE STUB ACTIVE: This is a temporary file. Update all components to use googleSheetsService'
  );
}

export default supabase;