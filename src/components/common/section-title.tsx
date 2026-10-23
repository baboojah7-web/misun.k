import { cn } from "@/lib/utils";

export function SectionTitle({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={cn("h2 mb-8 text-navy", className)}>
      {children}
    </h2>
  );
}
