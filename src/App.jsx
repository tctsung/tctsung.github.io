/* App shell — router + shared layout */
import { HashRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CatRunner from './components/CatRunner'
import About from './pages/About'
import Resume from './pages/Resume'
import Blog from './pages/Blog'
import Vlog from './pages/Vlog'
import Projects from './pages/Projects'

/* Lazy-load BlogPost to keep syntax-highlighter out of the main bundle */
const BlogPost = lazy(() => import('./pages/BlogPost'))

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Suspense fallback={<div className="section"><div className="container">Loading...</div></div>}><BlogPost /></Suspense>} />
          <Route path="/vlog" element={<Vlog />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      <Footer />
      <CatRunner />
    </HashRouter>
  )
}
