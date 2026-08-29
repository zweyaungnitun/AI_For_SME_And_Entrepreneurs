import { BrandLink } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="flex items-center justify-between gap-4">
      <BrandLink />
      <nav className="flex items-center gap-2 sm:gap-3">
        <Button href="/enter" variant="ghost" size="sm" className="hidden sm:inline-flex">
          Open a workspace
        </Button>
        <Button href="/enter" size="sm">
          Get started
        </Button>
      </nav>
    </header>
  );
}
