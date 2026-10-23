import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Tenant } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TenantDetailsModal } from './TenantDetailsModal';
import { 
  Building2, Plus, Search, Shield, MapPin, CheckCircle, Eye, Edit2, 
  Trash2, ToggleLeft, ToggleRight, AlertOctagon, Hourglass, CheckCircle2, 
  XCircle, Clock, Sparkles, Check, Phone, Crown, Sliders 
} from 'lucide-react';

export const RestaurantManagement: React.FC = () => {
  const { 
    tenants, 
    addTenant, 
    updateTenant, 
    updateTenantStatus, 
    approveTenant, 
    rejectTenant, 
    deleteTenant, 
    plans 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'trial' | 'suspended'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [search, setSearch] = useState('');

  // Approval & Rejection Modal State
  const [approvingTenant, setApprovingTenant] = useState<Tenant | null>(null);
  const [selectedApprovePlan, setSelectedApprovePlan] = useState('plan-starter');
  const [rejectingTenant, setRejectingTenant] = useState<Tenant | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Application details did not meet ChopFlow merchant guidelines.');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Create form state
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [planId, setPlanId] = useState('plan-pro');

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editPlanId, setEditPlanId] = useState('');

  // Counts
  const pendingCount = tenants.filter((t) => t.status === 'pending').length;
  const activeCount = tenants.filter((t) => t.status === 'active').length;
  const trialCount = tenants.filter((t) => t.status === 'trial').length;
  const suspendedCount = tenants.filter((t) => t.status === 'suspended').length;

  const filteredTenants = tenants.filter((t) => {
    // Status tab filter
    if (activeTab !== 'all' && t.status !== activeTab) {
      return false;
    }

    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || !phone) return;
    await addTenant({
      name,
      ownerName,
      phone,
      email,
      address: 'Commercial District',
      city: city || 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      planId: planId || 'plan-pro',
      status: 'active',
      expiryDate: '2027-12-31',
      currency: 'GH₵',
    });
    setIsModalOpen(false);
    setName('');
    setOwnerName('');
    setPhone('');
    setEmail('');
    setCity('');
  };

  const handleOpenEdit = (t: Tenant) => {
    setEditingTenant(t);
    setEditName(t.name);
    setEditOwner(t.ownerName);
    setEditPhone(t.phone);
    setEditEmail(t.email);
    setEditCity(t.city);
    setEditPlanId(t.planId);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant || !editName) return;

    await updateTenant(editingTenant.id, {
      name: editName,
      ownerName: editOwner,
      phone: editPhone,
      email: editEmail,
      city: editCity,
      planId: editPlanId,
    });

    setEditingTenant(null);
  };

  const handleToggleStatus = async (t: Tenant) => {
    const newStatus = t.status === 'active' ? 'suspended' : 'active';
    await updateTenantStatus(t.id, newStatus);
  };

  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingTenant) return;
    setIsActionLoading(true);

    try {
      await approveTenant(approvingTenant.id, selectedApprovePlan);
      setApprovingTenant(null);
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingTenant) return;
    setIsActionLoading(true);

    try {
      await rejectTenant(rejectingTenant.id, rejectionReason);
      setRejectingTenant(null);
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (t: Tenant) => {
    if (window.confirm(`Are you sure you want to completely purge restaurant organization "${t.name}"? This action cannot be undone.`)) {
      await deleteTenant(t.id);
    }
  };

  // 7-day trial expiry preview for approve modal
  const trialExpiryPreview = new Date();
  trialExpiryPreview.setDate(trialExpiryPreview.getDate() + 7);
  const trialExpiryDateFormatted = trialExpiryPreview.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">Multi-Tenant Restaurant Onboarding</h1>
          <p className="text-xs text-slate-500">Review pending registrations, approve 7-day trials, audit tenant health & manage plans</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Restaurant Tenant</span>
        </button>
      </div>

      {/* Directory Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-4 space-y-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-100">
          {[
            { id: 'all' as const, label: 'All Organizations', count: tenants.length },
            { id: 'pending' as const, label: 'Pending Review', count: pendingCount, isAlert: pendingCount > 0 },
            { id: 'trial' as const, label: '7-Day Free Trial', count: trialCount },
            { id: 'active' as const, label: 'Active Subscriptions', count: activeCount },
            { id: 'suspended' as const, label: 'Suspended', count: suspendedCount },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  tab.isAlert 
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : isSelected 
                      ? 'bg-slate-800 text-slate-200' 
                      : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex justify-between items-center pb-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, owner, code, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:block">
            Showing {filteredTenants.length} of {tenants.length} tenants
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Tenant Code</th>
                <th className="p-3">Restaurant Name</th>
                <th className="p-3">Type & Role</th>
                <th className="p-3">Owner / Contact</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No establishments match this filter.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const estType = t.establishment_type || t.establishmentType || 'fast_food';
                  const regRole = t.registered_by_role || t.registeredByRole || 'owner';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{t.code}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <span className="text-[10px] text-slate-500 font-mono">Plan: {t.planId}</span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          estType === 'fast_food' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {estType === 'fast_food' ? 'Fast Food' : 'Restaurant'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5 capitalize">By {regRole}</p>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-900">{t.ownerName}</div>
                        <div className="font-mono text-slate-500 text-[11px]">{t.phone}</div>
                      </td>
                      <td className="p-3 text-slate-600">{t.city}, {t.region}</td>
                      <td className="p-3">
                        {t.status === 'pending' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                            <Hourglass className="w-3 h-3 text-amber-600 animate-pulse" />
                            <span>Pending Review</span>
                          </span>
                        ) : t.status === 'trial' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>7-Day Trial</span>
                            </span>
                            <p className="text-[9px] text-purple-600 font-mono">Until {t.expiryDate}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(t)}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              t.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="Click to toggle Active / Suspended status"
                          >
                            {t.status === 'active' ? (
                              <>
                                <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5 text-rose-600" />
                                <span>Suspended</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* PENDING ACTIONS */}
                          {t.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setApprovingTenant(t);
                                  setSelectedApprovePlan(t.planId || 'plan-starter');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-sm transition-all"
                                title="Approve & start 7-day trial"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve (7-Day Trial)</span>
                              </button>

                              <button
                                onClick={() => {
                                  setRejectingTenant(t);
                                  setRejectionReason('Application details did not meet ChopFlow merchant guidelines.');
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                                title="Reject listing"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedTenantForDetails(t)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-[11px] inline-flex items-center gap-1 transition-colors"
                            title="View branches & analytics"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>

                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit organization"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(t)}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Purge tenant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: APPROVE TENANT (START 7-DAY TRIAL) */}
      {approvingTenant && (
        <Modal 
          isOpen={!!approvingTenant} 
          onClose={() => setApprovingTenant(null)} 
          title={`Approve Establishment: ${approvingTenant.name}`}
        >
          <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Activate 7-Day Free Trial</span>
              </div>
              <p className="text-emerald-700 text-xs">
                Approving this registration will automatically set their status to <strong>Trial</strong>, activate their user accounts, and grant full access for exactly 7 days until <strong>{trialExpiryDateFormatted}</strong>.
              </p>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                📱 <strong>Automated SMS Dispatch:</strong> An approval SMS will be sent to the owner (<strong className="font-mono">{approvingTenant.phone}</strong>) notifying them that their 7-day trial is active and they can log in.
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Subscription Tier</label>
              <select
                value={selectedApprovePlan}
                onChange={(e) => setSelectedApprovePlan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (GH₵ {p.priceMonthly}/mo after 7-day trial)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setApprovingTenant(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isActionLoading ? 'Activating Trial...' : 'Confirm Approval & Start Trial'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: REJECT TENANT */}
      {rejectingTenant && (
        <Modal 
          isOpen={!!rejectingTenant} 
          onClose={() => setRejectingTenant(null)} 
          title={`Reject Registration: ${rejectingTenant.name}`}
        >
          <form onSubmit={handleConfirmRejection} className="space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
              <p>
                Rejecting this listing will set the account to <strong>Suspended</strong>. The applicant will be notified via SMS that their application was not approved.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Rejection Reason / Notes</label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify reason for review audit..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingTenant(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isActionLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-colors"
              >
                {isActionLoading ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Registration Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Restaurant Tenant">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Restaurant Business Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Taste Chop Bar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Owner Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kwame Mensah"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                required
                placeholder="+233 24 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">City / Region</label>
              <input
                type="text"
                required
                placeholder="Breman Asikuma"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Email</label>
              <input
                type="email"
                placeholder="info@royaltaste.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subscription Plan</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (GH₵ {p.priceMonthly}/mo)</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-colors"
          >
            + Onboard Restaurant Tenant
          </button>
        </form>
      </Modal>

      {/* Edit Tenant Modal */}
      {editingTenant && (
        <Modal isOpen={!!editingTenant} onClose={() => setEditingTenant(null)} title={`Edit Tenant: ${editingTenant.name}`}>
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Restaurant Business Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Owner Full Name</label>
              <input
                type="text"
                required
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan</label>
                <select
                  value={editPlanId}
                  onChange={(e) => setEditPlanId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTenant(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-colors"
              >
                Save Organization Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Details Modal */}
      {selectedTenantForDetails && (
        <TenantDetailsModal
          isOpen={!!selectedTenantForDetails}
          tenant={selectedTenantForDetails}
          onClose={() => setSelectedTenantForDetails(null)}
        />
      )}

    </div>
  );
};
