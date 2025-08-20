# Cat Expense Tracker 🐱

A beautiful and functional web application for tracking cat-related expenses with a modern UI and excellent user experience.

## Features

### 🎯 Main Functionality

- **Add Expenses**: Add new cat expenses with item name, category, and amount
- **Delete Expenses**: Select and delete multiple expenses using checkboxes
- **Top Categories**: Automatically highlights the highest spending categories
- **Random Cat Facts**: Get a random cat fact every time you open the expense form
- **Local Storage**: All data is persisted in browser local storage

### 🎨 UI/UX Features

- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Theme-based Styling**: All gradients and colors use CSS custom properties for easy theming
- **Responsive Layout**: Works perfectly on desktop and mobile devices
  - **Desktop**: Clean table view with all details
  - **Mobile**: Card-based layout optimized for touch interaction
- **Category Badges**: Color-coded category indicators (Food, Furniture, Accessory)
- **Real-time Updates**: Instant UI updates when adding or deleting expenses
- **Loading States**: Smooth loading indicators for better user experience

### 🏗️ Architecture

The application follows a clean, layered architecture:

- **Service Layer**: Handles data persistence with local storage
- **React Query Layer**: Manages state and data fetching with hooks
- **UI Layer**: Beautiful, responsive components built with shadcn/ui

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **UI Components**: shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 10.9.0

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cat-expense
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint

## Usage

### Adding Expenses

1. Click the "Add Expense" button
2. Fill in the required fields:
   - **Item Name**: Name of the cat item (required)
   - **Category**: Choose from Food, Furniture, or Accessory (required)
   - **Amount**: Cost in USD (required, minimum $0.01)
3. Enjoy the random cat fact while filling out the form! 🐱
4. Click "Add Expense" to save

### Managing Expenses

- **View**: All expenses are displayed in a clean table format
- **Select**: Use checkboxes to select multiple expenses
- **Delete**: Click "Delete Selected" to remove selected expenses
- **Top Categories**: Highest spending categories are automatically highlighted with a purple gradient

### Data Persistence

All expense data is automatically saved to your browser's local storage, so your data will persist between sessions.

## Project Structure

```
src/
├── components/
│   ├── expense-page.tsx      # Main page component
│   ├── expense-table.tsx     # Expense table wrapper
│   ├── expense-form.tsx      # Add expense dialog
│   ├── expense-list/         # Expense list components
│   │   ├── expense-list.tsx      # Main list component
│   │   ├── expense-table-view.tsx # Desktop table view
│   │   ├── expense-card-view.tsx  # Mobile card view
│   │   └── index.ts              # Exports
│   ├── form-fields/         # Reusable form field components
│   └── shadcn/              # UI components
├── constants/
│   └── expense-constants.ts # Application constants
├── hooks/
│   └── use-expenses.ts      # React Query hooks
├── services/
│   ├── expense-service.ts   # Local storage operations
│   └── cat-fact-service.ts  # Cat facts API
├── types/
│   └── expense.ts          # TypeScript type definitions
└── App.tsx                 # Main app component
```

## API Integration

The application integrates with the [Cat Facts API](https://catfact.ninja/) to display random cat facts in the expense form dialog.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
