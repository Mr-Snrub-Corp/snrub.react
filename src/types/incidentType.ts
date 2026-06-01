export interface IncidentType {
  uid: string;
  code: string;
  name: string;
  category_id: string;
  default_severity: number;
  description: string | null;
  created: string;
  updated: string;
}
