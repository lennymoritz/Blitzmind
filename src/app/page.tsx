import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { AdaptWidget } from "../components/AdaptWidget";
import { AnalyzeWidget } from "../components/AnalyzeWidget";
import { StressSpike } from "../components/StressSpike";
import {
  ProblemSection,
  SystemIntro,
  AdaptSectionWrapper,
  AnalyzeSectionWrapper,
  InGameSection,
  HardwareSection,
  IntegritySection,
  StorySection,
  Footer,
} from "../components/Sections";

export default function Home() {
  return (
    <div className="grain">
      <Nav />
      <StressSpike />
      <main>
        <Hero />
        <ProblemSection />
        <SystemIntro />
        <AdaptSectionWrapper>
          <AdaptWidget />
        </AdaptSectionWrapper>
        <AnalyzeSectionWrapper>
          <AnalyzeWidget />
        </AnalyzeSectionWrapper>
        <InGameSection />
        <HardwareSection />
        <IntegritySection />
        <StorySection />
      </main>
      <Footer />
    </div>
  );
}
