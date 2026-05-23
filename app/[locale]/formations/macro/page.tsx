import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";

type MacroLevelKey = "debutant" | "intermediaire" | "avance";

const LEVELS: { key: MacroLevelKey; href: string; badgeClass: string; buttonClass: string; disabled?: boolean }[] = [
  { key: "debutant",      href: "/formations/macro/debutant",      badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", buttonClass: "bg-emerald-500/10 text-emerald-500" },
  { key: "intermediaire", href: "/formations/macro/intermediaire", badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",         buttonClass: "bg-blue-400/10 text-blue-400" },
  { key: "avance",        href: "/formations/macro/avance",        badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",     buttonClass: "bg-amber-400/10 text-amber-400" },
];

export default async function MacroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const h = (p: string) => localizedHref(p, locale);
  const fdict = await getDictionary(locale, "formations");
  const common = await getDictionary(locale, "common");
  const macro = fdict.macro;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href={h("/formations")} className="hover:text-zinc-400 transition-colors">{common.lessons.breadcrumbFormations}</Link>
          <span>/</span>
          <span className="text-zinc-400">{macro.breadcrumb}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{macro.title}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            {macro.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {LEVELS.map((level) => {
            const lvl = macro.levels[level.key];
            return level.disabled ? (
              <div
                key={level.key}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden opacity-50"
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h2 className="text-xl font-semibold">{lvl.label}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${level.badgeClass}`}>
                          {lvl.count}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                          {macro.comingSoon}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{lvl.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={level.key}
                href={h(level.href)}
                className="block bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h2 className="text-xl font-semibold">{lvl.label}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${level.badgeClass}`}>
                          {lvl.count}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{lvl.description}</p>
                    </div>
                    <div className="shrink-0 hidden md:block">
                      <span className={`inline-flex items-center gap-1.5 ${level.buttonClass} text-xs font-semibold px-3.5 py-2 rounded-lg`}>
                        {macro.cta}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
