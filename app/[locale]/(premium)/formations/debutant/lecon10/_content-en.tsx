import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import RRComparisonDiagram from "@/app/components/charts/RRComparisonDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="debutant"
      lessonId="lecon10"
      title="Risk management: why 90% of traders lose"
      subtitle="The retail trader&apos;s problem usually isn&apos;t the entry. It comes from what happens AROUND the trade: too much risk, bad R/R, excessive leverage, revenge trading. Two traders with the same setup: one ends up profitable, the other blows up their account. The difference doesn&apos;t come from the strategy. It comes from risk management."
      duration="13 min"
      lessonNumber={10}
      prev={{ href: "/formations/debutant/lecon9", label: "Lesson 9" }}
      next={null}
    >
      {/* ── Section 1 — The biggest lie in retail trading ────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The biggest lie in retail trading</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Retail traders often think: &ldquo;If I find the right strategy, I&apos;ll become profitable.&rdquo; That&apos;s false. A good strategy with bad risk management almost always ends up dying. No strategy wins 100% of the time. Even an excellent strategy takes losses, goes through drawdowns, hits rough patches, and sometimes strings together several stops in a row.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          The retail trader&apos;s problem is that they build their trading as if losses should never happen. So the moment they do, they increase risk, force setups, move the stop, delete the SL, want to win it back immediately. And that&apos;s when the account really starts to die.
        </p>
      </section>

      {/* ── Section 2 — How an account really dies ───────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How an account really dies</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          An account usually doesn&apos;t die because of a single trade. It dies from an accumulation of bad decisions, too much risk, and an inability to handle losses emotionally.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {/* Scenario A — Risk 3% */}
          <div className="rounded-xl border border-emerald-500/30 bg-zinc-900 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-3">Scenario A. Risk 3%</p>
            <ul className="space-y-1.5 text-[13px] text-zinc-300">
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Account</span><span className="font-mono">€500</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Risk per trade</span><span className="font-mono">€15 (3%)</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">5 losses in a row</span><span className="font-mono">−€75</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Account left</span><span className="font-mono">€425</span></li>
            </ul>
            <p className="text-[13px] text-emerald-400 leading-snug mt-3 pt-3 border-t border-emerald-500/20">
              The trader is still alive. They can keep trading normally.
            </p>
          </div>

          {/* Scenario B — Risk 10% */}
          <div className="rounded-xl border border-red-500/30 bg-zinc-900 p-4">
            <p className="text-sm font-bold text-red-400 mb-3">Scenario B. Risk 10%</p>
            <ul className="space-y-1.5 text-[13px] text-zinc-300">
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Account</span><span className="font-mono">€500</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Risk per trade</span><span className="font-mono">€50</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">5 losses in a row</span><span className="font-mono">−€250</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Account left</span><span className="font-mono">€250</span></li>
            </ul>
            <p className="text-[13px] text-red-400 leading-snug mt-3 pt-3 border-t border-red-500/20">
              The account is psychologically destroyed. To get back to €500, they now need +100%.
            </p>
          </div>
        </div>

      </section>

      {/* ── Section 3 — The retail psychological trap ────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The retail psychological trap</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Retail traders often want to win it back fast. And that&apos;s exactly what accelerates the account&apos;s destruction.
        </p>

        <h3 className="text-base font-semibold text-white mt-5 mb-3">The classic cycle of a dying account</h3>

        <ol className="space-y-2">
          {[
            "A normal loss happens (it's part of the game)",
            "Frustration → bigger position size to “catch up”",
            "A new, bigger loss → deleting the SL to “let it breathe”",
            "The market keeps going against them → revenge trading",
            "Account burned in a few hours",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          The problem then becomes psychological. The trader is no longer trading to execute a setup. They&apos;re trading to win it back, relieve frustration, erase a loss, get &ldquo;revenge&rdquo; on the market. And in that state, decision quality collapses.
        </p>
      </section>

      {/* ── Section 4 — Why R/R changes everything ───────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why R/R changes everything</h2>

        <h3 className="text-base font-semibold text-white mb-3">Picture two situations</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Situation 1: you risk €20 to make €10.<br />
          Situation 2: you risk €20 to make €40.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Which one is smarter?
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Obviously Situation 2. You make 4x more for exactly the same risk. And yet, 90% of retail traders spend their time taking Situation 1 trades without realizing it. Either because they set their Take Profit too early &ldquo;to lock it in,&rdquo; or because they accept mediocre trades where the upside is tiny compared to the risk.
        </p>

        <h3 className="text-base font-semibold text-white mt-6 mb-3">What exactly is R/R?</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          R/R (risk/reward) is the ratio between what you RISK and what you can MAKE on a trade.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          If you risk €20 and aim for €40 → your R/R is 1:2.<br />
          If you risk €20 and aim for €60 → your R/R is 1:3.<br />
          If you risk €20 and aim for €10 → your R/R is 1:0.5 (catastrophic).
        </p>

        <div className="mt-5">
          <RRComparisonDiagram />
        </div>
        <p className="text-[13px] text-zinc-400 italic leading-relaxed mt-3 text-center">
          At equal risk (€20 in both cases), good R/R makes you 4x more. And over 10 trades with an average win rate of 50%, one ruins you, the other makes you profitable.
        </p>

        <h3 className="text-base font-semibold text-white mt-6 mb-3">What this really means</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          You do NOT need to be right often to make money in the markets. You need your winning trades to bring in much more than your losing trades cost you.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Win rate</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">R/R</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Risk/trade</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Over 10 trades</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trader A</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">70%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">1:0.7</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€15</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">+€28.50</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trader B</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">45%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">1:3</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€15</td>
                <td className="py-2.5 px-3 leading-snug text-emerald-400 text-sm font-semibold">+€120</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          Trader A is wrong 30% of the time. Trader B is wrong 55% of the time. And yet, Trader B ends up more than 4x more profitable. Why? Because every time they&apos;re right, they bank €45. Trader A only banks €10.50.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-500/40 bg-zinc-900 px-5 py-4">
          <p className="text-[15px] text-emerald-400 leading-relaxed font-medium italic">
            The market doesn&apos;t reward &ldquo;the one who wins often.&rdquo; It rewards &ldquo;the one who loses little when wrong, and makes enough when right.&rdquo;
          </p>
        </div>
      </section>

      {/* ── Section 5 — Surviving matters more than winning fast ─────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Surviving matters more than winning fast</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Retail traders often want to double the account fast, speed things up, use a lot of leverage, aggressively size up. The problem: the market rarely rewards aggression for long.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Traders who survive a long time generally have low risk, controlled exposure, slower growth, and stronger emotional stability.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          The real goal isn&apos;t to make +300% fast. The real goal is to stay alive long enough to build experience, protect your capital, and avoid emotional destruction. Because a trader with no capital can&apos;t execute any setup anymore.
        </p>
      </section>

      {/* ── Section 6 — A concrete XAU/USD example ───────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">A concrete XAU/USD example: two R/R, two outcomes</h2>

        <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span>💰</span>
            <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
          </div>
          <p className="text-base text-zinc-300 leading-relaxed">
            Two traders take XAU/USD at the same moment, on the same entry setup. Same €500 account, same €15 risk (3%). The only difference: where they place their Take Profit. So their R/R. Here&apos;s the real impact over 10 trades.
          </p>
        </div>

        <h3 className="text-base font-semibold text-white mt-5 mb-3">Same setup, two R/R: result after 10 trades</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Metric</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader R/R 1:1</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader R/R 1:3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Starting capital</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€500</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€500</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Risk per trade</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€15 (3%)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">€15 (3%)</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">XAU/USD entry</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,320</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,320</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">SL</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,300 (20 pts)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,300 (20 pts)</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">TP</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,340 (20 pts, R/R 1:1)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4,380 (60 pts, R/R 1:3)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Win rate over 10 trades</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">60%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">40%</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Winning trades</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">6 × +€15 = +€90</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4 × +€45 = +€180</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Losing trades</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4 × −€15 = −€60</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">6 × −€15 = −€90</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Net result</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">+€30</td>
                <td className="py-2.5 px-3 leading-snug text-emerald-400 text-sm font-semibold">+€90</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          The R/R 1:1 trader wins more often (60% of trades). But they finish the series at +€30. The R/R 1:3 trader loses more often (60% of trades), but finishes at +€90. That&apos;s 3x more profitable, with fewer winning trades. That&apos;s the power of R/R: you can be wrong more than half the time and still be far more profitable than someone who&apos;s right more often.
        </p>
      </section>

      {/* ── Section 7 — What retail traders should do ────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What retail traders should do</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Simple rules to apply starting today:
        </p>

        <div className="space-y-2.5 mt-4">
          {[
            "Risk per trade: 3% to 5% of capital (per the account-size grid detailed in Lesson 8: 5% if you start at €200-500, 3% if you're at €500-1,000, 2% above that)",
            "2-3 trades per day max",
            "Daily stop: 10% to 15% of capital max per day",
            "Minimum acceptable R/R: 1:2",
            "Stop immediately after a loss that makes you lose your emotional clarity",
            "Never any revenge trading",
            "Never move an SL just to “hope”",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-emerald-400 shrink-0 mt-0.5"
              >
                <path
                  d="M2 7l3.5 3.5 6.5-6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5 italic">
          The goal isn&apos;t to make a ton today. The goal is to still be able to trade in 6 months.
        </p>
      </section>

      {/* ── Section 8 — Key takeaway ─────────────────────────────────────── */}
      <section className="bg-zinc-900/50 border border-emerald-500/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
            <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-semibold text-emerald-400">Key takeaway</h2>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm">
          The profitable trader doesn&apos;t have a better strategy than everyone else. They have a better mental hierarchy:
        </p>

        <ol className="space-y-2 mt-4">
          {[
            "Survive first.",
            "Protect capital next.",
            "Perform last.",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-zinc-900 border border-emerald-500/20 rounded-xl px-4 py-2.5"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Retail traders flip this hierarchy. They want to perform fast, without protecting, without surviving. And that&apos;s exactly why they lose.
        </p>
      </section>

      {/* ── End-of-lesson quiz (3 questions) ─────────────────────────────── */}
      <LessonQuiz
        question="You risk €20 to make €60 on a trade. What's your R/R?"
        options={["1:0.3", "1:2", "1:3", "1:60"]}
        correctIndex={2}
        explanation="R/R = potential gain / risk. Here €60 / €20 = 3. So the R/R is 1:3. You risk 1 to make 3."
      />

      <LessonQuiz
        question="You've lost 50% of your account. What percentage gain do you need to get back to your starting capital?"
        options={["50%", "75%", "100%", "150%"]}
        correctIndex={2}
        explanation="If your account goes from €1,000 to €500 (a 50% loss), you need +100% (doubling what's left) to get back to €1,000. That's why pros think about survival first."
      />

      <LessonQuiz
        question="Which trader is the most profitable over 10 trades, with a constant €15 risk per trade?"
        options={[
          "Trader A: 80% win rate, R/R 1:0.5",
          "Trader B: 50% win rate, R/R 1:2",
          "Trader C: 90% win rate, R/R 1:0.3",
          "All the same because luck evens out",
        ]}
        correctIndex={1}
        explanation="Trader A: 8 × +€7.50 − 2 × €15 = +€30. Trader B: 5 × +€30 − 5 × €15 = +€75. Trader C: 9 × +€4.50 − 1 × €15 = +€25.50. Trader B is the most profitable despite the lower win rate, thanks to R/R. That's the power of asymmetry."
      />
    </LessonPage>
  );
}
