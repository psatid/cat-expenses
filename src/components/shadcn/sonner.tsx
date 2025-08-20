import { cva } from "class-variance-authority";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const TOAST_DURATION = 3000;

const iconContainerVariants = cva(
  "flex items-center justify-center rounded-full p-1",
  {
    variants: {
      variant: {
        error: "bg-red-500",
        success: "bg-green-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
      },
    },
  }
);

const iconClass = "size-3.5 text-white !m-0";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md group-[.toaster]:border group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:gap-3 ",
          error:
            "!bg-white !text-gray-900 !border-l-5 !border-l-red-500 !shadow-red-500/20 !backdrop-blur-md",
          success:
            "!bg-white !text-gray-900 !border-l-5 !border-l-green-500 !shadow-green-500/20 !backdrop-blur-md",
          info: "!bg-white !text-gray-900 !border-l-5 !border-l-blue-500 !shadow-blue-500/20 !backdrop-blur-md",
          warning:
            "!bg-white !text-gray-900 !border-l-5 !border-l-yellow-500 !shadow-yellow-500/20 !backdrop-blur-md",
          description: "group-[.toast]:ml-2 text-md !text-gray-400",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:hover:bg-primary/90 group-[.toast]:hover:scale-105",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:hover:bg-gray-200 group-[.toast]:hover:scale-105",
          title: "group-[.toast]:ml-2 text-md",
        },
        duration: TOAST_DURATION,
        style: {
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(229, 231, 235, 0.8)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)",
        },
      }}
      icons={{
        error: (
          <div className={iconContainerVariants({ variant: "error" })}>
            <X className={iconClass} />
          </div>
        ),
        success: (
          <div className={iconContainerVariants({ variant: "success" })}>
            <Check className={iconClass} />
          </div>
        ),
        info: (
          <div className={iconContainerVariants({ variant: "info" })}>
            <Info className={iconClass} />
          </div>
        ),
        warning: (
          <div className={iconContainerVariants({ variant: "warning" })}>
            <AlertTriangle className={iconClass} />
          </div>
        ),
      }}
      {...props}
    />
  );
};

export { Toaster };
