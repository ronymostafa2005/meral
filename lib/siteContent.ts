import { AWARDS, CAPABILITIES, CLIENT_LOGOS, PROJECTS, SERVICES } from "../data/portfolioData";
import type { ArchiveItem, AwardItem, CapabilityItem, Project } from "../types/portfolio";

export type ServiceIcon = "direction" | "campaigns" | "voice" | "print";
export type FontChoice = "display" | "sans" | "mono";

export interface ProgramItem {
  id: string;
  title: string;
  icon: string;
  to: string;
}

export interface ServiceItem {
  icon: ServiceIcon;
  title: string;
  detail: string;
}

/** One of the numbered disciplines along the foot of the hero card. */
export interface HeroService {
  number: string;
  title: string;
}

export interface NamedLink {
  name: string;
  url: string;
}

export interface SiteContent {
  brand: {
    name: string;
    logoWord: string;
    logoImage: string;
    accent: string;
    accentHot: string;
    background: string;
    text: string;
    headlineFont: FontChoice;
    bodyFont: FontChoice;
  };
  nav: {
    works: string;
    about: string;
    awards: string;
    talk: string;
    cta: string;
    mobileWorks: string;
    mobileAbout: string;
    mobileAwards: string;
    mobileTalk: string;
  };
  intro: {
    brand: string;
    discipline: string;
    enter: string;
    leftA: string;
    leftB: string;
    rightA: string;
    rightB: string;
    badge: string;
    note: string;
    images: string[];
  };
  hero: {
    leftLabel: string;
    rightLabel: string;
    eyebrow: string;
    greeting: string;
    headline: string;
    headlineAccent: string;
    statementHeadline: string;
    statementBody: string;
    body: string;
    facts: string[];
    services: HeroService[];
    clientsLine: string;
    portrait: string;
    portraitAlt: string;
    name: string;
    roleLine1: string;
    roleLine2: string;
    cta: string;
    toolsLine: string;
  };
  programs: {
    caption: string;
    items: ProgramItem[];
  };
  practice: {
    kicker: string;
    line1: string;
    highlight: string;
    line2: string;
    body: string;
    services: ServiceItem[];
  };
  works: {
    kicker: string;
    titleA: string;
    titleB: string;
    intro: string;
    projects: Project[];
  };
  archive: {
    kicker: string;
    titleA: string;
    titleB: string;
    intro: string;
    /** Cards per page, in the dashboard editor and on the site. */
    perPage: number;
    items: ArchiveItem[];
  };
  about: {
    kicker: string;
    headline: string;
    paragraphA: string;
    paragraphB: string;
    practiceLabel: string;
    practiceNote: string;
    capabilities: CapabilityItem[];
    clientsLabel: string;
    clientsNote: string;
    clients: string[];
  };
  awards: {
    kicker: string;
    headline: string;
    intro: string;
    items: AwardItem[];
  };
  talk: {
    kicker: string;
    titleA: string;
    titleB: string;
    intro: string;
    greeting: string;
    windowLabel: string;
    status: string;
  };
  footer: {
    kicker: string;
    lineA: string;
    lineB: string;
    cta: string;
    practiceLabel: string;
    practiceBody: string;
    linksLabel: string;
    links: NamedLink[];
    ethosLabel: string;
    ethosBody: string;
    status: string;
    credit: string;
  };
}

