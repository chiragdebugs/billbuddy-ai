interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <section className="hidden lg:flex flex-col justify-center bg-slate-950 text-white p-16">
        <div className="max-w-md">
          <span className="text-lg font-semibold text-emerald-400">
            BillBuddy AI 🚀
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Split Bills.
            <br />
            Not Friendships.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
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
          <h2 className="text-3xl font-bold">{title}</h2>

          <p className="mt-2 text-slate-500">{subtitle}</p>

          {children}
        </div>
      </section>
    </main>
  );
}