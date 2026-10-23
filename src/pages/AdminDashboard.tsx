import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { StatusBadge } from '../components/common/Badge';
import { Building2, DollarSign, TrendingUp, Shield, Activity, Plus, Server, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { tenants, plans, metrics, refreshData, isLoading } = useAdmin();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
            <Shield className="w-4 h-4" />
            <span>PLATFORM SUPER ADMIN GOVERNANCE</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">ChopFlow SaaS Control Center</h1>
          <p className="text-xs text-slate-400">Multi-tenant management, MRR growth, and system health analytics</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center space-x-2 transition-all"
            title="Refresh metrics from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => onNavigate('admin_restaurants')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Restaurant</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tenants</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 font-tnum">{metrics.totalTenants}</div>
          <p className="text-[11px] text-slate-500">{metrics.activeTenants} Active • {metrics.trialTenants} Trial • {metrics.suspendedTenants} Suspended</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-display font-extrabold text-2xl text-emerald-600 font-tnum">GH₵ {metrics.mrr.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+18.5% MRR Growth this quarter</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders Processed</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="font-display font-extrabold text-2xl text-slate-900 font-tnum">{metrics.totalOrders.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">Across all tenant shops & branches</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-display font-extrabold text-2xl text-emerald-600 font-tnum">99.98%</div>
          <p className="text-[11px] text-slate-500">All Cloud & POS API Nodes Online</p>
        </div>
      </div>

      {/* Tenant Directory */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Enrolled Restaurant Tenants</h3>
          <button
            onClick={() => onNavigate('admin_restaurants')}
            className="text-xs font-bold text-purple-600 hover:text-purple-800"
          >
            Manage All Tenants &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Tenant Code</th>
                <th className="p-3">Restaurant Name</th>
                <th className="p-3">Owner Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Subscription</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tenants.map((t) => {
                const plan = plans.find((p) => p.id === t.planId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{t.code}</td>
                    <td className="p-3 font-bold text-slate-900">{t.name}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{t.ownerName}</p>
                      <p className="text-[11px] text-slate-500">{t.phone}</p>
                    </td>
                    <td className="p-3 text-slate-600">{t.city}, {t.region}</td>
                    <td className="p-3 font-bold text-purple-700 font-mono">
                      {plan?.name || 'Professional Plan'}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
