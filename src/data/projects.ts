// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA — edit this file to update your work
//
// HOW TO ADD A NEW PROJECT:
//   1. Copy one of the objects below and paste it into the `projects` array.
//   2. Give it a unique `id` (no spaces — used internally by React).
//   3. Set `coverImage` to the URL of your cover photo.
//   4. Add all gallery image URLs to the `images` array (order matters).
//   5. Fill in `title`, `category`, `year`. `client` and `description` are optional.
//
// HOW TO ADD IMAGES TO AN EXISTING PROJECT:
//   - Push new URLs into that project's `images` array.
//
// HOW TO REORDER PROJECTS ON THE GRID:
//   - Move the object up or down in the array — order in the array = order on screen.
//
// IMAGE URL OPTIONS:
//   - Local files placed in /public/images/   →  "/images/my-photo.jpg"
//   - Any public image URL                    →  "https://example.com/photo.jpg"
//   - Unsplash (placeholder)                  →  "https://images.unsplash.com/photo-{id}"
//
// ─────────────────────────────────────────────────────────────────────────────

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
    id: "editorial-noir-2024",
    title: "Five Years of Kad",
    category: "Creative Direction",
    year: "2024",
    client: "Self-initiated",
    description:
      "A study in shadow and silhouette across five sittings. Available exclusively.",
    coverImage: "/images/five-years-of-kad/01.jpg",
    images: [
      "/images/five-years-of-kad/01.jpg",
      "/images/five-years-of-kad/02.jpg",
      "/images/five-years-of-kad/03.jpg",
      "/images/five-years-of-kad/04.jpg",
      "/images/five-years-of-kad/05.jpg",
      "/images/five-years-of-kad/06.jpg",
      "/images/five-years-of-kad/07.jpg",
      "/images/five-years-of-kad/08.jpg",
    ],
  },
  {
    id: "portrait-quiet-2024",
    title: "Temi Otedola & Mr Eazi",
    category: "Styling",
    year: "2024",
    client: "Temi Otedola & Mr Eazi",
    description:
      "Studio portraits from a private celebration — traditional dress, coral, and quiet ceremony.",
    coverImage: "/images/temi-otedola-mr-eazi/01.jpg",
    images: [
      "/images/temi-otedola-mr-eazi/01.jpg",
      "/images/temi-otedola-mr-eazi/02.jpg",
      "/images/temi-otedola-mr-eazi/03.jpg",
      "/images/temi-otedola-mr-eazi/04.jpg",
      "/images/temi-otedola-mr-eazi/05.jpg",
      "/images/temi-otedola-mr-eazi/06.jpg",
      "/images/temi-otedola-mr-eazi/07.jpg",
      "/images/temi-otedola-mr-eazi/08.jpg",
      "/images/temi-otedola-mr-eazi/09.jpg",
      "/images/temi-otedola-mr-eazi/10.jpg",
    ],
  },
  {
    id: "campaign-structured-2023",
    title: "Davido's 5ive Album artwork",
    category: "Creative Direction",
    year: "2023",
    client: "Davido",
    description:
      "Campaign and concept imagery for Davido's 5ive album artwork — desert sets, costume design, and stills.",
    coverImage: "/images/davido-5ive/02.jpg",
    images: [
      "/images/davido-5ive/01.jpg",
      "/images/davido-5ive/02.jpg",
      "/images/davido-5ive/03.jpg",
      "/images/davido-5ive/04.jpg",
      "/images/davido-5ive/05.jpg",
      "/images/davido-5ive/06.jpg",
      "/images/davido-5ive/07.jpg",
      "/images/davido-5ive/08.jpg",
      "/images/davido-5ive/09.jpg",
    ],
  },
  {
    id: "creative-dir-material-2023",
    title: "The Audition",
    category: "Creative Direction",
    year: "2025",
    client: "Daniel Obaweya",
    description:
      "The first in a series exploring performance and connection. A collaboration between Momo Hassan-Odukale & Daniel Obaweya, featuring SS25 collections.",
    coverImage: "/images/the-audition/01.jpg",
    images: [
      "/images/the-audition/01.jpg",
      "/images/the-audition/02.jpg",
      "/images/the-audition/03.jpg",
    ],
  },
  {
    id: "personal-between-2022",
    title: "The Starting Line",
    category: "Styling",
    year: "2025",
    client: "Lisa Folawiyo Studio",
    description:
      "Lisa Folawiyo Studio Coll 1 2025: a vibrant ode to life as a race, blending bold prints, handcrafted embellishments, and cultural motifs like the Nigerian game Ayo. This collection celebrates the drive, ambition, and joy of the journey, reminding us that while the goal matters, the race is meant to be enjoyed. Styled by GIDA founder and Editor-in-Chief Momo Hassan-Odukale, shot by Jurnee Peterchukwu for GIDA Journal, with event concept and coordination by EE Collective.",
    coverImage: "/images/the-starting-line/05.jpg",
    images: [
      "/images/the-starting-line/01.jpg",
      "/images/the-starting-line/02.jpg",
      "/images/the-starting-line/03.jpg",
      "/images/the-starting-line/04.jpg",
      "/images/the-starting-line/05.jpg",
      "/images/the-starting-line/06.jpg",
      "/images/the-starting-line/07.jpg",
      "/images/the-starting-line/08.jpg",
      "/images/the-starting-line/09.jpg",
      "/images/the-starting-line/10.jpg",
      "/images/the-starting-line/11.jpg",
    ],
  },
]
