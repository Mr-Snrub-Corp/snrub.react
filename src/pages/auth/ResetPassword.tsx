import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { authApi } from "@/services/api";
import { toast } from "sonner";

const passwordComplexity = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
  .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
  .regex(/[0-9]/, { message: "Must contain a number" })
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
    message: "Must contain a symbol",
  });

const resetPasswordSchema = z
  .object({
    password: passwordComplexity,
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

function ResetPassword() {
  const [serverError, setServerError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        await authApi.resetPassword({ token, new_password: value.password });
        toast.success("Password has been reset", {
          description: "Redirecting to login...",
          position: "top-right",
        });
        setTimeout(() => navigate("/auth/login"), 1000);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : "Password reset failed",
        );
      }
    },
  });

  return (
    <div className="bg-grey-50 dark:bg-grey-950 flex h-screen w-full px-6 py-20 md:px-12 lg:px-20">
      <div className="bg-card mx-auto flex w-full max-w-xl flex-col gap-8 rounded-2xl p-8 shadow-sm md:p-12">
        <div className="flex flex-col items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-14"
            viewBox="0 0 33 32"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
              className="fill-grey-700 dark:fill-grey-300"
            />
          </svg>
          <h1 className="text-foreground w-full text-center text-2xl font-semibold">
            Lets Reset
          </h1>
        </div>

        <form
          noValidate
          className="flex w-full flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="Enter new password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors as Array<{
                            message?: string;
                          }>
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="Confirm password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={
                          field.state.meta.errors as Array<{
                            message?: string;
                          }>
                        }
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {serverError && (
            <p role="alert" className="text-destructive text-sm">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={form.state.isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
