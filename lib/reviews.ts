// Témoignages homepage. 13 reviews, données localisées FR / EN / ES.
//
// Le champ `text` est rendu sans formatage particulier. Le mécanisme de
// surlignage vert (marqueurs format `marker-word-marker`) a été retiré
// après feedback UX : trop "rédigé par l'équipe marketing", pas crédible.
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
    id: "mathieu-d",
    name: "Mathieu D.",
    initial: "M",
    rating: 5,
    verified: true,
    avatarColor: "a1",
    role: {
      fr: "Trader spécialiste · RaiseFX · Rentable depuis 5 ans",
      en: "Trading specialist · RaiseFX · Profitable for 5 years",
      es: "Trader especialista · RaiseFX · Rentable desde hace 5 años",
    },
    text: {
      fr: "Franchement, si j'avais découvert cette plateforme à mes débuts, ça m'aurait fait gagner un temps de fou. J'aurais compris beaucoup plus vite les stratégies SMC/ICT et la lecture des marchés. La méthode interactive change vraiment tout.",
      en: "Honestly, if I had discovered this platform when I started, it would have saved me a ton of time. I would have understood SMC/ICT strategies and market reading much faster. The interactive method truly changes everything.",
      es: "Sinceramente, si hubiera descubierto esta plataforma cuando empecé, me habría ahorrado un montón de tiempo. Habría entendido las estrategias SMC/ICT y la lectura de mercados mucho más rápido. El método interactivo lo cambia todo.",
    },
  },
  {
    id: "thomas-l",
    name: "Thomas L.",
    initial: "T",
    rating: 5,
    verified: true,
    avatarColor: "a2",
    role: {
      fr: "Trader · 6 ans d'XP, rentable depuis 3",
      en: "Trader · 6 yrs XP, profitable for 3",
      es: "Trader · 6 años de experiencia, rentable desde hace 3",
    },
    text: {
      fr: "Je trade depuis 6 ans, rentable depuis 3. J'ai testé pas mal de plateformes et de formations, et celle-ci est vraiment cool. Les jeux sont addictifs, je me surprends à y jouer régulièrement juste pour le plaisir.",
      en: "I've been trading for 6 years, profitable for 3. I've tested quite a few platforms and trainings, and this one is really cool. The games are addictive, I catch myself playing them just for fun.",
      es: "Llevo 6 años operando, rentable desde hace 3. He probado bastantes plataformas y formaciones, y esta es realmente buena. Los juegos son adictivos, me sorprendo jugándolos solo por placer.",
    },
  },
  {
    id: "karim-b",
    name: "Karim B.",
    initial: "K",
    rating: 5,
    verified: false,
    avatarColor: "a3",
    role: {
      fr: "Trader ICT débutant",
      en: "Beginner ICT trader",
      es: "Trader ICT principiante",
    },
    text: {
      fr: "J'ai dû regarder 30 vidéos YouTube sur ICT sans rien capter. En 2 leçons sur TradeScaleX j'ai enfin compris les Order Blocks et les FVG. Tout est expliqué dans le bon ordre.",
      en: "I watched 30 YouTube videos on ICT without getting any of it. In 2 lessons on TradeScaleX I finally understood Order Blocks and FVGs. Everything is explained in the right order.",
      es: "Vi 30 videos de YouTube sobre ICT sin entender nada. En 2 lecciones de TradeScaleX por fin entendí los Order Blocks y los FVG. Todo está explicado en el orden correcto.",
    },
  },
  {
    id: "sophie-m",
    name: "Sophie M.",
    initial: "S",
    rating: 5,
    verified: false,
    avatarColor: "a4",
    role: {
      fr: "Salariée · Trade le soir",
      en: "Employee · Evening trader",
      es: "Empleada · Trade por la noche",
    },
    text: {
      fr: "Je bosse en CDI, je peux pas suivre des lives à 13h. Avec TradeScaleX je fais 15 min le soir et j'avance vraiment. C'est exactement ce que je cherchais.",
      en: "I have a full-time job, I can't follow lives at 1pm. With TradeScaleX I do 15 minutes in the evening and I'm actually making progress. Exactly what I was looking for.",
      es: "Trabajo a tiempo completo, no puedo seguir directos a la 1 del mediodía. Con TradeScaleX hago 15 minutos por la noche y avanzo de verdad. Es justo lo que buscaba.",
    },
  },
  {
    id: "maxime-d",
    name: "Maxime D.",
    initial: "M",
    rating: 4,
    verified: false,
    avatarColor: "a5",
    role: {
      fr: "Trader débutant",
      en: "Beginner trader",
      es: "Trader principiante",
    },
    text: {
      fr: "J'adore surtout la partie jeux, mais j'aimerais qu'il y en ait plus. Build the Trade m'a accroché direct, je le refais pour le plaisir.",
      en: "I especially love the games section, but I'd love more of them. Build the Trade got me hooked right away, I play it again just for fun.",
      es: "Me encanta sobre todo la parte de juegos, pero me gustaría que hubiera más. Build the Trade me enganchó al instante, lo repito por puro gusto.",
    },
    founderReply: {
      fr: "Merci Maxime ! 3 nouveaux jeux arrivent : Risk Manager, Money Management & Psycho du trader. La plateforme est mise à jour régulièrement.",
      en: "Thanks Maxime! 3 new games are on the way: Risk Manager, Money Management & Trader Psychology. The platform is updated regularly.",
      es: "¡Gracias Maxime! Llegan 3 juegos nuevos: Risk Manager, Money Management y Psicología del trader. La plataforma se actualiza periódicamente.",
    },
  },
  {
    id: "nicolas-r",
    name: "Nicolas R.",
    initial: "N",
    rating: 5,
    verified: false,
    avatarColor: "a1",
    role: {
      fr: "Trader scalp · 4 ans d'XP",
      en: "Scalp trader · 4 yrs XP",
      es: "Trader scalp · 4 años de XP",
    },
    text: {
      fr: "Je suis sur les marchés depuis 4 ans et j'ai jamais trouvé une plateforme qui explique la macro aussi clairement. FOMC, NFP, CPI : tout est limpide.",
      en: "I've been on the markets for 4 years and I've never found a platform that explains macro that clearly. FOMC, NFP, CPI: everything is crystal clear.",
      es: "Llevo 4 años en los mercados y nunca encontré una plataforma que explique la macro tan claramente. FOMC, NFP, CPI: todo es nítido.",
    },
  },
  {
    id: "julien-p",
    name: "Julien P.",
    initial: "J",
    rating: 4,
    verified: false,
    avatarColor: "a2",
    role: {
      fr: "Débutant · Étudiant",
      en: "Beginner · Student",
      es: "Principiante · Estudiante",
    },
    text: {
      fr: "Je m'attendais à un truc plus simple, là c'est presque trop complet pour un débutant. Mais une fois qu'on rentre dedans, c'est addictif.",
      en: "I was expecting something simpler, this is almost too complete for a beginner. But once you get into it, it's addictive.",
      es: "Esperaba algo más simple, esto es casi demasiado completo para un principiante. Pero una vez que entras, es adictivo.",
    },
    founderReply: {
      fr: "Salut Julien, le parcours débutant est conçu pour avancer sans pression. Tu peux faire 1 leçon par jour et c'est largement suffisant pour bien comprendre.",
      en: "Hi Julien, the beginner track is designed to move forward without pressure. One lesson a day is more than enough to really get it.",
      es: "Hola Julien, el recorrido principiante está pensado para avanzar sin presión. Puedes hacer 1 lección al día y es más que suficiente para entenderlo bien.",
    },
  },
  {
    id: "melanie-f",
    name: "Mélanie F.",
    initial: "M",
    rating: 5,
    verified: false,
    avatarColor: "a3",
    role: {
      fr: "Auto-entrepreneure",
      en: "Self-employed",
      es: "Autónoma",
    },
    text: {
      fr: "J'ai arrêté Discord et YouTube depuis. Enfin une plateforme avec une vraie méthode structurée. Plus de signaux foireux, plus de gourous, juste de l'apprentissage.",
      en: "I've quit Discord and YouTube since. Finally a platform with a real structured method. No more sketchy signals, no more gurus, just learning.",
      es: "He dejado Discord y YouTube desde entonces. Por fin una plataforma con un verdadero método estructurado. Se acabaron las señales dudosas y los gurús, solo aprendizaje.",
    },
  },
  {
    id: "aicha-l",
    name: "Aïcha L.",
    initial: "A",
    rating: 4,
    verified: false,
    avatarColor: "a4",
    role: {
      fr: "Trader retail",
      en: "Retail trader",
      es: "Trader retail",
    },
    text: {
      fr: "Dommage que je sois pas tombée dessus il y a 2 ans, j'aurais évité de cramer mon premier compte. Au moins maintenant j'ai les bases solides.",
      en: "Shame I didn't find this 2 years ago, I'd have avoided blowing up my first account. At least now I have solid foundations.",
      es: "Lástima no haberlo encontrado hace 2 años, me habría evitado quemar mi primera cuenta. Al menos ahora tengo bases sólidas.",
    },
    founderReply: {
      fr: "Maintenant t'es là 💪 et c'est le bon timing. Reprends les leçons de risk management, c'est exactement ce qu'il fallait pour éviter ça.",
      en: "You're here now 💪 and the timing is right. Revisit the risk management lessons. That's exactly what you needed to avoid it.",
      es: "Ahora estás aquí 💪 y es el momento adecuado. Vuelve a las lecciones de risk management, es exactamente lo que hacía falta para evitarlo.",
    },
  },
  {
    id: "romain-k",
    name: "Romain K.",
    initial: "R",
    rating: 3,
    verified: false,
    avatarColor: "a5",
    role: {
      fr: "Trader SMC · 2 ans d'XP",
      en: "SMC trader · 2 yrs XP",
      es: "Trader SMC · 2 años de XP",
    },
    text: {
      fr: "Au début j'étais sceptique, encore une plateforme parmi tant d'autres. Les stratégies SMC et ICT sont bien expliquées, mais j'aurais aimé plus d'exemples sur les indices US où je trade le plus. Globalement satisfait quand même.",
      en: "At first I was skeptical, just another platform among many. The SMC and ICT strategies are well explained, but I would have liked more examples on US indices where I trade the most. Overall satisfied nonetheless.",
      es: "Al principio era escéptico, otra plataforma más entre tantas. Las estrategias SMC e ICT están bien explicadas, pero me hubiera gustado más ejemplos sobre los índices US donde más opero. En general satisfecho de todas formas.",
    },
  },
  {
    id: "yann-b",
    name: "Yann B.",
    initial: "Y",
    rating: 3,
    verified: false,
    avatarColor: "a2",
    role: {
      fr: "Trader ICT · 2 ans d'XP",
      en: "ICT Trader · 2 yrs XP",
      es: "Trader ICT · 2 años de experiencia",
    },
    text: {
      fr: "Les leçons et les jeux sont bien faits, j'ai appris des choses même après 2 ans d'ICT. Ce qui me manque vraiment c'est l'aspect communauté : pas de chat, pas d'espace pour échanger avec d'autres traders ou poser des questions. Du coup tu apprends seul. J'espère que ça viendra.",
      en: "The lessons and games are well made, I learned things even after 2 years of ICT. What I really miss is the community aspect: no chat, no space to exchange with other traders or ask questions. So you learn on your own. I hope it's coming.",
      es: "Las lecciones y los juegos están bien hechos, aprendí cosas incluso después de 2 años de ICT. Lo que realmente me falta es el aspecto comunidad: no hay chat, ni espacio para intercambiar con otros traders o hacer preguntas. Así que aprendes solo. Espero que llegue.",
    },
  },
  {
    id: "david-t",
    name: "David T.",
    initial: "D",
    rating: 4,
    verified: false,
    avatarColor: "a1",
    role: {
      fr: "Trader ICT · 1 an d'XP",
      en: "ICT trader · 1 yr XP",
      es: "Trader ICT · 1 año de XP",
    },
    text: {
      fr: "Je connaissais la théorie ICT depuis longtemps, mais j'arrivais jamais à l'appliquer en réel. Les jeux et les exemples concrets m'ont fait franchir le cap. Je sais enfin reconnaître les setups en live.",
      en: "I'd known the ICT theory for a long time, but I could never apply it in real conditions. The games and concrete examples got me across the gap. I can finally recognize setups live.",
      es: "Conocía la teoría ICT desde hace mucho, pero nunca lograba aplicarla en real. Los juegos y los ejemplos concretos me hicieron dar el salto. Por fin sé reconocer los setups en vivo.",
    },
    founderReply: {
      fr: "C'est exactement pourquoi j'ai créé Build the Trade. Trop de gens savent la théorie mais bloquent sur l'exécution. Continue comme ça David 💪",
      en: "That's exactly why I built Build the Trade. Too many people know the theory but get stuck on execution. Keep it up David 💪",
      es: "Justo por eso creé Build the Trade. Demasiada gente sabe la teoría pero se bloquea en la ejecución. Sigue así David 💪",
    },
  },
  {
    id: "antoine-m",
    name: "Antoine M.",
    initial: "A",
    rating: 4,
    verified: false,
    avatarColor: "a3",
    role: {
      fr: "Trader Price Action · 4 ans d'XP",
      en: "Price Action Trader · 4 yrs XP",
      es: "Trader Price Action · 4 años de experiencia",
    },
    text: {
      fr: "J'ai vraiment kiffé Build the Trade, c'est addictif et bien pensé. Par contre, en fonction de ta façon de trader, ça ne reflète pas toujours la réalité de tes setups. Moi je fais du Price Action pur, certaines mécaniques du jeu collent pas à 100% à ma méthode. Ça reste un super outil pour apprendre la structure d'un trade.",
      en: "I really enjoyed Build the Trade, it's addictive and well designed. That said, depending on your trading style, it doesn't always reflect your actual setups. I trade pure Price Action and some game mechanics don't match my method 100%. Still a great tool to learn trade structure.",
      es: "Build the Trade me gustó mucho, es adictivo y bien pensado. Eso sí, según tu forma de operar, no siempre refleja la realidad de tus setups. Yo opero Price Action puro y algunas mecánicas del juego no coinciden al 100% con mi método. Sigue siendo una excelente herramienta para aprender la estructura de un trade.",
    },
  },
];
