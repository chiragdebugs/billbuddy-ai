import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

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
      <section className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-slate-50 border-r border-border p-16">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          }
        />
        <div className="relative z-10 max-w-md">
          <span className="text-lg font-bold text-primary">
            BillBuddy AI
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Split Bills.
            <br />
            Not Friendships.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Track expenses, split bills fairly, and settle up with friends in
            seconds.
          </p>

          <div className="mt-10 space-y-4 text-sm font-medium text-muted-foreground">
            <p className="flex items-center gap-2"><span className="text-primary">✓</span> AI-powered expense insights</p>
            <p className="flex items-center gap-2"><span className="text-primary">✓</span> Secure authentication</p>
            <p className="flex items-center gap-2"><span className="text-primary">✓</span> Lightning fast experience</p>
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <section className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md bg-card p-10 shadow-soft sm:rounded-2xl border border-black/5">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          {children}
        </div>
      </section>
    </main>
  );
}