export const defaultContent: SiteContent = {
  brand: {
    name: "Meral",
    logoWord: "MERAL",
    logoImage: "",
    // The hero stage builds its atmosphere out of these, mixing the accent
    // down to the page background, so changing them re-tints the hero.
    accent: "#c4a574",
    // The hero card runs hot on this one; everything below it stays on the
    // gold accent above.
    accentHot: "#f95721",
    background: "#050505",
    text: "#ededed",
    headlineFont: "display",
    bodyFont: "sans",
  },
  nav: {
    works: "WORKS",
    about: "ABOUT",
    awards: "AWARDS",
    talk: "START A PROJECT",
    cta: "LET'S TALK",
    mobileWorks: "Featured Works",
    mobileAbout: "About",
    mobileAwards: "The selection",
    mobileTalk: "Start A Project",
  },
  intro: {
    brand: "MERAL",
    discipline: "GRAPHIC DESIGN",
    enter: "ENTER",
    leftA: "BRAND",
    leftB: "CRAFT",
    rightA: "WHY",
    rightB: "THERE",
    badge: "KV.2026",
    note: "Graphic design for real estate campaigns. Selected work only.",
    images: [
      "/work/rise-1.jpg",
      "/work/pyramids.jpg",
      "/work/taj-tower.jpg",
      "/work/village.jpg",
      "/work/silver-sands.jpg",
      "/work/unseen.jpg",
    ],
  },
  hero: {
    leftLabel: "Graphic designer",
    rightLabel: "Real estate campaigns",
    eyebrow: "Meral",
    greeting: "Hey, I'm a",
    headline: "Creative",
    headlineAccent: "Director",
    statementHeadline: "Great design should feel invisible.",
    statementBody: "From logo to language, I build brands that connect and convert.",
    body: "Meral is a graphic designer. She builds the visual language of a development before the listing does: one place, one line, and a picture that explains why it is worth choosing.",
    facts: ["Art direction", "Campaign design", "Print & brand voice"],
    services: [
      { number: "01", title: "Brand Strategy" },
      { number: "02", title: "Brand Identity Design" },
      { number: "03", title: "Packaging Design" },
      { number: "04", title: "Creative Direction" },
    ],
    clientsLine: "Trusted by brands I've helped shape",
    portrait: "/profile/2.png",
    portraitAlt: "Portrait of Meral, graphic designer",
    name: "Meral",
    roleLine1: "Art director",
    roleLine2: "Campaign design",
    cta: "VIEW THE WORK",
    toolsLine: "Photoshop · Illustrator · InDesign · After Effects · Premiere · Lightroom · Figma",
  },
  programs: {
    caption: "Design tools in motion",
    items: [
      { id: "ae", title: "After Effects", icon: "/icons/ae.png", to: "#9999FF" },
      { id: "pr", title: "Premiere", icon: "/icons/pr.png", to: "#9999FF" },
      { id: "ps", title: "Photoshop", icon: "/icons/ps.png", to: "#31A8FF" },
      { id: "ai", title: "Illustrator", icon: "/icons/ai.png", to: "#FF9A00" },
      { id: "id", title: "InDesign", icon: "/icons/id.png", to: "#FF3366" },
      { id: "lr", title: "Lightroom", icon: "/icons/lr.png", to: "#31A8FF" },
      { id: "fg", title: "Figma", icon: "/icons/fg.png", to: "#A259FF" },
    ],
  },
  practice: {
    kicker: "01 • PRACTICE",
    line1: "The work is for developments that need a point of view.",
    highlight: "Not a listing.",
    line2: "A campaign with one sentence, one picture, and a mark that knows when to step back.",
    body: "Meral designs the campaigns clients see first: key visuals, brand lines, and print for real estate. This page shows that work only.",
    services: SERVICES.map((service) => ({ ...service })),
  },
  works: {
    kicker: "02 • SELECTED WORK",
    titleA: "FEATURED",
    titleB: "PROJECTS",
    intro: "Campaigns and brand pieces for Lux Realty and Rise Tower Developments. Only Meral’s work.",
    projects: PROJECTS.map((project) => ({ ...project, galleryImages: [...project.galleryImages], tags: [...project.tags], results: [...project.results], role: [...project.role] })),
  },
  archive: {
    kicker: "02B • THE FULL ARCHIVE",
    titleA: "ALL",
    titleB: "PROJECTS",
    intro:
      "Everything else in the drawer: campaign frames, seasonal keys, and brand pieces, newest first.",
    // The grid runs three to a row on a wide screen, so nine fills three rows.
    // The owner picks any size from the dashboard.
    perPage: 9,
    items: [
      {
        id: "archive-1",
        title: "Rise Tower",
        titleAr: "رايز تاور",
        category: "Campaign Design",
        description: "Editorial frames and a quiet navy-and-gold voice for the tower.",
        images: ["/work/rise-1.jpg", "/work/rise-2.jpg", "/work/rise-3.jpg"],
      },
      {
        id: "archive-2",
        title: "Pyramids City",
        titleAr: "بيراميدز سيتي",
        category: "Campaign Design",
        description: "A key visual that puts the place first and the offer second.",
        images: ["/work/pyramids.jpg"],
      },
      {
        id: "archive-3",
        title: "Taj Tower 2",
        titleAr: "تاج تاور ٢",
        category: "Campaign Design",
        description: "Night tower visual, printed and rolled out across social.",
        images: ["/work/taj-tower.jpg"],
      },
      {
        id: "archive-4",
        title: "Village de la Capital",
        titleAr: "فيلدج دي لا كابيتال",
        category: "Campaign Design",
        description: "Warm daylight frames for a development that sells calm.",
        images: ["/work/village.jpg"],
      },
      {
        id: "archive-5",
        title: "Silver Sands",
        titleAr: "سيلفر ساندز",
        category: "Campaign Design",
        description: "Coastal palette, one line, and a mark that steps back.",
        images: ["/work/silver-sands.jpg"],
      },
      {
        id: "archive-6",
        title: "Lux Realty — Brand Voice",
        titleAr: "لوكس ريلتي — صوت العلامة",
        category: "Brand Voice",
        description: "The sentence the brand repeats, and the type that carries it.",
        images: ["/work/unseen.jpg", "/work/clarity.jpg"],
      },
    ],
  },
  about: {
    kicker: "03 • MERAL • GRAPHIC DESIGN",
    headline: "Campaigns are built to be read once. The place comes first, the offer second, and nothing extra stays in the frame.",
    paragraphA: "Meral is a graphic designer working on real estate campaigns. The work here is hers: art direction, key visuals, brand lines, and print for Lux Realty and Rise Tower Developments.",
    paragraphB: "Each project is a small system. A name, a sentence, a photograph, and a mark. The same discipline runs from a night tower visual to a printed sheet.",
    practiceLabel: "// PRACTICE",
    practiceNote: "ART DIRECTION TO PRINT",
    capabilities: CAPABILITIES.map((item) => ({ ...item, tags: [...item.tags] })),
    clientsLabel: "// CLIENTS IN THIS SELECTION",
    clientsNote: "SELECTED BRANDS",
    clients: [...CLIENT_LOGOS],
  },
  awards: {
    kicker: "04 • WHAT IS ON VIEW",
    headline: "Six campaigns. Two brands. Nothing else on this page.",
    intro: "The selection is limited to work Meral designed for Lux Realty and Rise Tower Developments.",
    items: AWARDS.map((item) => ({ ...item })),
  },
  talk: {
    kicker: "05 • PROJECT INQUIRY • MERAL",
    titleA: "LET’S TALK",
    titleB: "IDEAS",
    intro: "A short brief is enough. Meral reviews campaign, brand, and print inquiries directly.",
    greeting: "Hello. This is Meral’s inquiry desk. Share the project, the timeline, and what the campaign needs to say. You’ll get a plain scope note back on this page.",
    windowLabel: "meral-inquiry",
    status: "LIVE STUDIO DISPATCH",
  },
  footer: {
    kicker: "// MERAL",
    lineA: "THE WORK",
    lineB: "SPEAKS FIRST",
    cta: "Start a project",
    practiceLabel: "// PRACTICE",
    practiceBody: "Independent graphic design. Campaigns, art direction, and print for real estate brands.",
    linksLabel: "// ON THIS PAGE",
    links: [
      { name: "Selected work", url: "#works" },
      { name: "Practice", url: "#about" },
      { name: "Start a project", url: "#talk" },
    ],
    ethosLabel: "// ETHOS • BOOKINGS",
    ethosBody: "Graphic design for developments and the brands behind them. This portfolio shows Meral’s selected campaigns only.",
    status: "Open for campaign and brand commissions",
    credit: "ART DIRECTION • CAMPAIGN • PRINT",
  },
};

