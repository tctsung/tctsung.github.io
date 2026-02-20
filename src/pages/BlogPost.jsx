/* Individual blog post — renders markdown with syntax highlighting + Giscus comments */
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'

SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('python', python)

export default function BlogPost() {
  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [meta, setMeta] = useState({ title: '', summary: '', date: '' })
  const giscusRef = useRef(null)

  /* Load markdown */
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blogs/${slug}.md`)
      .then(r => r.text())
      .then(text => {
        const { title, summary, date, body } = parsePost(text, slug)
        setMeta({ title, summary, date })
        setContent(body)
      })
      .catch(() => setContent('# Post not found'))
  }, [slug])

  /* Load Giscus comments */
  useEffect(() => {
    if (!giscusRef.current || !content) return
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'tctsung/tctsung.github.io')
    script.setAttribute('data-repo-id', 'R_kgDOOKU8Rw')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOOKU8R84C2yPl')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'noborder_light')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true
    giscusRef.current.innerHTML = ''
    giscusRef.current.appendChild(script)
  }, [content, slug])

  return (
    <section className="section">
      <div className="container blog-post-container">
        <Link to="/blog" className="blog-back">&larr; Back to Blog</Link>
        <h1 className="blog-post-title">{meta.title}</h1>
        <span className="blog-post-date">{meta.date}</span>
        <p className="blog-post-summary">{meta.summary}</p>
        <hr className="blog-post-separator" />
        <div className="blog-post-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter style={oneLight} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>{children}</code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className="blog-giscus" ref={giscusRef} />
      </div>
    </section>
  )
}

/* Split markdown into meta (title, tags, summary above ---) and body (below ---) */
function parsePost(md, slug) {
  const lines = md.split('\n')
  let title = slug, tags = [], summaryLines = [], bodyStart = 0, titleFound = false

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (!titleFound && trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '')
      titleFound = true
      continue
    }
    if (titleFound && trimmed === '---') {
      bodyStart = i + 1
      break
    }
    if (titleFound) {
      const tagMatch = trimmed.match(/^\[tags:\s*(.+)\]$/)
      if (tagMatch) {
        tags = tagMatch[1].split(',').map(t => t.trim()).filter(Boolean)
        continue
      }
      if (trimmed) summaryLines.push(trimmed)
    }
  }

  const dateStr = slug.match(/^(\d{4})(\d{2})(\d{2})/)
  const date = dateStr
    ? new Date(+dateStr[1], +dateStr[2] - 1, +dateStr[3]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return { title, tags, summary: summaryLines.join(' '), date, body: lines.slice(bodyStart).join('\n') }
}
