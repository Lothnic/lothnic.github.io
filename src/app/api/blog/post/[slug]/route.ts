import { NextResponse } from "next/server";
import { getPostWithContent, formatDate } from "@/lib/blog";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const post = await getPostWithContent(slug);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Format date for display
        const formattedPost = {
            ...post,
            date: formatDate(post.date),
        };

        return NextResponse.json(formattedPost);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
