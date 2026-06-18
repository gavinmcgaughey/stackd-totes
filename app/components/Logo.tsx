export function LogoMark({ size = 36 }: { size?: number }) {
  const bar = "block rounded-[2px]";
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex flex-col items-center justify-center gap-[3px] rounded-xl bg-brand-black"
      aria-hidden
    >
      <i className={`${bar} bg-white`} style={{ width: size * 0.5, height: size * 0.09 }} />
      <i className={`${bar} bg-brand`} style={{ width: size * 0.5, height: size * 0.09 }} />
      <i className={`${bar} bg-white`} style={{ width: size * 0.5, height: size * 0.09 }} />
    </span>
  );
}

export function Logo({
  size = 32,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span
        className={`text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        STACK&apos;D
      </span>
    </span>
  );
}
