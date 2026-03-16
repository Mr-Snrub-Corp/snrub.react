// Incident status options
export const INCIDENT_STATUS = {
  REPORTED: "reported",
  UNDER_REVIEW: "under_review",
  CONFIRMED: "confirmed",
  FALSE_ALARM: "false_alarm",
  CONTAINED: "contained",
  MITIGATION_IN_PROGRESS: "mitigation_in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

// Incident escalation levels
export const ESCALATION_LEVEL = {
  NONE: "none",
  MONITORING: "monitoring",
  ESCALATED: "escalated",
  EMERGENCY_STATE_DECLARED: "emergency_state_declared",
} as const;

// Incident report subject roles
export const SUBJECT_ROLE = {
  RESPONSIBLE: "responsible",
  INVOLVED: "involved",
  WITNESS: "witness",
} as const;
