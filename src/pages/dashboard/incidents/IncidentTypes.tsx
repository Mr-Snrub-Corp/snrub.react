import { useEffect, useMemo, useState } from "react";
import { useIncidentCategoriesStore } from "@/stores/incidentCategories";
import { useIncidentTypesStore } from "@/stores/incidentTypes";
import type { IncidentCategory } from "@/types/incidentCategory";
import type { IncidentType } from "@/types/incidentType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import SeverityBadge from "@/components/SeverityBadge";

interface CategoryGroup {
  category: IncidentCategory;
  types: IncidentType[];
}

function IncidentTypes() {
  const fetchIncidentCategories = useIncidentCategoriesStore(
    (s) => s.fetchIncidentCategories,
  );
  const incidentCategories = useIncidentCategoriesStore(
    (s) => s.incidentCategories,
  );
  const fetchIncidentTypes = useIncidentTypesStore((s) => s.fetchIncidentTypes);
  const incidentTypes = useIncidentTypesStore((s) => s.incidentTypes);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchIncidentCategories(), fetchIncidentTypes()]).finally(() =>
      setIsLoading(false),
    );
  }, [fetchIncidentCategories, fetchIncidentTypes]);

  const groupedByCategory = useMemo<CategoryGroup[]>(() => {
    const categories = Object.values(incidentCategories);
    const types = Object.values(incidentTypes);
    return categories.map((category) => ({
      category,
      types: types.filter((t) => t.category_id === category.uid),
    }));
  }, [incidentCategories, incidentTypes]);

  return (
    <div className="px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <h1 className="mb-8 text-3xl font-medium">Incident Types</h1>

      {isLoading ? (
        <IncidentTypesSkeleton />
      ) : (
        <div className="flex flex-col gap-10">
          {groupedByCategory.map(({ category, types }) => (
            <div
              key={category.uid}
              data-testid="incidents.types.category-group"
            >
              <h2 className="mb-1 text-xl font-semibold">{category.name}</h2>
              {category.description && (
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {category.description}
                </p>
              )}
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <Table data-testid="incidents.types.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="text-right">
                        Default Severity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {types.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-sm text-zinc-500"
                        >
                          No incident types in this category.
                        </TableCell>
                      </TableRow>
                    ) : (
                      types.map((type) => (
                        <TableRow key={type.uid}>
                          <TableCell className="font-medium whitespace-normal">
                            {type.name}
                          </TableCell>
                          <TableCell className="hidden whitespace-normal text-zinc-600 sm:table-cell dark:text-zinc-400">
                            {type.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <SeverityBadge severity={type.default_severity} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IncidentTypesSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i}>
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="mb-4 h-4 w-96" />
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-right">Default Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }, (_, j) => (
                  <TableRow key={j}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Skeleton className="h-7 w-7 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncidentTypes;
