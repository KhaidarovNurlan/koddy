import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LANGUAGES = [
    { id: 'python', name: 'Python', codders: '0', icon: '/python.svg' },
    { id: 'javascript', name: 'Javascript', codders: '0', icon: '/js.svg' },
    { id: 'java', name: 'Java', codders: '0', icon: '/java.svg' },
    { id: 'cpp', name: 'C++', codders: '0', icon: '/cpp.svg' },
    { id: 'c', name: 'C', codders: '0', icon: '/c.svg' },
    { id: 'csharp', name: 'C#', codders: '0', icon: '/csharp.svg' },
    { id: 'lua', name: 'Lua', codders: '0', icon: '/lua.svg' },
    { id: 'php', name: 'PHP', codders: '0', icon: '/php.svg' },
    { id: 'go', name: 'Go', codders: '0', icon: '/go.svg' },
    { id: 'dart', name: 'Dart', codders: '0', icon: '/dart.svg' },
    { id: 'rust', name: 'Rust', codders: '0', icon: '/rust.svg' },
    { id: 'r', name: 'R', codders: '0', icon: '/r.svg' },
    { id: 'ruby', name: 'Ruby', codders: '0', icon: '/ruby.svg' },
    { id: 'swift', name: 'Swift', codders: '0', icon: '/swift.svg' },
];

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

export const Journeys = () => {
    const [stats, setStats] = useState<Record<string, number>>({});

    useEffect(() => {
        document.title = "Coding Journeys - Koddy";
        fetch('/api/journeys/stats')
            .then(res => res.json())
            .then(data => {
                if (data.stats) {
                    const statsMap: Record<string, number> = {};
                    data.stats.forEach((s: any) => {
                        statsMap[s.journeyId] = s.count;
                    });
                    setStats(statsMap);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-[1200px] w-full mx-auto">
            <h1 className="text-[20px] font-bold mb-8">Coding Journeys</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {LANGUAGES.map((lang) => {
                    const codersCount = stats[lang.id] !== undefined ? stats[lang.id] : 0;
                    return (
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
                                {codersCount > 0 ? formatNumber(codersCount) : lang.codders} Codders
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
