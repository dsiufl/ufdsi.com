/**
 * Right panel — soft mesh gradient (Caleo-style) with UF DSI branding.
 */
export function LoginHero() {
  return (
    <div className="relative flex min-h-[42vh] flex-1 items-center justify-center overflow-hidden px-8 py-16 sm:px-12 lg:min-h-screen lg:px-16">
      {/* Base wash */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-[#eef2ff] to-slate-100"
        aria-hidden
      />
      {/* Mesh orbs — soft indigo / sky / warm accent like modern SaaS templates */}
      <div
        className="pointer-events-none absolute -left-[18%] -top-[12%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,33,165,0.14),transparent_68%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[12%] top-[15%] h-[min(65vw,26rem)] w-[min(65vw,26rem)] rounded-full bg-[radial-gradient(circle_at_70%_40%,rgba(99,102,241,0.16),transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-8%] left-[20%] h-[min(55vw,22rem)] w-[min(55vw,22rem)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.12),transparent_70%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[25%] right-[10%] h-[min(45vw,18rem)] w-[min(45vw,18rem)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(240,101,47,0.08),transparent_72%)] blur-3xl"
        aria-hidden
      />
      {/* Subtle top shine */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent"
        aria-hidden
      />

      <p className="relative z-10 max-w-xl text-center text-[1.65rem] font-semibold leading-snug tracking-tight text-slate-800 sm:text-3xl lg:text-[2.35rem] lg:leading-tight">
        UF Data Science and Informatics
      </p>
    </div>
  );
}
