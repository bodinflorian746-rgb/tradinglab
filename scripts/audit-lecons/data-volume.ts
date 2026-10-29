// Données des leçons Volume Profile, VWAP et Order Flow (Trading Avancé 10 à 12) : les chiffres du texte
// redonnés par les bougies et leurs volumes (lib/lessons/volume.ts), les plans de trade (structure,
// R/R, lot minimum avec la règle des 2 %), les exemples chiffrés (VWAP, footprint, delta, CVD).
// Lancé par data.ts ; `--autotest` (autotest-volume.ts) vérifie que chaque défaut injecté est détecté.
import CANDLES from "@/lib/lessons/generated/candles.json";
import { tradeMath } from "@/lib/lessons/chart-analysis";
import { cvd, deltaOf, volumeProfile, vwap, type VCandle } from "@/lib/lessons/volume";
import { AVW_ANCHOR, AVW_TOUCH, LVN_BREAK, LVN_PROFILE, LVN_ROW, VP_ROW, VPT_LOCAL_HIGH, VPT_PROFILE, VPT_ROW, VPT_TRADE, VWN_TRADE, VWX_SUPPORT, VWX_TRADE } from "@/lib/lessons/volume-meta";
import { BOOK, DELTA_EXAMPLE, FOOTPRINT } from "@/app/components/charts/OrderFlowDiagrams";
import { VWAP_EXAMPLE } from "@/app/components/charts/VWAPDiagrams";

type Check = (ok: boolean, what: string) => void;
const near = (a: number, b: number, t = 1e-9) => Math.abs(a - b) <= t;
const pivH = (cs: VCandle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].h < cs[i].h);
const pivL = (cs: VCandle[], i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => cs[j].l > cs[i].l);

/** Lot minimum : valeur d'un pip / point / dollar au lot minimum (en €), règle des 2 % (leçons Débutant) */
const MIN_LOT_EUR = { eurusdPip: 0.092, nasdaqPoint: 0.092, xauDollar: 0.92 };

