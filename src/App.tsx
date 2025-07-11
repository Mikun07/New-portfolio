import { ThemeProvider } from './core/providers/ThemeProvider'
import { LanguageProvider } from './core/providers/LanguageProvider'
import { ToastProvider } from './core/providers/ToastProvider'
import Navbar from './shared/components/Navbar/Navbar'
import Home from './features/home/Home'
import About from './features/about/About'
import Experience from './features/experience/Experience'
import Services from './features/services/Services'
import Projects from './features/projects/Projects'
import Contact from './features/contact/Contact'
import Footer from './shared/components/Footer/Footer'
import ScrollToTop from './shared/components/ScrollToTop/ScrollToTop'

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <Navbar />
          <main className="flex flex-col pt-16" style={{ backgroundColor: 'var(--bg)' }}>
            <Home />
            <About />
            <Experience />
            <Services />
            <Projects />
            <Contact />
            <Footer />
          </main>
          <ScrollToTop />
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
