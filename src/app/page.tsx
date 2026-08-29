import { FeatureCards } from "@/components/landing/feature-cards";
import { Hero } from "@/components/landing/hero";
import { ProductPreview } from "@/components/landing/product-preview";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-6 sm:px-8 sm:py-10">
        <MarketingNav />
        <Hero />
        <FeatureCards />
        <ProductPreview />
        <section className="rounded-[12px] bg-ink px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Open the dashboard. See today&apos;s priority in under a minute.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/70">
            Demo data is already loaded for Daw Hla&apos;s Dry Goods — cash, credit,
            and the 5-day supplier payable. Analyze again any time.
          </p>
          <div className="mt-6">
            <Button href="/dashboard" className="bg-white text-ink hover:bg-[#e5e7eb]">
              Get started
            </Button>
          </div>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-8 text-sm text-muted">
          <p>SME Copilot · Myanmar SMEs</p>
          <p>What matters · Why · What to do next</p>
        </footer>
      </div>
    </div>
  );
}
