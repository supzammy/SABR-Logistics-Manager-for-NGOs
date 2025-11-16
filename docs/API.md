# API Documentation - SABR Logistics Manager

This document describes the internal service architecture and data structures used in SABR Logistics Manager.

## 📑 Table of Contents

- [Data Models](#data-models)
- [Services](#services)
- [State Management](#state-management)
- [Type Definitions](#type-definitions)

---

## Data Models

### InventoryItem

Represents a donated item in the inventory.

```typescript
interface InventoryItem {
  id: string;                    // Unique identifier (e.g., "inv001")
  name: string;                  // Item name (e.g., "Apples")
  category: string;              // Category (Produce, Canned Goods, Dairy, etc.)
  quantity: number;              // Available quantity
  unit: string;                  // Unit of measurement (kg, liters, cans, etc.)
  donor: string;                 // Donor organization name
  expiryDate: string;            // ISO date string
  donationDate: string;          // ISO date string
  valuePerUnit: number;          // Estimated value per unit (for tax receipts)
  isLowStock: boolean;           // Flag for low stock alerts
  dietaryRestrictions: string[]; // Array of dietary tags (gluten-free, vegan, etc.)
}
```

**Example:**
```json
{
  "id": "inv001",
  "name": "Apples",
  "category": "Produce",
  "quantity": 100,
  "unit": "kg",
  "donor": "Reliance Fresh",
  "expiryDate": "2025-11-20T00:00:00.000Z",
  "donationDate": "2025-11-15T00:00:00.000Z",
  "valuePerUnit": 2.5,
  "isLowStock": true,
  "dietaryRestrictions": ["gluten-free"]
}
```

---

### ShelterNeed

Represents a beneficiary's item request.

```typescript
interface ShelterNeed {
  id: string;                 // Unique identifier
  shelterName: string;        // Beneficiary organization name
  itemName: string;           // Requested item (or "Anything")
  quantityNeeded: number;     // Quantity required
  unit: string;               // Unit of measurement
  priority: 'High' | 'Medium' | 'Low'; // Urgency level
  address: string;            // Delivery address
  capacity: number;           // Total shelter capacity (people)
  currentStock: number;       // Current occupancy
  dietaryNeeds: string[];     // Dietary requirements
}
```

**Example:**
```json
{
  "id": "need01",
  "shelterName": "Anbu Illam",
  "itemName": "Apples",
  "quantityNeeded": 50,
  "unit": "kg",
  "priority": "High",
  "address": "123 Gandhi St, Chennai",
  "capacity": 1000,
  "currentStock": 800,
  "dietaryNeeds": []
}
```

---

### DonationSubmission

Represents a donor's submitted donation.

```typescript
interface DonationSubmission {
  id: string;                     // Unique identifier
  donorId: string;                // Reference to Donor.id
  items: DonationItem[];          // Array of donated items
  pickupWindow: {
    start: string;                // ISO date string
    end: string;                  // ISO date string
  };
  status: 'Pending Review' | 'Matched' | 'Collected' | 'Delivered';
  createdAt: string;              // ISO date string
  matchedNgoId?: string;          // Reference to ShelterNeed.id (when matched)
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

interface DonationItem {
  name: string;
  category: 'Food' | 'Clothing' | 'Medical' | 'Other';
  quantity: number;
  unit: string;
  expiryDate?: string;
  storageNotes?: string;
}
```

---

### Donor

Represents a registered donor organization.

```typescript
interface Donor {
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
  businessType: 'Supermarket' | 'Restaurant' | 'Farm' | 'Individual' | 'Other';
  status: 'Active' | 'Pending Verification' | 'Inactive';
  donationPreferences: {
    transportation: 'Self-deliver' | 'Pickup required';
    donationTypes: string[];
  };
  taxInfo?: {
    ein: string; // Employer Identification Number
  };
}
```

---

### Volunteer

Represents a registered volunteer.

```typescript
interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  task: 'Delivery Driver' | 'Warehouse Sorting' | 'Donation Pickup' | 'On Call';
  status: 'Active' | 'Inactive';
}
```

---

### Activity

Represents a logged activity in the system.

```typescript
interface Activity {
  id: string;
  timestamp: string;          // HH:MM:SS format
  description: string;        // Human-readable description
  type: 'match' | 'donation' | 'alert' | 'pledge';
}
```

---

## Services

### AI Service (`services/aiService.ts`)

Provides intelligent matching and suggestion algorithms.

#### `generateMatchingRecommendations()`

Generates AI-powered match recommendations.

```typescript
async function generateMatchingRecommendations(
  inventory: InventoryItem[],
  needs: ShelterNeed[]
): Promise<AiMatch[]>
```

**Algorithm:**
1. **High-Priority Matching** - Fulfills urgent needs first
2. **Waste Prevention** - Matches expiring items (< 7 days)
3. **Surplus Distribution** - Allocates abundant stock to general needs

**Returns:**
```typescript
interface AiMatch {
  inventoryId: string;    // Reference to InventoryItem.id
  needId: string;         // Reference to ShelterNeed.id
  quantity: number;       // Suggested match quantity
  reason: string;         // Explanation of why this match was suggested
}
```

**Example Response:**
```json
[
  {
    "inventoryId": "inv001",
    "needId": "need01",
    "quantity": 50,
    "reason": "Fulfills a high-priority request from Anbu Illam."
  }
]
```

---

#### `generateDonationSuggestions()`

Suggests most-needed items for potential donors.

```typescript
async function generateDonationSuggestions(
  needs: ShelterNeed[]
): Promise<DonationSuggestion[]>
```

**Algorithm:**
- Analyzes frequency and priority of needs
- Ranks items by demand
- Returns top 3 suggestions

**Returns:**
```typescript
interface DonationSuggestion {
  itemName: string;
  reason: string;
}
```

**Example Response:**
```json
[
  {
    "itemName": "Rice",
    "reason": "A high-priority item requested by 3 partners."
  }
]
```

---

## State Management

### App-Level State (`App.tsx`)

The main application state is managed in `App.tsx` using React hooks.

**State Variables:**
```typescript
const [inventory, setInventory] = useState<InventoryItem[]>([]);
const [needs, setNeeds] = useState<ShelterNeed[]>([]);
const [activities, setActivities] = useState<Activity[]>([]);
const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
const [donors, setDonors] = useState<Donor[]>([]);
const [donationSubmissions, setDonationSubmissions] = useState<DonationSubmission[]>([]);
const [messages, setMessages] = useState<Message[]>([]);
const [loggedInDonor, setLoggedInDonor] = useState<Donor | null>(null);
const [managerProfile, setManagerProfile] = useState<ManagerProfile>(INITIAL_MANAGER_PROFILE);
const [currentUser, setCurrentUser] = useState<'manager' | 'donor'>('manager');
```

**State Update Functions:**
- `onConfirmMatch()` - Updates inventory and needs when match is confirmed
- `handleMatchSubmission()` - Processes donor submissions and adds to inventory
- `handleLogin()` / `handleLogout()` - Manages donor authentication
- `handleCreateDonor()` / `handleUpdateDonor()` - Donor CRUD operations
- `showToast()` - Displays user feedback notifications

---

## Type Definitions

### Full Type Reference

See `types.ts` for complete type definitions:

```typescript
// Core entities
export type { InventoryItem } from './types';
export type { ShelterNeed } from './types';
export type { Donor } from './types';
export type { Volunteer } from './types';
export type { Activity } from './types';

// AI-related
export type { AiMatch } from './types';
export type { DonationSuggestion } from './types';

// Donations
export type { DonationSubmission } from './types';
export type { DonationItem } from './types';

// Analytics
export type { UsageDataPoint } from './types';

// Messaging
export type { Message } from './types';

// User profiles
export type { ManagerProfile } from './types';
```

---

## Mock Data

For development and demonstration, the app uses mock data defined in `App.tsx`:

- `MOCK_INVENTORY` - Sample inventory items
- `MOCK_NEEDS` - Sample beneficiary needs
- `MOCK_ACTIVITY` - Sample activity log
- `MOCK_VOLUNTEERS` - Sample volunteers
- `MOCK_DONORS` - Sample donor organizations
- `MOCK_SUBMISSIONS` - Sample donation submissions
- `MOCK_MESSAGES` - Sample message feed

This mock data allows the application to function fully without a backend.

---

## Future API Integration

When integrating with a real backend:

1. **Replace mock data** with API calls to fetch real data
2. **Update state setters** to call API endpoints
3. **Add authentication** for secure access
4. **Implement webhooks** for real-time updates
5. **Add pagination** for large datasets

**Example API Structure:**
```
GET    /api/inventory          - List all inventory items
POST   /api/inventory          - Create new item
PUT    /api/inventory/:id      - Update item
DELETE /api/inventory/:id      - Delete item

GET    /api/needs              - List all needs
POST   /api/needs              - Create new need

GET    /api/donors             - List all donors
POST   /api/donors             - Register new donor

GET    /api/matches            - Get AI match recommendations
POST   /api/matches/:id/confirm - Confirm a match
```

---

**This documentation reflects the current architecture of SABR Logistics Manager v1.0.0**
