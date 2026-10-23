/** Right panel: a quiet preview of the dashboard instead of a slogan. */
const Bar = ({ w, tone = "bg-white/15" }: { w: string; tone?: string }) => (
  <span className={`block h-2 rounded-full ${tone}`} style={{ width: w }} />
);

export function LoginHero() {
  return (
    <div className="relative flex min-h-[42vh] flex-1 flex-col justify-between overflow-hidden bg-[#141a33] px-8 py-12 text-[#f4efeb] sm:px-12 lg:min-h-screen lg:px-16 lg:py-16" aria-hidden>
      <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-[#9db4f5]">UF DSI · Admin</p>

      <div className="relative -mr-24 mt-10 hidden rounded-[4px] border border-white/15 bg-white/[0.03] p-5 sm:block lg:-mr-40">
        <div className="grid grid-cols-4 gap-3">
          {["Upcoming workshops", "News drafts", "Open forms", "Changes this week"].map((label, i) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="font-mono text-2xl tracking-[-0.04em]">{[4, 2, 1, 12][i]}</p>
              <p className="mt-1 truncate text-[11px] text-white/50">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-[1fr_0.8fr] gap-3">
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Bar w="35%" tone="bg-white/30" />
            {["70%", "55%", "80%", "45%"].map((w) => (
              <div key={w} className="flex items-center gap-3">
                <span className="size-6 shrink-0 rounded-full bg-white/10" />
                <span className="flex-1 space-y-1.5">
                  <Bar w={w} />
                  <Bar w="25%" tone="bg-white/[0.07]" />
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Bar w="40%" tone="bg-white/30" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-md text-[10px] font-semibold ${i === 0 ? "bg-[#cf3f12]" : "bg-white/10"}`}>
                  {[25, 1, 8][i]}
                </span>
                <span className="flex-1 space-y-1.5">
                  <Bar w={["85%", "70%", "75%"][i]} />
                  <Bar w="45%" tone="bg-white/[0.07]" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="relative mt-10 max-w-sm text-sm leading-relaxed text-white/55">
        Workshops, news, projects, the symposium and event forms for ufdsi.com.
      </p>
    </div>
  );
}
