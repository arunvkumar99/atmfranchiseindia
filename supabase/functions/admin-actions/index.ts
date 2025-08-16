import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminActionRequest {
  action: 'create_admin' | 'deactivate_admin' | 'update_permissions' | 'get_admin_users' | 'get_audit_logs';
  data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user has admin permissions
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdminResult, error: adminError } = await supabase
      .rpc('is_admin');
    
    // Get client information for audit logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (adminError || !isAdminResult) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, data }: AdminActionRequest = await req.json();

    console.log(`Processing admin action: ${action}`);

    let result;
    switch (action) {
      case 'get_admin_users':
        result = await getAdminUsers(supabase);
        break;
      
      case 'create_admin':
        result = await createAdminUser(supabase, data, user.id, clientIP, userAgent);
        break;
      
      case 'deactivate_admin':
        result = await deactivateAdminUser(supabase, data, user.id, clientIP, userAgent);
        break;
      
      case 'update_permissions':
        result = await updateAdminPermissions(supabase, data, user.id, clientIP, userAgent);
        break;
      
      case 'get_audit_logs':
        result = await getAuditLogs(supabase, data);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin action error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getAdminUsers(supabase: any) {
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      id,
      email,
      role,
      is_active,
      permissions,
      last_login,
      login_count,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch admin users');
  }

  return { success: true, data };
}

async function createAdminUser(supabase: any, data: any, createdBy: string, clientIP: string, userAgent: string) {
  if (!data?.email || !data?.role) {
    return { success: false, error: 'Email and role are required' };
  }

  // First, check if user exists in auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    return { success: false, error: 'Failed to check user existence' };
  }

  const existingUser = authUsers.users.find((u: any) => u.email === data.email);
  
  if (!existingUser) {
    return { success: false, error: 'User must register first before being granted admin access' };
  }

  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .insert([{
      user_id: existingUser.id,
      email: data.email,
      role: data.role,
      permissions: data.permissions || { export: true, manage_users: false, view_audit: false },
      created_by: createdBy
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, error: 'User is already an admin' };
    }
    return { success: false, error: 'Failed to create admin user' };
  }

  // Log the action with enhanced tracking
  await supabase.rpc('log_admin_action_enhanced', {
    action_type: 'admin_user_created',
    table_name: 'admin_users',
    record_id: adminUser.id,
    new_values: adminUser,
    ip_address: clientIP,
    user_agent: userAgent
  });

  return { success: true, data: adminUser };
}

async function deactivateAdminUser(supabase: any, data: any, modifiedBy: string, clientIP: string, userAgent: string) {
  if (!data?.id) {
    return { success: false, error: 'Admin user ID is required' };
  }

  // Get the current admin user data
  const { data: currentAdmin, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.id)
    .single();

  if (fetchError || !currentAdmin) {
    return { success: false, error: 'Admin user not found' };
  }

  const { data: updatedAdmin, error } = await supabase
    .from('admin_users')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', data.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: 'Failed to deactivate admin user' };
  }

  // Log the action with enhanced tracking
  await supabase.rpc('log_admin_action_enhanced', {
    action_type: 'admin_user_deactivated',
    table_name: 'admin_users',
    record_id: data.id,
    old_values: currentAdmin,
    new_values: updatedAdmin,
    ip_address: clientIP,
    user_agent: userAgent
  });

  return { success: true, data: updatedAdmin };
}

async function updateAdminPermissions(supabase: any, data: any, modifiedBy: string, clientIP: string, userAgent: string) {
  if (!data?.id || !data?.permissions) {
    return { success: false, error: 'Admin user ID and permissions are required' };
  }

  // Get the current admin user data
  const { data: currentAdmin, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.id)
    .single();

  if (fetchError || !currentAdmin) {
    return { success: false, error: 'Admin user not found' };
  }

  const { data: updatedAdmin, error } = await supabase
    .from('admin_users')
    .update({ 
      permissions: data.permissions,
      updated_at: new Date().toISOString()
    })
    .eq('id', data.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: 'Failed to update admin permissions' };
  }

  // Log the action with enhanced tracking
  await supabase.rpc('log_admin_action_enhanced', {
    action_type: 'admin_permissions_updated',
    table_name: 'admin_users',
    record_id: data.id,
    old_values: currentAdmin,
    new_values: updatedAdmin,
    ip_address: clientIP,
    user_agent: userAgent
  });

  return { success: true, data: updatedAdmin };
}

async function getAuditLogs(supabase: any, data: any) {
  const limit = data?.limit || 100;
  const offset = data?.offset || 0;

  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      ip_address,
      user_agent,
      created_at,
      user_id
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error('Failed to fetch audit logs');
  }

  return { success: true, data: logs };
}