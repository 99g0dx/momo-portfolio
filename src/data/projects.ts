export interface Project {
  id: string
  title: string
  category: string
  year: string
  coverImage: string
  images: string[]
  client?: string
  description?: string
}

export const projects: Project[] = [
  {
    id: "kadiju-last-gesture-2026",
    title: "KADIJU — Last gesture before midnight",
    category: "Creative Direction & Styling",
    year: "2026",
    client: "KADIJU",
    description: "Editorial",
    coverImage: "/images/kadiju-last-gesture/03-thumb.webp",
    images: [
      "/images/kadiju-last-gesture/03-full.webp",
      "/images/kadiju-last-gesture/01-full.webp",
      "/images/kadiju-last-gesture/02-full.webp",
    ],
  },
  {
    id: "the-audition-2025",
    title: "The Audition",
    category: "Styling",
    year: "2025",
    description: "Editorial",
    coverImage: "/images/the-audition-2025/01-thumb.webp",
    images: [
      "/images/the-audition-2025/01-full.webp",
      "/images/the-audition-2025/02-full.webp",
    ],
  },
  {
    id: "heatwave-2025",
    title: "HEATWAVE",
    category: "Creative Direction & Styling",
    year: "2025",
    client: "Heatwave",
    description: "Editorial",
    coverImage: "/images/heatwave/01-thumb.webp",
    images: ["/images/heatwave/01-full.webp", "/images/heatwave/02-full.webp"],
  },
  {
    id: "farfetch-2021",
    title: "FARFETCH",
    category: "Styling",
    year: "2021",
    client: "Farfetch",
    description: "Editorial",
    coverImage: "/images/farfetch/01-thumb.webp",
    images: ["/images/farfetch/01-full.webp", "/images/farfetch/02-full.webp"],
  },
  {
    id: "krucible-2025",
    title: "KRUCIBLE",
    category: "Styling",
    year: "2025",
    client: "Krucible",
    description: "Editorial",
    coverImage: "/images/krucible/01-thumb.webp",
    images: ["/images/krucible/01-full.webp", "/images/krucible/02-full.webp"],
  },
  {
    id: "lisa-folawiyo-coll-1-2024",
    title: "LISA FOLAWIYO Coll 1",
    category: "Styling",
    year: "2024",
    client: "Lisa Folawiyo",
    description: "Runway",
    coverImage: "/images/lisa-folawiyo-coll-1/01-thumb.webp",
    images: [
      "/images/lisa-folawiyo-coll-1/01-full.webp",
      "/images/lisa-folawiyo-coll-1/02-full.webp",
    ],
  },
  {
    id: "davido-5ive-album-2025",
    title: "DAVIDO 5ive ALBUM COVER",
    category: "Styling",
    year: "2025",
    client: "Davido",
    description: "Editorial",
    coverImage: "/images/davido-5ive-album/01-thumb.webp",
    images: [
      "/images/davido-5ive-album/01-full.webp",
      "/images/davido-5ive-album/02-full.webp",
      "/images/davido-5ive-album/03-full.webp",
    ],
  },
  {
    id: "asa-gq-cover-2024",
    title: "ASA — GQ COVER",
    category: "Styling",
    year: "2024",
    client: "GQ South Africa",
    description: "Editorial",
    coverImage: "/images/asa-gq-cover/01-thumb.webp",
    images: ["/images/asa-gq-cover/01-full.webp", "/images/asa-gq-cover/02-full.webp"],
  },
  {
    id: "native-magazine-2022",
    title: "The Native Magazine",
    category: "Styling",
    year: "2022",
    client: "The Native",
    description: "Editorial",
    coverImage: "/images/native-magazine/01-thumb.webp",
    images: ["/images/native-magazine/01-full.webp"],
  },
  {
    id: "lesson-teacher-2022",
    title: "Lesson Teacher",
    category: "Styling",
    year: "2022",
    description: "Editorial",
    coverImage: "/images/lesson-teacher/01-thumb.webp",
    images: [
      "/images/lesson-teacher/01-full.webp",
      "/images/lesson-teacher/02-full.webp",
    ],
  },
  {
    id: "lfw-zine-2020",
    title: "Lagos Fashion Week Zine",
    category: "Creative Direction, Styling & Production",
    year: "2020",
    client: "Lagos Fashion Week",
    description: "Editorial",
    coverImage: "/images/lfw-zine/01-thumb.webp",
    images: ["/images/lfw-zine/01-full.webp"],
  },
  {
    id: "nike-wafcon-2026",
    title: "NIKE WAFCON",
    category: "Styling",
    year: "2026",
    client: "Nike",
    description: "Editorial",
    coverImage: "/images/nike-wafcon/01-thumb.webp",
    images: [
      "/images/nike-wafcon/01-full.webp",
      "/images/nike-wafcon/02-full.webp",
      "/images/nike-wafcon/03-full.webp",
    ],
  },
  {
    id: "nocta-2023",
    title: "Nocta",
    category: "Styling",
    year: "2023",
    client: "NOCTA",
    description: "Campaign",
    coverImage: "/images/nocta/01-thumb.webp",
    images: ["/images/nocta/01-full.webp", "/images/nocta/02-full.webp"],
  },
]

/** Grid / index thumbs from a full gallery path. */
export function thumbFromFull(src: string) {
  return src.replace(/-full\.webp$/, "-thumb.webp")
}
