# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Guidelines

### Commit Messages
- Never include "Co-authored-by: Claude" or any similar Claude/AI attribution in commit messages
- Write clear, concise commit messages without AI attribution

## Commands

### Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with TypeScript support

### Project Setup
- `npm install` - Install dependencies
- Server runs on `http://localhost:3000` (check Vite output for exact port)

## Architecture

MoneyWatch is a React-based personal finance application with the following architecture:

### Core Stack
- **React 18 + TypeScript** - Component-based UI with type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Recharts** - Data visualization for financial charts

### Application Structure
- **Layout-based routing**: All pages wrapped in `Layout.tsx` with sidebar navigation
- **Query Client Provider**: Global React Query setup in `App.tsx` for state management
- **Page-based architecture**: Each major feature (Dashboard, Transactions, Budgets, etc.) is a separate page component

### Data Layer
- **Types**: Centralized TypeScript interfaces in `src/types/index.ts`
- **Core entities**: Account, Transaction, Budget, Subscription, CreditScore, FinancialGoal
- **State management**: React Query for server state, local component state for UI state
- **Services directory**: API integration layer (currently empty/mock data)

### UI Patterns
- **Lucide React icons** throughout the application
- **Modal-based interactions** for data entry (Add Account, Add Transaction, etc.)
- **Responsive design** with mobile-first approach
- **Consistent color scheme** using Tailwind's primary color system

### Key Components
- `Layout.tsx` - Main application shell with sidebar navigation
- Modal components for data entry operations
- Page components follow a consistent structure with headers, content sections, and data tables/charts

### Data Flow
1. Pages use React Query hooks for data fetching
2. Mock/placeholder data currently used (no real backend)
3. Modal components handle user input for creating/editing entities
4. State updates trigger re-renders through React Query cache invalidation

The application follows a standard React SPA pattern with emphasis on TypeScript type safety and modern React patterns (hooks, functional components).