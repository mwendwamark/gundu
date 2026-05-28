import CandleGate from "@/components/CandleGate";
import Particles from "@/components/Particles";
import ScrollReveal from "@/components/ScrollReveal";
import Hero from "@/components/Hero";
import WishSection from "@/components/WishSection";
import PhotoGallery from "@/components/PhotoGallery";
import BlessingsSection from "@/components/BlessingsSection";
import VerseBlock from "@/components/VerseBlock";
import SongSection from "@/components/SongSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CandleGate />
      <main id="main">
        <Particles />
        <ScrollReveal />
        <Hero />
        <WishSection />
        <div className="divider"><div className="divider-line" /></div>
        <PhotoGallery />
        <div className="divider"><div className="divider-line" /></div>
        <BlessingsSection />
        <div className="divider"><div className="divider-line" /></div>
        <VerseBlock />
        <div className="divider"><div className="divider-line" /></div>
        <SongSection />
        <Footer />
      </main>
    </>
  );
}
