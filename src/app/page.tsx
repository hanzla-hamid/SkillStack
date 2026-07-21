import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Programs } from "@/components/sections/Programs";
import { WhySkillStack } from "@/components/sections/WhySkillStack";
import { LearningProcess } from "@/components/sections/LearningProcess";
import { AcademyTypes } from "@/components/sections/AcademyTypes";
import { StudentJourney } from "@/components/sections/StudentJourney";
import { LearningRoadmap } from "@/components/sections/LearningRoadmap";
import { SuccessTimeline } from "@/components/sections/SuccessTimeline";
import { PromoVideo } from "@/components/sections/PromoVideo";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { FoundingLearners } from "@/components/sections/FoundingLearners";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Statistics } from "@/components/sections/Statistics";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <Programs />
      <WhySkillStack />
      <LearningProcess />
      <Statistics />
      <AcademyTypes />
      <StudentJourney />
      <LearningRoadmap />
      <SuccessTimeline />
      <Testimonials />
      <PromoVideo />
      <GalleryPreview />
      <FoundingLearners />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}