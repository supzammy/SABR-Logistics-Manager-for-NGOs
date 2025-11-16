# User Guide - SABR Logistics Manager

Welcome to SABR Logistics Manager! This guide will help you get started and make the most of the platform.

## 📑 Table of Contents

- [Getting Started](#getting-started)
- [Manager Guide](#manager-guide)
- [Donor Guide](#donor-guide)
- [Features Overview](#features-overview)
- [Tips & Best Practices](#tips--best-practices)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

1. **Access the Application**
   - Navigate to the deployed URL or run locally at `http://localhost:3000`
   
2. **Choose Your Role**
   - Use the toggle in the header to switch between **Manager** and **Donor Portal** views

3. **Explore the Interface**
   - The application works with demo data out of the box
   - All features are fully functional

---

## Manager Guide

### Dashboard Overview

The main dashboard provides:
- **Key Metrics**: Total items, beneficiaries served, active volunteers
- **Activity Feed**: Recent donations, matches, and system alerts
- **AI Recommendations**: Smart match suggestions based on priority and expiry
- **Quick Actions**: Access to frequently used features

### Managing Inventory

**Add New Items**
1. Navigate to **Inventory** page
2. Click "Add Item" button
3. Fill in the form:
   - Item name and category
   - Quantity and unit
   - Donor information
   - Expiry date
   - Dietary restrictions (if applicable)
4. Click "Add Item" to save

**Edit/Delete Items**
- Click the pencil icon to edit
- Click the trash icon to delete
- Use the search bar to find specific items

**Inventory Insights**
- Red badges indicate low stock items
- Items are color-coded by category
- Expiry dates are highlighted when approaching

### Managing Donors

**Register New Donor**
1. Go to **Donors** page
2. Click "Add Donor"
3. Fill in business details:
   - Organization name
   - Contact person and email
   - Business type (Supermarket, Restaurant, Farm, etc.)
   - Donation preferences
   - Tax information (optional)
4. Save donor profile

**Donor Status**
- **Active**: Regular contributor
- **Pending Verification**: Awaiting approval
- **Inactive**: No recent activity

### Managing Beneficiaries

**Add Shelter/Beneficiary**
1. Navigate to **Beneficiaries** page
2. Click "Add Need"
3. Enter details:
   - Shelter name and address
   - Item needed
   - Quantity and priority level
   - Current capacity and stock
   - Dietary requirements
4. Submit the need

**Priority Levels**
- **High**: Urgent needs, matched first by AI
- **Medium**: Regular needs
- **Low**: Can wait if higher priorities exist

### Reviewing Matches

**AI Match Recommendations**
1. View matches on the **Dashboard** or **Matches** page
2. AI suggests matches based on:
   - Priority needs
   - Expiring items
   - Abundant stock
3. Review suggested quantity and reason
4. Click "Confirm Match" to approve

**Manual Matching**
- Navigate to **Review Matches** modal
- Select donor submissions
- Choose beneficiary from dropdown
- Confirm allocation

### Volunteer Management

**Assign Tasks**
1. Go to **Volunteers** page
2. Click "Add Volunteer" to register new helpers
3. Assign tasks:
   - Delivery Driver
   - Warehouse Sorting
   - Donation Pickup
   - On Call
4. Track volunteer status (Active/Inactive)

### Reports & Analytics

**View Insights**
- **Donation Trends**: Line chart showing donation volume over time
- **Category Distribution**: Pie chart of donation types
- **Usage Patterns**: Bar chart of beneficiary consumption
- **Export Data**: Download reports for recordkeeping

### Settings

**Update Manager Profile**
1. Navigate to **Settings**
2. Update name, email, and contact info
3. Configure notification preferences:
   - Low stock alerts
   - New match notifications
   - Weekly summary emails
4. Save changes

---

## Donor Guide

### Accessing the Donor Portal

1. **Switch View**
   - Click the **Donor Portal** button in the header toggle

2. **Login or Register**
   - **New Donor**: Click "Register" tab and fill in your details
   - **Returning Donor**: Select your profile from the dropdown

### Submitting Donations

**Create a Donation**
1. Click **"Submit Donation"** card or button
2. Fill in donation details:
   - Item name and category
   - Quantity and unit
   - Storage notes (optional)
   - Expiry date (if applicable)
3. **Optional**: Use barcode scanner to auto-fill item details
4. Set pickup window (start and end time)
5. Submit donation

**Barcode Scanning**
- Click the camera icon
- Allow camera access
- Point camera at barcode
- System auto-fills item information

### Tracking Your Impact

**Dashboard Metrics**
- Total donations submitted
- Items currently matched to NGOs
- Donation level and progress to next milestone
- Impact score

**Donation History**
- View all past donations
- Filter by status:
  - **Pending Review**: Awaiting NGO approval
  - **Matched**: Assigned to beneficiary
  - **Collected**: Picked up by volunteers
  - **Delivered**: Successfully distributed

**Impact Visualization**
- See which beneficiaries received your donations
- View map of impact locations
- Track cumulative contribution metrics

### Earning Badges

**Achievement System**
Unlock badges by reaching milestones:
- 🥉 **Bronze Helper**: 5 donations
- 🥈 **Silver Contributor**: 20 donations
- 🥇 **Gold Supporter**: 50 donations
- 💎 **Platinum Champion**: 100 donations
- 🏆 **Community Hero**: 200 donations

**Level Progression**
- Earn XP with each donation
- Level up to unlock special badges
- Share achievements on social media

### Receipts & Certificates

**Download Receipt**
1. Go to donation history
2. Click on a delivered donation
3. Click **"Print Receipt"** button
4. Receipt includes:
   - Tax-deductible value
   - NGO details
   - Item breakdown
   - Official certification

**Impact Certificates**
- Automatically generated after delivery
- Show total impact value
- Include matched NGO information
- Shareable on social media

### Making Pledges

**Schedule Future Donations**
1. Click **"Make a Pledge"** button
2. Select item and quantity
3. Choose delivery date
4. System sends reminders before pickup
5. Convert pledge to actual donation when ready

### Messaging

**Stay Updated**
- Receive messages from NGO managers
- Get notifications about matched donations
- See thank-you notes from beneficiaries
- Mark messages as read/unread

---

## Features Overview

### AI-Powered Matching

**How It Works**
1. **Priority Matching**: High-priority needs are fulfilled first
2. **Waste Prevention**: Items near expiry are distributed urgently
3. **Surplus Distribution**: Abundant stock allocated to general needs
4. **Smart Suggestions**: Considers dietary restrictions and preferences

**Benefits**
- Reduces food waste
- Maximizes impact
- Saves manager time
- Fair distribution

### Dark Mode

**Enable Dark Mode**
- Click the sun/moon icon in the header
- Preference is saved automatically
- Applies to all pages instantly

**Benefits**
- Reduces eye strain in low-light environments
- Saves battery on OLED screens
- Modern, sleek appearance

### Responsive Design

**Optimized for All Devices**
- **Desktop**: Full sidebar and detailed views
- **Tablet**: Collapsible navigation, optimized layouts
- **Mobile**: Touch-friendly interface, stacked components

---

## Tips & Best Practices

### For Managers

✅ **Update inventory regularly** - Keep stock levels accurate
✅ **Review AI matches daily** - Don't let recommendations pile up
✅ **Maintain donor relationships** - Verify and approve donors promptly
✅ **Monitor expiry dates** - Prioritize items approaching expiration
✅ **Engage volunteers** - Keep task assignments current
✅ **Generate reports weekly** - Track trends and make data-driven decisions

### For Donors

✅ **Provide accurate info** - Correct quantities help with planning
✅ **Scan barcodes** - Faster and more accurate entry
✅ **Set realistic pickup windows** - Ensure you're available
✅ **Track your impact** - See the difference you're making
✅ **Complete your profile** - Better matching and tax benefits
✅ **Pledge regularly** - Helps NGOs plan ahead

---

## Troubleshooting

### Common Issues

**Problem: Can't see my donations**
- ✅ Solution: Make sure you're logged into the correct donor profile
- ✅ Check that you've switched to "Donor Portal" view

**Problem: Barcode scanner not working**
- ✅ Solution: Grant camera permissions in browser settings
- ✅ Ensure good lighting and clear barcode image
- ✅ Try manual entry if scanner continues to fail

**Problem: AI recommendations not showing**
- ✅ Solution: Ensure there are both inventory items and beneficiary needs
- ✅ Check that items aren't already matched
- ✅ Refresh the page to trigger new recommendations

**Problem: Dark mode not persisting**
- ✅ Solution: Check browser localStorage is enabled
- ✅ Clear browser cache and try again

**Problem: Charts not displaying**
- ✅ Solution: Ensure there's sufficient data (at least 3 data points)
- ✅ Try a different browser if issue persists
- ✅ Check console for JavaScript errors

### Getting Help

- 📖 Check the [README](../README.md) for setup instructions
- 🐛 Report bugs on [GitHub Issues](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/issues)
- 💬 Join discussions on [GitHub Discussions](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/discussions)
- 📧 Contact the maintainer for urgent issues

---

## Keyboard Shortcuts (Coming Soon)

Future release will include:
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + D` - Toggle dark mode
- `Ctrl/Cmd + N` - New donation/item
- `Esc` - Close modal

---

**Happy donating and managing! Together, we're making a difference.** 💙
