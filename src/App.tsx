import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
  type ReactNode,
  type TouchEvent,
  type MouseEvent,
} from "react"
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { projects, type Project } from "./data/projects"
import {
  gidaAbout,
  gidaInstagram,
  gidaSubscribeUrl,
  gidaVolumes,
} from "./data/gida"

// ── Personalise everything here ────────────────────────────────────────────
const NAME = "MOMO"
const EMAIL = "Morinsolaho@gmail.com"
const LOCATION = "Lagos · London"
const SOCIAL = [
  { label: "Socials", handle: "Momo.mho", href: "https://instagram.com/momo.mho" },
] as const
const BIO = [
  "Momo Hassan-Odukale is a stylist, creative director, and consultant based between London and Lagos, working at the intersection of fashion, history, and storytelling. She is the founder of GIDA Journal, a print publication documenting creative culture across Africa. Her work spans campaigns for Nike, Bottega Veneta, IAMISIGO, Lisa Folawiyo Studio, and Guinness, costume design for artists including Asake, ASA, Mr Eazi, and Temi Otedola, and editorial features in Vogue and Dazed.",
]
const SERVICES = ["Creative Direction", "Styling"]
const ABOUT_IMAGE = "/images/momo-about.png"
const LOGO = "/images/momo-logo-line.png"
// ───────────────────────────────────────────────────────────────────────────

type PageId = "home" | "work" | "about" | "gida" | "consultancy" | "contact"
type WorkMode = "grid" | "list" | "index"

const PAGES: { id: PageId; label: string; path: string }[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "work", label: "Selected Work", path: "/work" },
  { id: "consultancy", label: "Consultancy", path: "/consultancy" },
  { id: "contact", label: "Contact", path: "/contact" },
  { id: "gida", label: "GIDA", path: "/gida" },
]

function pathToPage(pathname: string): PageId {
  const match = PAGES.find((page) =>
    page.path === "/" ? pathname === "/" : pathname === page.path || pathname.startsWith(`${page.path}/`),
  )
  return match?.id ?? "home"
}

const imgUrl = (src: string, w: number, h?: number) => {
  const base = src.split("?")[0]
  const params = new URLSearchParams({
    w: String(w),
    fit: h ? "crop" : "max",
    auto: "format",
    q: "80",
  })
  if (h) params.set("h", String(h))
  return `${base}?${params.toString()}`
}

const allCategories = ["All", "Creative Direction", "Styling"]

function projectCredit(p: Project) {
  return [p.description, p.category].filter(Boolean).join(" · ")
}

function sampleSideLuma(img: HTMLImageElement, side: "left" | "right") {
  const canvas = document.createElement("canvas")
  const max = 72
  const scale = Math.min(max / img.naturalWidth, max / img.naturalHeight, 1)
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return 160
  ctx.drawImage(img, 0, 0, w, h)
  const sw = Math.max(1, Math.floor(w * 0.2))
  const sx = side === "left" ? 0 : w - sw
  const { data } = ctx.getImageData(sx, 0, sw, h)
  let sum = 0
  let n = 0
  for (let i = 0; i < data.length; i += 20) {
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    n++
  }
  return n ? sum / n : 160
}

function FadeImg({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes,
  srcSet,
  onClick,
}: {
  src: string
  alt: string
  className?: string
  loading?: "lazy" | "eager"
  sizes?: string
  srcSet?: string
  onClick?: (e: MouseEvent<HTMLImageElement>) => void
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onClick={onClick}
      className={`img-fade ${loaded ? "is-loaded" : ""} ${className}`}
    />
  )
}

