import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Create your account
        </h2>

        <p className="mt-2 text-slate-500">
          Start splitting bills smarter with BillBuddy AI.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Create Account
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="mx-4 text-sm text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        className="w-full rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-50"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <span className="cursor-pointer font-semibold text-emerald-600 hover:underline">
          Sign In
        </span>
      </p>
    </div>
  );
}