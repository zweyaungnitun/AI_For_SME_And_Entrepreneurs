import Link from "next/link";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";
  const type = size === "sm" ? "text-lg" : "text-xl";
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid ${box} place-items-center rounded-md bg-copper text-ink font-serif`}
      >
        F
      </span>
      <span className={`font-serif ${type} tracking-tight`}>Foundry</span>
    </span>
  );
}

export function SiteHeader({ active }: { active?: "home" | "console" }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="hover:opacity-90">
        <BrandMark />
      </Link>
      <nav className="flex items-center gap-6 text-sm text-parchment-dim">
        <Link
          href="/"
          className={active === "home" ? "text-parchment" : "hover:text-parchment"}
        >
          Overview
        </Link>
        <Link
          href="/console"
          className={
            active === "console"
              ? "text-parchment"
              : "rounded-full bg-copper px-4 py-2 text-ink hover:bg-copper-bright"
          }
        >
          Open console
        </Link>
      </nav>
    </header>
  );
}
