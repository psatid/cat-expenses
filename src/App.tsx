import { Layout } from "@/components/layout";
import { Toaster } from "@/components/shadcn";
import { ExpensePage } from "@/pages/expense-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <ExpensePage />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
