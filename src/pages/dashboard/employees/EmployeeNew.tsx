import { USER_ROLES, USER_STATUS } from "@/constants/user";
import { useForm, useStore } from "@tanstack/react-form";
import { useState } from "react";
import { useUsersStore } from "@/stores/users";
import type { UserRole, UserStatus } from "@/types/user";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatLabel } from "@/utils/format";
import { useNavigate } from "react-router";

function EmployeeNew() {
  const [serverError, setServerError] = useState("");
  const createUser = useUsersStore((s) => s.createUser);
  const navigate = useNavigate();

  // Role options
  const roleOptions = Object.values(USER_ROLES).map((role) => ({
    label: formatLabel(role),
    value: role,
  }));
  // User status options
  const userStatusOptions = Object.values(USER_STATUS).map((status) => ({
    label: formatLabel(status),
    value: status,
  }));

  const userSchema = z.object({
    email: z.email({ error: "Please enter a valid email address" }),
    name: z.string().min(1, { error: "Name is required" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .regex(/[a-z]/, {
        error: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { error: "Password must contain at least one digit" })
      .regex(/[!@#$%^&*()\-_=+[\]{}|;:,.<>?/`~]/, {
        error: "Password must contain at least one special character",
      }),
    role: z.enum(Object.values(USER_ROLES) as [UserRole, ...UserRole[]]),
    status: z.enum(Object.values(USER_STATUS) as [UserStatus, ...UserStatus[]]),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: USER_ROLES.VIEWER as UserRole,
      status: USER_STATUS.INACTIVE as UserStatus,
    },
    validators: { onSubmit: userSchema },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        const user = await createUser(value);
        navigate(`/dashboard/employees/${user.uid}`);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "User create failed",
        );
      }
    },
  });

  const canCreate = useStore(
    form.baseStore,
    (s) => !!s.values.email && !!s.values.name && !!s.values.password && !s.isSubmitting,
  );

  return (
    <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <h1 className="text-grey-900 dark:text-grey-50 text-3xl font-bold">
          Add New Employee
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
            User information
          </div>

          <FieldGroup>
            <form.Field
              name="email"
              validators={{
                onBlur: z.string().email({ error: "Please enter a valid email address" }),
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
                      data-testid="employees.new-form.email-input"
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
                      data-testid="employees.new-form.name-input"
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
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select defaultValue={USER_ROLES.VIEWER}>
                      <SelectTrigger id="checkout-exp-month-ts6" data-testid="employees.new-form.role-select">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleOptions.map((option) => {
                            return (
                              <SelectItem value={option.value}>
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="status">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select defaultValue={USER_STATUS.ACTIVE}>
                      <SelectTrigger id="checkout-exp-month-ts6" data-testid="employees.new-form.status-select">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {userStatusOptions.map((option) => {
                            return (
                              <SelectItem value={option.value}>
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field
              name="password"
              validators={{
                onBlur: z.string().min(8, { error: "Password must be at least 8 characters" }),
              }}
            >
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field
                    data-invalid={isInvalid}
                    data-testid="employees.new-form.password-input"
                  >
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="Password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
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
              disabled={!canCreate}
              data-testid="employees.new-form.create-btn"
            >
              Create User
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/dashboard/employees")}
              data-testid="employees.new-form.cancel-btn"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EmployeeNew;
