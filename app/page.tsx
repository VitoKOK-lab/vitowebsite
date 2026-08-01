import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Hi, I&apos;m
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900">
          Vito
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-500">
          個人網站建置中 — 這裡之後會放自我介紹與作品集。
        </p>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            作品
          </h2>
          <Link
            href="/demo"
            className="group mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="font-semibold text-slate-800">
                  AI 同事系統(AI Colleague OS)
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  中小企業 AI 營運系統 pitch demo:AI 建議集中決策、學習迴圈、三產業 × 四角色一鍵切換。
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
          </Link>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-3xl px-6 py-8 text-xs text-slate-400">
        © {new Date().getFullYear()} Vito
      </footer>
    </div>
  );
}
