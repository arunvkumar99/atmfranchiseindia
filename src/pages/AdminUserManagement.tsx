import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Users, Shield, Activity, Download, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  permissions: {
    export: boolean;
    manage_users: boolean;
    view_audit: boolean;
  };
  last_login?: string;
  login_count: number;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  table_name?: string;
  record_id?: string;
  created_at: string;
  user_id?: string;
}

const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    role: 'admin',
    permissions: {
      export: true,
      manage_users: false,
      view_audit: false
    }
  });
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    fetchAdminUsers();
    fetchAuditLogs();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'get_admin_users' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        setAdminUsers(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users.",
        variant: "destructive"
      });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { 
          action: 'get_audit_logs',
          data: { limit: 50, offset: 0 }
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        setAuditLogs(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async () => {
    if (!newAdminData.email) {
      toast({
        title: "Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { 
          action: 'create_admin',
          data: newAdminData
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully.",
        });
        setNewAdminData({
          email: '',
          role: 'admin',
          permissions: {
            export: true,
            manage_users: false,
            view_audit: false
          }
        });
        fetchAdminUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: "Failed to create admin user.",
        variant: "destructive"
      });
    }
  };

  const deactivateAdminUser = async (adminId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { 
          action: 'deactivate_admin',
          data: { id: adminId }
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: "Admin user deactivated successfully.",
        });
        fetchAdminUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deactivating admin user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate admin user.",
        variant: "destructive"
      });
    }
  };

  const updatePermissions = async (adminId: string, permissions: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-actions', {
        body: { 
          action: 'update_permissions',
          data: { id: adminId, permissions }
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success",
          description: "Permissions updated successfully.",
        });
        fetchAdminUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update permissions.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Admin <span className="bg-gradient-hero bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage administrator accounts and monitor system activity
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Admin Users</TabsTrigger>
            <TabsTrigger value="create">Create Admin</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Administrator Users ({adminUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((admin) => (
                    <div key={admin.id} className="border rounded-lg p-4 bg-background/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{admin.email}</span>
                            <Badge variant={admin.is_active ? "default" : "destructive"}>
                              {admin.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{admin.role}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last login: {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'} 
                            • Login count: {admin.login_count}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              Export: {admin.permissions.export ? "✓" : "✗"}
                            </span>
                            <span className="flex items-center">
                              <UserPlus className="w-4 h-4 mr-1" />
                              Manage Users: {admin.permissions.manage_users ? "✓" : "✗"}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              View Audit: {admin.permissions.view_audit ? "✓" : "✗"}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {admin.is_active && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deactivateAdminUser(admin.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create New Administrator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Address</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="admin@example.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    The user must already be registered in the system
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-role">Role</Label>
                  <Select 
                    value={newAdminData.role} 
                    onValueChange={(value) => setNewAdminData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Export Data</span>
                      <Switch
                        checked={newAdminData.permissions.export}
                        onCheckedChange={(checked) => 
                          setNewAdminData(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, export: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manage Users</span>
                      <Switch
                        checked={newAdminData.permissions.manage_users}
                        onCheckedChange={(checked) => 
                          setNewAdminData(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, manage_users: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View Audit Logs</span>
                      <Switch
                        checked={newAdminData.permissions.view_audit}
                        onCheckedChange={(checked) => 
                          setNewAdminData(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, view_audit: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={createAdminUser} className="w-full bg-gradient-hero">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Administrator
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded p-3 bg-background/50 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{log.action}</span>
                        <span className="text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.table_name && (
                        <div className="text-muted-foreground">
                          Table: {log.table_name}
                          {log.record_id && ` • Record: ${log.record_id.substring(0, 8)}...`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUserManagement;