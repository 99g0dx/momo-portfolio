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
    category: "Editorial",
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
    category: "Portrait",
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
    title: "Structured",
    category: "Campaign",
    year: "2023",
    client: "[Brand Name]",
    description: "SS23 campaign. Shot on location in Milan over two days.",
    coverImage:
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf",
    images: [
      "https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b",
      "https://images.unsplash.com/photo-1659522761084-79196b64abe4",
      "https://images.unsplash.com/photo-1610765431323-d88c88a2b2c8",
      "https://images.unsplash.com/photo-1551113006-731674fbb3ff",
      "https://images.unsplash.com/flagged/photo-1570733117311-d990c3816c47",
    ],
  },
  {
    id: "fineart-veil-2023",
    title: "Veil & Form",
    category: "Fine Art",
    year: "2023",
    description:
      "An ongoing series examining concealment, revelation, and the threshold between.",
    coverImage:
      "https://images.unsplash.com/photo-1762504013915-c1faf57f291b",
    images: [
      "https://images.unsplash.com/photo-1731589802956-b4693dae884b",
      "https://images.unsplash.com/photo-1779912217733-0b7df75b5083",
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993",
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf",
    ],
  },
  {
    id: "creative-dir-material-2023",
    title: "Material Gestures",
    category: "Creative Direction",
    year: "2023",
    client: "[Brand Name]",
    description:
      "Art and creative direction for the AW23 lookbook. Concept, casting, and production.",
    coverImage:
      "https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b",
    images: [
      "https://images.unsplash.com/photo-1659522761084-79196b64abe4",
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf",
      "https://images.unsplash.com/photo-1551113006-731674fbb3ff",
      "https://images.unsplash.com/photo-1779912218007-1a7854ba4f23",
      "https://images.unsplash.com/photo-1766951087359-fe48ea4f2796",
    ],
  },
  {
    id: "personal-between-2022",
    title: "Between Frames",
    category: "Personal Work",
    year: "2022",
    description:
      "Documentary-style images made between commissions — the edges of attention.",
    coverImage:
      "https://images.unsplash.com/photo-1766951087359-fe48ea4f2796",
    images: [
      "https://images.unsplash.com/photo-1779911915399-aeaaa1153847",
      "https://images.unsplash.com/photo-1594751684241-bcef815d5a57",
      "https://images.unsplash.com/photo-1571893714939-85a8e97c329d",
      "https://images.unsplash.com/photo-1676439777386-d67cd2b32e7b",
    ],
  },
]
