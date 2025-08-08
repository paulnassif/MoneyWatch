# MoneyWatch

A comprehensive personal finance tracker application built with React, TypeScript, and Tailwind CSS. MoneyWatch helps you manage your money, track expenses, monitor budgets, and stay on top of your financial goals.

## Features

### ✅ Completed Features

- **Dashboard**: Overview of net worth, spending trends, budget status, and recent transactions
- **Transaction Management**: View, search, filter, and categorize transactions with detailed analytics
- **Budget Tracking**: Create and monitor budgets by category with visual progress indicators
- **Subscription Management**: Track recurring subscriptions, monitor costs, and upcoming bills
- **Credit Score Monitoring**: View credit score trends, factors, and improvement tips
- **Manual Data Entry**: Add transactions, budgets, subscriptions, and accounts manually
- **Responsive Design**: Mobile-friendly interface with modern UI components

### 🎯 Core Functionality

1. **Financial Overview**
   - Net worth tracking with monthly changes
   - Spending trends visualization
   - Category-based expense breakdown
   - Recent transaction feed

2. **Transaction Tracking**
   - Search and filter transactions
   - Categorization and merchant details
   - Income vs expense analysis
   - Account-based organization

3. **Budget Management**
   - Category-based budget creation
   - Real-time spending vs budget comparison
   - Over-budget alerts and warnings
   - Visual progress indicators

4. **Subscription Tracking**
   - Active subscription monitoring
   - Monthly/yearly cost projections
   - Upcoming bill notifications
   - Cancellation management

5. **Credit Monitoring**
   - Credit score trend tracking
   - Factor analysis and improvement tips
   - Account status monitoring
   - Credit utilization tracking

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MoneyWatch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Transactions.tsx # Transaction management
│   ├── Budgets.tsx     # Budget tracking
│   ├── Subscriptions.tsx # Subscription management
│   └── CreditScore.tsx # Credit monitoring
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## Key Components

### Dashboard
- Financial overview with key metrics
- Spending trend visualization
- Category breakdown chart
- Recent transactions list

### Transactions
- Comprehensive transaction list
- Advanced search and filtering
- Category-based organization
- Income/expense analytics

### Budgets
- Budget creation and management
- Real-time progress tracking
- Over-budget notifications
- Visual progress indicators

### Subscriptions
- Subscription cost tracking
- Upcoming bill notifications
- Annual cost projections
- Cancellation management

### Credit Score
- Credit score trend tracking
- Factor impact analysis
- Account monitoring
- Improvement recommendations

## Data Models

The application uses TypeScript interfaces for type safety:

- `Account`: Bank accounts and credit cards
- `Transaction`: Financial transactions
- `Budget`: Budget categories and limits
- `Subscription`: Recurring subscriptions
- `CreditScore`: Credit monitoring data

## Future Enhancements

- Account linking with financial institutions
- Real-time transaction syncing
- Bill negotiation services
- Investment tracking
- Financial goal planning
- Mobile app development
- Bank-level security implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. MoneyWatch is an independent personal finance application.