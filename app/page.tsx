import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BootSequence from './components/BootSequence';
import ParticleBackground from './components/ParticleBackground';

export default function Home() {
  return (
    <>
      <BootSequence />
      <ParticleBackground />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Services />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
