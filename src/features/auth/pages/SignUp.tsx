import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <section className="hidden lg:flex flex-col justify-center bg-slate-950 text-white p-16">
        <div className="max-w-md">
          <span className="text-emerald-400 font-semibold text-lg">
            BillBuddy AI 🚀
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Split Bills.
            <br />
            Not Friendships.
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-8">
            Track expenses, split bills fairly, and settle up with friends in
            seconds.
          </p>

          <div className="mt-10 space-y-4 text-slate-200">
            <p>✅ AI-powered expense insights</p>
            <p>✅ Secure authentication</p>
            <p>✅ Lightning fast experience</p>
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <section className="flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900">
            Create Account
          </h2>

          <p className="mt-2 text-slate-500">
            Welcome to BillBuddy AI.
          </p>

          <div className="mt-8">
            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
}