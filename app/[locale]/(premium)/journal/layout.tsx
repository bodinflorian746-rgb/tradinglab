import { notFound } from "next/navigation";

// Hotfix production — Journal retiré immédiatement et inconditionnellement.
// Bloque TOUTES les routes /journal/* (404), quel que soit l'état de
// connexion, le statut premium, ou toute variable d'environnement
// JOURNAL_ENABLED éventuellement présente sur Vercel. Ne rend jamais children.
export default function JournalLayout() {
  notFound();
}
