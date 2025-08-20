# UML Sequence Diagrams - Cat Expense Tracker

This document contains UML sequence diagrams showing the data flow for key operations in the Cat Expense Tracker application.

## 1. Fetch Expenses Flow

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Hook as useExpenses Hook
    participant Query as React Query
    participant Service as ExpenseService
    participant Storage as Local Storage

    UI->>Hook: Component mounts
    Hook->>Query: useQuery(expenseKeys.lists())
    Query->>Service: getAllExpenses()
    Service->>Storage: localStorage.getItem("cat-expenses")
    Storage-->>Service: JSON data or empty array
    Service-->>Query: Expense[] array
    Query-->>Hook: { data, isLoading, error }
    Hook-->>UI: { expenses, isLoading, error }
    UI->>UI: Render expense list
```

## 2. Add Expense Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Form as ExpenseForm
    participant Hook as useAddExpense Hook
    participant Query as React Query
    participant Service as ExpenseService
    participant Storage as Local Storage
    participant Toast as Toast Notification

    User->>Form: Fill form & submit
    Form->>Hook: addExpense(expenseData)
    Hook->>Query: useMutation(mutationFn)
    Query->>Service: addExpense(expenseData)
    Service->>Service: Generate UUID
    Service->>Storage: localStorage.getItem("cat-expenses")
    Storage-->>Service: Current expenses array
    Service->>Service: Create new expense object
    Service->>Storage: localStorage.setItem(updated array)
    Service-->>Query: New expense object
    Query->>Query: Invalidate expense queries
    Query-->>Hook: Success response
    Hook->>Toast: Show success notification
    Hook-->>Form: Success callback
    Form->>Form: Close dialog & reset form
    Form->>Form: Trigger refetch of expense list
```

## 3. Delete Expenses Flow

```mermaid
sequenceDiagram
    participant User as User
    participant List as ExpenseList
    participant Hook as useDeleteExpenses Hook
    participant Query as React Query
    participant Service as ExpenseService
    participant Storage as Local Storage
    participant Toast as Toast Notification

    User->>List: Select expenses & click delete
    List->>Hook: deleteExpenses(expenseIds)
    Hook->>Query: useMutation(mutationFn)
    Query->>Service: deleteExpenses(expenseIds)
    Service->>Storage: localStorage.getItem("cat-expenses")
    Storage-->>Service: Current expenses array
    Service->>Service: Filter out selected expenses
    Service->>Storage: localStorage.setItem(filtered array)
    Service-->>Query: Success response
    Query->>Query: Invalidate expense queries
    Query-->>Hook: Success response
    Hook->>Toast: Show success notification
    Hook-->>List: Success callback
    List->>List: Update UI & clear selections
    List->>List: Trigger refetch of expense list
```

## 4. Fetch Cat Facts Flow

```mermaid
sequenceDiagram
    participant Form as ExpenseForm
    participant Hook as useRandomCatFact Hook
    participant Query as React Query
    participant Service as CatFactService
    participant API as Cat Facts API

    Form->>Form: Dialog opens
    Form->>Hook: Component mounts
    Hook->>Query: useQuery(catFactKeys.random())
    Query->>Service: getRandomCatFact()
    Service->>API: GET https://catfact.ninja/fact
    API-->>Service: { fact: "Random cat fact..." }
    Service-->>Query: Cat fact string
    Query-->>Hook: { data, isLoading, error }
    Hook-->>Form: { catFact, isLoading, error }
    Form->>Form: Display cat fact in dialog
```

## 5. Top Categories Calculation Flow

```mermaid
sequenceDiagram
    participant List as ExpenseList
    participant Hook as useTopCategories Hook
    participant Query as React Query
    participant Service as ExpenseService
    participant Storage as Local Storage

    List->>Hook: Component mounts
    Hook->>Query: useQuery(expenseKeys.topCategories())
    Query->>Service: getTopCategories()
    Service->>Storage: localStorage.getItem("cat-expenses")
    Storage-->>Service: All expenses array
    Service->>Service: Calculate category totals
    Service->>Service: Find category with max amount
    Service-->>Query: Top category name
    Query-->>Hook: { data, isLoading, error }
    Hook-->>List: { topCategory, isLoading, error }
    List->>List: Highlight top category in UI
```

## Key Components

### React Query Hooks

- `useExpenses()` - Fetches all expenses
- `useAddExpense()` - Adds new expense
- `useDeleteExpenses()` - Deletes selected expenses
- `useRandomCatFact()` - Fetches random cat fact
- `useTopCategories()` - Calculates top spending category

### Services

- `ExpenseService` - Handles local storage operations for expenses
- `CatFactService` - Handles external API calls for cat facts

### Data Flow Pattern

1. **UI Components** trigger actions
2. **React Query Hooks** manage state and caching
3. **Services** handle business logic and data operations
4. **Local Storage/APIs** provide data persistence
5. **Toast Notifications** provide user feedback
6. **Query Invalidation** ensures data consistency
