import { useTranslation } from 'react-i18next';
// Admin Table with IST Timezone Support
// Demonstrates proper timezone handling for Indian users

import React from 'react';
import { formatToIST, formatDateForAdmin, getRelativeTime } from '@/lib/indianTimezone';

interface AdminTableProps {
  data: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  }>;
}

export const AdminTableWithIST: React.FC<AdminTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Created (IST)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-muted/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {item.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div>
                  <div className="font-medium">
                    {formatDateForAdmin(item.created_at)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRelativeTime(item.created_at)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                <div>
                  <div className="font-medium">
                    {formatToIST(item.updated_at)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRelativeTime(item.updated_at)}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Timezone Info */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        All times displayed in Indian Standard Time (IST) • 
        Database stores in UTC for accuracy
      </div>
    </div>
  );
};

export default AdminTableWithIST;