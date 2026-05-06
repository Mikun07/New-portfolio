import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Experience from './pages/Experience/Experience'
import Services from './pages/Services/Services'
import Projects from './pages/Projects/Projects'
import Contact from './pages/Contact/Contact'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <Navbar />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col lg:pt-0 pt-16">
              <Home />
              <About />
              <Experience />
              <Services />
              <Projects />
              <Contact />
              <Footer />
            </main>
          </div>
          <ScrollToTop />
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
