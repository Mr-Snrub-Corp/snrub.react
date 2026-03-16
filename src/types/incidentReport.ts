import type {
  ESCALATION_LEVEL,
  INCIDENT_STATUS,
  SUBJECT_ROLE,
} from "@/constants/incident";

export type IncidentStatus =
  (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

export type EscalationLevel =
  (typeof ESCALATION_LEVEL)[keyof typeof ESCALATION_LEVEL];

export type SubjectRole = (typeof SUBJECT_ROLE)[keyof typeof SUBJECT_ROLE];

export interface IncidentReportSubject {
  uid: string;
  user_id: string;
  role: SubjectRole;
}

export interface IncidentReport {
  uid: string;
  incident_type_id: string;
  description: string | null;
  severity: number;
  status: IncidentStatus;
  escalation_level: EscalationLevel;
  reported_by_user_id: string;
  occurred_at: string;
  subjects: IncidentReportSubject[];
  created: string;
  updated: string;
}
