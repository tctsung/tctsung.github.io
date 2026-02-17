/* App shell — router + shared layout */
import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CatRunner from './components/CatRunner'
import About from './pages/About'
import Resume from './pages/Resume'
import BlogVlog from './pages/BlogVlog'
import Projects from './pages/Projects'

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blog" element={<BlogVlog />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      <Footer />
      <CatRunner />
    </HashRouter>
  )
}
