import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ESCALATION_LEVEL, INCIDENT_STATUS } from "@/constants/incident";
import { GRADIENTS } from "@/constants/gradients";
import { useIncidentReportsStore } from "@/stores/incidentReports";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import { useUsersStore } from "@/stores/users";
import type { IncidentReport } from "@/types/incidentReport";
import type { EscalationLevel } from "@/types/incidentReport";
import { formatLabel, timeAgo } from "@/utils/format";
import {
  CircleAlert,
  CircleCheck,
  Eye,
  Info,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

interface StatCard {
  title: string;
  icon: LucideIcon;
  gradient: string;
  count: number;
  description: string;
}

function getEscalationVariant(
  level: EscalationLevel,
): "destructive" | "default" | "secondary" | "outline" {
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

function DashboardHome() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [recentReports, setRecentReports] = useState<IncidentReport[]>([]);

  const fetchReports = useIncidentReportsStore((s) => s.fetchReports);
  const incidentReports = useIncidentReportsStore((s) => s.incidentReports);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const users = useUsersStore((s) => s.users);
  const fetchIncidentTypes = useIncidentTypesStore(
    (s) => s.fetchIncidentTypes,
  );
  const incidentTypes = useIncidentTypesStore((s) => s.incidentTypes);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7);

    Promise.all([
      fetchReports({
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      }),
      fetchUsers(),
      fetchIncidentTypes(),
    ]).then(() => setIsLoading(false));
  }, [fetchReports, fetchUsers, fetchIncidentTypes]);

  useEffect(() => {
    setRecentReports(Object.values(incidentReports));
  }, [incidentReports]);

  const majorAccidents = useMemo(
    () => recentReports.filter((r) => r.severity >= 7),
    [recentReports],
  );

  const accidents = useMemo(
    () => recentReports.filter((r) => r.severity >= 4 && r.severity <= 6),
    [recentReports],
  );

  const incidents = useMemo(
    () => recentReports.filter((r) => r.severity >= 1 && r.severity <= 3),
    [recentReports],
  );

  const reportsNotActioned = useMemo(
    () =>
      recentReports.filter((r) => r.status === INCIDENT_STATUS.REPORTED),
    [recentReports],
  );

  const statCards = useMemo<StatCard[]>(() => {
    const noAccidents = accidents.length === 0;
    const noIncidents = incidents.length === 0;

    return [
      {
        title: "Major Accidents",
        icon: TriangleAlert,
        gradient: GRADIENTS.fuchsia,
        count: majorAccidents.length,
        description: `Major accident${majorAccidents.length !== 1 ? "s" : ""} reported in the last 7 days`,
      },
      {
        title: "Accidents",
        icon: noAccidents ? CircleCheck : CircleAlert,
        gradient: noAccidents ? GRADIENTS.success : GRADIENTS.danger,
        count: accidents.length,
        description: noAccidents
          ? "No Accidents reported in the last 7 days"
          : `Accident${accidents.length !== 1 ? "s" : ""} reported in the last 7 days`,
      },
      {
        title: "Incidents",
        icon: noIncidents ? CircleCheck : CircleAlert,
        gradient: noIncidents ? GRADIENTS.success : GRADIENTS.warn,
        count: incidents.length,
        description: noIncidents
          ? "No Incidents reported in the last 7 days"
          : `Incident${incidents.length !== 1 ? "s" : ""} reported in the last 7 days`,
      },
      {
        title: "Awaiting Review",
        icon: Info,
        gradient: GRADIENTS.info,
        count: reportsNotActioned.length,
        description: "incidents reported in the last 7 days",
      },
    ];
  }, [majorAccidents, accidents, incidents, reportsNotActioned]);

  const criticalActivityLog = useMemo(() => {
    const seen = new Set<string>();
    const result: IncidentReport[] = [];

    for (const r of recentReports) {
      if (
        r.escalation_level === ESCALATION_LEVEL.EMERGENCY_STATE_DECLARED &&
        !seen.has(r.uid)
      ) {
        result.push(r);
        seen.add(r.uid);
      }
    }
    for (const r of recentReports) {
      if (
        r.escalation_level === ESCALATION_LEVEL.ESCALATED &&
        !seen.has(r.uid)
      ) {
        result.push(r);
        seen.add(r.uid);
      }
    }
    for (const r of recentReports) {
      if (r.severity >= 4 && !seen.has(r.uid)) {
        result.push(r);
        seen.add(r.uid);
      }
    }

    return result;
  }, [recentReports]);

  function getReportedByName(userId: string): string {
    return users?.find((u) => u.uid === userId)?.name ?? userId;
  }

  function getIncidentTypeName(typeId: string): string {
    return incidentTypes[typeId]?.name ?? "";
  }

  return (
    <div className="min-h-full overflow-hidden bg-grey-50 px-6 py-4 dark:bg-grey-950 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-grey-900 dark:text-grey-50">
          Dashboard
        </h1>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-8 pt-8 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Card
                key={card.title}
                className="border-0 bg-white shadow-sm dark:bg-grey-900"
              >
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold leading-tight text-grey-700 dark:text-grey-300">
                      {card.title}
                    </span>
                    <div
                      className={`${card.gradient} flex h-10 w-10 items-center justify-center rounded-lg`}
                    >
                      <card.icon className="h-5 w-5 text-white dark:text-grey-900" />
                    </div>
                  </div>
                  <div className="flex flex-1 gap-1">
                    <span className="leading-tight text-grey-600 dark:text-grey-300">
                      {card.count > 0 || card.title === "Awaiting Review" ? (
                        <>
                          <strong>{card.count}</strong> {card.description}
                        </>
                      ) : (
                        card.description
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-grey-900">
            <div className="text-xl font-medium leading-tight text-grey-900 dark:text-grey-50">
              Critical Activity Log
            </div>
            {criticalActivityLog.length === 0 ? (
              <div className="text-grey-500 dark:text-grey-400">
                No critical activity in the last 7 days
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {criticalActivityLog.map((report) => (
                  <div
                    key={report.uid}
                    className="flex items-center justify-between gap-4 rounded-xl border border-grey-200 p-4 dark:border-grey-700"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium leading-tight text-grey-900 dark:text-grey-50">
                          {getReportedByName(report.reported_by_user_id)}
                        </span>
                        <span className="text-grey-500 dark:text-grey-400">
                          &middot;
                        </span>
                        <span className="text-sm leading-tight text-grey-500 dark:text-grey-400">
                          {timeAgo(report.occurred_at)}
                        </span>
                      </div>
                      <span className="text-sm text-grey-700 dark:text-grey-200">
                        {getIncidentTypeName(report.incident_type_id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-grey-600 dark:text-grey-300">
                        Escalation Level:
                      </span>
                      <Badge
                        variant={getEscalationVariant(
                          report.escalation_level,
                        )}
                      >
                        {formatLabel(report.escalation_level)}
                      </Badge>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/incidents`)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-grey-500 hover:bg-grey-100 dark:text-grey-400 dark:hover:bg-grey-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-8 pt-8 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-grey-900"
          >
            <div className="flex justify-between gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <div className="flex flex-1 items-end">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-grey-900">
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-xl border border-grey-200 p-4 dark:border-grey-700"
            >
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardHome;