export function checkVolumeLessons(check: Check, C: Record<string, VCandle[]> = CANDLES as unknown as Record<string, VCandle[]>) {
  // Avancé 10 : le range EUR/USD (POC 1.0850, Value Area 1.0835 – 1.0865, HVN 1.0820, LVN 1.0870 – 1.0885)
  {
    const cs = C["vp-range"];
    const p = volumeProfile(cs, VP_ROW);
    check(near(p.poc, 1.085), `Volume Profile : POC ${p.poc} (le texte : 1.0850)`);
    check(near(p.vah, 1.0865) && near(p.val, 1.0835), `Volume Profile : Value Area ${p.val} – ${p.vah} (le texte : 1.0835 – 1.0865)`);
    check(p.vaShare >= 0.7 && p.vaShare <= 0.75, `Volume Profile : Value Area = ${(p.vaShare * 100).toFixed(1)} % du volume (environ 70 %)`);
    check(p.hvn.length === 1 && near(p.hvn[0], 1.082), `Volume Profile : HVN ${p.hvn.join(", ")} (le texte : 1.0820)`);
    check(p.lvn.length === 1 && near(p.lvn[0].lo, 1.087) && near(p.lvn[0].hi, 1.0885), `Volume Profile : LVN ${p.lvn.map((z) => `${z.lo}-${z.hi}`).join(", ")} (le texte : 1.0870 – 1.0885)`);
    check(Math.min(...cs.map((k) => k.l)) >= 1.08 && Math.max(...cs.map((k) => k.h)) <= 1.09, "Volume Profile : le range sort de 1.0800 – 1.0900");
    // sortie de la Value Area : même range, clôture au-dessus de la VAH, puis retour (rejet) ou retest tenu (acceptation)
    const n = cs.length;
    for (const k of ["va-rejet", "va-acceptation"]) {
      const q = C[k];
      check(JSON.stringify(q.slice(0, n)) === JSON.stringify(cs), `${k} : le range diffère du graphique du profil`);
      check(q[n + 2].c > p.vah && q.slice(n, n + 2).every((x) => x.c <= p.vah), `${k} : la bougie ${n + 2} n'est pas la 1re clôture au-dessus de la VAH`);
      if (k === "va-rejet") check(q[n + 3].c < p.vah && q.slice(n + 3).every((x) => x.c < p.vah), "rejet : le prix ne réintègre pas la Value Area");
      else check(q.slice(n + 2).every((x) => x.c > p.vah) && q[n + 3].l >= p.vah && q[n + 3].l - p.vah <= 0.0002, "acceptation : pas de retest tenu de la VAH (clôtures au-dessus, mèche sur la VAH)");
    }
  }

  // Avancé 10 : l'exemple pratique (support 1.0850, POC 1.0852, entrée M15 1.0855, SL 1.0835, TP 1.0895 avant la résistance H1 1.0900, R/R 1:2)
  {
    const h1 = C["vpt-h1"], m15 = C["vpt-m15"];
    const p = volumeProfile(h1, VPT_ROW, VPT_PROFILE[0], VPT_PROFILE[1]);
    check(near(p.poc, 1.0852), `Exemple EUR/USD : POC de la consolidation ${p.poc} (le texte : 1.0852)`);
    check([14, 18].every((i) => h1[i].h >= 1.0850 && h1[i].h <= 1.0851 && h1[i].c < 1.085) && h1[20].c > 1.085, "Exemple EUR/USD : résistance 1.0850 pas touchée deux fois puis cassée");
    check(h1.slice(21).every((k) => k.l >= 1.0848), "Exemple EUR/USD : la consolidation ne tient pas au-dessus de l'ancienne résistance");
    check([2, 5].every((i) => h1[i].h >= 1.09 && h1[i].h <= 1.0901) && h1.slice(6).every((k) => k.h < 1.0895) && VPT_TRADE.tp < 1.09, "Exemple EUR/USD : la résistance H1 1.0900 n'a pas deux touches, ou l'objectif 1.0895 n'est pas avant elle");
    const creux = m15.reduce((b, k, i) => (k.l < m15[b].l ? i : b), 0);
    check(pivL(m15, creux) && VPT_TRADE.sl < m15[creux].l, `Exemple EUR/USD : le SL ${VPT_TRADE.sl} n'est pas sous le creux technique`);
    const last = m15[m15.length - 1], top = m15[VPT_LOCAL_HIGH];
    check(pivH(m15, VPT_LOCAL_HIGH) && VPT_TRADE.entry > top.h && last.h >= VPT_TRADE.entry && m15.slice(VPT_LOCAL_HIGH + 1, -1).every((k) => k.h < VPT_TRADE.entry), "Exemple EUR/USD : l'entrée n'est pas la cassure du sommet local");
    const t = tradeMath(VPT_TRADE.entry, VPT_TRADE.sl, VPT_TRADE.tp);
    check(near(t.rr, 2, 1e-6) && near(t.risk, 0.002, 1e-9), `Exemple EUR/USD : R/R ${t.rr} (le texte : 1:2, 20 pips)`);
    check(20 * MIN_LOT_EUR.eurusdPip <= 0.02 * 300, "Exemple EUR/USD : risque au lot minimum au-dessus de 2 % d'un compte de 300 €");
  }

  // Avancé 10 : LVN NASDAQ (résistance 27 100, LVN 27 120 – 27 180, HVN 27 200)
  {
    const cs = C["vp-lvn"];
    const p = volumeProfile(cs, LVN_ROW, LVN_PROFILE[0], LVN_PROFILE[1]);
    check(p.hvn.length === 1 && near(p.hvn[0], 27200), `LVN NASDAQ : HVN ${p.hvn.join(", ")} (le texte : 27 200)`);
    check(p.lvn.length === 1 && near(p.lvn[0].lo, 27120) && near(p.lvn[0].hi, 27180), `LVN NASDAQ : LVN ${p.lvn.map((z) => `${z.lo}-${z.hi}`).join(", ")} (le texte : 27 120 – 27 180)`);
    const touches = cs.slice(0, LVN_BREAK).filter((k, i) => i > 10 && k.h >= 27099 && k.h <= 27101).length;
    check(touches >= 2 && cs.slice(12, LVN_BREAK).every((k) => k.c < 27100) && cs[LVN_BREAK].c > 27100, "LVN NASDAQ : résistance 27 100 pas touchée deux fois puis cassée en clôture");
    check(Math.max(...cs.slice(LVN_BREAK).map((k) => k.h)) >= 27195, "LVN NASDAQ : le prix n'atteint pas l'HVN après le breakout");
  }

  // Avancé 11 : exemple de calcul (VWAP 103 €, moyenne simple 102 €)
  {
    const sv = VWAP_EXAMPLE.reduce((s, r) => s + r.volume, 0);
    const vw = VWAP_EXAMPLE.reduce((s, r) => s + r.price * r.volume, 0) / sv;
    check(near(vw, 103) && near(VWAP_EXAMPLE.reduce((s, r) => s + r.price, 0) / VWAP_EXAMPLE.length, 102), `VWAP : exemple ${vw} € (le texte : 103 €, moyenne simple 102 €)`);
  }

  // Avancé 11 : plan NASDAQ (structure 27 000 / 27 140 / 27 080 / 27 230, VWAP ≈ 27 140 au creux, entrée 27 155, SL 27 125, TP 27 215)
  {
    const cs = C["vwap-nas"];
    const top = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), 0);
    const creux = cs.reduce((b, k, i) => (i > top && k.l < cs[b].l ? i : b), top);
    check(near(Math.min(...cs.slice(0, 4).map((k) => k.l)), 27000) && near(cs[6].h, 27140) && near(cs[9].l, 27080) && near(cs[top].h, 27230), "VWAP NASDAQ : la structure ne redonne pas 27 000 / 27 140 / 27 080 / 27 230");
    const vw = vwap(cs, 0)[creux]!;
    check(Math.abs(vw - 27140) <= 3, `VWAP NASDAQ : VWAP de séance ${vw.toFixed(1)} au creux (le texte : près de 27 140)`);
    check(pivL(cs, creux) && near(cs[creux].l, 27133) && VWN_TRADE.sl < cs[creux].l, "VWAP NASDAQ : le SL n'est pas sous le creux local 27 133");
    check(VWN_TRADE.tp < cs[top].h && pivH(cs, top), `VWAP NASDAQ : le TP ${VWN_TRADE.tp} n'est pas avant le dernier sommet ${cs[top].h}`);
    const lh = Math.max(...cs.slice(creux - 2, creux).map((k) => k.h));
    check(VWN_TRADE.entry > lh && cs[cs.length - 1].h >= VWN_TRADE.entry && cs.slice(creux, -1).every((k) => k.h < VWN_TRADE.entry), "VWAP NASDAQ : l'entrée n'est pas la cassure du sommet local de la correction");
    const t = tradeMath(VWN_TRADE.entry, VWN_TRADE.sl, VWN_TRADE.tp);
    check(t.rr >= 2 && near(t.risk, 30) && near(t.reward, 60), `VWAP NASDAQ : risque ${t.risk}, gain ${t.reward}, R/R ${t.rr} (le texte : 30 / 60 points, 1:2)`);
    check(t.risk * MIN_LOT_EUR.nasdaqPoint <= 0.02 * 300, "VWAP NASDAQ : risque au lot minimum au-dessus de 2 % d'un compte de 300 €");
  }

  // Avancé 11 : plan or (ancien support 3 900, VWAP ≈ 3 900, entrée 3 897, SL 3 907, TP 3 877 sur un support)
  {
    const cs = C["vwap-xau"];
    const last = cs.length - 1, retest = last - 2;
    const vw = vwap(cs, 0)[retest]!;
    check(Math.abs(vw - 3900) <= 2, `VWAP or : VWAP de séance ${vw.toFixed(1)} au retour sur 3 900 (le texte : autour de 3 900 $)`);
    check([3, 7].every((i) => cs[i].l >= 3899 && cs[i].l <= 3900) && cs[10].c < 3899 && cs[retest].h >= 3900 && cs[retest].h < VWX_TRADE.sl && pivH(cs, retest), "VWAP or : pas de support 3 900 touché deux fois, cassé, puis retesté par en dessous sous le SL");
    check([12, 15].every((i) => Math.abs(cs[i].l - VWX_SUPPORT) <= 1) && VWX_TRADE.tp > VWX_SUPPORT && cs[retest].h === 3902, "VWAP or : support 3 875 sans deux touches, objectif 3 877 pas avant lui, ou sommet de l'échec ≠ 3 902");
    check(cs[last].l < cs[last - 1].l && cs[last - 1].l > VWX_TRADE.entry && cs[last].l <= VWX_TRADE.entry, "VWAP or : l'entrée n'est pas la cassure du creux local");
    const t = tradeMath(VWX_TRADE.entry, VWX_TRADE.sl, VWX_TRADE.tp);
    check(near(t.risk, 10) && near(t.reward, 20), `VWAP or : risque ${t.risk} $, gain ${t.reward} $ (le texte : 10 $ / 20 $)`);
    check(t.risk * MIN_LOT_EUR.xauDollar <= 0.02 * 1500 && t.risk * MIN_LOT_EUR.xauDollar <= 0.02 * 460 + 0.01, "VWAP or : risque au lot minimum incompatible avec la règle des 2 % (1 500 €, au moins 460 €)");
  }

  // Avancé 11 : VWAP ancré sur la publication, touché par la correction
  {
    const cs = C["avwap-xau"];
    const a = vwap(cs, AVW_ANCHOR), s = vwap(cs, 0);
    check(cs[AVW_ANCHOR].c - cs[AVW_ANCHOR].o > 3 * Math.abs(cs[AVW_ANCHOR - 1].c - cs[AVW_ANCHOR - 1].o), "VWAP ancré : la bougie d'ancrage n'est pas le début de l'impulsion");
    // depuis le sommet de l'impulsion, la 1re bougie qui touche le VWAP ancré est celle du « retour »
    const top = cs.reduce((b, k, i) => (k.h > cs[b].h ? i : b), AVW_ANCHOR);
    check(cs[AVW_TOUCH].l <= a[AVW_TOUCH]! && cs[AVW_TOUCH].h >= a[AVW_TOUCH]! && cs.slice(top, AVW_TOUCH).every((k, i) => k.l > a[top + i]!), "VWAP ancré : la correction ne revient pas toucher le VWAP ancré (pour la 1re fois depuis le sommet)");
    check(a[AVW_TOUCH]! > s[AVW_TOUCH]!, "VWAP ancré : le VWAP de séance n'est pas sous le VWAP ancré");
  }

  // Avancé 12 : carnet, footprint, delta et CVD de l'exemple
  {
    check(BOOK.ask - BOOK.bid === 1 && BOOK.passiveBuy < BOOK.bid, "Order Flow : carnet (spread 1 point, achat limite sous le Bid)");
    check(FOOTPRINT.slice(0, 2).every((r) => r.ask > r.bid) && FOOTPRINT.slice(2).every((r) => r.ask < r.bid) && deltaOf(FOOTPRINT) === 110, "Order Flow : footprint (achats agressifs en haut, ventes en bas)");
    const cum = cvd(DELTA_EXAMPLE.map((d) => ({ o: 0, h: 0, l: 0, c: 0, v: 0, d })));
    check(JSON.stringify(cum) === JSON.stringify([300, 500, 350, 750]), `Order Flow : CVD ${cum.join(", ")} (le texte : 300, 500, 350, 750)`);
    const cs = C["of-absorption"];
    const peaks = cs.map((_, i) => i).filter((i) => pivH(cs, i));
    const [s1, s2] = peaks.slice(-2);
    const c = cvd(cs);
    check(s1 !== undefined && s2 !== undefined && cs[s1].h === 27100 && cs[s2].h > 27100 && cs[s2].c < 27100, "Absorption : pas de sommet sur 27 100 puis léger dépassement en mèche");
    check(c[s2] < c[s1], `Absorption : le CVD (${c[s1]} → ${c[s2]}) ne fait pas de sommet plus bas`);
    const medD = [...cs.map((k) => Math.abs(k.d ?? 0))].sort((x, y) => x - y)[cs.length >> 1];
    check((cs[s2].d ?? 0) >= 1.5 * medD && cs[s2].c - cs[s2].o <= 10, "Absorption : la dernière poussée n'a pas un delta fortement positif pour une faible progression");
    check(cs.every((k) => (k.d ?? 0) !== 0 && Math.abs(k.d ?? 0) < k.v), "Order Flow : delta nul ou plus grand que le volume");
  }
}