export function safeColor(value: string | undefined, fallback: string) {
  return value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeContent(saved: unknown): SiteContent {
  const source = isRecord(saved) ? saved : {};
  const merged = structuredClone(defaultContent);

  const assign = (target: Record<string, unknown>, patch: Record<string, unknown>) => {
    for (const key of Object.keys(target)) {
      const next = patch[key];
      const current = target[key];
      if (Array.isArray(current)) {
        if (Array.isArray(next)) target[key] = next;
        continue;
      }
      if (isRecord(current) && isRecord(next)) {
        assign(current, next);
        continue;
      }
      if (typeof next === typeof current && next !== undefined) target[key] = next;
    }
  };

  assign(merged as unknown as Record<string, unknown>, source);
  merged.brand.accent = safeColor(merged.brand.accent, defaultContent.brand.accent);
  merged.brand.accentHot = safeColor(merged.brand.accentHot, defaultContent.brand.accentHot);
  merged.brand.background = safeColor(merged.brand.background, defaultContent.brand.background);
  merged.brand.text = safeColor(merged.brand.text, defaultContent.brand.text);
  if (!["display", "sans", "mono"].includes(merged.brand.headlineFont)) merged.brand.headlineFont = "display";
  if (!["display", "sans", "mono"].includes(merged.brand.bodyFont)) merged.brand.bodyFont = "sans";
  merged.works.projects = (merged.works.projects || []).map((project, index) => ({
    ...project,
    id: project?.id || `work-${index + 1}`,
    slug: project?.slug || project?.id || `work-${index + 1}`,
    title: project?.title || "Untitled",
    client: project?.client || "Client",
    year: project?.year || "",
    category: project?.category || "Campaign Design",
    tags: Array.isArray(project?.tags) ? project.tags : [],
    headline: project?.headline || "",
    summary: project?.summary || "",
    challenge: project?.challenge || "",
    solution: project?.solution || "",
    results: Array.isArray(project?.results) ? project.results : [],
    coverImage: project?.coverImage || "/work/rise-1.jpg",
    galleryImages: Array.isArray(project?.galleryImages) ? project.galleryImages : [],
    featured: project?.featured !== false,
    accentColor: safeColor(project?.accentColor, "#c4a574"),
    role: Array.isArray(project?.role) ? project.role : [],
    clientLogo: project?.clientLogo || "",
  }));
  merged.hero.services = (merged.hero.services || []).map((service, index) => ({
    number: service?.number || String(index + 1).padStart(2, "0"),
    title: service?.title || "",
  }));
  merged.archive.items = (merged.archive.items || []).map((item, index) => ({
    id: item?.id || `archive-${index + 1}`,
    title: item?.title || "Untitled",
    titleAr: typeof item?.titleAr === "string" ? item.titleAr : "",
    category: item?.category || "",
    description: item?.description || "",
    images: Array.isArray(item?.images) ? item.images.filter(Boolean) : [],
  }));
  // Guard the page size: 0 or a negative would divide the grid into no pages.
  merged.archive.perPage = Math.min(
    48,
    Math.max(1, Math.round(Number(merged.archive.perPage) || defaultContent.archive.perPage)),
  );
  const icons = new Set(["direction", "campaigns", "voice", "print"]);
  merged.practice.services = (merged.practice.services || []).map((service) => ({
    icon: icons.has(service?.icon) ? service.icon : "direction",
    title: service?.title || "",
    detail: service?.detail || "",
  }));
  return merged;
}
