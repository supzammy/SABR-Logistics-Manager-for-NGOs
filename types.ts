export interface InventoryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Canned Goods' | 'Bakery' | 'Dairy';
  quantity: number;
  unit: string;
  donor: string;
  expiryDate: string; // ISO 8601 format
  donationDate: string; // ISO 8601 format
  valuePerUnit: number;
  isLowStock: boolean;
  dietaryRestrictions: string[];
}

export interface ShelterNeed {
  id: string;
  shelterName: string;
  itemName: string;
  quantityNeeded: number;
  unit: string;
  priority: 'High' | 'Medium' | 'Low';
  address: string;
  capacity: number; // total capacity
  currentStock: number; // current stock of all items
  dietaryNeeds: string[];
}

export interface Activity {
  id:string;
  timestamp: string;
  description: string;
  type: 'match' | 'donation' | 'alert' | 'pledge';
}

export interface UsageDataPoint {
  date: string;
  usage: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  task: 'Warehouse Sorting' | 'Donation Pickup' | 'Delivery Driver' | 'On Call';
  status: 'Active' | 'Inactive';
}

export interface Donor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  businessType: 'Supermarket' | 'Restaurant' | 'Farm' | 'Individual';
  status: 'Active' | 'Inactive' | 'Pending Verification';
  donationPreferences: {
      transportation: 'Self-deliver' | 'Pickup required';
      donationTypes?: ('Food' | 'Clothing' | 'Medical' | 'Other')[];
  };
  taxInfo: {
      ein: string;
  };
}

export interface DonationSubmission {
  id: string;
  donorId: string;
  items: {
      category: 'Food' | 'Clothing' | 'Medical' | 'Other';
      name: string;
      quantity: number;
      unit: string;
      expiryDate?: string;
      storageNotes: string;
  }[];
  pickupWindow: {
      start: string;
      end: string;
  };
  status: 'Pending Review' | 'Matched' | 'Collected' | 'In Transit' | 'Delivered';
  createdAt: string; // ISO 8601 format
  matchedNgoId?: string;
  matchDetails?: {
      ngo_id: string;
      name: string;
  };
  donorBenefits?: {
    tax_deduction_value: number;
    impact_certificate_ready: boolean;
    social_media_shareables: string[];
  };
}

// Gamification Types
export type AchievementId = 'first_donation' | 'five_timer' | 'produce_pro' | 'pantry_packer' | 'urgent_responder';

export interface Achievement {
    id: AchievementId;
    name: string;
    description: string;
    unlocked: boolean;
    icon: 'badge' | 'star' | 'award' | 'heart' | 'gift' | 'truck' | 'message-square';
}

// Message Center Type
export interface Message {
    id: string;
    timestamp: string;
    from: string;
    fromAvatar: string;
    content: string;
    read: boolean;
}

// Manager Profile Type
export interface ManagerProfile {
    name: string;
    email: string;
    notifications: {
        lowStock: boolean;
        newMatches: boolean;
        weeklySummary: boolean;
    };
}

// AI Service Types
export interface AiMatch {
  inventoryId: string;
  needId: string;
  quantity: number;
  reason: string;
}

export interface DonationSuggestion {
    itemName: string;
    reason: string;
}