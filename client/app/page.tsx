import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Services } from "@/components/home/Services";
import { StatsTools } from "@/components/home/StatsTools";
import { Work } from "@/components/home/Work";
import { Experience } from "@/components/home/Experience";
import { Certifications } from "@/components/home/Certifications";
import { Learning } from "@/components/home/Learning";
import { About } from "@/components/home/About";
import { FindMe } from "@/components/home/FindMe";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { getSite } from "@/lib/site";

export default async function Home() {
  const site = await getSite();
  return (
    <main>
      <Hero />
      <Intro />
      <Services services={site.services} />
      <StatsTools />
      <Work />
      <Experience skills={site.skills} />
      <Certifications />
      <Learning />
      <About links={site.links} photoUrl={site.profile.aboutPhotoUrl} />
      <FindMe links={site.links} />
      <ClosingCTA email={site.profile.email} resumeHref={site.resumeHref} />
    </main>
  );
}
