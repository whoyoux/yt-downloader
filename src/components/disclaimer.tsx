import Link from "next/link";
import { cn } from "@/lib/utils";
import { en } from "@/locales/en";

type DisclaimerProps = {
  className?: string;
};

export function Disclaimer({ className }: DisclaimerProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {en.disclaimer.beforeLink}
      <Link href="/terms" className="underline underline-offset-2">
        {en.disclaimer.linkText}
      </Link>
      {en.disclaimer.afterLink}
    </p>
  );
}
