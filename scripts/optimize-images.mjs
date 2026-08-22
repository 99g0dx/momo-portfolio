import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(import.meta.dirname, "..")
const IMAGES_DIR = path.join(ROOT, "public", "images")

const SKIP_FILES = new Set([
  "momo-about.png",
  "momo-logo-mark-2400px.png",
])

const SKIP_DIRS = new Set(["gida", "_originals", "davido-5ive", "five-years-of-kad", "temi-otedola-mr-eazi", "the-audition", "the-starting-line"])

const INPUT_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      files.push(...(await walk(full)))
      continue
    }
    if (!entry.isFile()) continue
    if (SKIP_FILES.has(entry.name)) continue
    const ext = path.extname(entry.name).toLowerCase()
    if (!INPUT_EXT.has(ext)) continue
    if (entry.name.endsWith("-full.webp") || entry.name.endsWith("-thumb.webp")) continue
    files.push(full)
  }
  return files
}

async function optimize(file) {
  const dir = path.dirname(file)
  const base = path.basename(file, path.extname(file))
  const fullOut = path.join(dir, `${base}-full.webp`)
  const thumbOut = path.join(dir, `${base}-thumb.webp`)

  const input = sharp(file)
  const meta = await input.metadata()
  const width = meta.width ?? 0

  await sharp(file)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 90, effort: 4 })
    .toFile(fullOut)

  await sharp(file)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 88, effort: 4 })
    .toFile(thumbOut)

  const [fullStat, thumbStat] = await Promise.all([fs.stat(fullOut), fs.stat(thumbOut)])

  const rel = path.relative(IMAGES_DIR, file)
  const archivePath = path.join(IMAGES_DIR, "_originals", rel)
  await fs.mkdir(path.dirname(archivePath), { recursive: true })
  await fs.rename(file, archivePath)

  return {
    file: path.relative(IMAGES_DIR, file),
    width,
    full: `${Math.round(fullStat.size / 1024)} KB`,
    thumb: `${Math.round(thumbStat.size / 1024)} KB`,
  }
}

async function main() {
  const files = await walk(IMAGES_DIR)
  if (!files.length) {
    console.log("No source images found.")
    return
  }

  console.log(`Optimizing ${files.length} image(s)…\n`)
  const results = []
  for (const file of files) {
    results.push(await optimize(file))
  }

  for (const r of results) {
    console.log(`${r.file} (${r.width}px) → full ${r.full}, thumb ${r.thumb}`)
  }
  console.log(`\nDone. ${results.length} image(s) → ${results.length * 2} WebP file(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
