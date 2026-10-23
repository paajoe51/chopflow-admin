export type ApplicationTier = 'admin' | 'app' | 'customer';

export type UserRole = 
  | 'platform_admin'
  | 'owner'
  | 'manager'
  | 'sales_person'
  | 'kitchen_staff'
  | 'inventory_staff'
  | 'accountant'
  | 'customer';

export type BusinessType = 
  | 'fast_food'
  | 'restaurant'
  | 'cafe'
  | 'chop_bar'
  | 'food_vendor';

export type FeatureEntitlement = 
  | 'dashboard'
  | 'pos'
  | 'orders'
  | 'menu'
  | 'customers'
  | 'kds'
  | 'inventory'
  | 'purchases'
  | 'suppliers'
  | 'finance'
  | 'reports'
  | 'staff_rbac'
  | 'printers'
  | 'customer_app'
  | 'branches'
  | 'states';

export interface ShopBranch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  businessType: BusinessType;
  enabledEntitlements: FeatureEntitlement[];
  status: 'active' | 'suspended';
  city: string;
  region: string;
  address: string;
  isMainBranch?: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  code: string; // e.g. PAPAYE-001
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  country: string;
  planId: string;
  status: 'active' | 'trial' | 'suspended';
  registrationDate?: string;
  createdAt?: string;
  expiryDate: string;
  currency: string;
  branches?: ShopBranch[];
  branchesCount?: number;
  activeOrdersCount?: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  currency?: string;
  maxUsers: number;
  branchesAllowed: number;
  features: string[];
  recommended?: boolean;
}

export interface StaffUser {
  id: string;
  tenantId: string;
  branchId?: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  savedAddresses: string[];
  totalOrders: number;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

export interface ProteinOption {
  id: string;
  name: string; // e.g. Chicken, Fish, Goat, Beef, Egg
  price: number; // e.g. 60, 65, 70
  available: boolean;
}

export interface SoupOption {
  id: string;
  name: string; // Light Soup, Palm Nut, Groundnut, Green Soup
  available: boolean;
}

export interface ExtraOption {
  id: string;
  name: string; // Extra Meat, Extra Fish, Egg, Extra Rice, Sausage
  price: number;
  available: boolean;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  available: boolean;
  status: 'READY' | 'PREPARING' | 'UNAVAILABLE';
  isLocalFood?: boolean; // e.g. Fufu, Banku, Kokonte
  isContinental?: boolean; // Jollof, Fried Rice, Plain Rice
  isNoodles?: boolean;
  isPizza?: boolean;
  packSizes?: { name: string; price: number }[];
  proteins?: ProteinOption[];
  soups?: SoupOption[];
  extras?: ExtraOption[];
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export type PaymentMethod = 'Cash' | 'MTN MoMo' | 'Card';

export type OrderSource = 'Walk-in' | 'Customer App' | 'Phone' | 'WhatsApp';

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedPackSize?: { name: string; price: number };
  selectedProtein?: ProteinOption;
  selectedSoup?: SoupOption;
  selectedExtras: ExtraOption[];
  selectedPizzaSize?: 'Small' | 'Medium' | 'Large';
  selectedPizzaCrust?: 'Thin' | 'Stuffed' | 'Pan';
  selectedPizzaToppings?: string[];
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-0048
  tenantId: string;
  branchId?: string;
  customerName: string;
  customerPhone: string;
  orderType: 'Pickup' | 'Dine-in' | 'Delivery';
  source: OrderSource;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  estimatedPrepMinutes: number;
  specialInstructions?: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string; // kg, liters, packs, pieces
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  address: string;
}

export interface Expense {
  id: string;
  tenantId: string;
  title: string;
  category: 'Electricity' | 'Water' | 'Gas' | 'Ingredients' | 'Transport' | 'Salaries' | 'Maintenance' | 'Miscellaneous';
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  loggedBy: string;
  notes?: string;
}

export interface PrinterPeripheral {
  id: string;
  name: string;
  type: 'Receipt Printer' | 'Kitchen Printer' | 'Bluetooth Thermal Printer';
  connection: 'USB' | 'Bluetooth' | 'Ethernet / LAN';
  ipAddress?: string;
  status: 'Connected' | 'Offline' | 'Paper Out';
  isDefault: boolean;
}
