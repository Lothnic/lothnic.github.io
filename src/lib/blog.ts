import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    tag: string;
    category: string;
    excerpt: string;
    content?: string;
}

/**
 * Get all blog post slugs (filenames without .md extension)
 */
export function getPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(/\.md$/, ""));
}

/**
 * Get post data by slug (without content)
 */
export function getPostBySlug(slug: string): BlogPost | null {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        tag: data.tag || "BLOG",
        category: data.category || "general",
        excerpt: data.excerpt || "",
    };
}

/**
 * Get post with full content rendered as HTML
 */
export async function getPostWithContent(slug: string): Promise<BlogPost | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark()
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(content);

    let contentHtml = processedContent.toString();

    // Add IDs to headings for anchor navigation
    contentHtml = contentHtml.replace(/<h2>([^<]+)<\/h2>/gi, (match, text) => {
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        return `<h2 id="${id}">${text}</h2>`;
    });

    contentHtml = contentHtml.replace(/<h3>([^<]+)<\/h3>/gi, (match, text) => {
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        return `<h3 id="${id}">${text}</h3>`;
    });

    return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        tag: data.tag || "BLOG",
        category: data.category || "general",
        excerpt: data.excerpt || "",
        content: contentHtml,
    };
}

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });

    return posts;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
    return getAllPosts().filter((post) => post.category === category);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).toUpperCase().replace(",", "");
}

/**
 * Extract headings from markdown content for table of contents
 */
export function extractHeadings(content: string): { id: string; label: string }[] {
    const headingRegex = /^##\s+(.+)$/gm;
    const headings: { id: string; label: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const label = match[1];
        const id = label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        headings.push({ id, label });
    }

    return headings;
}
