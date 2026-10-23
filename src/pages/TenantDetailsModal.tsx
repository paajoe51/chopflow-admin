import React, { useState } from 'react';
import { Tenant } from '../types';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';
import { Building2, GitBranch, Shield, Activity, CreditCard, Check } from 'lucide-react';

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  isOpen,
  onClose,
  tenant,
}) => {
  if (!tenant) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'usage' | 'subscriptions'>('overview');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tenant Deep Dive: ${tenant.name}`}>
      <div className="space-y-4">
        
        {/* Tab Header */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'branches', label: 'Shops & Branches' },
            { id: 'usage', label: 'Usage Metrics' },
            { id: 'subscriptions', label: 'Subscriptions' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">{tenant.name}</span>
                <StatusBadge status={tenant.status} />
              </div>
              <p className="text-slate-500">Tenant ID Code: <strong className="font-mono text-slate-900">{tenant.code}</strong></p>
              <p className="text-slate-500">Establishment Type: <strong className="uppercase text-slate-900">{tenant.establishment_type || tenant.establishmentType || 'Fast Food'}</strong> {tenant.year_established || tenant.yearEstablished ? `(Est. ${tenant.year_established || tenant.yearEstablished})` : ''}</p>
              <p className="text-slate-500">Owner: <strong className="text-slate-900">{tenant.ownerName}</strong> ({tenant.phone})</p>
              {(tenant.manager_name || tenant.managerName) && (
                <p className="text-slate-500">Registered by Manager: <strong className="text-slate-900">{tenant.manager_name || tenant.managerName}</strong> ({tenant.manager_phone || tenant.managerPhone || 'N/A'})</p>
              )}
              <p className="text-slate-500">Location: <strong className="text-slate-900">{tenant.address}, {tenant.city}, {tenant.region}, {tenant.country}</strong></p>
              
              {/* Services offered badges */}
              {(tenant.services || (tenant as any).services) && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">Services Offered:</span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(tenant.services) 
                      ? tenant.services 
                      : typeof tenant.services === 'string' 
                        ? JSON.parse(tenant.services || '[]') 
                        : []
                    ).map((srv: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-[10px] font-semibold">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(tenant.rejection_reason || tenant.rejectionReason) && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
                  <strong>Rejection Note:</strong> {tenant.rejection_reason || tenant.rejectionReason}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-2 text-xs">
            {tenant.branches?.map((b) => (
              <div key={b.id} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{b.name}</p>
                  <p className="text-[11px] text-slate-500">{b.city} • Business Type: <strong className="uppercase font-mono">{b.businessType}</strong></p>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                  {b.enabledEntitlements.length} Entitlements
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-50 border rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Orders Processed</p>
                <p className="font-display font-bold text-lg font-tnum text-slate-900">12,450</p>
              </div>
              <div className="p-3 bg-slate-50 border rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Active Staff Accounts</p>
                <p className="font-display font-bold text-lg font-tnum text-slate-900">4 / 10</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
              <p className="font-bold text-sm">Professional Plan (Annual)</p>
              <p className="text-[11px] text-purple-700 mt-0.5">Expires: {tenant.expiryDate}</p>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
