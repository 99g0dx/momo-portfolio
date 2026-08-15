import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
  type ReactNode,
  type TouchEvent,
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

function FadeImg({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes,
  srcSet,
}: {
  src: string
  alt: string
  className?: string
  loading?: "lazy" | "eager"
  sizes?: string
  srcSet?: string
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
    `font-sans text-[11px] sm:text-[10.5px] tracking-[0.14em] uppercase px-1.5 py-1 transition-opacity duration-200 shrink-0 inline-flex items-center font-medium ${
      active ? "text-ink" : "text-ink/38 hover:text-ink"
    }`

  return (
    <div className="px-2 sm:px-4 md:px-6 py-2 flex items-center gap-2 sm:gap-3">
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
      <div className="flex gap-3 shrink-0 pl-3 ml-1 border-l border-ink/15">
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
          <Link
            to="/"
            onClick={closeMenu}
            aria-label={NAME}
            className="absolute left-1/2 -translate-x-1/2 z-10 shrink-0 transition-opacity hover:opacity-55"
          >
            <img
              src={LOGO}
              alt={NAME}
              className={`h-14 sm:h-16 md:h-[4.5rem] w-auto object-contain ${isAbout ? "invert" : ""}`}
            />
          </Link>

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
        <div className={`h-px ${isAbout ? "bg-paper/15" : "bg-ink/10"}`} />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
      {filtered.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onOpen(p)}
          className="group text-left w-full animate-fade-up"
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <div className="overflow-hidden bg-ink/8 mb-3 w-full aspect-[3/4]">
            <FadeImg
              src={imgUrl(p.coverImage, 600)}
              srcSet={`${imgUrl(p.coverImage, 400)} 400w, ${imgUrl(p.coverImage, 700)} 700w, ${imgUrl(p.coverImage, 1000)} 1000w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.02]"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-display text-[17px] sm:text-[18px] tracking-[-0.015em] text-ink leading-snug min-w-0 break-words">
              {p.title}
            </p>
            <p className="font-sans text-[11px] text-ink-muted shrink-0 font-normal">{p.year}</p>
          </div>
          <p className="font-sans text-[10.5px] text-ink-muted mt-1.5 tracking-[0.12em] uppercase font-medium">
            {projectCredit(p)}
          </p>
          <div className="mt-3 h-px bg-ink/10" />
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
            <div className="relative z-10 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4 py-4 sm:py-5 border-b border-ink/10 min-h-14">
              <p className="font-display text-[19px] sm:text-[21px] tracking-[-0.02em] text-ink flex-1 leading-[1.1] min-w-0 break-words">
                {p.title}
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <p className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-ink-muted shrink-0 font-medium">
                  {projectCredit(p)}
                </p>
                <p className="font-sans text-[11px] text-ink-muted shrink-0 sm:w-10 sm:text-right">
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
    <div className="space-y-10 sm:space-y-14">
      {filtered.map((p) => (
        <div key={p.id}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 mb-3 sm:mb-4">
            <h2 className="font-display text-[22px] sm:text-[26px] tracking-[-0.02em] text-ink leading-none min-w-0 break-words">
              {p.title}
            </h2>
            <p className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-ink-muted shrink-0 font-medium">
              {projectCredit(p)}
              <span className="mx-1.5 opacity-50">·</span>
              {p.year}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0.5">
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
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
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8">
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
  onLightbox,
}: {
  project: Project
  onClose: () => void
  onLightbox: (src: string, all: string[]) => void
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] bg-paper animate-fade-in overflow-y-auto pt-[env(safe-area-inset-top)]">
      <div className="sticky top-0 z-10 bg-paper/96 backdrop-blur-md border-b border-ink/10 px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors min-h-9"
        >
          ← Close
        </button>
        <p className="font-display text-[17px] tracking-[-0.015em] text-ink">
          {project.title}
        </p>
        <span className="w-16" />
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 pb-20">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[32px] sm:text-[40px] tracking-[-0.025em] text-ink leading-[1.05]">
              {project.title}
            </h1>
          </div>
          <p className="font-sans text-[10.5px] text-ink-muted tracking-[0.12em] uppercase sm:text-right font-medium">
            {projectCredit(project)}
            <span className="mx-1.5 opacity-40">·</span>
            {project.year}
            {project.client && (
              <>
                <br />
                <span className="normal-case tracking-normal font-normal text-ink/55">
                  {project.client}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
          {project.images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onLightbox(src, project.images)}
              className="group aspect-square overflow-hidden bg-ink/8"
            >
              <FadeImg
                src={imgUrl(src, 500, 500)}
                alt={`${project.title} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                loading={i < 4 ? "eager" : "lazy"}
              />
            </button>
          ))}
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
      className="min-h-[100dvh] flex items-center justify-center bg-paper px-5 sm:px-8 lg:px-12 pt-[var(--header-h)]"
    >
      <div className="max-w-3xl mx-auto text-center animate-fade-up w-full">
        <img
          src={LOGO}
          alt=""
          className="mx-auto h-[clamp(3.25rem,16vw,7.5rem)] w-auto object-contain"
        />
        <h1 className="-mt-2 sm:-mt-3 font-display text-[clamp(1.35rem,5.5vw,2.85rem)] tracking-[-0.03em] font-light text-ink leading-[1.1] uppercase break-words">
          Momo Hassan-Odukale
        </h1>
        <p className="mt-4 sm:mt-6 font-sans text-[14px] sm:text-[16px] leading-[1.7] text-ink/65 font-light max-w-md mx-auto px-1">
          Momo Hassan-Odukale is a stylist, creative director, and consultant.
        </p>
      </div>
    </Section>
  )
}

