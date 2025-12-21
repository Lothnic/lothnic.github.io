import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import { FiArrowLeft, FiCalendar, FiTag } from 'react-icons/fi';

const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const module = await import(`../content/posts/${slug}.md?raw`);
                const { data, content } = matter(module.default);
                setMeta(data);
                setContent(content);
            } catch (error) {
                console.error('Error loading post:', error);
                setContent('Post not found.');
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="pt-32 pb-16 min-h-screen flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="container max-w-3xl">
                <Link
                    to="/blog"
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors"
                >
                    <FiArrowLeft className="mr-2" /> Back to Blog
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <header className="mb-8 not-prose">
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            {meta.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                            <div className="flex items-center">
                                <FiCalendar className="mr-2" />
                                {meta.date && new Date(meta.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            {meta.category && (
                                <div className="flex items-center">
                                    <FiTag className="mr-2" />
                                    {meta.category}
                                </div>
                            )}
                        </div>
                    </header>

                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
