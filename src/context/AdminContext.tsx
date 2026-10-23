import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, SubscriptionPlan } from '../types';
import api from '../services/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardMetrics {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  pendingTenants: number;
  suspendedTenants: number;
  mrr: number;
  totalOrders: number;
  activeUsers: number;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  tenants: Tenant[];
  plans: SubscriptionPlan[];
  metrics: AdminDashboardMetrics;
  auditLogs: any[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addTenant: (tenantData: any) => Promise<Tenant>;
  updateTenant: (id: string, tenantData: any) => Promise<void>;
  updateTenantStatus: (id: string, status: 'pending' | 'active' | 'trial' | 'suspended') => Promise<void>;
  approveTenant: (id: string, planId?: string) => Promise<void>;
  rejectTenant: (id: string, reason?: string) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  savePlan: (plan: SubscriptionPlan) => Promise<void>;
}

// Initial Mock Tenants
const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-papaye-001',
    code: 'PAPAYE-001',
    name: 'Papaye Fast Food Ghana',
    ownerName: 'Samir Kalmoni',
    email: 'operations@papaye.com.gh',
    phone: '+233 24 411 2233',
    address: 'Spintex Road, Near Shell Signboard',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    currency: 'GH₵',
    status: 'active',
    planId: 'plan-enterprise',
    expiryDate: '2027-12-31',
    branchesCount: 6,
    activeOrdersCount: 28,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'tenant-buka-002',
    code: 'BUKA-002',
    name: 'Buka Restaurant Osu',
    ownerName: 'Audrey Gadzekpo',
    email: 'info@bukarestaurant.com',
    phone: '+233 20 812 3456',
    address: '10th Street, Osu RE',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    currency: 'GH₵',
    status: 'active',
    planId: 'plan-pro',
    expiryDate: '2026-11-30',
    branchesCount: 2,
    activeOrdersCount: 14,
    createdAt: '2024-03-10T10:30:00Z',
  },
  {
    id: 'tenant-starbites-003',
    code: 'STAR-003',
    name: 'Starbites Food Bus',
    ownerName: 'Kwame Agyapong',
    email: 'support@starbitesgh.com',
    phone: '+233 55 900 1122',
    address: 'East Legon, Lagos Avenue',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    currency: 'GH₵',
    status: 'trial',
    planId: 'plan-starter',
    expiryDate: '2026-10-31',
    branchesCount: 1,
    activeOrdersCount: 5,
    createdAt: '2024-09-01T14:15:00Z',
  },
  {
    id: 'tenant-charlie-004',
    code: 'CHAR-004',
    name: 'Chez Clarisse Mama Africa',
    ownerName: 'Clarisse Kouassi',
    email: 'clarisse@chezmama.com',
    phone: '+233 24 555 7788',
    address: 'Osu Oxford Street',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    currency: 'GH₵',
    status: 'suspended',
    planId: 'plan-starter',
    expiryDate: '2026-08-15',
    branchesCount: 1,
    activeOrdersCount: 0,
    createdAt: '2024-02-18T09:00:00Z',
  },
  {
    id: 'tenant-goldcoast-005',
    code: 'GOLD-005',
    name: 'Gold Coast Food Hub',
    ownerName: 'Nana Yaw Boateng',
    email: 'contact@goldcoasthub.gh',
    phone: '+233 24 991 8822',
    address: 'Adum Central Market Road',
    city: 'Kumasi',
    region: 'Ashanti Region',
    country: 'Ghana',
    currency: 'GH₵',
    status: 'pending',
    planId: 'plan-starter',
    establishment_type: 'restaurant',
    year_established: 2023,
    services: ['Dine-in', 'Delivery', 'Self-Pickup', 'Table Reservation'],
    registered_by_role: 'owner',
    expiryDate: '2026-11-01',
    branchesCount: 1,
    activeOrdersCount: 0,
    createdAt: new Date().toISOString(),
  },
];

