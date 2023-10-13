import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Services />
    </>
  )
}

export default App
