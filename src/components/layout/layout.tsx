import { TopBar } from "./top-bar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      <TopBar />
      <div className="flex-1 container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};
