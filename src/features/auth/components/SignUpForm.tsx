import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth.service";

import PasswordField from "./PasswordField";
import SocialLogin from "./SocialLogin";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    terms: z.literal(true, {
      message: "You must accept the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setMessage("");
    setErrorMessage("");

    const { error } = await authService.signUp(
      data.fullName,
      data.email,
      data.password
    );

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage(
      "🎉 Account created successfully! Please check your email to verify your account."
    );

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>

        <Input
          id="fullName"
          placeholder="John Doe"
          {...register("fullName")}
        />

        {errors.fullName && (
          <p className="text-sm text-red-500">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        registration={register("password")}
        error={errors.password}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword}
      />

      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          className="mt-1 h-4 w-4"
          {...register("terms")}
        />

        <Label
          htmlFor="terms"
          className="font-normal leading-6"
        >
          I agree to the Terms & Conditions
        </Label>
      </div>

      {errors.terms && (
        <p className="text-sm text-red-500">
          {errors.terms.message}
        </p>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <ShimmerButton
        type="submit"
        className="w-full mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </ShimmerButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-500">
            Or continue with
          </span>
        </div>
      </div>

      <SocialLogin />

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}