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
import { authApi } from "@/services/api";
import { toast } from "sonner";
import { Link } from "react-router";

const forgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});

function ForgotPassword() {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setServerError("");

      try {
        authApi.requestPasswordReset({ email: value.email });
        toast.success("Success", {
          testId: "auth.forgot-password.success-toast",
          description:
            "If your email is registered, you will receive a password reset link",
          position: "top-right",
        });
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : "Reset password request failed",
        );
      }
    },
  });

  return (
    <div className="bg-background flex h-screen w-full">
      <div className="bg-background w-full p-12 md:w-6/12 md:p-20">
        <div className="mb-8">
          <svg
            className="fill-grey-700 dark:fill-grey-300 mb-4 h-14"
            viewBox="0 0 30 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
            />
          </svg>
          <div className="text-foreground mb-4 text-3xl font-medium">
            Forgot Password
          </div>
          <div className="flex items-center">
            <span className="text-grey-500 dark:text-grey-400 mr-1 font-medium">
              No worries, we'll send you restore instructions
            </span>
          </div>
        </div>
        <div>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="email">
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
                        data-testid="auth.forgot-password-form.email-input"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={
                            field.state.meta.errors as Array<{
                              // (an array of objects that optionally have a message string).
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
              <p role="alert" className="text-destructive mb-4 text-sm">
                {serverError}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={form.state.isSubmitting}
                data-testid="auth.forgot-password-form.submit-btn"
              >
                Send Reset Instructions
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                asChild
                data-testid="auth.forgot-password-form.back-to-login-btn"
              >
                <Link to="/auth/login">Back to login</Link>
              </Button>
            </div>
          </form>
          {/* <label
            for="email2"
            className="text-surface-900 dark:text-surface-0 mb-2 block font-medium"
          >
            Email
          </label> */}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
