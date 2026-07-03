export function parseBlogPost(md, slug) {
  const frontmatter = parseYamlFrontmatter(md)

  if (frontmatter) {
    return {
      ...frontmatter.data,
      date: formatDate(frontmatter.data.date, slug),
      body: frontmatter.body
    }
  }

  return parseLegacyPost(md, slug)
}

export function slugifyHeading(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

function parseYamlFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return null

  return {
    data: parseSimpleYaml(match[1]),
    body: match[2]
  }
}

function parseSimpleYaml(yaml) {
  const data = { title: '', summary: '', date: '', tags: [] }

  for (const line of yaml.split('\n')) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!match) continue

    const [, key, rawValue] = match
    data[key] = parseYamlValue(rawValue)
  }

  data.title = data.title || ''
  data.summary = data.summary || ''
  data.date = data.date || ''
  data.tags = Array.isArray(data.tags) ? data.tags : String(data.tags).split(',').map(tag => tag.trim()).filter(Boolean)

  return data
}

function parseYamlValue(rawValue) {
  const value = rawValue.trim()

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map(item => unquoteYaml(item.trim())).filter(Boolean)
  }

  return unquoteYaml(value)
}

function unquoteYaml(value) {
  try {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return JSON.parse(value)
    }
  } catch {
    return value.slice(1, -1)
  }

  return value
}

function parseLegacyPost(md, slug) {
  const lines = md.split('\n')
  let title = slug
  let tags = []
  let summaryLines = []
  let bodyStart = 0
  let titleFound = false

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
        tags = tagMatch[1].split(',').map(tag => tag.trim()).filter(Boolean)
        continue
      }
      if (trimmed) summaryLines.push(trimmed)
    }
  }

  return {
    title,
    tags,
    summary: summaryLines.join(' '),
    date: formatDate('', slug),
    body: lines.slice(bodyStart).join('\n')
  }
}

function formatDate(value, slug) {
  const dateFromValue = value ? new Date(`${value}T00:00:00`) : null
  const dateFromSlug = slug.match(/^(\d{4})(\d{2})(\d{2})/)
  const date = dateFromValue && !Number.isNaN(dateFromValue.valueOf())
    ? dateFromValue
    : dateFromSlug
      ? new Date(+dateFromSlug[1], +dateFromSlug[2] - 1, +dateFromSlug[3])
      : null

  return date
    ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''
}
