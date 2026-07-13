import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PasswordField from "./PasswordField";
import SocialLogin from "./SocialLogin";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value, {
      message: "Please accept the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Sign Up Data:", data);

    // Next task:
    // Connect to Supabase Auth
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
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
        placeholder="Enter password"
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm password"
      />

      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          className="mt-1"
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

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">
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