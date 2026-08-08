// ─────────────────────────────────────────────────────────────────────────────
// GIDA HUB — edit this file to update the GIDA section
//
// VOLUMES / PROGRAMMING:
//   Replace the placeholder rows below with real titles, years, and regions.
//   Order in each array = order on screen.
//
// SUBSCRIBE:
//   Set `subscribeUrl` to the live newsletter / Typeform / Beehiiv link.
//   Until then it opens @gidajournal.
// ─────────────────────────────────────────────────────────────────────────────

export const gidaInstagram = "https://instagram.com/gidajournal"
export const gidaSubscribeUrl = "https://instagram.com/gidajournal"

export const gidaAbout = {
  pronunciation: "/ˈɡiːdə/",
  meaning: "“home-grown” in English from Hausa",
  founder: "Founded by Momo Hassan-Odukale.",
  paragraphs: [
    "Born out of necessity, GIDA is a print and digital platform, a marketplace, and a community where African creatives, writers and thinkers can connect, develop their practice, and share their work.",
    "GIDA is the tie that binds African local talent, heritage, stories and craftsmanship with the rest of the world. Incubating and harnessing the power of collaboration through creativity, GIDA births pivotal digital and physical monuments for the next generation of African creatives to be.",
    "GIDA Journal is an annual print publication, prioritising works by creatives, writers and thinkers based and living in Africa. In each volume we focus on a different region, working closely with creatives from various fields, whose practices we believe in and are committed to platforming. We are dedicated to promoting and protecting the diversity of cultural practices and expressions in Africa, particularly through focusing on heritage and craftsmanship.",
    "Each publication acts as an archival monument, capturing a moment in time in African creativity across mediums and exploring broad themes from architecture and fashion, to sustainability and the visual arts. GIDA Journal is a timeless anthology where emerging and established African creatives, writers and thinkers can co-exist in a space that prioritises freedom of cultural expression and diversity of perspectives.",
  ],
}

export type GidaVolumeStatus = "Available" | "Sold out" | "Archive"

export interface GidaVolume {
  id: string
  label: string
  title: string
  year?: string
  status: GidaVolumeStatus
  coverImage: string
  href?: string
}

export const gidaVolumes: GidaVolume[] = [
  {
    id: "vol-ii",
    label: "Vol. II",
    title: "GIDA Journal Vol. II",
    status: "Sold out",
    coverImage: "/images/gida/volumes/vol-ii.jpg",
  },
  {
    id: "vol-iii",
    label: "Vol. III",
    title: "GIDA Journal Vol. III",
    status: "Available",
    coverImage: "/images/gida/volumes/vol-iii.jpg",
    href: "https://gidajournal.com/product/gida-journal-vol-iii/",
  },
]

export interface GidaProgram {
  id: string
  kind: "Roundtable" | "Event"
  title: string
  year: string
  href?: string
}

export const gidaProgramming: GidaProgram[] = [
  {
    id: "prog-02",
    kind: "Event",
    title: "GIDA Screen-Printing Workshop and Pop-Up",
    year: "2026",
    href: "https://www.instagram.com/p/DXHBtrxCJfp/?img_index=3",
  },
]

export interface GidaFeature {
  id: string
  label: string
  title: string
  body: string
  readMoreHref: string
  images: string[]
}

export const gidaFeatures: GidaFeature[] = [
  {
    id: "cowrie",
    label: "From the archive",
    title: "The cowrie shell",
    body: "The cowrie shell has long existed between the material and spiritual worlds, they are cast in divination, sewn onto sacred objects, incorporated into shrines and worn by priests, initiates, rulers and spiritual figures whose bodies and regalia mark their proximity to the divine.",
    readMoreHref: "https://www.instagram.com/p/DbqTbj-iMOu/?img_index=1",
    images: [
      "/images/gida/cowrie/01.jpg",
      "/images/gida/cowrie/02.jpg",
      "/images/gida/cowrie/03.jpg",
      "/images/gida/cowrie/04.jpg",
      "/images/gida/cowrie/05.jpg",
    ],
  },
  {
    id: "mobile-cinema",
    label: "From the archive",
    title: "Ghana’s mobile cinema",
    body: "In the 1980s, Ghana’s mobile cinema operators travelled from village to village with a television, a VCR, and a generator showing films wherever they could gather a crowd. To advertise screenings of Hollywood, Bollywood, and Nigerian films they needed large posters. With no access to printing technology, they commissioned local painters who created large-scale works using oil paint on cotton flour sacks sewn together. What those painters produced, working often without having seen the films they were illustrating, without access to stills or cover art, relying almost entirely on imagination, became one of the most visually extraordinary and least formally recognised art movements on the continent.",
    readMoreHref: "https://www.instagram.com/p/DbtMxxdCDX1/?img_index=4",
    images: [
      "/images/gida/mobile-cinema/01.jpg",
      "/images/gida/mobile-cinema/02.jpg",
      "/images/gida/mobile-cinema/03.jpg",
      "/images/gida/mobile-cinema/04.jpg",
      "/images/gida/mobile-cinema/05.jpg",
      "/images/gida/mobile-cinema/06.jpg",
    ],
  },
]

export const gidaGuide = {
  title: "The GIDA Guide & Library",
  paragraphs: [
    "Every month, GIDA editors—or guest contributors—share curated recommendations on where to eat, shop, and explore across Africa in The GIDA Guide.",
    "At GIDA, we champion African creativity in all its forms. Our newsletter features exhibitions worldwide showcasing artists from the continent, a wish list of fashion, beauty, and homeware from African brands, and more. For those drawn to deeper research and cultural storytelling, The GIDA Library highlights essays, archival finds, and thought-provoking insights from our contributors.",
    "Subscribe to stay connected with the pulse of African art, design, and culture.",
  ],
}
