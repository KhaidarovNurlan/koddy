import { Link } from 'react-router-dom';

const footerColumns = [
    {
        title: 'Company',
        links: [
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
            { name: 'Contact', href: '/contact' },
            { name: 'FAQs', href: '/faqs' },
            { name: 'AI Assistant', href: '/ai_assistant' },
        ],
    },
    {
        title: 'Languages',
        links: [
            { name: 'Python', href: '/' },
            { name: 'JavaScript', href: '/' },
            { name: 'SQL', href: '/' },
            { name: 'C++', href: '/' },
            { name: 'Java', href: '/' },
            { name: 'C#', href: '/' },
            { name: 'PHP', href: '/' },
            { name: 'Dart', href: '/' },
            { name: 'Golang', href: '/' },
            { name: 'Rust', href: '/' },
            { name: 'Lua', href: '/' },
        ],
    },
    {
        title: 'Knowledge',
        links: [
            { name: 'Projects', href: '/' },
            { name: 'Challenges', href: '/' },
            { name: 'Educational', href: '/' },
            { name: 'Beginner', href: '/' },
            { name: 'Intermediate', href: '/' },
            { name: 'Advanced', href: '/' },
        ],
    },
    {
        title: 'Subjects',
        links: [
            { name: 'Data Science', href: '/' },
            { name: 'Web Development', href: '/' },
            { name: 'Interview Prep', href: '/' },
            { name: 'Software Development', href: '/' },
            { name: 'Artificial Intelligence', href: '/' },
            { name: 'DSA', href: '/' },
            { name: 'Data Analytics', href: '/' },
        ],
    },
];

const socialLinks = [
    { name: 'GitHub', icon: '/github.svg', href: 'https://github.com/KhaidarovNurlan' },
    { name: 'LinkedIn', icon: '/linkedin.svg', href: 'https://www.linkedin.com/in/nurlankhaidarov' },
];

export function Footer() {
    return (
        <footer className="bg-grey-dark">
            <section className="relative pt-22 pb-36 overflow-hidden transition-all duration-700">
                <div className="absolute inset-0 bg-blue-dark" />
                <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'url(/bottom-cta-bg-dark.svg)', backgroundSize: '80%', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom center' }} />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 style={{ fontFamily: "'Audiowide', cursive" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-12">Learn to code<br />with Koddy</h2>
                    <Link to="/" className="inline-flex items-center justify-center px-10 py-2.5 cursor-pointer bg-grey text-blue-light font-semibold rounded-xl transition-all border-grey-light border-[2px] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                        GET STARTED
                    </Link>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-row flex-wrap lg:flex-nowrap items-top justify-between gap-8 md:gap-3">
                    {footerColumns.map((col) => (
                        <div key={col.title} className="w-[45%] lg:w-auto">
                            <h3 className="text-sm md:text-lg text-white font-bold mb-4">{col.title}</h3>
                            <ul className="space-y-2 mb-6">
                                {col.links.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.href} className="text-sm md:text-base text-text-secondary hover:text-blue transition-colors duration-200">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {col.title === "Company" && (
                                <div className="flex items-center justify-start gap-2 mt-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className="w-10 h-10 rounded-lg bg-bg-card/50 hover:bg-bg-card flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                            aria-label={social.name}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src={social.icon}
                                                alt={social.name}
                                                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
                                            />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    )
}