function Section({
  id,
  children,
  className = "",
}: {
  id: PageId
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}

function ScrollHintArrow({
  side,
  visible,
  onClick,
}: {
  side: "left" | "right"
  visible: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll filters left" : "Scroll filters right"}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`scroll-hint-arrow scroll-hint-arrow--${side} ${visible ? "is-visible" : ""}`}
    >
      <span aria-hidden="true" className="scroll-hint-arrow__glyph">
        {side === "left" ? "‹" : "›"}
      </span>
    </button>
  )
}

function ChipScroller({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateHints = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 4)
    setCanRight(max > 4 && el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateHints()
    const onScroll = () => updateHints()
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(updateHints)
    ro.observe(el)
    window.addEventListener("resize", updateHints)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
      window.removeEventListener("resize", updateHints)
    }
  }, [updateHints, children])

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.55), behavior: "smooth" })
  }

  return (
    <div className={`chip-scroller ${canLeft ? "has-left" : ""} ${canRight ? "has-right" : ""}`}>
      <ScrollHintArrow side="left" visible={canLeft} onClick={() => scrollByDir(-1)} />
      <div ref={trackRef} className="chip-scroll">
        {children}
      </div>
      <ScrollHintArrow side="right" visible={canRight} onClick={() => scrollByDir(1)} />
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function WorkToolbar({
  mode,
  activeCategory,
  onWorkMode,
  onCategory,
}: {
  mode: WorkMode
  activeCategory: string
  onWorkMode: (m: WorkMode) => void
  onCategory: (c: string) => void
}) {
  const tagCls = (active: boolean) =>
    `font-sans text-[8px] sm:text-[10.5px] tracking-[0.08em] sm:tracking-[0.14em] uppercase px-1 py-0.5 sm:px-1.5 sm:py-1 transition-opacity duration-200 shrink-0 inline-flex items-center font-medium ${
      active ? "text-ink" : "text-ink/38 hover:text-ink"
    }`

  return (
    <div className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-3">
      <ChipScroller>
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategory(cat)}
            className={tagCls(activeCategory === cat)}
          >
            {cat}
          </button>
        ))}
      </ChipScroller>
      <div className="flex gap-1.5 sm:gap-3 shrink-0 pl-2 sm:pl-3 ml-1 border-l border-ink/15">
        {(["grid", "list", "index"] as WorkMode[]).map((m) => (
          <button key={m} type="button" onClick={() => onWorkMode(m)} className={tagCls(mode === m)}>
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}

const NAV_LINKS = PAGES.filter((page) => page.id !== "home")

function Nav() {
  const location = useLocation()
  const activePage = pathToPage(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const sync = () => {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`)
    }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    closeMenu()
  }, [location.pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) closeMenu()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [menuOpen, closeMenu])

  const isAbout = location.pathname === "/about"
  const isHome = location.pathname === "/"

  const menuItemCls = (active: boolean) =>
    `block w-full text-left font-sans text-[11px] tracking-[0.16em] uppercase px-3 py-2 border-b transition-opacity font-medium ${
      isAbout
        ? `border-paper/10 ${active ? "text-paper" : "text-paper/78 hover:text-paper"}`
        : `border-ink/10 ${active ? "text-ink" : "text-ink/40 hover:text-ink"}`
    }`

  const desktopLinkCls = (active: boolean) =>
    `font-sans text-[8px] tracking-[0.1em] uppercase whitespace-nowrap transition-opacity font-medium ${
      isAbout
        ? active
          ? "text-paper"
          : "text-paper/78 hover:text-paper"
        : active
          ? "text-ink"
          : "text-ink/40 hover:text-ink"
    }`

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] ${
          isAbout ? "bg-ink" : "bg-paper"
        }`}
      >
        <div className="relative flex items-center justify-end px-4 sm:px-6 md:px-8 py-2.5 sm:py-3">
          {!isHome ? (
            <Link
              to="/"
              onClick={closeMenu}
              aria-label={NAME}
              className="absolute left-1/2 -translate-x-1/2 z-10 shrink-0 transition-opacity hover:opacity-55"
            >
              <img
                src={LOGO}
                alt={NAME}
                className={`h-7 sm:h-8 md:h-6 lg:h-7 w-auto object-contain ${isAbout ? "invert" : ""}`}
              />
            </Link>
          ) : null}

          <nav className="hidden md:flex items-center gap-x-2 lg:gap-x-2.5" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={desktopLinkCls(activePage === item.id)}
                aria-current={activePage === item.id ? "page" : undefined}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={`menu-toggle grid md:hidden ${isAbout ? "is-on-ink" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
            <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
            <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div ref={menuRef} className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-transparent"
            onClick={closeMenu}
          />
          <nav
            id="site-nav-menu"
            className={`absolute top-[var(--header-h)] right-4 w-[min(12.5rem,calc(100vw-2rem))] border animate-fade-up ${
              isAbout ? "bg-ink border-paper/15" : "bg-paper border-ink/15 shadow-[0_8px_24px_rgba(12,12,10,0.1)]"
            }`}
            aria-label="Primary"
          >
            {NAV_LINKS.map((item, i) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMenu}
                aria-current={activePage === item.id ? "page" : undefined}
                className={`${menuItemCls(activePage === item.id)} ${i === NAV_LINKS.length - 1 ? "border-b-0" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  )
}

// ─── Grid Mode ────────────────────────────────────────────────────────────────
function WorkGrid({ filtered, onOpen }: { filtered: Project[]; onOpen: (p: Project) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-5 sm:gap-y-10">
      {filtered.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onOpen(p)}
          className="group text-left w-full animate-fade-up"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <div className="overflow-hidden bg-ink/8 mb-2 sm:mb-2.5 w-full aspect-[3/4]">
            <FadeImg
              src={imgUrl(p.coverImage, 600)}
              srcSet={`${imgUrl(p.coverImage, 400)} 400w, ${imgUrl(p.coverImage, 700)} 700w, ${imgUrl(p.coverImage, 1000)} 1000w`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.02]"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </div>
          <p className="font-display text-[11px] sm:text-[13px] tracking-[-0.02em] text-ink leading-snug min-w-0 break-words uppercase font-semibold">
            {p.title}
          </p>
          <p className="font-sans text-[8px] sm:text-[9px] text-ink-muted mt-1 tracking-[0.08em] uppercase font-medium">
            {projectCredit(p)}
            <span className="mx-1.5 opacity-50">·</span>
            {p.year}
          </p>
        </button>
      ))}
    </div>
  )
}

// ─── List Mode ────────────────────────────────────────────────────────────────
function WorkList({ filtered, onOpen }: { filtered: Project[]; onOpen: (p: Project) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div>
      {filtered.map((p) => {
        const active = hoveredId === p.id
        return (
          <button
            key={p.id}
            type="button"
            className="relative overflow-hidden w-full text-left cursor-pointer group"
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(p.id)}
            onBlur={() => setHoveredId(null)}
            onClick={() => onOpen(p)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300 hidden sm:block"
              style={{
                backgroundImage: `url(${imgUrl(p.coverImage, 1400)})`,
                opacity: active ? 0.13 : 0,
              }}
            />
            <div className="relative z-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 py-2.5 sm:py-3 border-b border-ink/10 min-h-0">
              <p className="font-display text-[12px] sm:text-[13px] tracking-[-0.02em] text-ink flex-1 leading-snug min-w-0 break-words uppercase font-semibold">
                {p.title}
              </p>
              <div className="flex items-center gap-2 sm:gap-4">
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.08em] uppercase text-ink-muted min-w-0 font-medium">
                  {projectCredit(p)}
                </p>
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.08em] text-ink-muted shrink-0 sm:w-10 sm:text-right">
                  {p.year}
                </p>
                <span
                  className={`font-sans text-[11px] text-ink transition-opacity duration-200 shrink-0 w-4 hidden sm:inline ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  ↗
                </span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── Index Mode ───────────────────────────────────────────────────────────────
function WorkIndex({
  filtered,
  onLightbox,
}: {
  filtered: Project[]
  onLightbox: (src: string, all: string[]) => void
}) {
  return (
    <div className="space-y-6 md:space-y-8">
      {filtered.map((p) => (
        <div key={p.id}>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between md:justify-start sm:gap-4 md:gap-x-6 mb-2 sm:mb-4 md:mb-2">
            <h2 className="font-display text-[16px] sm:text-[26px] md:text-[16px] tracking-[-0.02em] text-ink leading-snug min-w-0 break-words uppercase font-semibold">
              {p.title}
            </h2>
            <p className="font-sans text-[7.5px] sm:text-[10.5px] tracking-[0.06em] sm:tracking-[0.12em] uppercase text-ink-muted shrink-0 font-medium">
              {projectCredit(p)}
              <span className="mx-1.5 opacity-50">·</span>
              {p.year}
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0.5">
            {p.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onLightbox(src, p.images)}
                className="group aspect-square overflow-hidden bg-ink/8"
              >
                <FadeImg
                  src={imgUrl(src, 300, 300)}
                  srcSet={`${imgUrl(src, 200, 200)} 200w, ${imgUrl(src, 400, 400)} 400w`}
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  alt={`${p.title} ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] group-active:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Work Section ─────────────────────────────────────────────────────────────
function WorkSection({
  mode,
  activeCategory,
  onWorkMode,
  onCategory,
  onOpen,
  onLightbox,
}: {
  mode: WorkMode
  activeCategory: string
  onWorkMode: (m: WorkMode) => void
  onCategory: (c: string) => void
  onOpen: (p: Project) => void
  onLightbox: (src: string, all: string[]) => void
}) {
  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category.includes(activeCategory))

  return (
    <Section id="work" className="pb-16 sm:pb-24 bg-paper pt-[var(--header-h)]">
      <div className="work-toolbar-sticky sticky z-30 bg-paper">
        <WorkToolbar
          mode={mode}
          activeCategory={activeCategory}
          onWorkMode={onWorkMode}
          onCategory={onCategory}
        />
        <div className="h-px bg-ink/10" />
      </div>
      <div className={`px-3 sm:px-6 md:px-8 pt-4 ${mode === "index" ? "md:pt-5" : "sm:pt-8"}`}>
        <div key={`${mode}-${activeCategory}`} className="animate-fade-up">
          {mode === "grid" && <WorkGrid filtered={filtered} onOpen={onOpen} />}
          {mode === "list" && <WorkList filtered={filtered} onOpen={onOpen} />}
          {mode === "index" && <WorkIndex filtered={filtered} onLightbox={onLightbox} />}
        </div>
      </div>
    </Section>
  )
}

// ─── Gallery Overlay ──────────────────────────────────────────────────────────
function GalleryOverlay({
  project,
  onClose,
  onPrevCollection,
  onNextCollection,
}: {
  project: Project
  onClose: () => void
  onPrevCollection: () => void
  onNextCollection: () => void
}) {
  const [index, setIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [edgeInk, setEdgeInk] = useState({ left: true, right: true })
  const touchStartX = useRef<number | null>(null)
  const touchDelta = useRef(0)
  const total = project.images.length
  const src = project.images[index] ?? project.images[0]

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total)
  }, [total])

  useEffect(() => {
    setIndex(0)
  }, [project.id])

  useEffect(() => {
    let cancelled = false
    const probe = new Image()
    probe.onload = () => {
      if (cancelled) return
      setEdgeInk({
        left: sampleSideLuma(probe, "left") >= 145,
        right: sampleSideLuma(probe, "right") >= 145,
      })
    }
    probe.onerror = () => {
      if (!cancelled) setEdgeInk({ left: true, right: true })
    }
    probe.src = imgUrl(src, 480)
    return () => {
      cancelled = true
    }
  }, [src])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "Escape") {
        if (menuOpen) setMenuOpen(false)
        else onClose()
        return
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext, onClose, menuOpen])

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
    touchDelta.current = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    touchDelta.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current
  }

  const onTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      if (touchDelta.current > 0) goPrev()
      else goNext()
    }
    touchStartX.current = null
    touchDelta.current = 0
  }

  return (
    <div className="fixed inset-0 z-[70] h-[100dvh] overflow-hidden bg-paper animate-fade-in flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="relative flex items-center justify-between px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 shrink-0 bg-paper z-10">
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[8px] sm:text-[9px] tracking-[0.16em] uppercase text-ink-muted hover:text-ink transition-colors min-h-0 py-0.5 shrink-0 z-10"
        >
          ← Close
        </button>
        <Link
          to="/"
          aria-label={NAME}
          className="absolute left-1/2 -translate-x-1/2 z-10 shrink-0 transition-opacity hover:opacity-55"
        >
          <img
            src={LOGO}
            alt={NAME}
            className="h-7 sm:h-8 md:h-6 lg:h-7 w-auto object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-x-2 lg:gap-x-2.5 z-10" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`font-sans text-[8px] tracking-[0.1em] uppercase whitespace-nowrap transition-opacity font-medium ${
                item.id === "work" ? "text-ink" : "text-ink/40 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="menu-toggle grid md:hidden z-10"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="collection-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
          <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
          <span className={`menu-toggle__line ${menuOpen ? "is-open" : ""}`} />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-20 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-transparent"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="collection-nav-menu"
            className="absolute top-[calc(env(safe-area-inset-top)+2.75rem)] right-4 w-[min(12.5rem,calc(100vw-2rem))] border border-ink/15 bg-paper shadow-[0_8px_24px_rgba(12,12,10,0.1)] animate-fade-up"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.id}
                to={item.path}
                className={`block w-full text-left font-sans text-[11px] tracking-[0.16em] uppercase px-3 py-2 border-b border-ink/10 transition-opacity font-medium ${
                  item.id === "work" ? "text-ink" : "text-ink/40 hover:text-ink"
                } ${i === NAV_LINKS.length - 1 ? "border-b-0" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <div
        className="relative flex-1 min-h-0 flex flex-col"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative flex-1 min-h-0 px-3 sm:px-6 md:px-8 isolate">
          <FadeImg
            src={imgUrl(src, 1800)}
            alt={`${project.title} ${index + 1}`}
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            aria-label="Previous image"
            className="absolute inset-y-0 left-0 w-[40%] cursor-pointer bg-transparent flex items-center justify-start pl-3 sm:pl-5 md:pl-8 group"
            onClick={goPrev}
          >
            <span className={`flex h-16 w-8 items-center justify-center ${edgeInk.left ? "text-ink" : "text-paper"} md:text-ink`}>
              <svg
                viewBox="0 0 16 40"
                className="h-10 w-4 md:h-12 md:w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.15"
                aria-hidden="true"
              >
                <path d="M12 2L3 20l9 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="absolute inset-y-0 right-0 w-[40%] cursor-pointer bg-transparent flex items-center justify-end pr-3 sm:pr-5 md:pr-8 group"
            onClick={goNext}
          >
            <span className={`flex h-16 w-8 items-center justify-center ${edgeInk.right ? "text-ink" : "text-paper"} md:text-ink`}>
              <svg
                viewBox="0 0 16 40"
                className="h-10 w-4 md:h-12 md:w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.15"
                aria-hidden="true"
              >
                <path d="M4 2l9 18-9 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
        <div className="shrink-0 px-3 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-between gap-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            aria-label="Previous collection"
            className="shrink-0 text-ink/40 hover:text-ink transition-colors flex items-center justify-center p-1"
            onClick={onPrevCollection}
          >
            <svg
              viewBox="0 0 10 10"
              className="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              aria-hidden="true"
            >
              <path d="M7 1L3 5l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-[14px] sm:text-[18px] tracking-[-0.02em] text-ink leading-snug uppercase font-semibold">
                {project.title}
              </h1>
              <p className="font-sans text-[8px] sm:text-[9px] text-ink-muted tracking-[0.08em] uppercase font-medium mt-1">
                {projectCredit(project)}
                <span className="mx-1.5 opacity-40">·</span>
                {project.year}
              </p>
            </div>
            <p className="font-sans text-[8px] sm:text-[9px] text-ink-muted tabular-nums shrink-0">
              {index + 1} / {total}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next collection"
            className="shrink-0 text-ink/40 hover:text-ink transition-colors flex items-center justify-center p-1"
            onClick={onNextCollection}
          >
            <svg
              viewBox="0 0 10 10"
              className="h-2.5 w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              aria-hidden="true"
            >
              <path d="M3 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Landing / Intro ──────────────────────────────────────────────────────────
function LandingView() {
  return (
    <Section
      id="home"
      className="flex-1 flex items-center justify-center bg-paper px-5 sm:px-8 lg:px-12 min-h-0"
    >
      <div className="max-w-3xl mx-auto text-center animate-fade-up w-full">
        <img
          src={LOGO}
          alt=""
          className="mx-auto h-[clamp(2rem,11vw,4.75rem)] md:h-[clamp(3.25rem,7vw,6.5rem)] w-auto max-w-[min(15rem,80vw)] md:max-w-[min(24rem,48vw)] object-contain"
        />
        <h1 className="mt-4 sm:mt-5 font-display text-[clamp(1.85rem,8vw,3.75rem)] tracking-[-0.02em] font-semibold text-ink leading-[1.1] uppercase break-words">
          Momo Hassan-Odukale
        </h1>
        <p className="mt-3 font-sans text-[10px] sm:text-[12px] leading-[1.5] text-ink/50 font-light max-w-md mx-auto px-1">
          Momo Hassan-Odukale is a stylist, creative director, and consultant.
        </p>
      </div>
    </Section>
  )
}

// ─── About View ───────────────────────────────────────────────────────────────
function AboutView() {
  return (
    <Section
      id="about"
      className="bg-ink flex-1 min-h-0 overflow-hidden flex flex-col pt-[var(--header-h)] md:pt-0"
    >
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        <div className="order-1 md:order-2 w-full flex-1 min-h-0 md:flex-none md:w-1/2 md:h-full md:shrink-0 overflow-hidden">
          <FadeImg
            src={ABOUT_IMAGE}
            alt={NAME}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="order-2 md:order-1 shrink-0 md:flex-1 md:w-1/2 md:h-full md:min-h-0 flex flex-col justify-end md:justify-center md:overflow-hidden px-5 sm:px-8 md:px-14 lg:px-16 py-4 sm:py-6 md:py-0 md:pt-[var(--header-h)]">
          <div className="max-w-md md:max-w-sm">
            {BIO.map((para, i) => (
              <p
                key={i}
                className={`font-sans text-[13px] sm:text-[16px] md:text-[13px] leading-[1.7] text-paper/78 font-light ${i > 0 ? "mt-5" : ""}`}
              >
                {para}
              </p>
            ))}
            <div className="mt-6 sm:mt-8 md:mt-10 md:pt-0 pt-5 sm:pt-7 border-t border-paper/10 md:border-t-0">
              <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-paper/40 mb-2 font-medium">
                Services
              </p>
              <p className="font-sans text-[12px] sm:text-[14px] md:text-[12px] text-paper/65 md:text-paper/50 leading-relaxed font-light">
                {SERVICES.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── GIDA View ────────────────────────────────────────────────────────────────
function GidaView() {
  const [subscribed, setSubscribed] = useState(false)

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get("email") || "").trim()
    const firstName = String(data.get("firstName") || "").trim()
    const url = new URL(gidaSubscribeUrl)
    if (email) url.searchParams.set("email", email)
    if (firstName) url.searchParams.set("first_name", firstName)
    window.open(url.toString(), "_blank", "noopener,noreferrer")
    setSubscribed(true)
  }

  return (
    <Section
      id="gida"
      className="bg-paper flex-1 min-h-0 md:overflow-hidden md:flex md:flex-col pt-[calc(var(--header-h)+1.25rem)] pb-0"
    >
      <div className="px-5 sm:px-8 lg:px-12 md:flex-1 md:min-h-0 md:flex md:flex-col md:justify-center">
        <div className="max-w-2xl md:max-w-5xl mx-auto w-full animate-fade-up md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-0 md:items-start">
          <div>
            <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-2 sm:mb-3 md:mb-2 font-medium">
              GIDA
            </p>
            <p className="font-sans text-[12px] tracking-[0.04em] text-ink/55 mb-2 sm:mb-3 md:mb-2 font-normal">
              <span className="font-display text-[14px] sm:text-[15px] tracking-[-0.02em] text-ink/80 not-italic font-semibold">
                {gidaAbout.pronunciation}
              </span>
              <span className="mx-2.5 text-ink/25">·</span>
              {gidaAbout.meaning}
            </p>
            <h1 className="font-display font-semibold text-[clamp(1.85rem,5vw,2.75rem)] md:text-[2.15rem] tracking-[-0.02em] text-ink leading-[0.95] mb-3 sm:mb-4 md:mb-3">
              GIDA
            </h1>
            <div className="space-y-3 md:space-y-2.5 mb-4 md:mb-0">
              {gidaAbout.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-ink/78 font-normal"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {gidaAbout.founder ? (
              <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-ink/50 font-normal mb-4 md:mb-0 md:mt-2.5">
                {gidaAbout.founder}
              </p>
            ) : null}
          </div>

          <div className="mt-4 md:mt-0">
            <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-3 md:mb-2 font-medium">
              Journal
            </p>
            <ol className="border-t border-ink/15 mb-5 md:mb-4">
              {gidaVolumes.map((volume) => (
                <li
                  key={volume.id}
                  className="grid grid-cols-[3.25rem_1fr_auto] sm:grid-cols-[3.75rem_1fr_auto] md:grid-cols-[3rem_1fr_auto] gap-x-3 sm:gap-x-4 py-2 md:py-1.5 border-b border-ink/10 items-start"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-ink/8">
                    <FadeImg
                      src={volume.coverImage}
                      alt={volume.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-sans text-[10px] text-ink-muted tabular-nums tracking-[0.06em] font-medium mb-0.5">
                      {volume.label}
                    </p>
                    {volume.href ? (
                      <a
                        href={volume.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display font-semibold text-[15px] sm:text-[16px] md:text-[15px] tracking-[-0.02em] text-ink leading-snug underline underline-offset-4 decoration-ink/20 hover:decoration-ink"
                      >
                        {volume.title}
                      </a>
                    ) : (
                      <p className="font-display font-semibold text-[15px] sm:text-[16px] md:text-[15px] tracking-[-0.02em] text-ink leading-snug">
                        {volume.title}
                      </p>
                    )}
                    {volume.year ? (
                      <p className="font-sans text-[10px] text-ink/45 mt-0.5 tracking-[0.04em]">
                        {volume.year}
                      </p>
                    ) : null}
                  </div>
                  {volume.href ? (
                    <a
                      href={volume.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[9px] tracking-[0.12em] uppercase text-ink font-medium pt-1 underline underline-offset-4 decoration-ink/25 hover:decoration-ink"
                    >
                      Purchase
                    </a>
                  ) : (
                    <span className="font-sans text-[9px] tracking-[0.12em] uppercase text-ink-muted font-medium pt-1">
                      {volume.status}
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-ink/78 font-normal mb-4 md:mb-3">
              Subscribe to stay connected with the pulse of African art, design, and culture.
            </p>

            <form onSubmit={onSubscribe} className="max-w-md space-y-3 md:space-y-1.5 mb-4 md:mb-2">
              <div className="grid md:grid-cols-2 md:gap-x-6 gap-y-3 md:gap-y-0">
                <label className="block">
                  <span className="font-sans text-[9px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                    Email Address *
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-1 w-full min-h-9 md:min-h-8 bg-transparent border-b border-ink/20 py-1.5 md:py-1 font-sans text-[13px] text-ink outline-none focus:border-ink transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="font-sans text-[9px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                    First Name *
                  </span>
                  <input
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className="mt-1 w-full min-h-9 md:min-h-8 bg-transparent border-b border-ink/20 py-1.5 md:py-1 font-sans text-[13px] text-ink outline-none focus:border-ink transition-colors"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="md:mt-1 inline-flex items-center justify-center px-3.5 py-1.5 border border-ink font-sans text-[9px] tracking-[0.2em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors duration-200"
              >
                {subscribed ? "Opening subscribe…" : "Subscribe →"}
              </button>
            </form>

            <a
              href={gidaInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[12px] text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
            >
              @gidajournal
            </a>
          </div>
        </div>
      </div>

    </Section>
  )
}

// ─── Consultancy View ─────────────────────────────────────────────────────────
function ConsultancyView() {
  const navigate = useNavigate()
  const services = [
    {
      name: "Styling",
      description: "Directing looks for campaigns, editorials, and artist visuals.",
    },
    {
      name: "Creative direction",
      description: "Shaping the overall visual concept and story across a project.",
    },
    {
      name: "Brand image development",
      description: "Building a brand's visual identity and creative positioning.",
    },
    {
      name: "Creative research",
      description: "Sourcing references, archives, and cultural context to ground a project.",
    },
    {
      name: "Costume design",
      description: "Designing character and performance looks for film, music, and campaigns.",
    },
  ]

  return (
    <Section
      id="consultancy"
      className="flex flex-col flex-1 min-h-0 bg-paper md:overflow-hidden pt-[calc(var(--header-h)+0.75rem)] pb-4"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-4 sm:py-6 md:py-0 md:flex-1 md:flex md:items-center md:min-h-0 md:overflow-hidden">
        <div className="max-w-2xl mx-auto w-full">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-2 sm:mb-3 md:mb-2 font-medium">
            Consultancy
          </p>
          <h1 className="font-display font-semibold text-[clamp(1.75rem,5vw,2.6rem)] md:text-[2rem] tracking-[-0.02em] text-ink mb-2 sm:mb-3 leading-[1.05]">
            Consultancy
          </h1>
          <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-ink/70 mb-4 sm:mb-5 md:mb-4 max-w-md font-normal">
            Momo offers the following services for brands, artists, and cultural institutions:
          </p>
          <ul className="border-t border-ink/15">
            {services.map((service) => (
              <li
                key={service.name}
                className="grid grid-cols-[0.9rem_1fr] sm:grid-cols-[1.25rem_1fr] gap-3 sm:gap-4 py-2 sm:py-2.5 md:py-2 border-b border-ink/10"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] sm:mt-[0.7rem] h-px w-3 sm:w-4 bg-ink/35"
                />
                <div>
                  <h2 className="font-display font-semibold text-[16px] sm:text-[20px] md:text-[17px] tracking-[-0.02em] text-ink mb-0.5 leading-snug">
                    {service.name}
                  </h2>
                  <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] md:leading-[1.5] text-ink/68 font-normal max-w-md">
                    {service.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="mt-5 sm:mt-6 md:mt-5 inline-flex items-center justify-center px-3.5 py-1.5 border border-ink font-sans text-[9px] tracking-[0.2em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors duration-200"
          >
            Get in touch
          </button>
        </div>
      </div>
    </Section>
  )
}

// ─── Contact View ─────────────────────────────────────────────────────────────
function ContactView() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") || "")
    const email = String(data.get("email") || "")
    const message = String(data.get("message") || "")
    const subject = encodeURIComponent(`Enquiry from ${name || "website"}`)
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`)
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <Section
      id="contact"
      className="flex flex-col flex-1 min-h-0 bg-paper md:overflow-hidden pt-[calc(var(--header-h)+1.25rem)] pb-6"
    >
      <div className="px-5 sm:px-8 lg:px-12 py-6 sm:py-8 md:flex-1 md:flex md:items-center">
        <div className="max-w-xl mx-auto w-full">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-3 sm:mb-4 font-medium">
            Contact
          </p>
          <h1 className="font-display font-semibold text-[clamp(1.75rem,5vw,2.6rem)] tracking-[-0.02em] text-ink mb-3 leading-[1.05]">
            Get in touch
          </h1>
          <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-ink/70 mb-6 sm:mb-7 max-w-md font-normal">
            For commissions, GIDA, consultancy, or press — send a note or reach out on Instagram.
          </p>

          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 mb-6 sm:mb-7">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
              <label className="block">
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                  Name
                </span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full min-h-8 bg-transparent border-0 border-b border-ink/10 py-1 font-sans text-[12px] sm:text-[13px] leading-[1.6] font-normal text-ink outline-none focus:border-ink/40 transition-colors"
                />
              </label>
              <label className="block">
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full min-h-8 bg-transparent border-0 border-b border-ink/10 py-1 font-sans text-[12px] sm:text-[13px] leading-[1.6] font-normal text-ink outline-none focus:border-ink/40 transition-colors"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={2}
                className="mt-1 w-full bg-transparent border-0 border-b border-ink/10 py-1 font-sans text-[12px] sm:text-[13px] leading-[1.6] font-normal text-ink outline-none focus:border-ink/40 transition-colors resize-none min-h-[2.75rem]"
              />
            </label>
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center px-3.5 py-1.5 border border-ink font-sans text-[9px] tracking-[0.2em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors duration-200"
            >
              {sent ? "Opening mail…" : "Send message →"}
            </button>
          </form>

          <div className="mt-12 sm:mt-16 space-y-3 sm:space-y-4">
            <div>
              <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted mb-2 font-medium">
                Email
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="font-sans text-[12px] sm:text-[13px] leading-[1.6] font-normal text-ink hover:opacity-45 transition-opacity"
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted mb-3 font-medium">
                Socials
              </p>
              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {SOCIAL.map((item) => (
                  <li key={item.handle}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[12px] sm:text-[13px] leading-[1.6] font-normal text-ink hover:opacity-45 transition-opacity"
                    >
                      @{item.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function SiteFooter() {
  const location = useLocation()
  const onInk = location.pathname === "/about"

  return (
    <div
      className={`px-5 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex flex-col gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0 ${
        onInk ? "bg-ink" : "bg-paper"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className={`font-sans text-[9px] tracking-wider ${onInk ? "text-paper/45" : "text-ink-muted"}`}>
          © {new Date().getFullYear()} {NAME} · ALL RIGHTS RESERVED
        </p>
        <p className={`font-sans text-[11px] tracking-wider shrink-0 ${onInk ? "text-paper/45" : "text-ink-muted"}`}>
          {LOCATION}
        </p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 min-w-0">
        {PAGES.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`font-sans text-[9px] tracking-wider transition-colors ${
              onInk ? "text-paper/45 hover:text-paper" : "text-ink-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const touchStartX = useRef<number | null>(null)
  const touchDelta = useRef(0)
  const didSwipe = useRef(false)

  const clickOnVisibleImage = (e: MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const rect = img.getBoundingClientRect()
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    if (!nw || !nh) return true
    const scale = Math.min(rect.width / nw, rect.height / nh)
    const dw = nw * scale
    const dh = nh * scale
    const left = rect.left + (rect.width - dw) / 2
    const top = rect.top + (rect.height - dh) / 2
    return (
      e.clientX >= left &&
      e.clientX <= left + dw &&
      e.clientY >= top &&
      e.clientY <= top + dh
    )
  }

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
    touchDelta.current = 0
  }

  const onTouchMove = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    touchDelta.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current
  }

  const onTouchEnd = () => {
    const swiped = Math.abs(touchDelta.current) > 50
    didSwipe.current = swiped
    if (swiped) {
      if (touchDelta.current > 0) onPrev()
      else onNext()
    }
    touchStartX.current = null
    touchDelta.current = 0
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-ink/97 flex items-center justify-center animate-fade-in pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="relative w-full h-full flex items-center justify-center px-0 pt-9 pb-7 sm:px-10 sm:py-10"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <FadeImg
          key={images[index]}
          src={`${images[index]?.split("?")[0]}?w=1600&fit=max&auto=format&q=85`}
          srcSet={`${images[index]?.split("?")[0]}?w=800&fit=max&auto=format&q=80 800w, ${images[index]?.split("?")[0]}?w=1600&fit=max&auto=format&q=85 1600w`}
          sizes="100vw"
          alt={`Image ${index + 1}`}
          className="w-full h-full max-w-full max-h-full object-contain select-none animate-scale-in !h-full"
          loading="eager"
          onClick={(e) => {
            e.stopPropagation()
            if (didSwipe.current) {
              didSwipe.current = false
              return
            }
            if (!clickOnVisibleImage(e)) onClose()
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 font-sans text-[10px] sm:text-[9px] tracking-[0.22em] uppercase text-paper/50 hover:text-paper transition-colors min-h-10 min-w-10 px-2"
        >
          Close
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              aria-label="Previous image"
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 text-paper/50 hover:text-paper transition-colors p-2 sm:p-4 text-lg sm:text-xl min-h-10 min-w-10 sm:min-h-12 sm:min-w-12"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              aria-label="Next image"
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 text-paper/50 hover:text-paper transition-colors p-2 sm:p-4 text-lg sm:text-xl min-h-10 min-w-10 sm:min-h-12 sm:min-w-12"
            >
              →
            </button>
          </>
        )}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-[0.14em] uppercase text-paper/35 font-medium">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [workMode, setWorkMode] = useState<WorkMode>("grid")
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  const workProjectId = location.pathname.startsWith("/work/")
    ? decodeURIComponent(location.pathname.slice("/work/".length).split("/")[0] ?? "")
    : ""
  const activeProject = workProjectId
    ? projects.find((project) => project.id === workProjectId) ?? null
    : null

  const openGallery = (project: Project) => {
    navigate(`/work/${project.id}`)
  }

  const closeGallery = useCallback(() => {
    navigate("/work")
  }, [navigate])

  const goAdjacentCollection = useCallback(
    (delta: number) => {
      if (!activeProject) return
      const i = projects.findIndex((p) => p.id === activeProject.id)
      if (i < 0) return
      const next = projects[(i + delta + projects.length) % projects.length]
      if (next) navigate(`/work/${next.id}`)
    },
    [activeProject, navigate],
  )

  const openLightbox = (src: string, all: string[]) => {
    const index = all.indexOf(src)
    setLightbox({ images: all, index: index >= 0 ? index : 0 })
  }

  const prevImage = useCallback(() => {
    setLightbox((current) => {
      if (!current) return current
      return {
        ...current,
        index: (current.index - 1 + current.images.length) % current.images.length,
      }
    })
  }, [])

  const nextImage = useCallback(() => {
    setLightbox((current) => {
      if (!current) return current
      return {
        ...current,
        index: (current.index + 1) % current.images.length,
      }
    })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === "ArrowLeft") prevImage()
        if (e.key === "ArrowRight") nextImage()
        if (e.key === "Escape") setLightbox(null)
        return
      }
      if (activeProject && e.key === "Escape") closeGallery()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, activeProject, prevImage, nextImage, closeGallery])

  useEffect(() => {
    document.body.style.overflow = lightbox || activeProject ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightbox, activeProject])

  useEffect(() => {
    const about = location.pathname === "/about"
    const fill = about ? "var(--color-ink)" : "var(--color-paper)"
    document.documentElement.style.background = fill
    document.body.style.background = fill
    return () => {
      document.documentElement.style.background = ""
      document.body.style.background = ""
    }
  }, [location.pathname])

  return (
    <div
      className={`flex flex-col ${
        location.pathname === "/about"
          ? "min-h-[100dvh] md:h-[100dvh] md:overflow-hidden bg-ink text-paper"
          : location.pathname === "/consultancy"
            ? "min-h-[100dvh] md:h-[100dvh] md:overflow-hidden bg-paper text-ink"
            : "min-h-[100dvh] bg-paper text-ink"
      }`}
    >
      <Nav />

      <main className="flex-1 flex flex-col min-h-0">
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/about" element={<AboutView />} />
          <Route
            path="/work"
            element={
              <WorkSection
                mode={workMode}
                activeCategory={activeCategory}
                onWorkMode={setWorkMode}
                onCategory={setActiveCategory}
                onOpen={openGallery}
                onLightbox={openLightbox}
              />
            }
          />
          <Route
            path="/work/:projectId"
            element={
              <WorkSection
                mode={workMode}
                activeCategory={activeCategory}
                onWorkMode={setWorkMode}
                onCategory={setActiveCategory}
                onOpen={openGallery}
                onLightbox={openLightbox}
              />
            }
          />
          <Route path="/consultancy" element={<ConsultancyView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/gida" element={<GidaView />} />
        </Routes>
      </main>

      <SiteFooter />

      {activeProject && (
        <GalleryOverlay
          project={activeProject}
          onClose={closeGallery}
          onPrevCollection={() => goAdjacentCollection(-1)}
          onNextCollection={() => goAdjacentCollection(1)}
        />
      )}

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  )
}
