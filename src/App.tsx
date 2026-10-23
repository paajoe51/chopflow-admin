import React, { useState } from 'react';
import { useAdmin } from './context/AdminContext';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { RestaurantManagement } from './pages/RestaurantManagement';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldCheck,
  LogOut,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  Clock,
  UserCheck
} from 'lucide-react';

export const AdminApp: React.FC = () => {
  const { adminUser, isAuthenticated, logout, auditLogs } = useAdmin();
  const [activeTab, setActiveTab] = useState<'admin_dashboard' | 'admin_restaurants' | 'admin_plans' | 'admin_audit'>('admin_dashboard');

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const navItems = [
    {
      id: 'admin_dashboard',
      label: 'Platform Overview',
      description: 'MRR metrics & tenant health',
      icon: LayoutDashboard,
    },
    {
      id: 'admin_restaurants',
      label: 'Restaurant Tenants',
      description: 'Onboarding & franchise controls',
      icon: Building2,
    },
    {
      id: 'admin_plans',
      label: 'Subscription Plans',
      description: 'Tiers, features & pricing',
      icon: CreditCard,
    },
    {
      id: 'admin_audit',
      label: 'Audit & Governance',
      description: 'Security & multi-tenant logs',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Platform Super Admin Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-900/40 ring-1 ring-purple-400/40">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-base tracking-tight text-white">
                  Chop<span className="text-purple-400">Flow</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
                  Super Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                admin.chopflow.com • Platform Master Governance
              </p>
            </div>
          </div>

          {/* User Info & Controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Cluster: Production GH-West</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">{adminUser?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-purple-400 font-mono">{adminUser?.email || 'admin@chopflow.com'}</p>
              </div>

              <button
                onClick={logout}
                title="Sign out of Super Admin Portal"
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-red-950/80 hover:text-red-300 text-slate-400 border border-slate-800 hover:border-red-800 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800 hidden md:flex md:flex-col shrink-0 justify-between">
          <div className="p-4 space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
              SaaS Administration
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div className="leading-tight">{item.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-purple-200' : 'text-slate-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System & Architecture Info Footer */}
          <div className="p-4 border-t border-slate-900 space-y-2 bg-slate-950/50">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backend Gateway</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">PHP 8.4</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Database Hub</span>
              </span>
              <span className="font-mono text-purple-400 font-bold">MySQL PDO</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-2 flex overflow-x-auto space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
                  isActive ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'admin_dashboard' && <AdminDashboard onNavigate={(t) => setActiveTab(t as any)} />}
          {activeTab === 'admin_restaurants' && <RestaurantManagement />}
          {activeTab === 'admin_plans' && <SubscriptionPlans />}
          {activeTab === 'admin_audit' && (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PLATFORM AUDIT & SECURITY LEDGER</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl text-white">System Audit & Governance Logs</h1>
                <p className="text-xs text-slate-400">Immutable event log tracking administrative actions, tenant logins, and security events</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Recent Audit Trails</h3>
                  <span className="text-xs text-slate-500 font-mono">Live Sync</span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'log-1',
                      time: 'Just now',
                      actor: adminUser?.email || 'admin@chopflow.com',
                      action: 'SUPER_ADMIN_SESSION_STARTED',
                      details: 'Master administrative session verified via token authentication',
                      status: 'success',
                    },
                    {
                      id: 'log-2',
                      time: '15 mins ago',
                      actor: 'operations@papaye.com.gh',
                      action: 'TENANT_STATION_CONNECT',
                      details: 'Terminal station PAPAYE-SPINTEX-01 authenticated cashier shift',
                      status: 'info',
                    },
                    {
                      id: 'log-3',
                      time: '1 hour ago',
                      actor: 'system_cron',
                      action: 'SUBSCRIPTION_RENEWAL_CHECK',
                      details: 'Verified 4 active tenant billing cycles, all subscriptions healthy',
                      status: 'success',
                    },
                    {
                      id: 'log-4',
                      time: '3 hours ago',
                      actor: 'info@bukarestaurant.com',
                      action: 'MENU_CATALOG_SYNC',
                      details: 'Updated menu pricing for 8 Ghanaian local dishes',
                      status: 'info',
                    },
                  ].map((log) => (
                    <div key={log.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-800">{log.action}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold uppercase">
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{log.details}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Actor: {log.actor}</p>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 shrink-0 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return <AdminApp />;
}
