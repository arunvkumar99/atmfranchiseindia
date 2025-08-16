/**
 * Architecture Comparison Dashboard
 * Visual comparison of Supabase vs Google Sheets-only approach
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, DollarSign, Zap, Shield, Users, Database, Cloud } from 'lucide-react';

export default function ArchitectureComparison() {
  const comparisonData = [
    {
      feature: 'Monthly Cost',
      supabase: '$25-50',
      sheetsOnly: '$0',
      winner: 'sheets',
      icon: DollarSign
    },
    {
      feature: 'Setup Time',
      supabase: '2-3 hours',
      sheetsOnly: '30 minutes',
      winner: 'sheets',
      icon: Zap
    },
    {
      feature: 'Data Security',
      supabase: 'Database + RLS',
      sheetsOnly: 'Google Security',
      winner: 'equal',
      icon: Shield
    },
    {
      feature: 'Team Access',
      supabase: 'Requires Export',
      sheetsOnly: 'Direct Access',
      winner: 'sheets',
      icon: Users
    },
    {
      feature: 'Scalability',
      supabase: 'Unlimited',
      sheetsOnly: '5M cells/sheet',
      winner: 'supabase',
      icon: Database
    },
    {
      feature: 'Maintenance',
      supabase: 'Medium',
      sheetsOnly: 'Low',
      winner: 'sheets',
      icon: Cloud
    }
  ];

  const costBreakdown = {
    supabase: {
      database: 25,
      storage: 5,
      bandwidth: 10,
      functions: 10,
      total: 50
    },
    sheetsOnly: {
      googleSheets: 0,
      serverless: 0,
      total: 0
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8">Architecture Comparison: Database vs Sheets-Only</h1>
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current: Supabase + Sheets</span>
              <Database className="h-6 w-6" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-red-600">${costBreakdown.supabase.total}/mo</p>
                <p className="text-gray-600">Annual: ${costBreakdown.supabase.total * 12}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Database</span>
                  <span>${costBreakdown.supabase.database}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span>${costBreakdown.supabase.storage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bandwidth</span>
                  <span>${costBreakdown.supabase.bandwidth}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Edge Functions</span>
                  <span>${costBreakdown.supabase.functions}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recommended: Sheets-Only</span>
              <Cloud className="h-6 w-6 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-green-600">${costBreakdown.sheetsOnly.total}/mo</p>
                <p className="text-gray-600">Annual Savings: ${costBreakdown.supabase.total * 12}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free Google Sheets API</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free Serverless Tier</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>No Storage Costs</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>No Bandwidth Costs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-center py-3">Supabase + Sheets</th>
                  <th className="text-center py-3">Sheets-Only</th>
                  <th className="text-center py-3">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-600" />
                          <span>{item.feature}</span>
                        </div>
                      </td>
                      <td className="text-center py-3">{item.supabase}</td>
                      <td className="text-center py-3">{item.sheetsOnly}</td>
                      <td className="text-center py-3">
                        {item.winner === 'sheets' && (
                          <span className="text-green-600 font-semibold">Sheets ✓</span>
                        )}
                        {item.winner === 'supabase' && (
                          <span className="text-blue-600 font-semibold">Supabase ✓</span>
                        )}
                        {item.winner === 'equal' && (
                          <span className="text-gray-600">Equal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Diagrams */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <span>1. User Form</span>
                <span>↓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                <span>2. Supabase Database</span>
                <span>↓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                <span>3. Edge Function</span>
                <span>↓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-100 rounded">
                <span>4. Google Sheets</span>
                <span>✓</span>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded">
                <p className="text-red-600">Complexity: HIGH</p>
                <p className="text-red-600">Points of Failure: 4</p>
                <p className="text-red-600">Monthly Cost: $25-50</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle>Recommended Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <span>1. User Form</span>
                <span>↓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-100 rounded">
                <span>2. Serverless Function</span>
                <span>↓</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-100 rounded">
                <span>3. Google Sheets</span>
                <span>✓</span>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-green-600">Complexity: LOW</p>
                <p className="text-green-600">Points of Failure: 2</p>
                <p className="text-green-600">Monthly Cost: $0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-24 text-sm text-gray-600">30 mins</div>
              <div className="flex-1">
                <h4 className="font-semibold">Phase 1: Setup Google Service Account</h4>
                <p className="text-sm text-gray-600">Create service account, generate keys, share sheet</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-24 text-sm text-gray-600">30 mins</div>
              <div className="flex-1">
                <h4 className="font-semibold">Phase 2: Deploy Serverless Function</h4>
                <p className="text-sm text-gray-600">Deploy to Vercel/Netlify, configure environment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-24 text-sm text-gray-600">1 hour</div>
              <div className="flex-1">
                <h4 className="font-semibold">Phase 3: Update Forms</h4>
                <p className="text-sm text-gray-600">Replace Supabase calls with Sheets service</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-24 text-sm text-gray-600">30 mins</div>
              <div className="flex-1">
                <h4 className="font-semibold">Phase 4: Testing & Cleanup</h4>
                <p className="text-sm text-gray-600">Test all forms, remove Supabase dependencies</p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold">Total Migration Time: 2.5 hours</p>
            <p className="text-green-600 text-sm">Start saving $25-50/month immediately!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}