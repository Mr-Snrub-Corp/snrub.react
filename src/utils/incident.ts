import { ESCALATION_LEVEL, INCIDENT_STATUS } from "@/constants/incident";

export function getSeverityClass(severity: number): string {
  const classes: Record<number, string> = {
    1: "bg-emerald-700 text-white",
    2: "bg-lime-600 text-white",
    3: "bg-yellow-300 text-black",
    4: "bg-amber-400 text-black",
    5: "bg-orange-500 text-white",
    6: "bg-red-600 text-white",
    7: "bg-fuchsia-600 text-white",
  };
  return classes[severity] ?? "bg-gray-500 text-white";
}

export function getSeverityBarClass(severity: number): string {
  const classes: Record<number, string> = {
    1: "bg-emerald-700",
    2: "bg-lime-600",
    3: "bg-yellow-300",
    4: "bg-amber-400",
    5: "bg-orange-500",
    6: "bg-red-600",
    7: "bg-fuchsia-600",
  };
  return classes[severity] ?? "bg-gray-500";
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case INCIDENT_STATUS.REPORTED:
    case INCIDENT_STATUS.UNDER_REVIEW:
    case INCIDENT_STATUS.MITIGATION_IN_PROGRESS:
      return "default";
    case INCIDENT_STATUS.FALSE_ALARM:
    case INCIDENT_STATUS.CONTAINED:
    case INCIDENT_STATUS.RESOLVED:
    case INCIDENT_STATUS.CLOSED:
      return "secondary";
    default:
      return "outline";
  }
}

export function getEscalationVariant(level: string): BadgeVariant {
  switch (level) {
    case ESCALATION_LEVEL.EMERGENCY_STATE_DECLARED:
      return "destructive";
    case ESCALATION_LEVEL.ESCALATED:
      return "default";
    case ESCALATION_LEVEL.MONITORING:
      return "secondary";
    default:
      return "outline";
  }
}
