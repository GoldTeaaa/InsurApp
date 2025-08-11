import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 ring-offset-white dark:ring-offset-slate-950 select-none";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-100",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-900 dark:hover:bg-slate-800 dark:text-slate-100",
      link: "bg-transparent p-0 h-auto underline-offset-4 hover:underline text-blue-700 dark:text-blue-400",
      destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-700/90",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3 gap-2",
      md: "h-9 px-4 gap-2",
      lg: "h-11 px-5 text-[15px] gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = "Button";