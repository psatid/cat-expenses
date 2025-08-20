import { TopBar } from "./top-bar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  );
};
