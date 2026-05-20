import { useEffect, useState, useRef } from 'react';

const CHALLENGES = [
    { title: "Connect Beach Flags", language: "JavaScript", difficulty: "Easy" },
    { title: "Decipher the Ancient Message", language: "C#", difficulty: "Easy" },
    { title: "Scottish Hospital Welcome Message Generator", language: "Java", difficulty: "Easy" },
    { title: "Marketplace Cipher Decoder", language: "Python", difficulty: "Medium" },
    { title: "Garden Pest Removal", language: "Java", difficulty: "Easy" },
    { title: "Lumber Probability Calculator", language: "Python", difficulty: "Medium" },
    { title: "Duplicate Characters Until 'x'", language: "Python", difficulty: "Easy" },
    { title: "Bond Through Numbers", language: "C++", difficulty: "Medium" },
    { title: "Artistic Sign Creation", language: "JavaScript", difficulty: "Easy" },
    { title: "Picnic Story Encoder", language: "Python", difficulty: "Hard" },
];

export const Challenges = () => {
    const [activeDropdown, setActiveDropdown] = useState<'language' | 'difficulty' | null>(null);

    const languageRef = useRef<HTMLDivElement>(null);
    const difficultyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = "Explore Challenges - Koddy";
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedLanguage = languageRef.current?.contains(target);
            const clickedDifficulty = difficultyRef.current?.contains(target);

            if (!clickedLanguage && !clickedDifficulty) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (type: 'language' | 'difficulty') => {
        setActiveDropdown(prev => prev === type ? null : type);
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[850px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[20px] font-bold text-white">Challenges</h1>
                <button className="inline-flex items-center justify-center px-4 lg:px-8 py-2.5 bg-blue text-white text-[16px] lg:text-[18px] font-semibold rounded-xl transition-all shadow-[0_5px_0_0_#264D73] hover:shadow-[0_0px_0_0_#264D73] hover:translate-y-[3px]">
                    DAILY CHALLENGE
                </button>
            </div>

            <div className="flex gap-3 mb-8 relative z-30">

                <div className="relative" ref={languageRef}>
                    <div
                        onClick={() => toggleDropdown('language')}
                        className={`flex items-center gap-2 px-3 py-1.5 border border-grey-light/50 rounded-lg cursor-pointer hover:bg-grey/50 transition-colors ${activeDropdown === 'language' ? 'bg-grey/50' : ''}`}
                    >
                        <span className="text-[16px] lg:text-[18px] font-medium">Language</span>
                        <img
                            src="/down-white.svg"
                            className={`w-4 h-4 opacity-50 transition-transform duration-200 ${activeDropdown === 'language' ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {activeDropdown === 'language' && (
                        <div className="absolute left-0 top-[calc(100%+6px)] w-48 bg-grey-dark border border-grey-light/50 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Python</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Javascript</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">C++</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Java</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">C#</button>
                        </div>
                    )}
                </div>

                <div className="relative" ref={difficultyRef}>
                    <div
                        onClick={() => toggleDropdown('difficulty')}
                        className={`flex items-center gap-2 px-3 py-1.5 border border-grey-light/50 rounded-lg cursor-pointer hover:bg-grey/50 transition-colors ${activeDropdown === 'difficulty' ? 'bg-grey/50' : ''}`}
                    >
                        <span className="text-[16px] lg:text-[18px] font-medium">Difficulty</span>
                        <img
                            src="/down-white.svg"
                            className={`w-4 h-4 opacity-50 transition-transform duration-200 ${activeDropdown === 'difficulty' ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {activeDropdown === 'difficulty' && (
                        <div className="absolute left-0 top-[calc(100%+6px)] w-48 bg-grey-dark border border-grey-light/50 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Easy</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Medium</button>
                            <button className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white">Hard</button>
                        </div>
                    )}
                </div>

            </div>

            <div className="flex flex-col mb-8">
                {CHALLENGES.map((challenge, i) => (
                    <div key={i} className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-0 justify-between py-4 border-b border-grey-light/20 last:border-0 hover:bg-grey/30 px-3 rounded-lg cursor-pointer transition-colors -mx-3">
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 rounded-full bg-grey-light flex-shrink-0"></div>
                            <span className="text-[16px] lg:text-[18px] text-white">{challenge.title}</span>
                        </div>
                        <div className="flex items-center gap-4 pl-4">
                            <div className="px-3 py-1 rounded-full bg-grey-light/20 min-w-[75px] flex items-center justify-center">
                                <span className="text-[16px] font-medium text-white">{challenge.language}</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-grey-light/20 min-w-[75px] flex items-center justify-center">
                                <span className="text-[16px] font-medium text-white">{challenge.difficulty}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};