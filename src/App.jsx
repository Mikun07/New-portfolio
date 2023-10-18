import React from "react";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Projects from './pages/Projects/Projects';
import Contact from './pages/Contact/Contact,';
import Footer from './components/Footer/Footer';
import Social from './components/Social/Social';
import ScrollToTop from './components/Scroll/ScrollToTop';

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTop />
      <Social />
    </>
  )
}

export default App
