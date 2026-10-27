// Données de la stratégie Volume Profile + VWAP (4 leçons) : chaque chiffre du texte redonné par les
// bougies et leurs volumes (lib/lessons/volume.ts) — structure H1, profil de la consolidation, zone
// d'intérêt, VWAP de séance au retour, confirmation M15, plans refusé et retenu (R/R), taille de
// position, issues A et B, absorption et CVD sur le contrat future, vente sur l'or.
// Lancé par data.ts ; autotest-volume.ts vérifie que chaque défaut injecté est détecté.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { tradeMath } from "@/lib/lessons/chart-analysis";
import { cvd, volumeProfile, vwap, type VCandle } from "@/lib/lessons/volume";
import { VSV_FUT_BASIS, VSV_FUT_FROM, VSV_H1, VSV_M15, VSV_PLAN, VSV_PROFILE, VSV_REFUSED, VSV_RES, VSV_ROW, VSV_ZONE, VSX, VSX_PROFILE, VSX_ROW } from "@/lib/lessons/strat-volume-meta";

type Check = (ok: boolean, what: string) => void;
const near = (a: number, b: number, t = 1e-9) => Math.abs(a - b) <= t;
const pip = (a: number, b: number) => Math.round(Math.abs(a - b) * 1e4 * 10) / 10;
const pivH = (cs: VCandle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].h < cs[i].h);
const pivL = (cs: VCandle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].l > cs[i].l);
const firstClose = (cs: VCandle[], from: number, ok: (c: number) => boolean) => cs.findIndex((k, i) => i > from && ok(k.c));

/** Valeur d'un pip sur un lot standard EUR/USD (10 $ ≈ 9,20 €) et lot minimum */
const PIP_EUR_LOT = 9.2;
const MIN_LOT = 0.01;

