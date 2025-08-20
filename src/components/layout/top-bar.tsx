import { Cat } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 justify-between lg:gap-x-6">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-full">
            <Cat className="size-5 text-primary-foreground" />
          </div>
          <p className="text-xl font-bold">Cat Expense</p>
        </div>
      </div>
    </div>
  );
};
