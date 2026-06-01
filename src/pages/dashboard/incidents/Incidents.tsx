import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Eye, TriangleAlert } from "lucide-react";
import { useIncidentReportsStore } from "@/stores/incidentReports";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import { useAuthStore, selectIsAdmin } from "@/stores/auth";
import { INCIDENT_STATUS } from "@/constants/incident";
import type { IncidentReport } from "@/types/incidentReport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SeverityBadge from "@/components/SeverityBadge";
import {
  getSeverityBarClass,
  getStatusVariant,
  getEscalationVariant,
} from "@/utils/incident";
import { formatDate, formatLabel } from "@/utils/format";

interface EnrichedReport extends IncidentReport {
  typeName: string;
}

function Incidents() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore(selectIsAdmin);

  const fetchReports = useIncidentReportsStore((s) => s.fetchReports);
  const incidentReports = useIncidentReportsStore((s) => s.incidentReports);
  const fetchIncidentTypes = useIncidentTypesStore((s) => s.fetchIncidentTypes);
  const incidentTypes = useIncidentTypesStore((s) => s.incidentTypes);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchReports({ status: INCIDENT_STATUS.REPORTED, limit: 5 }),
      fetchIncidentTypes(),
    ]).finally(() => setIsLoading(false));
  }, [fetchReports, fetchIncidentTypes]);

  const enrichedReports = useMemo<EnrichedReport[]>(
    () =>
      Object.values(incidentReports).map((report) => ({
        ...report,
        typeName: incidentTypes[report.incident_type_id]?.name ?? "Unknown",
      })),
    [incidentReports, incidentTypes],
  );

  return (
    <div className="px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-medium">Incidents</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            data-testid="incidents.list.incident-types-btn"
            onClick={() => navigate("/dashboard/incidents/types")}
          >
            <BookOpen className="mr-1 h-4 w-4" />
            Incident Types
          </Button>
          {isAdmin && (
            <Button
              variant="outline"
              data-testid="incidents.list.incident-reports-btn"
              onClick={() => navigate("/dashboard/incidents/reports")}
            >
              <TriangleAlert className="mr-1 h-4 w-4" />
              Incident Reports
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-6 text-xl font-medium">Recent Incidents</div>

        {isLoading ? (
          <IncidentsSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            {enrichedReports.map((report) => (
              <IncidentRow
                key={report.uid}
                report={report}
                onView={(uid) =>
                  navigate(`/dashboard/incidents/reports/${uid}`)
                }
              />
            ))}
            {enrichedReports.length === 0 && (
              <p className="text-sm text-zinc-500">No reported incidents.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface IncidentRowProps {
  report: EnrichedReport;
  onView: (uid: string) => void;
}

function IncidentRow({ report, onView }: IncidentRowProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div
        className={`hidden w-3.5 self-stretch sm:block ${getSeverityBarClass(report.severity)}`}
      />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 p-4">
        <div className="shrink-0">
          <div className="text-lg leading-tight font-medium">
            {report.typeName}
          </div>
          <div className="text-sm leading-tight text-zinc-500">
            {formatDate(report.occurred_at)}
          </div>
        </div>
        <div className="hidden min-w-0 basis-1/2 text-sm text-zinc-600 md:line-clamp-2 dark:text-zinc-400">
          {report.description}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm font-semibold sm:inline">
            Severity
          </span>
          <SeverityBadge severity={report.severity} />
          <Badge variant={getStatusVariant(report.status)}>
            {formatLabel(report.status)}
          </Badge>
          <Badge variant={getEscalationVariant(report.escalation_level)}>
            {formatLabel(report.escalation_level)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            data-testid="incidents.list.view-btn"
            onClick={() => onView(report.uid)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function IncidentsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
        >
          <Skeleton className="hidden h-16 w-3.5 shrink-0 sm:block" />
          <div className="flex flex-1 items-center justify-between gap-4 p-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton className="hidden h-4 w-1/2 md:block" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Incidents;
