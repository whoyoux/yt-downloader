import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { en } from "@/locales/en";

export const metadata: Metadata = {
  title: en.termsPage.metaTitle,
  description: en.termsPage.metaDescription,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: `${en.termsPage.metaTitle} | ${en.meta.brandName}`,
    description: en.termsPage.metaDescription,
  },
};

const TermsPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div>
        <Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
          <ArrowLeft /> {en.termsPage.backLink}
        </Link>
      </div>
      <h1 className="text-3xl font-semibold">{en.termsPage.heading}</h1>

      <section className="space-y-3 text-sm leading-6 text-muted-foreground">
        {en.termsPage.paragraphs.map(({ id, text }) => (
          <p key={id}>{text}</p>
        ))}
      </section>
    </main>
  );
};

export default TermsPage;
