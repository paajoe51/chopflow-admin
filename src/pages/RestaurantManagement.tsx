import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Tenant } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TenantDetailsModal } from './TenantDetailsModal';
import { Building2, Plus, Search, Shield, MapPin, CheckCircle, Eye, Edit2, Trash2, ToggleLeft, ToggleRight, AlertOctagon } from 'lucide-react';

export const RestaurantManagement: React.FC = () => {
  const { tenants, addTenant, updateTenant, updateTenantStatus, deleteTenant, plans } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [search, setSearch] = useState('');

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

  const filteredTenants = tenants.filter((t) => {
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

  const handleDelete = async (t: Tenant) => {
    if (window.confirm(`Are you sure you want to completely purge restaurant organization "${t.name}"? This action cannot be undone.`)) {
      await deleteTenant(t.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">Multi-Tenant Restaurant Onboarding</h1>
          <p className="text-xs text-slate-500">Register new restaurants, audit tenant health, modify plans & manage status</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Restaurant Tenant</span>
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-4 space-y-4">
        
        {/* Search */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
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
            {filteredTenants.length} Tenant Organizations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Tenant Code</th>
                <th className="p-3">Restaurant Name</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Contact</th>
                <th className="p-3">City / Region</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">{t.code}</td>
                  <td className="p-3 font-bold text-slate-900">{t.name}</td>
                  <td className="p-3 text-slate-900">{t.ownerName}</td>
                  <td className="p-3 font-mono text-slate-600">{t.phone}</td>
                  <td className="p-3 text-slate-600">{t.city}, {t.region}</td>
                  <td className="p-3">
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
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center space-x-1.5">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
