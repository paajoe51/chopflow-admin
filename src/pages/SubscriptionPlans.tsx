import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SubscriptionPlan } from '../types';
import { Modal } from '../components/common/Modal';
import { Check, CreditCard, Edit, Plus, Star } from 'lucide-react';

export const SubscriptionPlans: React.FC = () => {
  const { plans, savePlan } = useAdmin();

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceAnnual, setPriceAnnual] = useState('');
  const [maxUsers, setMaxUsers] = useState('5');
  const [branchesAllowed, setBranchesAllowed] = useState('1');
  const [featuresText, setFeaturesText] = useState('');
  const [recommended, setRecommended] = useState(false);

  const handleOpenAdd = () => {
    setName('');
    setPriceMonthly('200');
    setPriceAnnual('2000');
    setMaxUsers('5');
    setBranchesAllowed('1');
    setFeaturesText('POS Register, Kitchen Display, Inventory Control');
    setRecommended(false);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPriceMonthly(plan.priceMonthly.toString());
    setPriceAnnual(plan.priceAnnual.toString());
    setMaxUsers(plan.maxUsers.toString());
    setBranchesAllowed(plan.branchesAllowed.toString());
    setFeaturesText(plan.features.join(', '));
    setRecommended(Boolean(plan.recommended));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceMonthly) return;

    const featureList = featuresText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    await savePlan({
      id: editingPlan?.id || `plan-${Date.now()}`,
      name,
      priceMonthly: parseFloat(priceMonthly) || 0,
      priceAnnual: parseFloat(priceAnnual) || 0,
      maxUsers: parseInt(maxUsers, 10) || 3,
      branchesAllowed: parseInt(branchesAllowed, 10) || 1,
      features: featureList,
      recommended,
    });

    setEditingPlan(null);
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">Subscription Plans & Billing Matrix</h1>
          <p className="text-xs text-slate-500">Configure tier pricing, feature entitlements, user thresholds, and SaaS tenant limits</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Tier Plan</span>
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-white border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between relative transition-shadow hover:shadow-md ${
              p.recommended ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-200'
            }`}
          >
            {p.recommended && (
              <span className="absolute -top-3 right-6 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" /> Most Popular
              </span>
            )}

            <div className="space-y-3">
              <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="font-display font-extrabold text-3xl text-slate-900 font-tnum">
                  GH₵ {p.priceMonthly}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Annual: GH₵ {p.priceAnnual} / year
              </p>

              <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
                <p>• Max Staff Accounts: <strong className="text-slate-900 font-bold">{p.maxUsers} Users</strong></p>
                <p>• Branches Allowed: <strong className="text-slate-900 font-bold">{p.branchesAllowed} Branch{p.branchesAllowed > 1 ? 'es' : ''}</strong></p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Included</p>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(p)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs mt-4 flex items-center justify-center space-x-2 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Plan Configuration</span>
            </button>
          </div>
        ))}
      </div>

      {/* Plan Edit / Add Modal */}
      {(editingPlan || isAddOpen) && (
        <Modal
          isOpen={!!editingPlan || isAddOpen}
          onClose={() => {
            setEditingPlan(null);
            setIsAddOpen(false);
          }}
          title={editingPlan ? `Configure Plan: ${editingPlan.name}` : 'Create Subscription Tier'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Plan Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enterprise Plus"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Fee (GH₵)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={priceMonthly}
                  onChange={(e) => setPriceMonthly(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold font-tnum"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Annual Fee (GH₵)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={priceAnnual}
                  onChange={(e) => setPriceAnnual(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold font-tnum"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Max Staff Users</label>
                <input
                  type="number"
                  required
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold font-tnum"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Branches Included</label>
                <input
                  type="number"
                  required
                  value={branchesAllowed}
                  onChange={(e) => setBranchesAllowed(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold font-tnum"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Included Features (Comma separated)</label>
              <textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="POS Register, KDS Kitchen Display, Inventory & Suppliers, Customer Mobile App"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <label className="flex items-center space-x-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={recommended}
                onChange={(e) => setRecommended(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium text-slate-700">Mark as "Most Popular / Recommended" Tier</span>
            </label>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingPlan(null);
                  setIsAddOpen(false);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs transition-colors"
              >
                Commit & Save to MySQL
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
