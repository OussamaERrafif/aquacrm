import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, action, className, children }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center md:justify-between mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        {children}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
}
