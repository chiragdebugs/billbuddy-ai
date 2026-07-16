# BillBuddy AI 💸

BillBuddy AI is an enterprise-grade, modern expense-sharing and financial tracking application. Built with a premium SaaS aesthetic and cutting-edge web technologies, it allows users to effortlessly track expenses, split bills with friends, and manage group finances.

![BillBuddy AI Preview](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000)

## ✨ Key Features

- **Advanced Expense Splitting**: Supports Equal splits, Exact Amounts, Percentages, and Shares.
- **Genuine AI Receipt Scanner (OCR)**: Integrates client-side Machine Learning (Tesseract.js) to read physical receipts, extract totals, and auto-fill expense forms instantly—all without sending sensitive image data to a server.
- **Partial Payments**: Users can incrementally pay off their balances instead of paying the entire sum at once, with real-time UI indicators for partial statuses.
- **Activity Feed & Audit Log**: A comprehensive, chronologically sorted timeline that aggregates your recent bills and payments for full financial transparency.
- **Data Export**: Instantly export your entire bill history and dashboard statistics to a structured CSV file for external bookkeeping.
- **Premium Theming & Dark Mode**: Features a robust theming engine with a sleek Dark Mode and fluid UI micro-animations powered by Framer Motion.
- **Real-time Dashboard Analytics**: Visual insights into spending habits with beautiful charts (Recharts).
- **Secure Authentication**: Protected routes and user sessions managed seamlessly via Supabase Auth.

## 🛠 Tech Stack

- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, CSS Variables, Shadcn UI
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Machine Learning / OCR**: Tesseract.js (Client-side)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security)
- **Routing**: React Router DOM v7
- **Utilities**: date-fns, lucide-react

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (for database and auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/billbuddy-ai.git
   cd billbuddy-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL scripts provided in your Supabase SQL editor to set up the necessary tables (`bills`, `participants`, `payments`, `groups`, `reminders`). *Note: Ensure you include the `amount_paid` column in the `participants` table to support partial payments.*

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📂 Project Architecture

```
src/
├── components/       # Reusable UI components (Shadcn, Layouts)
├── context/          # React Context (Auth, Theme)
├── features/         # Feature-based modular architecture
│   ├── auth/         # Authentication logic and pages
│   ├── bills/        # Bill creation, splitting, and details
│   ├── dashboard/    # Analytics, Activity Feed, Quick Actions
│   ├── groups/       # Group management
│   ├── notifications/# Alerts and reminders
│   └── receipts/     # AI Receipt Scanner (OCR)
├── lib/              # Utilities (Supabase client, Export tools)
└── types/            # Global TypeScript definitions
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
