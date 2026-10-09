/** The content currently on the live design. Used by `npm run seed`. */
export const settings = {
  key: "main",
  profile: {
    name: "Atharv Doiphode",
    headline: "Full-stack developer, UI/UX designer and AI video creator",
    location: "Pune, India",
    email: "doiphodeatharva750@gmail.com",
    photoUrl: "",
    introPhotoUrl: "",
    aboutPhotoUrl: "",
  },
  services: [
    { glyph: "</>", hue: 25, title: "Websites for local businesses", short: "Websites for local businesses", desc: "Fast, mobile-first sites with ordering, booking and an admin panel you can run yourself." },
    { glyph: "▶", hue: 300, title: "AI videos for brands", short: "AI videos: cartoon, UGC, product", desc: "Cartoon, UGC-style and product videos, made with AI and cut for Reels." },
    { glyph: "▦", hue: 150, title: "Excel trackers & dashboards", short: "Excel trackers and dashboards", desc: "Client trackers and dashboards that replace scattered sheets and notes." },
    { glyph: "@", hue: 85, title: "Instagram business setup", short: "Instagram business setup", desc: "Profile, bio, highlights and a posting setup for small businesses." },
  ],
  // From the résumé. An item ending in "(familiar)" shows with a dashed outline on the site.
  skills: [
    { group: "Languages", items: ["Java", "Python", "JavaScript (ES6+)", "TypeScript", "SQL", "HTML5 / CSS3"] },
    { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap", "Framer Motion"] },
    { group: "Backend", items: ["Node.js", "Express.js", "REST APIs", "JWT auth", "Socket.IO", "WebRTC"] },
    { group: "Databases", items: ["MongoDB", "MySQL"] },
    { group: "AI / ML", items: ["PyTorch", "Deep reinforcement learning", "Prompt engineering", "AI video generation", "Scikit-learn (familiar)"] },
    { group: "Data analytics", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn (familiar)", "Power BI (familiar)"] },
    { group: "Tools & deployment", items: ["Git", "GitHub", "Postman", "Vercel", "Cloudinary", "Figma", "Excel", "Docker (familiar)"] },
    { group: "AI tools", items: ["Claude", "ChatGPT", "Gemini", "Google Flow"] },
  ],
  // Only real numbers.
  stats: [
    { value: "8.28", label: "CGPA in B.Tech Computer Science Engineering, VIIT Pune" },
    { value: "3", label: "full-stack apps built: Oya Kekars, CutPro and PeerLearn" },
    { value: "30k", label: "wireless channel samples tested in my DROO research" },
    { value: "4", label: "freelance clients in my first month: websites + AI video" },
  ],
  links: [
    { g: "GH", hue: -1, name: "GitHub", sub: "Code and projects", href: "https://github.com/atharvdoiphode" },
    { g: "in", hue: 250, name: "LinkedIn", sub: "Experience and updates", href: "https://linkedin.com/in/atharv-doiphode-07045125a" },
    { g: "IG", hue: 300, name: "ProductMotion AI", sub: "Instagram · client enquiries", href: "https://www.instagram.com/productmotionai" },
    { g: "IG", hue: 25, name: "John Fitness For U", sub: "Instagram · AI work", href: "https://www.instagram.com/johnfitnessforu" },
    { g: "IG", hue: 150, name: "Weblinq", sub: "Instagram · websites and video", href: "https://www.instagram.com/weblinq_4" },
  ],
};

export type SeedProject = { title: string; cat: "Websites" | "AI Videos" | "Excel" | "Research"; desc: string; tags: string[]; ph: string; long: string;
  liveUrl: string; liveLabel: string; codeUrl: string; codeLabel: string; featured?: boolean };

export const projects: SeedProject[] = [
  { title: "Oya Kekars", cat: "Websites", desc: "Bakery e-commerce with WhatsApp ordering and a JWT admin.", tags: ["Next.js", "MongoDB", "JWT", "WhatsApp"], ph: "storefront screenshot",
    long: "An online store for a home bakery. Customers browse the menu and send their order straight to WhatsApp; the owner manages products and orders from a JWT-secured admin panel.",
    liveUrl: "https://oya-kekars.vercel.app/", liveLabel: "Visit site", codeUrl: "https://github.com/AtharvDoiphode/OYA-KEKARS-", codeLabel: "View code", featured: true },
  { title: "CutPro", cat: "Websites", desc: "Salon appointments with a live queue.", tags: ["Appointments", "Live queue"], ph: "booking flow screenshot",
    long: "A booking site for salons. Clients book a slot and can see the live queue, so they arrive when their chair is ready.",
    liveUrl: "https://github.com/AtharvDoiphode/CutPro", liveLabel: "View code", codeUrl: "", codeLabel: "" },
  { title: "PeerLearn", cat: "Websites", desc: "Real-time learning platform built on WebRTC.", tags: ["WebRTC", "Real-time"], ph: "session room screenshot",
    long: "A platform where students learn together in real time, with peer-to-peer video sessions over WebRTC.",
    liveUrl: "https://github.com/AtharvDoiphode/peerlearn", liveLabel: "View code", codeUrl: "", codeLabel: "" },
  { title: "ProductMotion AI", cat: "AI Videos", desc: "AI product reels for brands.", tags: ["Product", "Reels", "AI video"], ph: "reel still · 9:16",
    long: "Short product reels for brands, generated and edited with AI video tools and cut for Instagram.",
    liveUrl: "https://www.instagram.com/productmotionai", liveLabel: "Watch reels", codeUrl: "/contact", codeLabel: "Work with me" },
  { title: "John's Journey", cat: "AI Videos", desc: "An animated AI fitness series.", tags: ["Cartoon", "Series", "Fitness"], ph: "episode still · 9:16",
    long: "An animated fitness series following John, made episode by episode with AI tools.",
    liveUrl: "https://www.instagram.com/johnfitnessforu", liveLabel: "Watch series", codeUrl: "/contact", codeLabel: "Work with me" },
  { title: "Business client tracker", cat: "Excel", desc: "Dashboard for tracking clients, work and payments.", tags: ["Excel", "Dashboard"], ph: "dashboard screenshot",
    long: "A client tracker with a summary dashboard for a small business, built in Excel.",
    liveUrl: "/contact", liveLabel: "Request one", codeUrl: "", codeLabel: "" },
  { title: "Personal habit tracker", cat: "Excel", desc: "Daily habit tracking with a progress dashboard.", tags: ["Excel", "Dashboard"], ph: "tracker screenshot",
    long: "A personal habit tracker with daily check-ins and a dashboard that shows progress over time.",
    liveUrl: "/contact", liveLabel: "Request one", codeUrl: "", codeLabel: "" },
  { title: "Energy-Aware DROO", cat: "Research", desc: "Energy-aware offloading for mobile edge computing.", tags: ["PyTorch", "Python", "MEC"], ph: "results chart",
    long: "Research on energy-aware deep reinforcement learning for computation offloading in mobile edge computing, trained on 30k channel samples.",
    liveUrl: "/contact", liveLabel: "Get in touch", codeUrl: "", codeLabel: "" },
];

