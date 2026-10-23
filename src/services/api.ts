/**
 * ChopFlow Platform Admin API Client
 * Standalone client targeting admin.chopflow.com -> api.chopflow.com
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000';

class AdminApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('chopflow_admin_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('chopflow_admin_token', token);
    } else {
      localStorage.removeItem('chopflow_admin_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.error(`[AdminApiClient] Request failed: ${method} ${url}`, err);
      throw err;
    }
  }

  // ==================================================================
  // PLATFORM SUPER ADMIN ENDPOINTS
  // ==================================================================
  public auth = {
    login: (email: string, password: string) =>
      this.request('/admin/auth/login', 'POST', { email, password }),

    getMe: () =>
      this.request('/admin/auth/me', 'GET'),
  };

  public getDashboard = () =>
    this.request('/admin/dashboard', 'GET');

  public getTenants = (filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/admin/tenants${query}`, 'GET');
  };

  public getTenantDetails = (id: string) =>
    this.request(`/admin/tenants/${id}`, 'GET');

  public createTenant = (tenantData: {
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    planId?: string;
    businessType?: string;
    city?: string;
    region?: string;
    address?: string;
    password?: string;
  }) => this.request('/admin/tenants', 'POST', tenantData);

  public updateTenant = (id: string, tenantData: any) =>
    this.request(`/admin/tenants/${id}`, 'PUT', tenantData);

  public deleteTenant = (id: string) =>
    this.request(`/admin/tenants/${id}`, 'DELETE');

  public updateTenantStatus = (id: string, status: 'active' | 'trial' | 'suspended') =>
    this.request(`/admin/tenants/${id}/status`, 'PUT', { status });

  public getPlans = () =>
    this.request('/admin/plans', 'GET');

  public savePlan = (planData: any) =>
    this.request('/admin/plans', 'POST', planData);

  public getSettings = () =>
    this.request('/admin/settings', 'GET');

  public updateSettings = (settings: Record<string, any>) =>
    this.request('/admin/settings', 'PUT', settings);

  public getAuditLogs = (limit: number = 50) =>
    this.request(`/admin/audit-logs?limit=${limit}`, 'GET');
}

export const api = new AdminApiClient();
export default api;
