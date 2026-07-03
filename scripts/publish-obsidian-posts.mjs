import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const registryPath = path.join(repoRoot, 'docs', 'obsidian-posts.json')
const blogsDir = path.join(repoRoot, 'public', 'blogs')
const imageRoot = path.join(repoRoot, 'public', 'img', 'blog')
const manifestPath = path.join(blogsDir, 'manifest.json')

const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'))

for (const entry of registry) {
  await publishEntry(entry)
}

await updateManifest(registry.map(entry => datedSlug(entry)))

function datedSlug(entry) {
  const datePrefix = entry.date.replace(/-/g, '')
  const cleanSlug = entry.slug.replace(/^\d{8}_/, '')
  return `${datePrefix}_${cleanSlug}`
}

async function publishEntry(entry) {
  const source = await fs.readFile(entry.sourcePath, 'utf8')
  const sourceDir = path.dirname(entry.sourcePath)
  const slug = datedSlug(entry)
  const blogAssetDir = path.join(imageRoot, slug)

  await fs.mkdir(blogsDir, { recursive: true })
  await fs.mkdir(blogAssetDir, { recursive: true })

  const body = await convertObsidianMarkdown(stripFrontmatter(source), {
    entry,
    sourceDir,
    blogAssetDir
  })

  const md = `${formatFrontmatter(entry)}\n${body.trim()}\n`
  await fs.writeFile(path.join(blogsDir, `${slug}.md`), md)
}

async function convertObsidianMarkdown(markdown, context) {
  let body = markdown
    .replace(/\r\n/g, '\n')
    .replace(/\$\s*\\rightarrow\s*\$/g, '→')
    .replace(/\t/g, '  ')

  body = await replaceImageEmbeds(body, context)
  body = replaceWikiLinks(body)
  return body
}

async function replaceImageEmbeds(markdown, { entry, sourceDir, blogAssetDir }) {
  const slug = datedSlug(entry)
  const imageEmbed = /!\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/g
  const replacements = []

  for (const match of markdown.matchAll(imageEmbed)) {
    const originalName = match[1].trim()
    const width = match[2]?.trim()
    const asset = entry.assets?.[originalName] ?? defaultAsset(originalName)
    const sourceAsset = await findAsset(sourceDir, originalName)
    const targetAsset = path.join(blogAssetDir, asset.fileName)
    const publicPath = `/img/blog/${slug}/${asset.fileName}`
    const alt = asset.alt ?? titleFromFileName(asset.fileName)

    await fs.copyFile(sourceAsset, targetAsset)

    const replacement = width && /^\d+$/.test(width)
      ? `<img src="${publicPath}" alt="${escapeAttribute(alt)}" width="${width}" />`
      : `![${alt}](${publicPath})`

    replacements.push([match[0], replacement])
  }

  return replacements.reduce((text, [from, to]) => text.replace(from, to), markdown)
}

function replaceWikiLinks(markdown) {
  return markdown.replace(/\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/g, (_, target, alias) => {
    const [page, heading] = target.split('#')
    const label = alias?.trim() || heading?.trim() || page.trim()

    if (!page.trim() && heading) {
      return `[${label}](#${slugifyHeading(heading)})`
    }

    return label
  })
}

async function findAsset(sourceDir, fileName) {
  const candidates = [
    path.join(sourceDir, fileName),
    path.join(sourceDir, 'assets', fileName)
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      // Try the next conventional Obsidian asset location.
    }
  }

  throw new Error(`Could not find asset "${fileName}" next to ${sourceDir}`)
}

async function updateManifest(slugs) {
  let existing = []

  try {
    existing = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  } catch {
    existing = []
  }

  const merged = new Map()
  for (const entry of existing) merged.set(entry.slug, entry)
  for (const slug of slugs) merged.set(slug, { slug })

  const sorted = Array.from(merged.values())
    .filter(entry => entry.slug)
    .sort((a, b) => b.slug.localeCompare(a.slug))

  await fs.writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`)
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '')
}

function formatFrontmatter(entry) {
  return [
    '---',
    `title: ${quoteYaml(entry.title)}`,
    `date: ${quoteYaml(entry.date)}`,
    `tags: [${entry.tags.map(quoteYaml).join(', ')}]`,
    `summary: ${quoteYaml(entry.summary)}`,
    'source: obsidian',
    '---'
  ].join('\n')
}

function defaultAsset(fileName) {
  return {
    fileName: fileName
      .toLowerCase()
      .replace(/\.[^.]+$/, match => match)
      .replace(/\s+/g, '-'),
    alt: titleFromFileName(fileName)
  }
}

function titleFromFileName(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function slugifyHeading(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

function quoteYaml(value) {
  return JSON.stringify(String(value))
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
