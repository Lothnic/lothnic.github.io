import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

const BlogList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            // Import all markdown files from the content/posts directory
            const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' });

            const loadedPosts = await Promise.all(
                Object.entries(modules).map(async ([path, loader]) => {
                    const content = await loader();
                    const { data } = matter(content);
                    const slug = path.split('/').pop().replace('.md', '');

                    return {
                        slug,
                        ...data,
                    };
                })
            );

            // Sort posts by date (newest first)
            loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(loadedPosts);
        };

        loadPosts();
    }, []);

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="container max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Thoughts, tutorials, and insights on NLP and AI.
                    </p>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-6"></div>
                </div>

                <div className="grid gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.slug}
                            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <span className="text-sm text-primary font-medium px-3 py-1 bg-primary/10 rounded-full w-fit">
                                    {post.category || 'General'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>

                            <Link to={`/blog/${post.slug}`} className="block group">
                                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                            </Link>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {post.description}
                            </p>

                            <Link
                                to={`/blog/${post.slug}`}
                                className="text-primary font-medium hover:underline inline-flex items-center"
                            >
                                Read more &rarr;
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
