import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#0B1F3A]">
      {/* Kimpton-style top bar */}
      <header className="w-full">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg?v=bird" alt="Carstair" width={28} height={28} priority unoptimized />
            <span className="text-[14px] font-medium tracking-tight">Carstair</span>
          </Link>
          <nav className="flex items-center gap-1 text-[13px]" aria-label="Primary">
            <Link href="/login" className="text-[#6B7C93] hover:text-[#0B1F3A] px-3 py-1.5 transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-[#0B1F3A] text-white px-3.5 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#122a4a] transition-colors"
            >
              Open product
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — large type, short subcopy, calm field (Kimpton proportions) */}
      <section className="w-full">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
          <h1 className="text-[2.5rem] sm:text-[3.25rem] md:text-[3.75rem] font-semibold tracking-[-0.035em] leading-[1.08] max-w-[18ch] mb-6">
            Maintenance control for airworthiness and release.
          </h1>
          <p className="text-[15px] md:text-base text-[#6B7C93] leading-relaxed max-w-[36rem] mb-10">
            Task cards, dual inspection, and return-to-service records — built for hangar and
            CAMO work, with a clear audit trail on every release.
          </p>
          <div className="flex flex-wrap gap-2.5 mb-16 md:mb-20">
            <Link
              href="/login?mode=demo"
              className="bg-[#0B1F3A] text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#122a4a] transition-colors"
            >
              Try a sample hangar
            </Link>
            <Link
              href="/login?mode=provision"
              className="bg-white text-[#0B1F3A] border border-[#E2E6EC] px-4 py-2 rounded-full text-[13px] font-medium hover:border-[#C5CDD8] transition-colors"
            >
              Set up your organisation
            </Link>
          </div>

          {/* Soft product stage — navy field, light grey frame */}
          <div className="rounded-2xl border border-[#E2E6EC] bg-white overflow-hidden shadow-[0_24px_80px_-40px_rgba(11,31,58,0.25)]">
            <div className="border-b border-[#E2E6EC] px-4 py-3 flex items-center gap-2 bg-[#FAFBFC]">
              <span className="w-2 h-2 rounded-full bg-[#C5CDD8]" />
              <span className="w-2 h-2 rounded-full bg-[#C5CDD8]" />
              <span className="w-2 h-2 rounded-full bg-[#C5CDD8]" />
              <span className="ml-3 text-[12px] text-[#6B7C93]">Work package · N123AB</span>
            </div>
            <div className="grid md:grid-cols-[220px_1fr] min-h-[280px] md:min-h-[340px]">
              <aside className="border-r border-[#E2E6EC] bg-[#FAFBFC] p-4 hidden md:block">
                <p className="text-[11px] uppercase tracking-wide text-[#6B7C93] mb-3">Fleet</p>
                {["N123AB · B737-800", "G-EUUY · A320neo", "VH-XZC · B787-9"].map((r, i) => (
                  <div
                    key={r}
                    className={`text-[13px] px-2 py-1.5 rounded-md mb-0.5 ${
                      i === 0 ? "bg-[#0B1F3A] text-white" : "text-[#6B7C93]"
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </aside>
              <div className="p-5 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[12px] text-[#6B7C93] mb-1">Task card</p>
                    <p className="text-[15px] font-medium">Inspect LH wing upper skin STA 540</p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#EEF1F5] text-[#0B1F3A]">
                    RII required
                  </span>
                </div>
                <div className="space-y-3 text-[13px] text-[#6B7C93]">
                  <div className="flex justify-between border-b border-[#E2E6EC] pb-2">
                    <span>Performer signature</span>
                    <span className="text-[#0B1F3A]">Recorded</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E2E6EC] pb-2">
                    <span>Certifying staff</span>
                    <span className="text-[#A16207]">Pending</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Evidence</span>
                    <span className="text-[#0B1F3A]">2 attachments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: how release works */}
      <section className="w-full border-t border-[#E2E6EC] bg-white">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <h2 className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight max-w-[20ch] mb-4">
            From the job card to return to service.
          </h2>
          <p className="text-[14px] text-[#6B7C93] max-w-[32rem] mb-14">
            The same sequence you already run in the hangar — captured once, signed properly, ready
            for the records office.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Open the task card",
                d: "Pull the work instruction against the aircraft and work package.",
              },
              {
                t: "Record findings & evidence",
                d: "Photos and notes stay with the card for the certifying review.",
              },
              {
                t: "Performer sign-off",
                d: "The inspector who did the work signs with a recorded hash.",
              },
              {
                t: "Independent inspection",
                d: "Where RII applies, a second authorised person must sign.",
              },
              {
                t: "Return to service",
                d: "Assemble the release package when the work is complete.",
              },
              {
                t: "Keep the audit trail",
                d: "Every airworthiness action is written to an append-only log.",
              },
            ].map((item) => (
              <div key={item.t} className="border border-[#E2E6EC] rounded-xl p-5 bg-[#FAFBFC]">
                <h3 className="text-[14px] font-medium mb-2">{item.t}</h3>
                <p className="text-[13px] text-[#6B7C93] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: capabilities */}
      <section className="w-full border-t border-[#E2E6EC] bg-[#F4F5F7]">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <h2 className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight mb-4 max-w-[22ch]">
            Built around the work you already do.
          </h2>
          <p className="text-[14px] text-[#6B7C93] max-w-[32rem] mb-14">
            Aircraft status, AD and SB tracking, MEL deferrals, component times, and the dual-sign
            path to release.
          </p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                t: "Airworthiness directives & service bulletins",
                d: "Track applicability and open items against the aircraft you maintain.",
              },
              {
                t: "Electronic task cards",
                d: "Multi-step sign-off with required inspection gates where the procedure demands them.",
              },
              {
                t: "MEL and deferred defects",
                d: "Open, limit, and close deferrals without losing the paper trail.",
              },
              {
                t: "Component life",
                d: "TSN, TSO, cycles, and serialised parts against position on the aircraft.",
              },
            ].map((item) => (
              <div key={item.t}>
                <h3 className="text-[15px] font-medium mb-2">{item.t}</h3>
                <p className="text-[14px] text-[#6B7C93] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — Kimpton commission-style */}
      <section className="w-full border-t border-[#E2E6EC] bg-white">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 py-20 md:py-28">
          <h2 className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight mb-4 max-w-[18ch]">
            Bring your next check under control.
          </h2>
          <p className="text-[14px] text-[#6B7C93] max-w-[30rem] mb-8">
            Start with a sample hangar, or open an organisation and put your own aircraft on the
            board.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/login?mode=demo"
              className="bg-[#0B1F3A] text-white px-4 py-2 rounded-full text-[13px] font-medium"
            >
              Try a sample hangar
            </Link>
            <Link
              href="/login?mode=provision"
              className="bg-white text-[#0B1F3A] border border-[#E2E6EC] px-4 py-2 rounded-full text-[13px] font-medium"
            >
              Set up your organisation
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-[#E2E6EC]">
        <div className="max-w-[1120px] mx-auto px-6 md:px-8 py-10 text-[13px] text-[#6B7C93]">
          Carstair
        </div>
      </footer>
    </main>
  );
}
