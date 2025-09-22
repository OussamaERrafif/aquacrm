import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h1>
      {action && <div>{action}</div>}
    </div>
  );
}
