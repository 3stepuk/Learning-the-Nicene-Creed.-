import { Card } from "./types";

export const CREED_CARDS: Card[] = [
  {
    id: 1,
    phaseId: 1,
    phaseLabel: "Phase 1",
    themeTitle: "The Father",
    cue: "I believe in one God…",
    response: "…the Father almighty, maker of heaven and earth, of all things visible and invisible.",
    note: "This card establishes the foundational posture of Christian belief: absolute trust (Creed comes from 'Credo' - I believe) in God as the unique Source, Sovereign, Father, and Creator of all domains of existence, material and spiritual.",
    imageThemeHint: "cosmic-abstractions"
  },
  {
    id: 2,
    phaseId: 2,
    phaseLabel: "Phase 2",
    themeTitle: "The Son — Identity & Origin",
    cue: "I believe in one Lord Jesus Christ…",
    response: "…the Only Begotten Son of God, born of the Father before all ages.",
    note: "Begins the Christological phase, asserting the pre-eternal relationship of the Son to the Father. He is 'Only Begotten' (Monogenes), meaning unique in nature, not created.",
    imageThemeHint: "luminous-gold"
  },
  {
    id: 3,
    phaseId: 2,
    phaseLabel: "Phase 2",
    themeTitle: "The Son — Identity & Origin",
    cue: "God from God, Light from Light…",
    response: "…true God from true God, begotten, not made, consubstantial with the Father.",
    note: "This phrase was targeted against Arianism. 'Consubstantial' (Homoousios) asserts that the Son shares the exact identical divine essence/nature with the Father.",
    imageThemeHint: "bursting-light"
  },
  {
    id: 4,
    phaseId: 2,
    phaseLabel: "Phase 2",
    themeTitle: "The Son — Identity & Origin",
    cue: "…consubstantial with the Father…",
    response: "…through him all things were made.",
    note: "Attributes creation to the Logos, in alignment with John 1:3 ('Through him all things were made; without him nothing was made that has been made').",
    imageThemeHint: "divine-creation"
  },
  {
    id: 5,
    phaseId: 2,
    phaseLabel: "Phase 2 · Continued",
    themeTitle: "The Son — Incarnation",
    cue: "For us men and for our salvation…",
    response: "…he came down from heaven, and by the Holy Spirit was incarnate of the Virgin Mary, and became man.",
    note: "Declares the miracle of the Incarnation. God entered humanity for humankind's salvation, marrying the spiritual and the physical fully through His humble birth.",
    imageThemeHint: "glowing-hills"
  },
  {
    id: 6,
    phaseId: 2,
    phaseLabel: "Phase 2 · Continued",
    themeTitle: "The Son — Passion, Death & Resurrection",
    cue: "For our sake he was crucified under Pontius Pilate…",
    response: "…he suffered death and was buried, and rose again on the third day in accordance with the Scriptures.",
    note: "Anchors the gospel in human history ('Pontius Pilate') and emphasizes the bodily death, historical burial, and miraculous physical resurrection of Christ.",
    imageThemeHint: "mountaintop-dawn"
  },
  {
    id: 7,
    phaseId: 2,
    phaseLabel: "Phase 2 · Continued",
    themeTitle: "The Son — Ascension & Second Coming",
    cue: "He ascended into heaven…",
    response: "…and is seated at the right hand of the Father.",
    note: "Asserts the glorification and cosmic rule of the resurrected human body of Christ at completion of His earthly journey, sitting in the ultimate seat of power.",
    imageThemeHint: "shining-ether"
  },
  {
    id: 8,
    phaseId: 2,
    phaseLabel: "Phase 2 · Continued",
    themeTitle: "The Son — Ascension & Second Coming",
    cue: "He will come again in glory…",
    response: "…to judge the living and the dead and his kingdom will have no end.",
    note: "The Eschatological promise: Christ will return as sovereign judge over all human history, and His divine kingdom of peace and love will be eternal.",
    imageThemeHint: "sovereign-throne"
  },
  {
    id: 9,
    phaseId: 3,
    phaseLabel: "Phase 3",
    themeTitle: "The Holy Spirit",
    cue: "I believe in the Holy Spirit, the Lord, the giver of life…",
    response: "…who proceeds from the Father and the Son.",
    note: "Declares the divinity of the Holy Spirit as 'Lord' and 'Giver of life'. Note: Western liturgies contain the 'Filioque' ('and the Son'), whereas Eastern Orthodox liturgies historically recite 'who proceeds from the Father.' This app welcomes all configurations!",
    imageThemeHint: "ethereal-winds"
  },
  {
    id: 10,
    phaseId: 3,
    phaseLabel: "Phase 3",
    themeTitle: "The Holy Spirit",
    cue: "…who proceeds from the Father and the Son…",
    response: "…who with the Father and the Son is adored and glorified, who has spoken through the prophets.",
    note: "Asserts equal worship (co-adoration) of the Holy Spirit as part of the Holy Trinity, and recognizes His voice in ancient Hebrew prophecies.",
    imageThemeHint: "golden-tapestry"
  },
  {
    id: 11,
    phaseId: 4,
    phaseLabel: "Phase 4",
    themeTitle: "The Church",
    cue: "I believe in one…",
    response: "…holy, catholic and apostolic Church.",
    note: "Lists the Four Marks of the Church: One (Unity under Christ), Holy (consecrated by the Holy Spirit), Catholic (universal, global, and whole across all lands and times), and Apostolic (carrying the direct message and succession of the original Apostles).",
    imageThemeHint: "cathedrals"
  },
  {
    id: 12,
    phaseId: 4,
    phaseLabel: "Phase 4 · Continued",
    themeTitle: "Baptism & Forgiveness",
    cue: "I confess one Baptism…",
    response: "…for the forgiveness of sins.",
    note: "Affirms that holy Baptism is the unique sacrament of initiation and cosmic washing, reconciling humanity with God once and for all.",
    imageThemeHint: "flowing-water"
  },
  {
    id: 13,
    phaseId: 4,
    phaseLabel: "Phase 4 · Final",
    themeTitle: "The Last Things",
    cue: "…and I look forward to…",
    response: "…the resurrection of the dead and the life of the world to come. Amen.",
    note: "The grand climax of faith: looking forward with joy to body resurrection and eternal life in the restored cosmos. 'Amen' translates from Hebrew as 'So be it' or 'Truly'.",
    imageThemeHint: "new-creation"
  }
];

