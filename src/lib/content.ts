import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Frontmatter {
  title: string;
  description?: string;
  category?: string;
  date?: string;
  updated?: string;
  author?: string;
  tags?: string[];
  order?: number;
}

export interface Doc {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  readingTime: number;
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** List all MDX docs in a content subfolder (e.g. "blog", "legal"). */
export function listDocs(subdir: string): Doc[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as Frontmatter, content, readingTime: readingTime(content) };
    })
    .sort((a, b) => {
      if (a.frontmatter.order != null && b.frontmatter.order != null) {
        return a.frontmatter.order - b.frontmatter.order;
      }
      const da = a.frontmatter.date || "";
      const db = b.frontmatter.date || "";
      return db.localeCompare(da);
    });
}

export function getDoc(subdir: string, slug: string): Doc | null {
  // Defence-in-depth against path traversal (esp. on win32): only accept simple
  // lowercase slugs, so path.join can never escape CONTENT_DIR via ../ or drive letters.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const dir = path.join(CONTENT_DIR, subdir);
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(dir, slug + ext);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as Frontmatter, content, readingTime: readingTime(content) };
    }
  }
  return null;
}