// Initial Mock Plans
const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter Chop',
    priceMonthly: 150,
    priceAnnual: 1500,
    currency: 'GH₵',
    maxUsers: 3,
    branchesAllowed: 1,
    features: ['POS Register', 'Kitchen Display System (KDS)', 'Menu Catalog', 'Cash & MoMo Payments'],
    recommended: false,
  },
  {
    id: 'plan-pro',
    name: 'Professional Eatery',
    priceMonthly: 350,
    priceAnnual: 3500,
    currency: 'GH₵',
    maxUsers: 10,
    branchesAllowed: 3,
    features: ['Everything in Starter', 'Inventory & Ingredient Tracking', 'Multi-Branch Entitlements', 'Executive Sales Reports', 'Thermal Hardware Printing'],
    recommended: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Franchise',
    priceMonthly: 850,
    priceAnnual: 8500,
    currency: 'GH₵',
    maxUsers: 50,
    branchesAllowed: 10,
    features: ['Everything in Pro', 'Custom Mobile Ordering Subdomain', 'Staff Role Matrix (RBAC)', 'Unlimited Kitchen Stations', 'Dedicated Account Manager & SLA'],
    recommended: false,
  },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('chopflow_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('chopflow_admin_tenants');
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem('chopflow_admin_plans');
      return saved ? JSON.parse(saved) : INITIAL_PLANS;
    } catch {
      return INITIAL_PLANS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('chopflow_admin_tenants', JSON.stringify(tenants));
    } catch {}
  }, [tenants]);

  useEffect(() => {
    try {
      localStorage.setItem('chopflow_admin_plans', JSON.stringify(plans));
    } catch {}
  }, [plans]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const tenantsRes = await api.getTenants();
      if (tenantsRes?.success && Array.isArray(tenantsRes.data)) {
        setTenants(tenantsRes.data);
      }
    } catch (e) {
      console.warn('Backend API connection warning, using cached tenant data');
    }

    try {
      const plansRes = await api.getPlans();
      if (plansRes?.success && Array.isArray(plansRes.data)) {
        setPlans(plansRes.data);
      }
    } catch (e) {
      // Keep local plans
    }

    try {
      const logsRes = await api.getAuditLogs(30);
      if (logsRes?.success && Array.isArray(logsRes.data)) {
        setAuditLogs(logsRes.data);
      }
    } catch (e) {
      // Keep empty
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (adminUser) {
      refreshData();
    }
  }, [adminUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(email, password);
      if (res?.success && res.data) {
        api.setToken(res.data.token);
        const user = res.data.user || {
          id: 'admin-01',
          name: 'Platform Super Admin',
          email,
          role: 'platform_admin',
        };
        setAdminUser(user);
        localStorage.setItem('chopflow_admin_auth', JSON.stringify(user));
        return true;
      }
    } catch (e) {
      console.warn('Live API auth failed, testing master credentials locally');
    }

    // Master credential fallback
    if (email.toLowerCase() === 'admin@chopflow.com' && password === 'password123') {
      const user: AdminUser = {
        id: 'usr-admin-01',
        name: 'Platform Super Admin',
        email: 'admin@chopflow.com',
        role: 'platform_admin',
      };
      setAdminUser(user);
      localStorage.setItem('chopflow_admin_auth', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setAdminUser(null);
    api.setToken(null);
    localStorage.removeItem('chopflow_admin_auth');
  };

  const addTenant = async (tenantData: any): Promise<Tenant> => {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      code: `SHOP-${Math.floor(100 + Math.random() * 900)}`,
      name: tenantData.name,
      ownerName: tenantData.ownerName,
      email: tenantData.email || `${tenantData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: tenantData.phone,
      address: tenantData.address || 'Commercial District',
      city: tenantData.city || 'Accra',
      region: tenantData.region || 'Greater Accra',
      country: tenantData.country || 'Ghana',
      currency: tenantData.currency || 'GH₵',
      status: tenantData.status || 'active',
      planId: tenantData.planId || 'plan-pro',
      expiryDate: tenantData.expiryDate || '2027-12-31',
      branchesCount: 1,
      activeOrdersCount: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.createTenant(tenantData);
      if (res?.success && res.data) {
        setTenants((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (e) {
      console.warn('Backend API tenant save failed, saving to local store:', e);
    }

    setTenants((prev) => [newTenant, ...prev]);
    return newTenant;
  };

  const updateTenant = async (id: string, tenantData: any) => {
    try {
      await api.updateTenant(id, tenantData);
    } catch (e) {
      console.warn('Backend API tenant update failed, updating locally:', e);
    }

    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tenantData } : t))
    );
  };

  const updateTenantStatus = async (id: string, status: 'active' | 'trial' | 'suspended') => {
    try {
      await api.updateTenantStatus(id, status);
    } catch (e) {
      console.warn('Backend API status update failed, updating locally:', e);
    }

    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const deleteTenant = async (id: string) => {
    try {
      await api.deleteTenant(id);
    } catch (e) {
      console.warn('Backend API delete failed, deleting locally:', e);
    }

    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const savePlan = async (plan: SubscriptionPlan) => {
    try {
      await api.savePlan(plan);
    } catch (e) {
      console.warn('Backend API save plan failed, saving locally:', e);
    }

    setPlans((prev) => {
      const existing = prev.find((p) => p.id === plan.id);
      if (existing) {
        return prev.map((p) => (p.id === plan.id ? plan : p));
      }
      return [...prev, plan];
    });
  };

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'active').length;
  const trialTenants = tenants.filter((t) => t.status === 'trial').length;
  const suspendedTenants = tenants.filter((t) => t.status === 'suspended').length;
  const mrr = tenants
    .filter((t) => t.status === 'active')
    .reduce((acc, t) => {
      const plan = plans.find((p) => p.id === t.planId);
      return acc + (plan?.priceMonthly || 350);
    }, 0);

  const metrics: AdminDashboardMetrics = {
    totalTenants,
    activeTenants,
    trialTenants,
    suspendedTenants,
    mrr,
    totalOrders: 142850,
    activeUsers: 84,
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        logout,
        tenants,
        plans,
        metrics,
        auditLogs,
        isLoading,
        refreshData,
        addTenant,
        updateTenant,
        updateTenantStatus,
        deleteTenant,
        savePlan,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Compatibility export so existing components expecting useStore can seamlessly work
export const useStore = useAdmin;
