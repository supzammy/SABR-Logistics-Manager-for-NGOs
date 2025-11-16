# 🌟 SABR Logistics Manager for NGOs
<img width="1435" height="751" alt="Screenshot 2025-11-17 at 1 29 27 AM" src="https://github.com/user-attachments/assets/efb0aba8-73ed-487a-a571-0cf07b352e41" />

> **Smart Aid & Benefit Resource Management** - A comprehensive logistics dashboard designed to streamline food donation management for NGOs, connecting donors with beneficiaries efficiently.

> https://sabr-ngo-logestics-manager.vercel.app/

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?logo=vercel)](https://sabr-ngo-logestics-manager.vercel.app/)

🌐 **[View Live Demo →](https://sabr-ngo-logestics-manager.vercel.app/)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

SABR Logistics Manager is a modern, full-featured dashboard application designed to help NGOs and food banks manage their donation logistics efficiently. The platform bridges the gap between donors and beneficiaries by providing intelligent matching recommendations, real-time inventory tracking, and comprehensive analytics.

### **Why SABR?**

- 🤝 **Connect Donors & Beneficiaries** - Streamlined donor registration and beneficiary management
- 🧠 **Smart Matching** - AI-powered recommendations to match donations with needs
- 📊 **Real-Time Analytics** - Track inventory, donations, and impact metrics
- 🎨 **Beautiful UI** - Modern, responsive interface with dark mode support
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🔒 **Secure** - Role-based access for managers and donors

---

## ✨ Features

### **For NGO Managers**

- 📦 **Inventory Management** - Track all donated items with expiry dates, quantities, and donor information
- 🏠 **Beneficiary Portal** - Manage shelter needs and capacity
- 🤝 **Match Management** - Review and approve donation matches with AI suggestions
- 👥 **Volunteer Coordination** - Track volunteer assignments and availability
- 📈 **Reports & Analytics** - Generate insights with interactive charts and trend analysis
- 🔔 **Smart Alerts** - Low stock warnings and expiry notifications

### **For Donors**

- 🎁 **Easy Donation Submission** - Submit donation details with barcode scanning
- 📸 **Receipt Generation** - Automatic tax-deductible receipt creation
- 💝 **Impact Tracking** - See the real-time impact of your contributions
- 🏆 **Gamification** - Earn badges and track donation milestones
- 📱 **Donor Portal** - Dedicated interface for donation history and certificates
- 💬 **Direct Communication** - Message feed for updates from NGOs

### **Smart Features**

- 🤖 **AI Recommendations** - Intelligent matching based on priority, expiry dates, and inventory levels
- 📊 **Predictive Analytics** - Forecast donation trends and needs
- 🗺️ **Impact Mapping** - Visualize beneficiary locations and reach
- 📅 **Pledge System** - Schedule future donations with reminder notifications
- 🌓 **Dark Mode** - Eye-friendly theme toggle
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile

---

## 📸 Screenshots

### Dashboard Overview
<img width="1435" height="751" alt="Screenshot 2025-11-17 at 1 29 27 AM" src="https://github.com/user-attachments/assets/9985be23-3cf1-4c7a-89b0-140d96355717" />

*Real-time metrics, recent activities, and AI-powered match recommendations*

### Inventory Management
<img width="1430" height="752" alt="Screenshot 2025-11-17 at 1 29 40 AM" src="https://github.com/user-attachments/assets/8ba408ea-6d5d-4204-9884-c27a475a8e54" />

*Comprehensive item tracking with expiry alerts and donor attribution*

### Donor Portal
<img width="1429" height="748" alt="Screenshot 2025-11-17 at 1 36 30 AM" src="https://github.com/user-attachments/assets/fcd64b24-27b7-4f33-9371-b45da71148e7" />
*Dedicated interface for donors to track their impact and submit donations*

<img width="1431" height="666" alt="Screenshot 2025-11-17 at 1 37 24 AM" src="https://github.com/user-attachments/assets/e916583a-3c73-4f47-ae5e-fd934e8060b7" />
<img width="1429" height="666" alt="Screenshot 2025-11-17 at 1 37 15 AM" src="https://github.com/user-attachments/assets/7fb2b36f-79d6-4543-97cb-51a8f3c7e5cf" />
<img width="1434" height="694" alt="Screenshot 2025-11-17 at 1 37 04 AM" src="https://github.com/user-attachments/assets/bfe8f79d-6964-4e4d-949a-003eaf82fbea" />

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.2** - Modern UI library with latest features
- **TypeScript 5.8** - Type-safe development
- **Vite 6.2** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first styling via CDN

### **Data Visualization**
- **Recharts** - Beautiful, composable charts
- **Custom SVG Icons** - 40+ custom icons for consistent UI

### **Additional Libraries**
- **jsQR** - Barcode/QR code scanning for donations
- **React Hooks** - Modern state management

### **Development**
- **ESM** - Modern ES modules via esm.sh CDN
- **Hot Module Replacement** - Instant updates during development
- **TypeScript Strict Mode** - Maximum type safety

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs.git
   cd SABR-Logistics-Manager-for-NGOs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (Optional)
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your AI_API_KEY if using live AI features
   ```
   > **Note:** The app works perfectly with mock AI data - no API key required!

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

### **Build for Production**

```bash
npm run build
```

The optimized production build will be generated in the `dist/` folder.

### **Preview Production Build**

```bash
npm run preview
```

---

## 📁 Project Structure

```
sabr-logistics-dashboard/
├── components/              # React components
│   ├── AiRecommendations.tsx
│   ├── DashboardCard.tsx
│   ├── DonationTracker.tsx
│   ├── DonorProfileForm.tsx
│   ├── Header.tsx
│   ├── Icon.tsx
│   ├── ImpactMap.tsx
│   ├── Modal.tsx
│   ├── Sidebar.tsx
│   └── ...
├── pages/                   # Page components
│   ├── DashboardPage.tsx
│   ├── InventoryPage.tsx
│   ├── DonorsPage.tsx
│   ├── BeneficiariesPage.tsx
│   ├── DonorPortalPage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── services/                # Business logic & API services
│   └── aiService.ts         # AI matching algorithms (mocked)
├── hooks/                   # Custom React hooks
│   └── useTheme.ts
├── App.tsx                  # Root application component
├── types.ts                 # TypeScript type definitions
├── index.tsx                # Application entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 📖 Usage Guide

### **Manager Workflow**

1. **Login** - Use the header toggle to switch to "Manager" view
2. **Dashboard** - View overview metrics and AI match recommendations
3. **Inventory** - Add new donated items or edit existing stock
4. **Matches** - Review AI-suggested matches and confirm distributions
5. **Donors** - Manage donor profiles and view contribution history
6. **Beneficiaries** - Track shelter needs and update capacity
7. **Reports** - Generate insights and export data

### **Donor Workflow**

1. **Register/Login** - Switch to "Donor Portal" and create an account
2. **Submit Donation** - Fill out donation form (supports barcode scanning)
3. **Track Impact** - View your donation history and impact metrics
4. **Earn Badges** - Unlock achievements for donation milestones
5. **Download Receipts** - Get tax-deductible donation receipts
6. **View Messages** - Stay updated with NGO communications

### **AI Matching System**

The smart matching algorithm prioritizes:
1. **High-priority needs** - Urgent requests are matched first
2. **Expiring items** - Prevents waste by allocating items near expiry
3. **Abundant stock** - Distributes surplus inventory efficiently
4. **Dietary restrictions** - Respects beneficiary requirements

---

## 🌐 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push code to GitHub** (already done!)
2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import `supzammy/SABR-Logistics-Manager-for-NGOs`
3. **Configure build settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy!** 🚀

### **Deploy to Netlify**

```bash
npm run build
# Upload the dist/ folder to Netlify
```

### **Deploy to GitHub Pages**

```bash
# Add to vite.config.ts: base: '/SABR-Logistics-Manager-for-NGOs/'
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Write meaningful component names
- Add comments for complex logic
- Test on both light and dark themes
- Ensure mobile responsiveness

### **Bug Reports**

Found a bug? [Open an issue](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- Built with ❤️ for NGOs and food banks making a difference
- Inspired by the need for efficient donation logistics
- Thanks to all contributors and open-source libraries

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/issues)
- **Discussions**: [Join the conversation](https://github.com/supzammy/SABR-Logistics-Manager-for-NGOs/discussions)

---

<div align="center">

**Made with 💙 for a better world**

⭐ Star this repo if you find it helpful!

</div>
