import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Users, MessageSquare, MapPin, UserCheck, Star, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormCounts {
  agent_submissions: number;
  influencer_submissions: number;
  contact_submissions: number;
  atm_enquiry_submissions: number;
  franchise_applications: number;
  location_submissions: number;
  job_applications: number;
}

const AdminExport = () => {
  const [formCounts, setFormCounts] = useState<FormCounts>({
    agent_submissions: 0,
    influencer_submissions: 0,
    contact_submissions: 0,
    atm_enquiry_submissions: 0,
    franchise_applications: 0,
    location_submissions: 0,
    job_applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFormCounts();
  }, []);

  const fetchFormCounts = async () => {
    try {
      const tables = [
        'agent_submissions',
        'influencer_submissions', 
        'contact_submissions',
        'atm_enquiry_submissions',
        'franchise_applications',
        'location_submissions',
        'job_applications'
      ];

      const counts: FormCounts = {} as FormCounts;
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table as keyof FormCounts)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error(`Error fetching count for ${table}:`, error);
          counts[table as keyof FormCounts] = 0;
        } else {
          counts[table as keyof FormCounts] = count || 0;
        }
      }
      
      setFormCounts(counts);
    } catch (error) {
      console.error('Error fetching form counts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch form submission counts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async (tableName: string, fileName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName as keyof FormCounts)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          title: "No Data",
          description: `No submissions found for ${fileName}.`,
          variant: "destructive"
        });
        return;
      }

      // Convert data to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle arrays (for languages field)
            if (Array.isArray(value)) {
              return `"${value.join('; ')}"`;
            }
            // Handle strings with commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      try {
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      } catch (error) {
        console.debug('Download link already removed:', error);
      }

      toast({
        title: "Export Successful",
        description: `${fileName} data exported to CSV successfully.`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export ${fileName} data.`,
        variant: "destructive"
      });
    }
  };

  const exportAll = async () => {
    const exports = [
      { table: 'agent_submissions', name: 'Agent Submissions' },
      { table: 'influencer_submissions', name: 'Influencer Submissions' },
      { table: 'contact_submissions', name: 'Contact Submissions' },
      { table: 'atm_enquiry_submissions', name: 'ATM Enquiry Submissions' },
      { table: 'franchise_applications', name: 'Franchise Applications' },
      { table: 'location_submissions', name: 'Location Submissions' },
      { table: 'job_applications', name: 'Job Applications' }
    ];

    for (const exp of exports) {
      await exportToCSV(exp.table, exp.name);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const formTypes = [
    {
      key: 'agent_submissions' as keyof FormCounts,
      title: 'Agent Submissions',
      description: 'Sahasra Network agent applications',
      icon: UserCheck,
      color: 'bg-blue-500'
    },
    {
      key: 'influencer_submissions' as keyof FormCounts,
      title: 'Influencer Submissions', 
      description: 'Social media influencer applications',
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      key: 'contact_submissions' as keyof FormCounts,
      title: 'Contact Submissions',
      description: 'General contact form messages',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      key: 'atm_enquiry_submissions' as keyof FormCounts,
      title: 'ATM Enquiry Submissions',
      description: 'ATM business interest enquiries',
      icon: Building,
      color: 'bg-orange-500'
    },
    {
      key: 'franchise_applications' as keyof FormCounts,
      title: 'Franchise Applications',
      description: 'Complete ATM franchise applications',
      icon: Building,
      color: 'bg-red-500'
    },
    {
      key: 'location_submissions' as keyof FormCounts,
      title: 'Location Submissions',
      description: 'ATM location survey requests',
      icon: MapPin,
      color: 'bg-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  const totalSubmissions = Object.values(formCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Form Data Export <span className="bg-gradient-hero bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Export all form submissions as CSV files for analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="p-6 text-center">
              <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{totalSubmissions}</h3>
              <p className="text-sm opacity-90">Total Submissions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-success text-secondary-foreground">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">7</h3>
              <p className="text-sm opacity-90">Form Types</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">CSV</h3>
              <p className="text-sm opacity-90">Export Format</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardContent className="p-6 text-center">
              <Button onClick={exportAll} className="bg-gradient-hero">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Form Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formTypes.map((form) => {
            const IconComponent = form.icon;
            const count = formCounts[form.key];
            
            return (
              <Card key={form.key} className="bg-gradient-card hover:shadow-professional transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${form.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {count}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {form.description}
                  </p>
                  <Button 
                    onClick={() => exportToCSV(form.key, form.title)}
                    className="w-full"
                    variant="outline"
                    disabled={count === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV ({count} records)
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Export Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Individual Exports:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click on any form type card to export that specific data</li>
                  <li>• CSV files include all submission fields</li>
                  <li>• Files are named with current date</li>
                  <li>• Data is sorted by submission date (newest first)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bulk Export:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use "Export All" to download all form data</li>
                  <li>• Creates separate CSV file for each form type</li>
                  <li>• Small delay between downloads to prevent browser blocking</li>
                  <li>• Perfect for comprehensive data analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminExport;