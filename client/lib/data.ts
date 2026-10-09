// Static content, plus the fallback for what the API serves (see lib/site.ts).

export const chip = (h: number) => `oklch(0.8 0.12 ${h})`;
export const C = { coral: chip(25), lilac: chip(300), green: chip(150), yellow: chip(85), blue: chip(250) };

export const SITE = {
  name: "Atharv Doiphode",
  email: "doiphodeatharva750@gmail.com",
  location: "Pune, India",
  resume: "/resume.pdf",
  links: {
    github: "https://github.com/atharvdoiphode",
    linkedin: "https://linkedin.com/in/atharv-doiphode-07045125a",
    productmotion: "https://www.instagram.com/productmotionai",
    johnfitness: "https://www.instagram.com/johnfitnessforu",
    weblinq: "https://www.instagram.com/weblinq_4",
  },
};

export const heroPhrases = [
  "full-stack developer from Pune, India",
  "building websites for local businesses",
  "making AI videos for brands",
  "learning agentic AI with Claude Code",
];

export const introText = "I build things people actually use.";

export const services = [
  { n: "01", glyph: "</>", chip: C.coral, title: "Websites for local businesses", short: "Websites for local businesses", desc: "Fast, mobile-first sites with ordering, booking and an admin panel you can run yourself." },
  { n: "02", glyph: "▶", chip: C.lilac, title: "AI videos for brands", short: "AI videos: cartoon, UGC, product", desc: "Cartoon, UGC-style and product videos, made with AI and cut for Reels." },
  { n: "03", glyph: "▦", chip: C.green, title: "Excel trackers & dashboards", short: "Excel trackers and dashboards", desc: "Client trackers and dashboards that replace scattered sheets and notes." },
  { n: "04", glyph: "@", chip: C.yellow, title: "Instagram business setup", short: "Instagram business setup", desc: "Profile, bio, highlights and a posting setup for small businesses." },
];

export const roles = [
  { n: "01", word: "DEVELOPER", lines: ["DEVELOPER"], chip: C.coral },
  { n: "02", word: "AI VIDEO CREATOR", lines: ["AI VIDEO", "CREATOR"], chip: C.lilac },
  { n: "03", word: "UI/UX DESIGNER", lines: ["UI/UX", "DESIGNER"], chip: C.green },
  { n: "04", word: "LEARNER", lines: ["LEARNER"], chip: C.yellow },
];

export const barcode = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 1, 3, 2, 1, 4, 1, 1, 2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 2];

// Only real numbers. `to` is what the counter ends on.
export const stats = [
  { to: 8.28, decimals: 2, suffix: "", label: "CGPA in B.Tech Computer Science Engineering, VIIT Pune" },
  { to: 3, decimals: 0, suffix: "", label: "full-stack apps built: Oya Kekars, CutPro and PeerLearn" },
  { to: 30, decimals: 0, suffix: "k", label: "wireless channel samples tested in my DROO research" },
  { to: 4, decimals: 0, suffix: "", label: "freelance clients in my first month: websites + AI video" },
];

export const tools = ["Next.js", "React", "Node.js", "MongoDB", "TypeScript", "Python", "PyTorch", "Tailwind", "Framer Motion", "Cloudinary", "Google Flow", "Claude", "ChatGPT", "Gemini", "Figma"];
export const toolDots = [C.coral, C.lilac, C.green, C.yellow];

export type Category = "Websites" | "AI Videos" | "Excel" | "Research";
export const categories: Category[] = ["Websites", "AI Videos", "Excel", "Research"];

const stripe = (a: string, b: string) => `repeating-linear-gradient(135deg,${a} 0 1px,${b} 1px 10px)`;
export const covers: Record<Category, string> = {
  Websites: stripe("#E9C9B9", "#F2D9CC"),
  "AI Videos": stripe("#D5C8F0", "#E3D9F6"),
  Excel: stripe("#BFE3CB", "#D3EDDB"),
  Research: stripe("#EADBA6", "#F2E7BF"),
};

export interface ProjectLink { label: string; href: string }
export interface Project {
  id: string;
  cat: Category;
  title: string;
  desc: string;
  tags: string[];
  ph: string; // placeholder caption until a real cover is uploaded
  long: string;
  links: ProjectLink[]; // first = primary button, second = outline button
  coverUrl?: string; // uploaded from /admin, else the bundled default below
  coverPos?: string; // CSS background-position for the 4:3 crop of a bundled default
  videoUrl?: string;
  featured?: boolean;
}

// Shown until a photo is uploaded in /admin (an upload always wins).
export const defaultPhotos = {
  photoUrl: "/images/badge-headshot.jpg",
  introPhotoUrl: "/images/intro-portrait.jpg",
  aboutPhotoUrl: "/images/about-seated.jpg",
};

// Bundled project covers, keyed by project title, shown until a cover is uploaded in /admin.
export const defaultCovers: Record<string, { url: string; pos?: string }> = {
  "Oya Kekars": { url: "/images/projects/oya-kekars.png", pos: "50% 52%" },
  CutPro: { url: "/images/projects/cutpro.png" },
  PeerLearn: { url: "/images/projects/peerlearn.png" },
  "ProductMotion AI": { url: "/images/projects/productmotion.png", pos: "50% 30%" },
  "John's Journey": { url: "/images/projects/johns-journey.png", pos: "50% 10%" },
  "Business client tracker": { url: "/images/projects/client-tracker.png" },
  "Personal habit tracker": { url: "/images/projects/habit-tracker.png" },
  "Energy-Aware DROO": { url: "/images/projects/droo.png" },
};

/** Fills in the bundled cover for a project that has no uploaded one. */
export const withDefaultCover = (p: Project): Project => {
  if (p.coverUrl) return p;
  const d = defaultCovers[p.title];
  return d ? { ...p, coverUrl: d.url, coverPos: d.pos } : p;
};

export const projects: Project[] = [
  {
    id: "oya-kekars", cat: "Websites", title: "Oya Kekars",
    desc: "Bakery e-commerce with WhatsApp ordering and a JWT admin.",
    tags: ["Next.js", "MongoDB", "JWT", "WhatsApp"], ph: "storefront screenshot",
    long: "An online store for a home bakery. Customers browse the menu and send their order straight to WhatsApp; the owner manages products and orders from a JWT-secured admin panel.",
    links: [{ label: "Visit site", href: "https://oya-kekars.vercel.app/" }, { label: "View code", href: "https://github.com/AtharvDoiphode/OYA-KEKARS-" }],
  },
  {
    id: "cutpro", cat: "Websites", title: "CutPro",
    desc: "Salon appointments with a live queue.",
    tags: ["Appointments", "Live queue"], ph: "booking flow screenshot",
    long: "A booking site for salons. Clients book a slot and can see the live queue, so they arrive when their chair is ready.",
    links: [{ label: "View code", href: "https://github.com/AtharvDoiphode/CutPro" }],
  },
  {
    id: "peerlearn", cat: "Websites", title: "PeerLearn",
    desc: "Real-time learning platform built on WebRTC.",
    tags: ["WebRTC", "Real-time"], ph: "session room screenshot",
    long: "A platform where students learn together in real time, with peer-to-peer video sessions over WebRTC.",
    links: [{ label: "View code", href: "https://github.com/AtharvDoiphode/peerlearn" }],
  },
  {
    id: "productmotion", cat: "AI Videos", title: "ProductMotion AI",
    desc: "AI product reels for brands.",
    tags: ["Product", "Reels", "AI video"], ph: "reel still · 9:16",
    long: "Short product reels for brands, generated and edited with AI video tools and cut for Instagram.",
    links: [{ label: "Watch reels", href: SITE.links.productmotion }, { label: "Work with me", href: "/contact" }],
  },
  {
    id: "johns-journey", cat: "AI Videos", title: "John's Journey",
    desc: "An animated AI fitness series.",
    tags: ["Cartoon", "Series", "Fitness"], ph: "episode still · 9:16",
    long: "An animated fitness series following John, made episode by episode with AI tools.",
    links: [{ label: "Watch series", href: SITE.links.johnfitness }, { label: "Work with me", href: "/contact" }],
  },
  {
    id: "client-tracker", cat: "Excel", title: "Business client tracker",
    desc: "Dashboard for tracking clients, work and payments.",
    tags: ["Excel", "Dashboard"], ph: "dashboard screenshot",
    long: "A client tracker with a summary dashboard for a small business, built in Excel.",
    links: [{ label: "Request one", href: "/contact" }],
  },
  {
    id: "habit-tracker", cat: "Excel", title: "Personal habit tracker",
    desc: "Daily habit tracking with a progress dashboard.",
    tags: ["Excel", "Dashboard"], ph: "tracker screenshot",
    long: "A personal habit tracker with daily check-ins and a dashboard that shows progress over time.",
    links: [{ label: "Request one", href: "/contact" }],
  },
  {
    id: "droo", cat: "Research", title: "Energy-Aware DROO",
    desc: "Energy-aware offloading for mobile edge computing.",
    tags: ["PyTorch", "Python", "MEC"], ph: "results chart",
    long: "Research on energy-aware deep reinforcement learning for computation offloading in mobile edge computing, trained on 30k channel samples.",
    links: [{ label: "Get in touch", href: "/contact" }],
  },
];

// Mirrors the résumé (public/resume.pdf), newest first.
export const experience = [
  { when: "May 2026 – now", org: "Oya Kekars · bakery client", title: "Freelance full-stack developer", desc: "Built and launched a live bakery store with WhatsApp ordering, a JWT-secured admin panel and Cloudinary image uploads. Worked with the owner from brief to launch.", dot: C.coral },
  { when: "2026 – now", org: "ProductMotion AI", title: "Founder", desc: "AI product and promo videos for 3–4 business clients: brief, scripts and prompts, drafts and revisions on agreed timelines.", dot: C.lilac },
  { when: "Feb – May 2026", org: "Mobile edge computing", title: "Research internship", desc: "Built an energy-aware extension of the DROO deep reinforcement learning algorithm. Tested on 30,000 wireless channel samples at ~0.03 s per channel, and compared against GA, ACO and DQN.", dot: C.yellow },
  { when: "Jan – May 2025", org: "IBM", title: "Full Stack Software Developer", desc: "Professional certificate in full-stack web development.", dot: C.blue },
  { when: "2026", org: "VIIT, Pune", title: "B.Tech, Computer Science Engineering", desc: "Vishwakarma Institute of Information Technology. CGPA 8.28.", dot: C.green },
];

// Fallback when the API is down; the live list is edited in /admin > Settings.
// An item ending in "(familiar)" renders with a dashed outline, matching the résumé's "Familiar:" notes.
export const skills = [
  { group: "Languages", items: ["Java", "Python", "JavaScript (ES6+)", "TypeScript", "SQL", "HTML5 / CSS3"] },
  { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap", "Framer Motion"] },
  { group: "Backend", items: ["Node.js", "Express.js", "REST APIs", "JWT auth", "Socket.IO", "WebRTC"] },
  { group: "Databases", items: ["MongoDB", "MySQL"] },
  { group: "AI / ML", items: ["PyTorch", "Deep reinforcement learning", "Prompt engineering", "AI video generation", "Scikit-learn (familiar)"] },
  { group: "Data analytics", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn (familiar)", "Power BI (familiar)"] },
  { group: "Tools & deployment", items: ["Git", "GitHub", "Postman", "Vercel", "Cloudinary", "Figma", "Excel", "Docker (familiar)"] },
  { group: "AI tools", items: ["Claude", "ChatGPT", "Gemini", "Google Flow"] },
];

// PDFs live in public/certificates. `verify` is the issuer's public check page, where one exists.
export interface Certificate { title: string; issuer: string; via?: string; date: string; file: string; verify?: string; c: string }
export const certificates: Certificate[] = [
  { title: "Fundamentals of Deep Learning", issuer: "NVIDIA", via: "Deep Learning Institute", date: "Certificate of competency", file: "/certificates/nvidia-deep-learning.pdf", c: C.green },
  { title: "Introduction to Containers with Docker, Kubernetes & OpenShift", issuer: "IBM", via: "Coursera", date: "Apr 2025", file: "/certificates/ibm-docker-kubernetes.pdf", verify: "https://coursera.org/verify/C16HCPOA9P4I", c: C.blue },
  { title: "Django Application Development with SQL and Databases", issuer: "IBM", via: "Coursera", date: "Apr 2025", file: "/certificates/ibm-django-sql.pdf", verify: "https://coursera.org/verify/FEEGIKJIRQAE", c: C.blue },
  { title: "Python for Data Science, AI & Development", issuer: "IBM", via: "Coursera", date: "Mar 2025", file: "/certificates/ibm-python-data-science.pdf", verify: "https://coursera.org/verify/JPJJ7I1YE0IA", c: C.blue },
  { title: "Getting Started with Git and GitHub", issuer: "IBM", via: "Coursera", date: "Feb 2025", file: "/certificates/ibm-git-github.pdf", verify: "https://coursera.org/verify/BPGTN7A2IPMQ", c: C.blue },
  { title: "Introduction to HTML, CSS & JavaScript", issuer: "IBM", via: "Coursera", date: "Feb 2025", file: "/certificates/ibm-html-css-js.pdf", verify: "https://coursera.org/verify/U9Y5BV1N23AK", c: C.blue },
  { title: "Introduction to Cloud Computing", issuer: "IBM", via: "Coursera", date: "Jan 2025", file: "/certificates/ibm-cloud-computing.pdf", verify: "https://coursera.org/verify/WGJ799R5M8CM", c: C.blue },
  { title: "Introduction to Software Engineering", issuer: "IBM", via: "Coursera", date: "Jan 2025", file: "/certificates/ibm-software-engineering.pdf", verify: "https://coursera.org/verify/9B23T9SZTXHQ", c: C.blue },
  { title: "Introduction to Packet Tracer", issuer: "Cisco", via: "Networking Academy", date: "Jul 2024", file: "/certificates/cisco-packet-tracer.pdf", c: C.lilac },
  { title: "TensorFlow 2.0: Deep Learning and Artificial Intelligence", issuer: "Udemy", via: "24 hours", date: "Apr 2024", file: "/certificates/udemy-tensorflow.pdf", verify: "https://ude.my/UC-e515b84f-e312-44de-afb1-447094ed124b", c: C.coral },
  { title: "Soft Skills Training", issuer: "Infosys", via: "Springboard", date: "Apr 2024", file: "/certificates/infosys-soft-skills.pdf", c: C.yellow },
];

export const learning = [
  { title: "Agentic AI with Claude Code", sub: "CampusX", level: 3 },
  { title: "Data structures & algorithms", sub: "Daily practice", level: 2 },
  { title: "SEO for websites", sub: "Meta tags, sitemaps, schema markup and Core Web Vitals", level: 2 },
  { title: "System design", sub: "Scaling and architecture", level: 1 },
];

export const aboutBullets = [
  { t: "B.Tech in Computer Science Engineering from VIIT, Pune, with a CGPA of 8.28.", c: C.green },
  { t: "Took on 4 clients in my first month of freelancing.", c: C.coral },
  { t: "Completed a research internship on energy-aware task offloading for mobile edge computing.", c: C.yellow },
  { t: "IBM-certified full-stack developer, now learning agentic AI with Claude Code.", c: C.lilac },
];

export const socialChips = [
  { name: "GitHub", href: SITE.links.github },
  { name: "LinkedIn", href: SITE.links.linkedin },
  { name: "Instagram", href: SITE.links.productmotion },
];

export const findMe = [
  { name: "GitHub", sub: "Code and projects", g: "GH", c: "#F7F3F5", href: SITE.links.github },
  { name: "LinkedIn", sub: "Experience and updates", g: "in", c: C.blue, href: SITE.links.linkedin },
  { name: "ProductMotion AI", sub: "Instagram · client enquiries", g: "IG", c: C.lilac, href: SITE.links.productmotion },
  { name: "John Fitness For U", sub: "Instagram · AI work", g: "IG", c: C.coral, href: SITE.links.johnfitness },
  { name: "Weblinq", sub: "Instagram · websites and video", g: "IG", c: C.green, href: SITE.links.weblinq },
];

export const footIcons = [
  { g: "GH", label: "GitHub", href: SITE.links.github },
  { g: "in", label: "LinkedIn", href: SITE.links.linkedin },
  { g: "IG", label: "Instagram (ProductMotion AI)", href: SITE.links.productmotion },
];

export const needOptions = ["Website", "AI video", "Excel dashboard", "Instagram setup", "Something else"];