export const THEOLOGICAL_GLOSSARY = [
  {
    term: "Consubstantial (Homoousios)",
    definition: "Of the exact same essence, substance, or being.",
    theology: "Defined at the Council of Nicaea (325 AD) to declare that Jesus Christ, the Son, is fully divine and shares the identical essence (ousia) as God the Father, refuting claims that He was a lesser created god."
  },
  {
    term: "Only Begotten (Monogenes)",
    definition: "The unique, single-of-its-kind generation of the Son by the Father.",
    theology: "Indicates that Jesus is eternal and is not created or formed out of nothing like the physical world. He shares the direct father-begetting nature, existing timelessly before anything else came to be."
  },
  {
    term: "Incarnate",
    definition: "Embodied in human flesh, taking on a physical human body.",
    theology: "Refers to the core mystery that God the Logos assumed full human nature (body, mind, and soul) while remaining fully God, becoming a real historic human in Jesus of Nazareth through the Virgin Mary."
  },
  {
    term: "Filioque",
    definition: "Latin phrase meaning 'and [from] the Son'.",
    theology: "Added in the Western Church to assert the Son's joint role in the procession of the Holy Spirit. This addition became a major historical point of theological discussion between Western Catholicism and Eastern Orthodoxy, which maintains the original Nicene formula of procession exclusively 'from the Father' (John 15:26)."
  },
  {
    term: "Catholic (Katholikos)",
    definition: "According to the whole, universal, global, or complete.",
    theology: "In the Creed, 'catholic' is spelt with a small 'c' and refers to the fullness of faith spread throughout the entire world, undivided, and intended for every human being across all times, rather than a single specific institution."
  },
  {
    term: "Apostolic",
    definition: "Connected to or carrying forward the message of the twelve Apostles.",
    theology: "Indicates that the faith has not changed, keeping directly to the foundations first built by the Apostles who walked with Christ and were sent forth with His authority."
  },
  {
    term: "Amen",
    definition: "A Hebrew word meaning 'it is true', 'certainly', or 'strictly verified'.",
    theology: "Used historically at the end of prayers and liturgies to signify absolute solemn agreement or affirmation by the entire community of believers."
  }
];
