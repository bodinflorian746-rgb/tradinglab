// Témoignages homepage. 12 reviews, données localisées FR / EN / ES.
//
// Ton volontairement naturel, casual, type commentaires laissés par des
// utilisateurs 20-35 ans. Les imperfections orthographiques en FR sont
// intentionnelles (crédibilité) — ne PAS corriger.
//
// Note globale produit ≈ 4,4/5 (7×5 + 3×4 + 2×3 = 53 / 12).
//
// Pour ajouter un témoignage : nouvelle entrée dans REVIEWS, role + text
// + founderReply (optionnel) traduits dans les 3 locales.

export type LocalizedString = {
  fr: string;
  en: string;
  es: string;
};

export type AvatarColor = "a1" | "a2" | "a3" | "a4" | "a5";

export type Review = {
  id: string;
  name: string;
  initial: string;
  rating: 3 | 4 | 5;
  verified: boolean; // true → badge "Vérifié", false → badge "Early user"
  avatarColor: AvatarColor;
  role: LocalizedString;
  text: LocalizedString;
  founderReply?: LocalizedString;
};

export const REVIEWS: readonly Review[] = [
  {
    id: "pierre-l",
    name: "Pierre L.",
    initial: "P",
    rating: 5,
    verified: true,
    avatarColor: "a1",
    role: {
      fr: "Trader 6 mois",
      en: "Trader · 6 months",
      es: "Trader · 6 meses",
    },
    text: {
      fr: "Franchement propre.",
      en: "Honestly clean.",
      es: "Sinceramente impecable.",
    },
  },
  {
    id: "lucas-m",
    name: "Lucas M.",
    initial: "L",
    rating: 5,
    verified: false,
    avatarColor: "a2",
    role: {
      fr: "Étudiant en finance",
      en: "Finance student",
      es: "Estudiante de finanzas",
    },
    text: {
      fr: "Je suis deg de pas avoir découvert ça avant. Ça m'aurait fait gagner grave du temps.",
      en: "I'm gutted I didn't find this earlier. Would have saved me so much time.",
      es: "Estoy fastidiado de no haberlo descubierto antes. Me habría ahorrado un montón de tiempo.",
    },
  },
  {
    id: "lea-c",
    name: "Léa C.",
    initial: "L",
    rating: 5,
    verified: false,
    avatarColor: "a3",
    role: {
      fr: "Trader débutante",
      en: "Beginner trader",
      es: "Trader principiante",
    },
    text: {
      fr: "Le jeu Bull or Trade est lourd. J'ai appris plein de trucs sans m'en rendre compte.",
      en: "The Bull or Trade game is sick. Learned a ton without even realizing.",
      es: "El juego Bull or Trade está genial. He aprendido un montón sin darme cuenta.",
    },
  },
  {
    id: "hugo-r",
    name: "Hugo R.",
    initial: "H",
    rating: 5,
    verified: true,
    avatarColor: "a4",
    role: {
      fr: "Trader 2 ans",
      en: "Trader · 2 yrs",
      es: "Trader · 2 años",
    },
    text: {
      fr: "Je pensais connaitre les base mais en vrai j'avais encore plein de lacunes.",
      en: "Thought I knew the basics but turns out I still had plenty of gaps.",
      es: "Pensaba que conocia las bases pero en realidad aún tenía muchas lagunas.",
    },
  },
  {
    id: "camille-d",
    name: "Camille D.",
    initial: "C",
    rating: 5,
    verified: true,
    avatarColor: "a5",
    role: {
      fr: "Salariée · Trade en soirée",
      en: "Employee · Evening trader",
      es: "Empleada · Trade por la noche",
    },
    text: {
      fr: "Les quiz m'ont mis une claque 😅 Je pensais retenir les leçons mais pas tant que ça visiblement.",
      en: "The quizzes slapped me 😅 Thought I was remembering the lessons but apparently not that much.",
      es: "Los quiz me dieron una bofetada 😅 Pensaba retener las lecciones pero al parecer no tanto.",
    },
  },
  {
    id: "marie-b",
    name: "Marie B.",
    initial: "M",
    rating: 5,
    verified: false,
    avatarColor: "a1",
    role: {
      fr: "Débutante",
      en: "Beginner",
      es: "Principiante",
    },
    text: {
      fr: "Ça change vraiment des vidéos YouTube.",
      en: "Really changes from YouTube videos.",
      es: "Cambia mucho de los vídeos de YouTube.",
    },
  },
  {
    id: "theo-p",
    name: "Théo P.",
    initial: "T",
    rating: 5,
    verified: false,
    avatarColor: "a2",
    role: {
      fr: "Étudiant",
      en: "Student",
      es: "Estudiante",
    },
    text: {
      fr: "Le système de progression est vraiment bien fait. Ça donne envie d'aller jusqu'au bout.",
      en: "The progression system is really well done. Makes you want to go all the way through.",
      es: "El sistema de progresión está realmente bien hecho. Dan ganas de llegar hasta el final.",
    },
  },
  {
    id: "sarah-t",
    name: "Sarah T.",
    initial: "S",
    rating: 4,
    verified: false,
    avatarColor: "a3",
    role: {
      fr: "Trader 1 an",
      en: "Trader · 1 yr",
      es: "Trader · 1 año",
    },
    text: {
      fr: "Franchement propre. J'aurais juste aimé plus de jeux pour certaines stratégies mais ça viendra sûrement avec le temps.",
      en: "Honestly clean. Would have just liked more games for some strategies but I guess it'll come with time.",
      es: "Sinceramente impecable. Me habría gustado solo más juegos para ciertas estrategias pero seguramente llegará con el tiempo.",
    },
  },
  {
    id: "yanis-k",
    name: "Yanis K.",
    initial: "Y",
    rating: 4,
    verified: false,
    avatarColor: "a4",
    role: {
      fr: "Trader ICT",
      en: "ICT trader",
      es: "Trader ICT",
    },
    text: {
      fr: "Le contenu est bon. Par contre sa mériterait une communauté Discord ou Telegram en plus, ça pourrait être sympa.",
      en: "Content's good. Could use a Discord or Telegram community though, would be nice.",
      es: "El contenido es bueno. Pero le vendría bien una comunidad Discord o Telegram también, podría estar bien.",
    },
  },
  {
    id: "manon-v",
    name: "Manon V.",
    initial: "M",
    rating: 4,
    verified: false,
    avatarColor: "a5",
    role: {
      fr: "Trader retail",
      en: "Retail trader",
      es: "Trader retail",
    },
    text: {
      fr: "Ca change des formations YouTube. Dommage qu'il n'y ait pas encore d'application mobile.",
      en: "Changes from YouTube training. Shame there's no mobile app yet.",
      es: "Cambia de las formaciones de YouTube. Lástima que aún no haya una app móvil.",
    },
  },
  {
    id: "maxence-g",
    name: "Maxence G.",
    initial: "M",
    rating: 3,
    verified: false,
    avatarColor: "a1",
    role: {
      fr: "Trader SMC",
      en: "SMC trader",
      es: "Trader SMC",
    },
    text: {
      fr: "Je suis arrivé en pensant trouver une communauté. Les cours sont bien mais j'attends surtout les futures fonctionnalités.",
      en: "I came expecting to find a community. The courses are good but I'm mainly waiting on the future features.",
      es: "Vine pensando encontrar una comunidad. Los cursos están bien pero estoy esperando sobre todo las futuras funcionalidades.",
    },
  },
  {
    id: "emile-s",
    name: "Émile S.",
    initial: "É",
    rating: 3,
    verified: true,
    avatarColor: "a2",
    role: {
      fr: "Trader 3 ans",
      en: "Trader · 3 yrs",
      es: "Trader · 3 años",
    },
    text: {
      fr: "Pas mal dans l'ensemble. J'ai surtout aimé les quiz mais j'aurais aimé plus de contenu avancé.",
      en: "Not bad overall. Especially liked the quizzes but would have liked more advanced content.",
      es: "No está mal en general. Me gustaron sobre todo los quiz pero me habría gustado más contenido avanzado.",
    },
  },
];
