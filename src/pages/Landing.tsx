import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

const languages = [
    { name: 'Python', icon: '/python-white.svg' },
    { name: 'JavaScript', icon: '/js-white.svg' },
    { name: 'Java', icon: '/java-white.svg' },
    { name: 'C++', icon: '/cpp-white.svg' },
    { name: 'SQL', icon: '/sql-white.svg' },
    { name: 'C#', icon: '/csharp-white.svg' },
    { name: 'PHP', icon: '/php-white.svg' },
    { name: 'Dart', icon: '/dart-white.svg' },
    { name: 'Golang', icon: '/go-white.svg' },
    { name: 'Rust', icon: '/rust-white.svg' },
    { name: 'Lua', icon: '/lua-white.svg' },
    { name: 'Ruby', icon: '/ruby-white.svg' },
    { name: 'Swift', icon: '/swift-white.svg' },
    { name: 'Bash', icon: '/terminal-white.svg' },
];

const tabs = [
    { id: 'code', label: 'Code', icon: '/python-white.svg' },
    { id: 'sql', label: 'SQL', icon: '/db-white.svg' },
    { id: 'terminal', label: 'Terminal', icon: '/terminal-white.svg' },
];

const codeSnippets: Record<string, { language: string; lines: { text: string; color: string }[] }> = {
    code: {
        language: 'Python',
        lines: [
            { text: '# Write your first program', color: 'text-text-muted' },
            { text: 'name = input("What is your name? ")', color: 'text-blue-light' },
            { text: 'print(f"Hello, {name}!")', color: 'text-emerald-400' },
            { text: '', color: '' },
            { text: 'age = int(input("Your age: "))', color: 'text-blue-light' },
            { text: 'days = age * 365', color: 'text-amber-300' },
            { text: 'print(f"You are {days} days old!")', color: 'text-emerald-400' },
        ],
    },
    sql: {
        language: 'PostgreSQL',
        lines: [
            { text: 'SELECT name, score', color: 'text-purple-400' },
            { text: 'FROM students', color: 'text-blue-light' },
            { text: 'WHERE score > 90', color: 'text-amber-300' },
            { text: 'ORDER BY score DESC', color: 'text-emerald-400' },
            { text: 'LIMIT 10;', color: 'text-pink-400' },
        ],
    },
    terminal: {
        language: 'Bash',
        lines: [
            { text: '~/project $ mkdir my-app', color: 'text-purple-400' },
            { text: '~/project $ cd my-app', color: 'text-emerald-400' },
            { text: '~/project/my-app $ echo "Hello World"', color: 'text-amber-300' },
            { text: 'Hello World', color: 'text-text-muted' },
            { text: '~/project/my-app $ ls -la', color: 'text-purple-400' },
        ],
    },
};

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const activeDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const frozenDays = [4];

const leaderboardUsers = [
    { rank: 1, name: 'Alex', xp: 2840, avatar: '/avatar_1.jpeg', badge: '/first.svg', highlight: true },
    { rank: 2, name: 'Jordan', xp: 2650, avatar: '/avatar_2.jpeg', badge: '/second.svg', highlight: true },
    { rank: 3, name: 'Sam', xp: 2420, avatar: '/avatar_3.jpeg', badge: '/third.svg', highlight: true },
    { rank: 4, name: 'Casey', xp: 2180, avatar: '/avatar_4.jpeg', badge: null, highlight: false },
    { rank: 5, name: 'Morgan', xp: 1950, avatar: '/avatar_placeholder.png', badge: null, highlight: false },
];

// The sections below are loaded via separate functions because they include fade-in animations based on visibility

