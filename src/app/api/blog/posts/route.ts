import { NextResponse } from "next/server";
import { getAllPosts, formatDate } from "@/lib/blog";

export async function GET() {
    try {
        const posts = getAllPosts();

        // Format dates for display
        const formattedPosts = posts.map((post) => ({
            ...post,
            date: formatDate(post.date),
        }));

        return NextResponse.json(formattedPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json([], { status: 500 });
    }
}
