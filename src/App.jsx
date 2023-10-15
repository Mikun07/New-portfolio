import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Projects from './pages/Projects/Projects';
import Contact from './pages/Contact/Contact,';

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Services />
      <Projects />
      <Contact />
    </>
  )
}

export default App