function LearnByDoing() {
    const [activeTab, setActiveTab] = useState('code');
    const { ref, isVisible } = useInView();
    const snippet = codeSnippets[activeTab];

    const [progress, setProgress] = useState(0);
    const TAB_DURATION = 5000;

    useEffect(() => {
        setProgress(0);
    }, [activeTab]);

    useEffect(() => {
        const interval = 100;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    const nextIndex = (currentIndex + 1) % tabs.length;
                    setActiveTab(tabs[nextIndex].id);
                    return 0;
                }
                return prev + (interval / TAB_DURATION) * 100;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [activeTab, tabs]);

    return (
        <section ref={ref} className={`py-20 md:py-28 transition-all duration-700 ${isVisible ? 'section-visible' : 'section-hidden'}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justigy-between gap-6">
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-bold leading-tight mb-5">Learn by Doing</h2>
                    <p className="text-base lg:text-[22px] leading-relaxed max-w-md">
                        Write real code, query databases, etc. Our interactive lessons cover every skill modern developers need.
                    </p>
                </div>
                <div className="md:w-1/2 w-full">
                    <div className="rounded-2xl bg-grey border-2 border-grey-lighter overflow-hidden shadow-2xl shadow-black/30">
                        <div className="flex items-center gap-1 px-3 pt-3 pb-0 bg-grey-dark/50 overflow-x-auto scrollbar-hide border-b-2 border-grey-lighter/50">
                            <div className="flex gap-1.5 mr-3 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>

                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative group flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-semibold transition-all duration-200 overflow-hidden ${isActive
                                            ? 'bg-grey border-t border-x border-grey-lighter'
                                            : 'text-text-muted hover:text-text-secondary hover:bg-bg-card/30'
                                            }`}
                                    >
                                        <img src={tab.icon} alt={tab.label} className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                                        <span>{tab.label}</span>

                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-grey-lighter/30">
                                            {isActive && (
                                                <div
                                                    className="h-full bg-blue transition-all duration-100 ease-linear"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="px-4 pt-3 pb-1 flex items-left">
                            <span className="text-xs text-text-muted font-mono">{snippet.language}</span>
                        </div>
                        <div className="px-4 pb-4 font-mono text-sm leading-6 min-h-[220px]">
                            {snippet.lines.map((line, i) => (
                                <div key={`${activeTab}-${i}`} className="flex">
                                    <span className="w-8 text-right mr-4 text-text-muted/40 select-none text-xs leading-6">{i + 1}</span>
                                    <span className={line.color || 'text-text-secondary'}>{line.text || '\u00A0'}</span>
                                </div>
                            ))}
                            <div className="flex">
                                <span className="w-8 text-right mr-4 text-text-muted/40 select-none text-xs leading-6">{snippet.lines.length + 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CodingStreak() {
    const { ref, isVisible } = useInView();

    return (
        <section ref={ref} className={`py-20 md:py-28 bg-grey transition-all duration-700 ${isVisible ? 'section-visible' : 'section-hidden'}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-1/2 w-full max-w-md">
                    <div className="rounded-2xl bg-grey-dark border border-grey-lighter p-6 shadow-2xl shadow-black/20">
                        <div className="flex items-center gap-3 mb-2">
                            <img src="/fire-filled.svg" alt="Streak" className="w-8 h-8 animate-pulse-fire" />
                            <div><div className="text-2xl font-bold">12 days streak</div></div>
                        </div>
                        <p className="text-text-muted text-sm mb-5">Return tomorrow to keep your streak!</p>
                        <div className="mb-5">
                            <div className="flex flex-row justify-between">
                                <img src="/left-white.svg" className="w-4 h-4 opacity-75 cursor-pointer" />
                                <div className="text-sm font-semibold text-text-secondary mb-3">January {new Date().getFullYear()}</div>
                                <img src="/right-white.svg" className="w-4 h-4 opacity-75 cursor-pointer" />
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                {calendarDays.map((day) => {
                                    const isActive = activeDays.includes(day);
                                    const isFrozen = frozenDays.includes(day);
                                    const isToday = day === 12;
                                    return (
                                        <div key={day} className="relative flex items-center justify-center">
                                            {isToday && (
                                                <div className="absolute inset-0 rounded-3xl ring-1 ring-orange/60 animate-ping" />
                                            )}

                                            <div className={`relative w-9 h-9 rounded-3xl flex items-center justify-center text-xs font-medium transition-all duration-200
                                                ${isToday
                                                    ? 'text-white ring-2 ring-orange/40 shadow-lg shadow-orange/20'
                                                    : isFrozen
                                                        ? 'bg-blue-light text-white/75'
                                                        : isActive
                                                            ? 'bg-orange text-white/75'
                                                            : 'text-text-muted'
                                                }`}
                                            >
                                                {day}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-bg-card/50 rounded-xl p-3 border border-grey-lighter hover:bg-bg-card-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src="/product_double_or_nothing.svg" alt="" className="w-6 h-6" />
                                    <span className="text-xs font-semibold">Double or Nothing</span>
                                </div>
                                <p className="text-[15px] text-text-secondary">Day 5 of 7</p>
                            </div>
                            <div className="flex-1 bg-bg-card/50 rounded-xl p-3 border border-grey-lighter hover:bg-bg-card-hover transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src="/fire-freeze-white-dark.svg" alt="" className="w-6 h-6" />
                                    <span className="text-xs font-semibold">Streak Freeze</span>
                                </div>
                                <p className="text-[15px] text-text-secondary">2 left</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 text-center md:text-right">
                    <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-tight mb-5">Build Your Coding Streak</h2>
                    <p className=" text-base lg:text-[22px] leading-relaxed">Stay consistent and watch your progress grow! Track your daily coding habit, protect your streak with freeze days, and earn rewards for showing up every day.</p>
                </div>
            </div>
        </section>
    );
}

function Leaderboard() {
    const { ref, isVisible } = useInView();

    return (
        <section ref={ref} className={`py-20 md:py-28 transition-all duration-700 ${isVisible ? 'section-visible' : 'section-hidden'}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold leading-tight mb-5">You're Not Alone in This</h2>
                    <p className="text-base md:text-xl leading-relaxed max-w-md">Compete on global leaderboards, invite friends to earn rewards, and celebrate each other's wins. Coding is better with friends!</p>
                </div>
                <div className="md:w-1/2 w-full max-w-md">
                    <div className="rounded-2xl bg-grey border border-grey-lighter overflow-hidden shadow-2xl shadow-black/20">
                        <div className="px-5 py-4 flex items-center gap-3 border-b border-grey-lighter bg-grey-dark/50">
                            <img src="/challenger.svg" alt="Challenger" className="w-16 h-16" />
                            <div><div className="text-lg font-bold text-blue">Challenger League</div><div className="text-base ">Top 7 advance</div></div>
                        </div>
                        <div className="px-3 py-2">
                            {leaderboardUsers.map((user, i) => (
                                <div key={user.rank} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-bg-card/50 ${i < 3 ? 'hover:-translate-y-0.5' : ''}`}>
                                    <div className="w-6 flex-shrink-0">{user.badge ? <div className="relative flex items-center justify-center w-7 h-7"><img src={user.badge} alt={`${user.rank}`} className="w-full h-auto" /><span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">{user.rank}</span></div> : <span className="text-sm font-semibold flex items-center justify-center">{user.rank}</span>}</div>
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-grey-lighter" />
                                    <span className="text-lg font-medium flex-1">{user.name}</span>
                                    <div className="flex items-center gap-1"><span className="text-sm font-semibold text-text-secondary">{user.xp.toLocaleString()} XP</span></div>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 py-2  flex items-center justify-center gap-2">
                            <img src="/arrow-up.svg" alt="" className="w-3 h-3" /><span className="text-[10px] font-semibold text-[#07AA0D] uppercase tracking-wider">Promotion Zone</span><img src="/arrow-up.svg" alt="" className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Landing() {
    useEffect(() => {
        document.title = "Learn to Code for Free with Koddy.Tech | Code Makes Perfect";
    }, []);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen">
            <nav className={`sticky top-0 z-50 bg-grey-dark transition-all duration-300 ${isScrolled ? 'border-b-3 border-grey-lighter' : 'border-b-0 border-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">

                    <Link to="/" className={`flex items-center transition-all duration-300 group ${!isScrolled ? 'max-sm:absolute max-sm:left-1/2 max-sm:-translate-x-1/2' : ''
                        }`}>
                        <div className={`flex items-center ${isScrolled ? 'gap-5' : 'gap-0'}`}>

                            <img
                                src="/logo.svg"
                                alt="koddy"
                                className={`h-12 w-auto transition-all duration-500 ${isScrolled
                                    ? 'opacity-100 scale-100 block'
                                    : 'opacity-0 scale-50 hidden'
                                    }`}
                            />

                            <img
                                src="/logo-text.svg"
                                alt="koddy"
                                className={`h-8 w-auto mt-3 transition-all duration-500 ${!isScrolled
                                    ? 'opacity-100 block'
                                    : 'max-sm:hidden sm:block opacity-100'
                                    }`}
                            />
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className={`btn-shimmer items-center justify-center px-10 cursor-pointer transition-all bg-blue text-white font-semibold py-2.5 rounded-xl border-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] ${isScrolled
                            ? 'flex animate-in fade-in zoom-in duration-300'
                            : 'hidden sm:flex'
                            }`}
                    >
                        GET STARTED
                    </Link>

                </div>
            </nav>

            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                    <div className="flex-shrink-0 w-48 md:w-64 lg:w-72 animate-float">
                        <img src="/bit-start.svg" alt="Mascot" className="w-full h-auto drop-shadow-2xl" />
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            The free, fun, and effective way<br />to learn to code!
                        </h1>

                        <p className="text-text-secondary text-base md:text-lg">
                            Join over 999,999,999 <span style={{ fontFamily: "'Audiowide', cursive" }}>kodders</span>
                        </p>

                        <div className="flex flex-col gap-3 mt-2 w-full max-w-sm">
                            <Link to="/" className="btn-shimmer inline-flex items-center justify-center px-10 py-2.5 cursor-pointer bg-blue text-white font-semibold rounded-xl transition-all border-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                                GET STARTED
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center px-10 py-2.5 cursor-pointer bg-grey text-blue-light font-semibold rounded-xl transition-all border-grey-light border-[2px] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                                I ALREADY HAVE AN ACCOUNT
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative bg-grey overflow-hidden">
                <div className="marquee-container flex items-center py-2 h-22">
                    <div className="flex items-center gap-14 animate-marquee whitespace-nowrap min-w-full">
                        {[...languages, ...languages].map((lang, i) => (
                            <div key={`${lang.name}-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary whitespace-nowrap text-lg font-bold mx-1">
                                <img src={lang.icon} alt={lang.name} className="w-8 h-8 opacity-75" />
                                <span>{lang.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LearnByDoing />
            <CodingStreak />
            <Leaderboard />
        </div>
    );
}
