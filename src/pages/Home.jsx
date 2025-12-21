import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi';
import { projects } from '../data/projects';

const Home = () => {
    const location = useLocation();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                scrollToSection(id);
            }, 100);
        }
    }, [location]);

    return (
        <div className="pt-16 md:pt-20">
            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center">
                <div className="container">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Hi, I'm <span className="text-primary">Mayank Joshi</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            I'm an LLM / NLP Researcher passionate about advancing the field of natural language processing.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                className="btn btn-primary"
                                onClick={() => scrollToSection('contact')}
                            >
                                Get in Touch
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => scrollToSection('projects')}
                            >
                                View My Work <FiArrowRight className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="section bg-gray-50 dark:bg-gray-800/30">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
                        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex space-x-4">
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center"
                                        >
                                            Live Demo <FiExternalLink className="ml-1" />
                                        </a>
                                        <a
                                            href={project.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center"
                                        >
                                            Source Code <FiGithub className="ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
                            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 items-center">
                            <div className="md:col-span-1 flex justify-center">
                                <div className="w-64 h-64 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {/* Add your profile image here */}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="text-2xl font-bold mb-4">Who am I?</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    I'm a researcher focused on Large Language Models and Natural Language Processing.
                                    My work involves exploring the capabilities of state-of-the-art models and developing new techniques for language understanding and generation.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <h4 className="font-semibold">Name:</h4>
                                        <p className="text-gray-600 dark:text-gray-400">Mayank Joshi</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Email:</h4>
                                        <a href="mailto:your.email@example.com" className="text-primary">
                                            your.email@example.com
                                        </a>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Location:</h4>
                                        <p className="text-gray-600 dark:text-gray-400">City, Country</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Availability:</h4>
                                        <p className="text-gray-600 dark:text-gray-400">Open to work</p>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Download CV
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="section bg-gray-50 dark:bg-gray-800/30">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="What's this about?"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Your message here..."
                                    required
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
