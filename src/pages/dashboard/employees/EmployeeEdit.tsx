import { USER_ROLES, USER_STATUS } from "@/constants/user";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { usersApi } from "@/services/api";
import type { User, UserRole, UserStatus } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLabel } from "@/utils/format";

const roleOptions = Object.values(USER_ROLES).map((role) => ({
  label: formatLabel(role),
  value: role,
}));

const userStatusOptions = Object.values(USER_STATUS).map((status) => ({
  label: formatLabel(status),
  value: status,
}));

const userSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  name: z.string().min(1, { error: "Name is required" }),
  role: z.enum(Object.values(USER_ROLES) as [UserRole, ...UserRole[]]),
  status: z.enum(Object.values(USER_STATUS) as [UserStatus, ...UserStatus[]]),
});

function EmployeeEdit() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Snrub Corp | Edit Team Member";
  }, []);

  useEffect(() => {
    if (!uid) return;
    usersApi
      .getOne(uid)
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, [uid]);

  if (isLoading) {
    return <EmployeeEditSkeleton />;
  }

  if (!user || !uid) {
    return (
      <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
        <p className="text-grey-500">User not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          data-testid="employees.edit-form.cancel-btn"
          onClick={() => navigate("/dashboard/employees")}
        >
          Back
        </Button>
      </div>
    );
  }

  return <EmployeeEditForm uid={uid} user={user} />;
}

function EmployeeEditForm({ uid, user }: { uid: string; user: User }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    defaultValues: {
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    },
    validators: { onSubmit: userSchema },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        await usersApi.updateOne(uid, value);
        toast.success("Employee updated");
        navigate(`/dashboard/employees/${uid}`);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "User update failed",
        );
      }
    },
  });

  const isSubmitting = useStore(form.baseStore, (s) => s.isSubmitting);

  return (
    <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <h1 className="text-grey-900 dark:text-grey-50 text-3xl font-bold">
          Edit Employee Details
        </h1>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="dark:bg-grey-900 mb-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm xl:w-3/4">
          <div className="text-grey-900 dark:text-grey-50 text-xl font-medium">
            Profile
          </div>

          <FieldGroup>
            <form.Field
              name="email"
              validators={{
                onBlur: z.email({ error: "Please enter a valid email address" }),
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="Email address"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      data-testid="employees.edit-form.email-input"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors as Array<{ message?: string }>
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field
              name="name"
              validators={{
                onBlur: z.string().min(1, { error: "Name is required" }),
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Employee name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      data-testid="employees.edit-form.name-input"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors as Array<{ message?: string }>
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as UserRole)
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      data-testid="employees.edit-form.role-select"
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="status">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as UserStatus)
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      data-testid="employees.edit-form.status-select"
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {userStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          {serverError && (
            <p role="alert" className="text-destructive mb-4 text-sm">
              {serverError}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
              data-testid="employees.edit-form.update-btn"
            >
              Update Profile
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/dashboard/employees/${uid}`)}
              data-testid="employees.edit-form.cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function EmployeeEditSkeleton() {
  return (
    <div className="bg-grey-50 dark:bg-grey-950 px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="dark:bg-grey-900 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm xl:w-3/4">
        <Skeleton className="h-6 w-20" />
        <div className="flex flex-col gap-7">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeEdit;