// ─── About View ───────────────────────────────────────────────────────────────
function AboutView() {
  return (
    <Section id="about" className="bg-ink min-h-[100dvh] pt-[var(--header-h)] md:pt-0">
      <div className="flex flex-col md:flex-row md:min-h-[100dvh]">
        <div className="order-1 md:order-2 w-full md:w-[42%] md:shrink-0 aspect-[4/5] md:aspect-auto md:min-h-[100dvh] overflow-hidden">
          <FadeImg
            src={ABOUT_IMAGE}
            alt={NAME}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="order-2 md:order-1 flex-1 flex flex-col justify-end px-5 sm:px-8 md:px-10 py-10 sm:py-12 md:pb-14 md:pt-[var(--header-h)]">
          <div className="max-w-md">
            {BIO.map((para, i) => (
              <p
                key={i}
                className={`font-sans text-[15px] sm:text-[16px] leading-[1.8] text-paper/78 font-light ${i > 0 ? "mt-5" : ""}`}
              >
                {para}
              </p>
            ))}
            <div className="mt-8 pt-7 border-t border-paper/10">
              <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-paper/40 mb-2 font-medium">
                Services
              </p>
              <p className="font-sans text-[13px] sm:text-[14px] text-paper/65 leading-relaxed font-light">
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
    <Section id="gida" className="bg-[#e6e2d8] py-16 sm:py-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-5 font-medium">
            GIDA
          </p>
          <p className="font-sans text-[12px] sm:text-[13px] tracking-[0.04em] text-ink/55 mb-4 font-light">
            <span className="font-display text-[15px] sm:text-[16px] tracking-[-0.02em] text-ink/80 not-italic">
              {gidaAbout.pronunciation}
            </span>
            <span className="mx-2.5 text-ink/25">·</span>
            {gidaAbout.meaning}
          </p>
          <h1 className="font-display text-[clamp(2.6rem,8vw,4.25rem)] tracking-[-0.04em] font-light text-ink leading-[0.95] mb-8">
            GIDA
          </h1>
          <div className="space-y-5 mb-6">
            {gidaAbout.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="font-sans text-[15px] sm:text-[16px] leading-[1.8] text-ink/78 font-light"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {gidaAbout.founder ? (
            <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-ink/50 font-light">
              {gidaAbout.founder}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 mt-16 sm:mt-20">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-8 font-medium">
            Journal
          </p>
          <ol className="border-t border-ink/15">
            {gidaVolumes.map((volume) => (
              <li
                key={volume.id}
                className="grid grid-cols-[4.75rem_1fr_auto] sm:grid-cols-[5.5rem_1fr_auto] gap-x-4 sm:gap-x-5 py-4 border-b border-ink/10 items-start"
              >
                <div className="aspect-[3/4] overflow-hidden bg-ink/8">
                  <FadeImg
                    src={volume.coverImage}
                    alt={volume.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="font-sans text-[11px] text-ink-muted tabular-nums tracking-[0.06em] font-medium mb-1.5">
                    {volume.label}
                  </p>
                  {volume.href ? (
                    <a
                      href={volume.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-[18px] sm:text-[20px] tracking-[-0.02em] text-ink leading-snug underline underline-offset-4 decoration-ink/20 hover:decoration-ink"
                    >
                      {volume.title}
                    </a>
                  ) : (
                    <p className="font-display text-[18px] sm:text-[20px] tracking-[-0.02em] text-ink leading-snug">
                      {volume.title}
                    </p>
                  )}
                  {volume.year ? (
                    <p className="font-sans text-[11px] text-ink/45 mt-1 tracking-[0.04em]">
                      {volume.year}
                    </p>
                  ) : null}
                </div>
                {volume.href ? (
                  <a
                    href={volume.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[10px] tracking-[0.12em] uppercase text-ink font-medium pt-1 underline underline-offset-4 decoration-ink/25 hover:decoration-ink"
                  >
                    Purchase
                  </a>
                ) : (
                  <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-ink-muted font-medium pt-1">
                    {volume.status}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-12 mt-16 sm:mt-24">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <p className="font-sans text-[15px] sm:text-[16px] leading-[1.8] text-ink/78 font-light mb-10">
            Subscribe to stay connected with the pulse of African art, design, and culture.
          </p>

          <form onSubmit={onSubscribe} className="max-w-md space-y-5 mb-8">
            <label className="block">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                Email Address *
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full min-h-11 bg-transparent border-b border-ink/20 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                First Name *
              </span>
              <input
                name="firstName"
                required
                autoComplete="given-name"
                className="mt-2 w-full min-h-11 bg-transparent border-b border-ink/20 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-ink transition-colors"
              />
            </label>
            <button
              type="submit"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-ink hover:opacity-45 transition-opacity"
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

      <SiteFooter />
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
    <Section id="consultancy" className="bg-[#f1efe8] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="max-w-2xl mx-auto">
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-6 font-medium">
          Consultancy
        </p>
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.4rem)] tracking-[-0.03em] text-ink leading-[1.08] mb-5">
          Consultancy
        </h1>
        <p className="font-sans text-[15px] sm:text-[16px] leading-[1.75] text-ink/72 mb-12 max-w-lg font-light">
          Momo offers the following services for brands, artists, and cultural institutions:
        </p>
        <ul className="border-t border-ink/15">
          {services.map((service) => (
            <li
              key={service.name}
              className="grid grid-cols-[1.25rem_1fr] gap-5 py-6 border-b border-ink/10"
            >
              <span
                aria-hidden="true"
                className="mt-[0.85rem] h-px w-4 bg-ink/35"
              />
              <div>
                <h2 className="font-display text-[24px] sm:text-[28px] tracking-[-0.025em] text-ink mb-2 leading-none">
                  {service.name}
                </h2>
                <p className="font-sans text-[14px] sm:text-[15px] leading-7 text-ink/68 font-light max-w-md">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="mt-10 font-sans text-[11px] tracking-[0.2em] uppercase border border-ink px-5 py-3 text-ink hover:bg-ink hover:text-paper transition-colors"
        >
          Get in touch
        </button>
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
    <Section id="contact" className="flex flex-col bg-paper pt-[calc(var(--header-h)+2.5rem)]">
      <div className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="max-w-xl mx-auto">
          <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink-muted mb-5 font-medium">
            Contact
          </p>
          <h1 className="font-display text-[clamp(2.35rem,5.5vw,3.5rem)] text-ink mb-4 tracking-[-0.03em] leading-[1.05]">
            Get in touch
          </h1>
          <p className="font-sans text-[15px] sm:text-[16px] text-ink/70 leading-[1.75] mb-12 max-w-md font-light">
            For commissions, GIDA, consultancy, or press — send a note or reach out on Instagram.
          </p>

          <form onSubmit={onSubmit} className="space-y-5 mb-12">
            <label className="block">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                Name
              </span>
              <input
                name="name"
                required
                className="mt-2 w-full min-h-11 bg-transparent border-b border-ink/20 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full min-h-11 bg-transparent border-b border-ink/20 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted font-medium">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={4}
                className="mt-2 w-full min-h-11 bg-transparent border-b border-ink/20 py-2.5 font-sans text-[14px] text-ink outline-none focus:border-ink transition-colors resize-y min-h-[6rem]"
              />
            </label>
            <button
              type="submit"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-ink hover:opacity-45 transition-opacity"
            >
              {sent ? "Opening mail…" : "Send message →"}
            </button>
          </form>

          <div className="border-t border-ink/15 pt-8 space-y-5">
            <div>
              <p className="font-sans text-[10px] tracking-[0.16em] uppercase text-ink-muted mb-2 font-medium">
                Email
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="font-sans text-[14px] text-ink hover:opacity-45 transition-opacity"
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
                      className="font-sans text-[13px] text-ink hover:opacity-45 transition-opacity"
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
  return (
    <div className="border-t border-ink/10 px-5 sm:px-8 lg:px-12 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 bg-[#e6e2d8] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <p className="font-sans text-[9px] text-ink-muted tracking-wider">
        © {new Date().getFullYear()} {NAME} · ALL RIGHTS RESERVED
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 min-w-0">
        {PAGES.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="font-sans text-[9px] text-ink-muted tracking-wider hover:text-ink transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <p className="font-sans text-[9px] text-ink-faint tracking-wider">{LOCATION}</p>
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
        className="relative w-full h-full flex items-center justify-center px-3 sm:px-10 py-14 sm:py-10"
        onClick={(e) => e.stopPropagation()}
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
          className="max-w-full max-h-full object-contain select-none animate-scale-in"
          loading="eager"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-6 font-sans text-[10px] sm:text-[9px] tracking-[0.22em] uppercase text-paper/50 hover:text-paper transition-colors min-h-10 min-w-10 px-2"
        >
          Close
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-paper/50 hover:text-paper transition-colors p-3 sm:p-4 text-xl min-h-12 min-w-12"
            >
              ←
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-paper/50 hover:text-paper transition-colors p-3 sm:p-4 text-xl min-h-12 min-w-12"
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
  const [workMode, setWorkMode] = useState<WorkMode>("grid")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  const openGallery = (project: Project) => {
    setActiveProject(project)
  }

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
      if (activeProject && e.key === "Escape") setActiveProject(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, activeProject, prevImage, nextImage])

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightbox])

  return (
    <div className={`min-h-[100dvh] ${location.pathname === "/about" ? "bg-ink text-paper" : "bg-paper text-ink"}`}>
      <Nav />

      <main>
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
          <Route path="/consultancy" element={<ConsultancyView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/gida" element={<GidaView />} />
        </Routes>
      </main>

      {activeProject && (
        <GalleryOverlay
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onLightbox={openLightbox}
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
