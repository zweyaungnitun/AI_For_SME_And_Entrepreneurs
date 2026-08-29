"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBrief } from "@/components/brief/brief-provider";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_ENTRY_IDS, SHOPS, isKnownShop } from "@/lib/sme/catalog";

function EnterView() {
  const router = useRouter();
  const params = useSearchParams();
  const { snapshot, loadVenture } = useBrief();

  function openAs(shopId: string) {
    loadVenture(shopId);
    router.push("/dashboard");
  }

  useEffect(() => {
    const as = params.get("as");
    if (as && isKnownShop(as)) openAs(as);
    // Deep link from landing opens one tenant and leaves this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const featured = SHOPS.filter((shop) =>
    (DEMO_ENTRY_IDS as readonly string[]).includes(shop.id),
  );
  const rest = SHOPS.filter(
    (shop) => !(DEMO_ENTRY_IDS as readonly string[]).includes(shop.id),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-6 sm:px-8 sm:py-10">
        <MarketingNav />
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            One business at a time
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Open a workspace. You only see that shop&apos;s books.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            This is not an admin console. Each demo is a separate tenant — cash,
            credit, and stock stay in that business. You cannot browse another
            owner&apos;s numbers from inside the dashboard.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Judge demos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((shop) => (
              <DemoCard
                key={shop.id}
                name={shop.context.name}
                label={shop.label}
                place={shop.context.location}
                challenge={shop.context.challenge}
                current={snapshot.shopId === shop.id}
                onOpen={() => openAs(shop.id)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Other sample workspaces
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rest.map((shop) => (
              <DemoCard
                key={shop.id}
                name={shop.context.name}
                label={shop.label}
                place={shop.context.location}
                challenge={shop.context.challenge}
                current={snapshot.shopId === shop.id}
                onOpen={() => openAs(shop.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DemoCard({
  name,
  label,
  place,
  challenge,
  current,
  onOpen,
}: {
  name: string;
  label: string;
  place: string;
  challenge: string;
  current: boolean;
  onOpen: () => void;
}) {
  return (
    <Card className={current ? "border-primary/40" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
      <h3 className="mt-2 text-lg font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-muted">{place}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{challenge}</p>
      <div className="mt-4">
        <Button size="sm" onClick={onOpen}>
          {current ? "Continue this workspace" : "Open this workspace"}
        </Button>
      </div>
    </Card>
  );
}

export default function EnterPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted">Loading workspace…</p>}>
      <EnterView />
    </Suspense>
  );
}
