import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const AnimatedGradientBackground = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  // Stripe-like pastel colors
  const color1 = "100, 200, 255"; // Cyan
  const color2 = "160, 140, 255"; // Blurple
  const color3 = "255, 170, 200"; // Pink
  const color4 = "220, 240, 255"; // Light Blue
  const color5 = "255, 230, 200"; // Peach

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col overflow-hidden bg-background",
        containerClassName
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg className="hidden">
          <defs>
            <filter id="blurMe">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div
          className={cn(
            "h-full w-full",
            isSafari ? "blur-[20px]" : "[filter:url(#blurMe)_blur(40px)]"
          )}
        >
          <div
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_rgba(var(--color1),_0.8)_0,_rgba(var(--color1),_0)_50%)_no-repeat] [mix-blend-mode:normal] w-[80vw] h-[80vw] top-[calc(50%-40vw)] left-[calc(50%-40vw)] animate-first opacity-100",
            )}
            style={{ "--color1": color1 } as React.CSSProperties}
          ></div>
          <div
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_rgba(var(--color2),_0.8)_0,_rgba(var(--color2),_0)_50%)_no-repeat] [mix-blend-mode:normal] w-[80vw] h-[80vw] top-[calc(50%-40vw)] left-[calc(50%-40vw)] animate-second opacity-100",
            )}
            style={{ "--color2": color2 } as React.CSSProperties}
          ></div>
          <div
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_rgba(var(--color3),_0.8)_0,_rgba(var(--color3),_0)_50%)_no-repeat] [mix-blend-mode:normal] w-[80vw] h-[80vw] top-[calc(50%-40vw)] left-[calc(50%-40vw)] animate-third opacity-100",
            )}
            style={{ "--color3": color3 } as React.CSSProperties}
          ></div>
          <div
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_rgba(var(--color4),_0.8)_0,_rgba(var(--color4),_0)_50%)_no-repeat] [mix-blend-mode:normal] w-[80vw] h-[80vw] top-[calc(50%-40vw)] left-[calc(50%-40vw)] animate-fourth opacity-70",
            )}
            style={{ "--color4": color4 } as React.CSSProperties}
          ></div>
          <div
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_rgba(var(--color5),_0.8)_0,_rgba(var(--color5),_0)_50%)_no-repeat] [mix-blend-mode:normal] w-[100vw] h-[100vw] top-[calc(50%-50vw)] left-[calc(50%-50vw)] animate-fifth opacity-70",
            )}
            style={{ "--color5": color5 } as React.CSSProperties}
          ></div>
        </div>
      </div>
      <div className={cn("relative z-10 h-full w-full", className)}>
        {children}
      </div>
    </div>
  );
};
