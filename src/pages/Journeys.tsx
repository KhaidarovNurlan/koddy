import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const LANGUAGES = [
    { id: 'python', name: 'Python', codders: '1.58M', icon: '/python.svg' },
    { id: 'javascript', name: 'Javascript', codders: '230K', icon: '/js.svg' },
    { id: 'java', name: 'Java', codders: '201K', icon: '/java.svg' },
    { id: 'cpp', name: 'C++', codders: '194K', icon: '/cpp.svg' },
    { id: 'sqlite', name: 'SQLite', codders: '119K', icon: '/sql.svg' },
    { id: 'c', name: 'C', codders: '111K', icon: '/c.svg' },
    { id: 'csharp', name: 'C#', codders: '100K', icon: '/csharp.svg' },
    { id: 'lua', name: 'Lua', codders: '44K', icon: '/lua.svg' },
    { id: 'php', name: 'PHP', codders: '27K', icon: '/php.svg' },
    { id: 'go', name: 'Go', codders: '20K', icon: '/go.svg' },
    { id: 'dart', name: 'Dart', codders: '16K', icon: '/dart.svg' },
    { id: 'rust', name: 'Rust', codders: '15K', icon: '/rust.svg' },
    { id: 'r', name: 'R', codders: '14K', icon: '/r.svg' },
    { id: 'ruby', name: 'Ruby', codders: '3K', icon: '/ruby.svg' },
    { id: 'terminal', name: 'Terminal', codders: '2K', icon: '/terminal.svg' },
    { id: 'swift', name: 'Swift', codders: '1K', icon: '/swift.svg' },
];

export const Journeys = () => {
    useEffect(() => {
        document.title = "Coding Journeys - Koddy";
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-[1200px] w-full mx-auto">
            <h1 className="text-[20px] font-bold mb-8">Coding Journeys</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {LANGUAGES.map((lang) => (
                    <Link
                        key={lang.id}
                        to={`/journeys/${lang.id}`}
                        className='relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 border-b-5 transition-all border-grey-light bg-grey-dark hover:border-b-2 hover:translate-y-[3px]'
                    >

                        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 md:mb-5">
                            <img
                                src={lang.icon}
                                alt={lang.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h3 className="font-bold text-lg md:text-xl text-center">
                            {lang.name}
                        </h3>
                        <p className="text-text-secondary text-xs md:text-sm mt-1.5 font-semibold text-center">
                            {lang.codders} Codders
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
