import { Layout } from "@/components/layout";
import { Toaster } from "@/components/shadcn";
import { ExpensePage } from "@/pages/expense-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
