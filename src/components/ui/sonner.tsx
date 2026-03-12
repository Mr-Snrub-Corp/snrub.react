import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="text-success-600 dark:text-success-400 size-4" />
        ),
        info: <InfoIcon className="text-info-600 dark:text-info-400 size-4" />,
        warning: (
          <TriangleAlertIcon className="text-warn-600 dark:text-warn-400 size-4" />
        ),
        error: (
          <OctagonXIcon className="text-danger-600 dark:text-danger-400 size-4" />
        ),
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          title: "!text-inherit !font-semibold",
          description: "!text-inherit !opacity-80",
          success:
            "!bg-success-50 !text-success-900 !border-success-200 dark:!bg-success-950 dark:!text-success-100 dark:!border-success-800",
          error:
            "!bg-danger-50 !text-danger-900 !border-danger-200 dark:!bg-danger-950 dark:!text-danger-100 dark:!border-danger-800",
          warning:
            "!bg-warn-50 !text-warn-900 !border-warn-200 dark:!bg-warn-950 dark:!text-warn-100 dark:!border-warn-800",
          info: "!bg-info-50 !text-info-900 !border-info-200 dark:!bg-info-950 dark:!text-info-100 dark:!border-info-800",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
