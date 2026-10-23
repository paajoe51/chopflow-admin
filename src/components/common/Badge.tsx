import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | 'READY' | 'PREPARING' | 'UNAVAILABLE' | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Connected' | 'Offline' | 'Paper Out' | 'active' | 'trial' | 'suspended';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Pending':
    case 'trial':
    case 'PREPARING':
      badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      break;
    case 'Confirmed':
    case 'Preparing':
    case 'In Stock':
    case 'Connected':
    case 'active':
      badgeStyle = 'bg-sky-500/10 text-sky-600 border-sky-500/20';
      break;
    case 'Ready':
    case 'READY':
    case 'Completed':
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      break;
    case 'Cancelled':
    case 'UNAVAILABLE':
    case 'Out of Stock':
    case 'Offline':
    case 'Paper Out':
    case 'suspended':
      badgeStyle = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      break;
    case 'Low Stock':
      badgeStyle = 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      break;
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};
