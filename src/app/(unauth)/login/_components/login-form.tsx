"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/features/auth/actions";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/features/auth/constants";
import { loginSchema, LoginSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import CoffeeCupIcon from "@/assets/icons/coffee-cup.svg";

export default function LoginForm() {
  // 🔹 Client Validation - React Hook Form
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  // 🔹 Server Action State
  const [loginState, loginAction, loginIsPending] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  async function onSubmit(data: LoginSchema) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      loginAction(formData);
    });
  }

  useEffect(() => {
    if (loginState?.status === "error") {
      // Toast
      toast.error("Login Failed", {
        description: loginState.errors._form?.[0],
      });
      // Bersihkan loginState ('error' -> 'idle')
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState, loginAction]);

  return (
    <div className="w-full max-w-lg">
      <div className="space-y-12">
        <div className="space-y-12">
          <div className="flex items-center gap-1">
            <CoffeeCupIcon className="size-12 text-amber-500" />
            <h1 className="text-2xl font-medium text-amber-500">MyCafe POS</h1>
          </div>
          <div className="text-4xl font-bold">Login Form</div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Insert your email here..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="Insert your password here..."
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Field orientation="horizontal">
            <Button type="submit">
              {loginIsPending ? <Loader2Icon /> : "Login"}
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
