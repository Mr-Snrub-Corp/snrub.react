import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from '@tanstack/react-form'
import { useAuthStore } from '@/stores/auth'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z.string().min(1, { error: 'Password is required' }),
})

function Login() {
  useEffect(() => {
    document.title = 'Snrub Corp | Login'
  }, [])

  const [serverError, setServerError] = useState('')
  const login = useAuthStore((s) => s.login)
  let navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setServerError('')
      try {
        await login(value.email, value.password)
        navigate('/dashboard')
      } catch (error) {
        setServerError(error instanceof Error ? error.message : 'Login failed')
      }
    },
  })

  function handleGoogleLogin() {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URL
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="flex w-full flex-col justify-center p-12 md:w-1/2 md:p-20">
        <div className="mb-8">
          <Link to="/" className="mb-4 inline-block">
            {/* TODO: replace with DashboardLogo component */}
            <div className="flex size-14 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
              S
            </div>
          </Link>
          <h1 className="mb-2 text-3xl font-medium text-foreground">Welcome Back</h1>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0
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
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors as Array<{ message?: string }>}
                      />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0
                return (
                  <Field data-invalid={isInvalid}>
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
                      autoComplete="current-password"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors as Array<{ message?: string }>}
                      />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <div className="mb-8 mt-2 flex justify-end">
            <Button type="button" variant="ghost" size="sm" className="text-primary">
              Forgot password?
            </Button>
          </div>

          {serverError && (
            <p role="alert" className="mb-4 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
            Sign in
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 w-full"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </form>
      </div>

      <div
        className="hidden w-1/2 bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: `url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/signin/signin.jpg')`,
        }}
      />
    </div>
  )
}

export default Login