export function checkStratVolume(check: Check, C: Record<string, VCandle[]> = CANDLES as unknown as Record<string, VCandle[]>) {
  const S = "Stratégie Volume Profile + VWAP";
  const h1 = C["vsv-h1"], m15 = C["vsv-m15"], H = VSV_H1, M = VSV_M15;

  // Leçon 1 : structure H1 (creux 1.0800, sommet 1.0860 rejeté deux fois, creux 1.0830, breakout, sommet 1.0910)
  check(pivL(h1, H.low0) && near(h1[H.low0].l, 1.08), `${S} : le premier creux n'est pas un pivot à 1.0800`);
  check([H.res1, H.res2].every((i) => pivH(h1, i) && near(h1[i].h, 1.086)) && h1.slice(H.res1, H.brk).every((k) => k.h <= 1.086), `${S} : 1.0860 n'est pas rejeté deux fois avant le breakout`);
  check(pivL(h1, H.low1) && near(h1[H.low1].l, 1.083) && H.low1 > H.res2 && H.low1 < H.brk, `${S} : le deuxième creux n'est pas un pivot à 1.0830 entre le 2e rejet et le breakout`);
  check(firstClose(h1, H.res1, (c) => c > 1.086) === H.brk, `${S} : la bougie ${H.brk} n'est pas la première clôture au-dessus de 1.0860`);
  check([H.top1, H.top2].every((i) => pivH(h1, i) || i === H.top1) && [H.top1, H.top2].every((i) => near(h1[i].h, VSV_RES)) && Math.max(...h1.map((k) => k.h)) === VSV_RES, `${S} : le sommet 1.0910 n'est pas touché deux fois (résistance H1)`);
  check(Math.abs(h1[h1.length - 1].c - 1.089) <= 0.0003, `${S} : le prix ne finit pas autour de 1.0890 (${h1[h1.length - 1].c})`);
  // Profil de la consolidation : POC 1.0860 (HVN principale), VAH 1.0890, VAL 1.0845, LVN 1.0895 – 1.0905
  const p = volumeProfile(h1, VSV_ROW, VSV_PROFILE[0], VSV_PROFILE[1]);
  check(near(p.poc, 1.086), `${S} : POC ${p.poc} (le texte : 1.0860)`);
  check(near(p.vah, 1.089) && near(p.val, 1.0845), `${S} : Value Area ${p.val} – ${p.vah} (le texte : 1.0845 – 1.0890)`);
  check(p.vaShare >= 0.7 && p.vaShare <= 0.75, `${S} : Value Area = ${(p.vaShare * 100).toFixed(1)} % du volume (environ 70 %)`);
  check(p.lvn.length === 1 && near(p.lvn[0].lo, 1.0895) && near(p.lvn[0].hi, 1.0905), `${S} : LVN ${p.lvn.map((z) => `${z.lo}-${z.hi}`).join(", ")} (le texte : 1.0895 – 1.0905, seule LVN)`);
  check(p.lvn.every((z) => z.lo > p.vah && z.hi < VSV_RES), `${S} : la LVN n'est pas entre la VAH et la résistance 1.0910`);
  // Zone d'intérêt 1.0855 – 1.0865 : ancienne résistance, POC, support tenu (deux retours après le breakout)
  check(p.poc >= VSV_ZONE[0] && p.poc <= VSV_ZONE[1] && 1.086 >= VSV_ZONE[0] && 1.086 <= VSV_ZONE[1], `${S} : la zone d'intérêt ne contient pas le POC et l'ancienne résistance`);
  check([H.back1, H.back2].every((i) => h1[i].l >= VSV_ZONE[0] && h1[i].l <= VSV_ZONE[1]) && h1.slice(H.brk).every((k) => k.c >= VSV_ZONE[0]), `${S} : le support 1.0855 – 1.0865 n'est pas retesté deux fois sans clôture dessous`);

  // Leçon 2 : M15, VWAP de séance 1.0862 au retour dans la zone
  check(near(m15[0].o, h1[h1.length - 1].c), `${S} : le M15 ne prolonge pas le H1`);
  const vw = vwap(m15, M.session);
  check(Math.abs(vw[M.back]! - 1.0862) < 0.00005, `${S} : VWAP de séance ${vw[M.back]!.toFixed(5)} au retour (le texte : 1.0862)`);
  check(m15.slice(M.session, M.back - 2).every((k) => k.l > VSV_ZONE[1]) && m15[M.back].l <= VSV_ZONE[1] && Math.min(...m15.slice(M.back - 1, M.back + 1).map((k) => k.l)) <= 1.086, `${S} : le retour dans la zone (1.0860 atteint) n'est pas à la bougie ${M.back}`);

  // Leçon 3 : creux 1.0845, sommet local 1.0870, légère correction, clôture au-dessus de 1.0870
  check(pivL(m15, M.low) && near(m15[M.low].l, 1.0845) && Math.min(...m15.slice(0, M.confirm + 1).map((k) => k.l)) === m15[M.low].l, `${S} : le creux d'invalidation n'est pas un pivot à 1.0845`);
  check(pivH(m15, M.high) && near(m15[M.high].h, 1.087), `${S} : le sommet local n'est pas un pivot à 1.0870`);
  check(m15.slice(M.high + 1, M.confirm).every((k) => k.l > m15[M.low].l && k.h < 1.087), `${S} : la correction casse le creux ou le sommet local avant la confirmation`);
  check(firstClose(m15, M.high, (c) => c > 1.087) === M.confirm && near(m15[M.confirm].c, VSV_REFUSED.entry), `${S} : la confirmation n'est pas la première clôture au-dessus de 1.0870, à 1.0872`);

  // Leçon 4 : plan refusé (30 / 34 pips, 1:1,1), plan retenu (16 / 48 pips, 1:3)
  const r = tradeMath(VSV_REFUSED.entry, VSV_REFUSED.sl, VSV_REFUSED.tp);
  check(pip(VSV_REFUSED.entry, VSV_REFUSED.sl) === 30 && pip(VSV_REFUSED.tp, VSV_REFUSED.entry) === 34 && r.rr < 2 && Math.round(r.rr * 10) / 10 === 1.1, `${S} : plan refusé ${pip(VSV_REFUSED.entry, VSV_REFUSED.sl)} / ${pip(VSV_REFUSED.tp, VSV_REFUSED.entry)} pips, R/R ${r.rr.toFixed(2)} (le texte : 30 / 34, 1:1,1)`);
  for (const t of [VSV_REFUSED, VSV_PLAN]) {
    check(t.sl < m15[M.low].l && m15[M.low].l - t.sl <= 0.0005, `${S} : le stop ${t.sl} n'est pas juste sous le creux d'invalidation 1.0845`);
    check(t.tp < VSV_RES && VSV_RES - t.tp <= 0.0005, `${S} : l'objectif ${t.tp} n'est pas juste avant la résistance 1.0910`);
  }
  check(pivL(m15, M.low2) && near(m15[M.low2].l, 1.0848) && m15[M.low2].l > m15[M.low].l && m15.slice(M.confirm, M.low2).some((k) => k.l <= VSV_ZONE[1]), `${S} : le second retour (creux 1.0848 au-dessus de l'invalidation) est faux`);
  check(pivH(m15, M.high2) && near(m15[M.high2].h, 1.0856) && firstClose(m15, M.high2, (c) => c > 1.0856) === M.entry2 && near(m15[M.entry2].c, VSV_PLAN.entry) && m15.slice(M.high2 + 1, M.entry2).every((k) => k.l > m15[M.low2].l), `${S} : l'entrée 1.0858 n'est pas la clôture au-dessus du sommet local 1.0856`);
  const t = tradeMath(VSV_PLAN.entry, VSV_PLAN.sl, VSV_PLAN.tp);
  check(pip(VSV_PLAN.entry, VSV_PLAN.sl) === 16 && pip(VSV_PLAN.tp, VSV_PLAN.entry) === 48 && near(t.rr, 3, 1e-6), `${S} : plan retenu ${pip(VSV_PLAN.entry, VSV_PLAN.sl)} / ${pip(VSV_PLAN.tp, VSV_PLAN.entry)} pips, R/R ${t.rr} (le texte : 16 / 48, 1:3)`);
  // Taille de position : 2 000 € à 1 % = 20 €, 1,25 € par pip, ≈ 0,13 lot, risque ≈ 19 €, gain 3R ≈ 57 € ; 300 € à 2 % ≈ 0,04 lot
  const lot = Math.floor((20 / 16 / PIP_EUR_LOT) * 100) / 100;
  check(lot === 0.13 && Math.round(lot * PIP_EUR_LOT * 16) === 19 && Math.round(lot * PIP_EUR_LOT * 48) === 57, `${S} : taille ${lot} lot, risque ${(lot * PIP_EUR_LOT * 16).toFixed(1)} €, gain ${(lot * PIP_EUR_LOT * 48).toFixed(1)} € (le texte : 0,13 lot, 19 €, 57 €)`);
  const small = Math.floor((6 / 16 / PIP_EUR_LOT) * 100) / 100;
  check(small === 0.04 && small >= MIN_LOT, `${S} : petit compte ${small} lot (le texte : 0,04 lot, faisable au lot minimum)`);
  // Issues : A touche le stop avant l'objectif, B l'objectif avant le stop (sous la résistance)
  for (const k of ["a", "b"] as const) {
    const cs = C[`vsv-m15-${k}`];
    check(JSON.stringify(cs.slice(0, m15.length)) === JSON.stringify(m15), `${S} : l'issue ${k.toUpperCase()} ne prolonge pas le M15`);
    const sl = cs.findIndex((c, i) => i > M.entry2 && c.l <= VSV_PLAN.sl), tp = cs.findIndex((c, i) => i > M.entry2 && c.h >= VSV_PLAN.tp);
    check(k === "a" ? sl === cs.length - 1 && tp < 0 : tp === cs.length - 1 && sl < 0 && cs[tp].h < VSV_RES, `${S} : l'issue ${k.toUpperCase()} ne finit pas sur ${k === "a" ? "le stop" : "l'objectif"}`);
  }

  // Leçon 3 : contrat future (même séance, environ 40 pips au-dessus) : absorption et CVD
  {
    const f = C["vsv-fut"];
    const r5 = (x: number) => Number((x + VSV_FUT_BASIS).toFixed(5));
    const src = m15.slice(VSV_FUT_FROM, M.confirm + 1);
    check(f.length === src.length && f.every((k, i) => k.o === r5(src[i].o) && k.h === r5(src[i].h) && k.l === r5(src[i].l) && k.c === r5(src[i].c)), `${S} : le future ne suit pas la séance au comptant`);
    const a = M.back - VSV_FUT_FROM, lo = M.low - VSV_FUT_FROM;
    const med = [...f.map((k) => Math.abs(k.d ?? 0))].sort((x, y) => x - y)[f.length >> 1];
    check((f[a].d ?? 0) <= -1.5 * med && (f[a - 1].d ?? 0) <= -1.5 * med && f[a].c > f[a].o && f[a].l >= f[a - 1].l, `${S} : pas d'absorption (fortes ventes sans nouvelle baisse) au contact de la zone`);
    const c = cvd(f);
    check(f[lo].l < f[a].l && c[lo] > c[a] && c[a] === Math.min(...c.slice(0, lo + 1)), `${S} : pas de divergence (nouveau creux du prix, CVD au-dessus de son creux)`);
    check(f.every((k) => (k.d ?? 0) !== 0 && Math.abs(k.d ?? 0) < k.v), `${S} : delta nul ou plus grand que le volume`);
  }

  // Leçon 2 : or H1 baissier, résistance 3 900 $ (deux rejets), volume concentré à 3 898 $, VWAP 3 899 $ au rebond
  {
    const x = C["vsv-xau"];
    check([VSX.res1, VSX.res2].every((i) => x[i].h === 3900) && x.slice(VSX_PROFILE[0], VSX_PROFILE[1] + 1).every((k) => k.h <= 3900), `${S} : or, la résistance 3 900 $ n'est pas rejetée deux fois`);
    check(x[0].h > x[VSX.rebound].h && pivL(x, VSX.low) && x[VSX.low].l < Math.min(...x.slice(0, VSX.low).map((k) => k.l)), `${S} : or, pas de tendance baissière (sommets et creux descendants)`);
    const q = volumeProfile(x, VSX_ROW, VSX_PROFILE[0], VSX_PROFILE[1]);
    check(q.poc === 3898, `${S} : or, concentration de volume ${q.poc} $ (le texte : 3 898 $)`);
    const v = vwap(x, 0)[VSX.rebound]!;
    check(Math.round(v) === 3899, `${S} : or, VWAP de séance ${v.toFixed(1)} $ au rebond (le texte : 3 899 $)`);
    check(x[VSX.rebound].h === 3900 && x.slice(VSX.low + 1, VSX.rebound).every((k) => k.h < 3898), `${S} : or, le rebond n'atteint pas la zone 3 898 – 3 900 $ à la bougie ${VSX.rebound}`);
  }
}
