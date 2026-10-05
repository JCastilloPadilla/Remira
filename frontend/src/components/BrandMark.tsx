export function BrandMark({ tone = "ink" }: { tone?: "ink" | "light" }) {
  return (
    <span className={tone === "light" ? "brand-mark brand-mark-light" : "brand-mark"} aria-hidden="true">
      <img
        src="/brand/logo-remira-segunda-hoja-v2.png"
        alt=""
        width={42}
        height={42}
      />
    </span>
  );
}
