import { getSeverityClass } from "@/utils/incident";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: number;
  className?: string;
}

function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
        getSeverityClass(severity),
        className,
      )}
    >
      {severity}
    </span>
  );
}

export default SeverityBadge;
