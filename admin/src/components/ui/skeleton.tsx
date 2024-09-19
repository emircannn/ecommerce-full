import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-lightBg dark:bg-darkPrimaryLight", className)}
      {...props}
    />
  )
}

export { Skeleton }
