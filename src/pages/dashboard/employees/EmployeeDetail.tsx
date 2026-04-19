import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { usersApi } from "@/services/api";
import { useAuthStore, selectIsAdmin } from "@/stores/auth";
import type { User } from "@/types/user";
import { formatLabel } from "@/utils/format";
import {
  getAvatarSrc,
  getAvatarFallback,
  getStatusVariant,
} from "@/utils/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil } from "lucide-react";

function EmployeeDetail() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const isAdmin = useAuthStore(selectIsAdmin);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    usersApi
      .getOne(uid)
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, [uid]);

  function handleGoBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard/employees");
    }
  }

  if (isLoading) {
    return <EmployeeDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
        <p className="text-grey-500">User not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          data-testid="employees.detail.back-btn"
          onClick={handleGoBack}
        >
          <ArrowLeft />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <h1 className="text-grey-900 dark:text-grey-50 text-3xl font-bold">
          Team Member
        </h1>
        {isAdmin && (
          <Button
            variant="primary"
            data-testid="employees.detail.edit-btn"
            onClick={() => navigate(`/dashboard/employees/${uid}/edit`)}
          >
            <Pencil />
            Edit
          </Button>
        )}
      </div>

      <div className="dark:bg-grey-900 mb-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm xl:w-3/4">
        <div className="text-grey-900 dark:text-grey-50 text-xl font-medium">
          Profile
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="shrink-0">
            <Avatar className="border-grey-300 h-32 w-32 rounded-lg border">
              <AvatarImage src={getAvatarSrc(user)} alt={user.name} />
              <AvatarFallback className="rounded-lg text-3xl">
                {getAvatarFallback(user)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="text-grey-500 dark:text-grey-400 mb-1 text-sm">
                Name
              </div>
              <div
                className="text-grey-900 dark:text-grey-50"
                data-testid="employees.detail.name"
              >
                {user.name}
              </div>
            </div>
            <div>
              <div className="text-grey-500 dark:text-grey-400 mb-1 text-sm">
                Email
              </div>
              <div
                className="text-grey-900 dark:text-grey-50"
                data-testid="employees.detail.email"
              >
                {user.email}
              </div>
            </div>
            <div>
              <div className="text-grey-500 dark:text-grey-400 mb-1 text-sm">
                Role
              </div>
              <Badge variant="outline" data-testid="employees.detail.role">
                {formatLabel(user.role)}
              </Badge>
            </div>
            <div>
              <div className="text-grey-500 dark:text-grey-400 mb-1 text-sm">
                Status
              </div>
              <Badge
                variant={getStatusVariant(user.status)}
                data-testid="employees.detail.status"
              >
                {formatLabel(user.status)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Button variant="outline" data-testid="employees.detail.back-btn" onClick={handleGoBack}>
        <ArrowLeft />
        Back
      </Button>
    </div>
  );
}

function EmployeeDetailSkeleton() {
  return (
    <div className="bg-grey-50 dark:bg-grey-950 px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="dark:bg-grey-900 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm xl:w-3/4">
        <Skeleton className="h-6 w-20" />
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3.5 w-12" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
