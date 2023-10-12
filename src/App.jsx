import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import About from './pages/About/About';

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
    </>
  )
}

export default App
