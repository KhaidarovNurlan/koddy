import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const JOURNEY_ICONS: Record<string, string> = {
    'python': '/python.svg',
    'javascript': '/js.svg',
    'java': '/java.svg',
    'cpp': '/cpp.svg',
    'sqlite': '/sql.svg',
    'c': '/c.svg',
    'csharp': '/csharp.svg',
    'lua': '/lua.svg',
    'php': '/php.svg',
    'go': '/go.svg',
    'dart': '/dart.svg',
    'rust': '/rust.svg',
    'r': '/r.svg',
    'ruby': '/ruby.svg',
    'terminal': '/terminal.svg',
    'swift': '/swift.svg',
};

const NAV_ITEMS = [
    { name: "Journey", icon: "/journey.svg", path: "/journeys" },
    { name: "Courses", icon: "/practice.svg", path: "/courses" },
    { name: "Projects", icon: "/projects.svg", path: "/projects" },
    { name: "Goals", icon: "/daily-challenges.svg", path: "/goals" },
    { name: "Leaderboard", icon: "/leaderboard.svg", path: "/leaderboard" },
    { name: "Store", icon: "/store.svg", path: "/store" },
    { name: "Profile", icon: "/profile.svg", path: "/profile" },
];

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MAX_ENERGY = Array.from({ length: 5 }, (_, i) => i);

const DAILY_GOALS_MOCK = [
    { title: "Get 2 perfect completions", current: 0, total: 2 },
    { title: "Complete 5 exercises", current: 0, total: 5 },
    { title: "Earn 70 XP", current: 0, total: 70 },
];

const EnergyMenuContent = ({ user, refreshUser }: { user: any; refreshUser: () => Promise<void> }) => {
    const [timeLeftStr, setTimeLeftStr] = useState('');

    useEffect(() => {
        if (!user || user.energy >= 5) {
            setTimeLeftStr('');
            return;
        }

        const updateTimer = () => {
            const lastUpdate = new Date(user.lastEnergyUpdate).getTime();
            const nextUpdate = lastUpdate + 2 * 60 * 1000;
            const now = Date.now();
            const diff = nextUpdate - now;

            if (diff <= 0) {
                setTimeLeftStr('Regenerating...');
                refreshUser();
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
                setTimeLeftStr(`${minutes}:${formattedSeconds}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [user, refreshUser]);

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">Energy</h3>
            <div className="flex gap-2 mb-4">
                {MAX_ENERGY.map((i) => (
                    <img key={i} src="/energy.svg" alt="Energy" className={`w-6 h-6 ${(user?.energy ?? 5) > i ? '' : 'grayscale opacity-50'}`} />
                ))}
            </div>
            <p className="text-white font-bold text-[15px] mb-2">
                {user?.energy === 5 ? 'You have full energy' : `You have ${user?.energy || 0} energy`}
            </p>
            {user && user.energy < 5 && timeLeftStr && (
                <div className="text-orange font-semibold text-xs mb-4 flex items-center gap-1.5 bg-orange/10 px-3 py-1.5 rounded-full border border-orange/20 animate-pulse">
                    <span>⚡ +1 Energy in:</span>
                    <span className="font-mono font-bold text-sm text-white">{timeLeftStr}</span>
                </div>
            )}
            <p className="text-text-secondary font-medium text-sm mb-6 text-center">
                Each energy equals one completed lesson
            </p>

            <button type="button" className="cursor-pointer w-full flex items-center justify-between bg-grey p-2.5 text-blue-light font-semibold rounded-xl transition-all border-2 border-grey-light shadow-[0_5px_0_0_#494D50] hover:shadow-[0_0px_0_0_#494D50] hover:translate-y-[3px]">
                <div className="flex items-center gap-3">
                    <img src="/energy-refill.svg" className="w-6 h-6" alt="" />
                    <span>REFILL ENERGY</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50">
                    <span>25</span>
                    <img src="/token.svg" alt="Token" className="w-3.5 h-3.5 grayscale" />
                </div>
            </button>
        </div>
    );
};

export const GameLayout = () => {
    const currentDayIndex = useMemo(() => new Date().getDay(), []);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const { user, journeys, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    const activeJourney = useMemo(() => {
        const match = location.pathname.match(/^\/journeys\/([^/]+)/);
        if (match && match[1]) {
            return match[1];
        }
        const lastJourneyId = localStorage.getItem('lastJourneyId');
        if (lastJourneyId) {
            return lastJourneyId;
        }
        return journeys.length > 0 ? journeys[0] : null;
    }, [location.pathname, journeys]);

    const activeJourneyIcon = activeJourney ? JOURNEY_ICONS[activeJourney] || '/no-journey.svg' : '/no-journey.svg';

    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [leaderboardStatus, setLeaderboardStatus] = useState<{ league: string; rank: number } | null>(null);

    useEffect(() => {
        if (user && user.xp >= 100) {
            const fetchStatus = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/user/leaderboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setLeaderboardStatus({ league: data.league, rank: data.rank });
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchStatus();
        } else {
            setLeaderboardStatus(null);
        }
    }, [user?.xp]);

    const [goals, setGoals] = useState<any[]>(DAILY_GOALS_MOCK);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('/api/user/goals', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setGoals(data.goals || DAILY_GOALS_MOCK);
                }
            } catch (e) {
                console.error(e);
            }
        };
        if (user) {
            fetchGoals();
        }
    }, [user]);

    const weekDates = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay();
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - currentDay + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }, []);

    const activeDaysArray = useMemo(() => {
        try {
            return JSON.parse(user?.activeDays || '[]');
        } catch (e) {
            return [];
        }
    }, [user?.activeDays]);

    const isTodayActive = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return activeDaysArray.includes(todayStr);
    }, [activeDaysArray]);

    const pageState = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const pathname = location.pathname;

        return {
            isJourneysPage: pathname === '/journeys',
            isCoursesPage: pathname === '/courses',
            isLeaderboardPage: pathname === '/leaderboard',
            isProfileSearchPage: pathname === '/profile' && searchParams.has('search'),
            isProfilePage: pathname === '/profile',
            isGoalsPage: pathname === '/goals',
        };
    }, [location]);

    const { isJourneysPage, isCoursesPage, isLeaderboardPage, isProfileSearchPage, isProfilePage, isGoalsPage } = pageState;

    const toggleMenu = (menuName: string) => {
        setActiveMenu(prev => prev === menuName ? null : menuName);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex h-[100dvh] overflow-hidden">
            <aside className="hidden md:flex flex-col w-[260px] bg-grey-dark shrink-0 relative z-20 border-r-3 border-grey-light">
                <div className="px-6 py-8">
                    <img src="/logo-text.svg" alt="Koddy" className="h-8 object-contain" />
                </div>

                <nav className="flex-1 px-4 pb-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const path = item.name === "Journey" && activeJourney ? `/journeys/${activeJourney}` : item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${isActive || (item.name === "Journey" && isJourneysPage)
                                        ? "font-semibold bg-grey-light"
                                        : "hover:bg-grey-light/50"
                                    }`
                                }
                            >
                                <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-[18px]">{item.name}</span>
                                    </div>
                                </div>
                            </NavLink>
                        )
                    })}

                    <div className="relative group" ref={moreMenuRef}>
                        <button
                            type="button"
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors hover:bg-grey/60"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <img src="/more.svg" alt="More" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-[18px] flex-1 text-left">More</span>
                        </button>

                        <div className="absolute left-full -bottom-16 mr-8 w-56 bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl py-2 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <Link to="/notifications" className="block px-5 py-2 hover:bg-white/5">Notifications</Link>
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="w-full text-left px-5 py-2 hover:bg-white/5 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>

            <div className="flex flex-1 overflow-y-auto flex-col lg:flex-row lg:justify-center h-full w-full max-w-full pb-16 md:pb-0">
                {isProfileSearchPage ? (
                    <div className="lg:hidden flex items-center justify-between mb-6 border-b-3 border-grey-light p-3 pt-6">
                        <Link to="/profile" className="hover:opacity-80 transition-opacity">
                            <img src="/left-white.svg" alt="Back" className="w-6 h-6 opacity-50" />
                        </Link>
                        <h1 className="text-xl font-bold text-text-secondary w-full text-center">Search friends</h1>
                    </div>
                ) : isProfilePage ? (
                    <div className="lg:hidden flex items-center justify-between mb-6 border-b-3 border-grey-light p-3 pt-6">
                        <h1 className="text-xl font-bold text-text-secondary">Profile</h1>
                        <div className="flex items-center gap-4">
                            <Link to="/profile?p=search" className="hover:opacity-80 transition-opacity">
                                <img src="/search-white.svg" alt="Search friends" className="w-6 h-6 opacity-80" />
                            </Link>
                            <Link to={`/user/${encodeURIComponent(user?.email ? user.email.split('@')[0] : '')}`} target="_blank" className="hover:opacity-80 transition-opacity">
                                <img src="/resume-white.svg" alt="Public profile" className="w-6 h-6 opacity-80" />
                            </Link>
                        </div>
                    </div>
                ) : isJourneysPage ? null : (
                    <div className="lg:hidden flex items-center justify-between px-3 pt-6" ref={containerRef}>
                        <div className="flex justify-between gap-2 text-md font-semibold w-full relative">

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleMenu('journey')}
                                    className={`flex items-center justify-center p-2 rounded-xl transition-colors h-10 min-w-10 ${activeMenu === 'journey' ? 'bg-grey' : ''}`}
                                >
                                    <img src={activeJourneyIcon} alt="Journey" className="w-6 h-6" />
                                </button>

                                {activeMenu === 'journey' && (
                                    <div className="absolute left-0 top-[calc(100%+8px)] w-48 z-50 transition-all duration-200">
                                        <div className="bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl py-2 relative">
                                            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                            <div className="block px-5 py-3 font-semibold text-white">My Journeys</div>
                                            <div className="h-px bg-white/10 my-1 mx-3"></div>
                                            {journeys.map(j => {
                                                const isActive = j === activeJourney;
                                                return (
                                                    <Link
                                                        key={j}
                                                        to={`/journeys/${j}`}
                                                        onClick={() => setActiveMenu(null)}
                                                        className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors font-semibold ${isActive ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img src={JOURNEY_ICONS[j] || '/no-journey.svg'} className="w-6 h-6" alt="" />
                                                            <span className="capitalize">{j}</span>
                                                        </div>
                                                        {isActive && (
                                                            <span className="w-2 h-2 rounded-full bg-blue-light"></span>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                            <Link to="/journeys" onClick={() => setActiveMenu(null)} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors font-semibold text-text-secondary hover:text-white">
                                                <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center text-xl leading-none pt-0.5">+</div>
                                                <span>Add Journey</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleMenu('streak')}
                                    className={`flex items-center justify-center gap-2 px-3 rounded-xl transition-colors h-10 ${activeMenu === 'streak' ? 'bg-grey' : ''}`}
                                >
                                    <span className={user?.streak ? 'text-orange font-bold' : ''}>{user?.streak ?? 0}</span>
                                    <img src={user?.streak ? "/fire-filled.svg" : "/fire.svg"} alt="Streak" className="w-6 h-6" />
                                </button>

                                {activeMenu === 'streak' && (
                                    <div className="absolute left-1/2 translate-x-[-40px] top-[calc(100%+8px)] w-[275px] bg-grey-dark border-2 border-orange rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-200">
                                        <div className="bg-orange p-5 pb-6 relative z-0">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-[16px] font-bold text-white mb-1.5">{user?.streak ?? 0} day streak</h3>
                                                    <p className="text-white text-[12px] leading-tight font-medium">
                                                        {isTodayActive ? "You kept your streak alive today!" : "Complete a lesson today to keep your streak!"}
                                                    </p>
                                                </div>
                                                <img src="/fire-white.svg" alt="Streak" className="w-14 h-14 opacity-90 drop-shadow-md" />
                                            </div>
                                            <div className="bg-grey-dark/80 rounded-xl p-4 flex justify-between">
                                                {DAYS_OF_WEEK.map((day, i) => {
                                                    const dateStr = weekDates[i];
                                                    const isActive = activeDaysArray.includes(dateStr);
                                                    return (
                                                        <div key={i} className="flex flex-col items-center gap-2">
                                                            <span className="text-[11px] font-bold text-white/50">{day}</span>
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive
                                                                ? 'bg-orange text-white'
                                                                : (i === currentDayIndex ? 'bg-grey-dark text-orange border-2 border-orange' : 'bg-grey-light/50 text-white/30')
                                                                }`}>
                                                                {isActive ? '✓' : ''}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleMenu('tokens')}
                                    className={`flex items-center justify-center gap-2 px-3 rounded-xl transition-colors h-10 ${activeMenu === 'tokens' ? 'bg-grey' : ''}`}
                                >
                                    <span className="text-orange">{user?.tokens || 0}</span>
                                    <img src="/token.svg" alt="Tokens" className="w-6 h-6" />
                                </button>

                                {activeMenu === 'tokens' && (
                                    <div className="absolute right-1/2 translate-x-[25px] top-[calc(100%+8px)] w-[245px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-5 z-50 transition-all duration-200">
                                        <div className="absolute -top-2 right-[20px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                        <div className="flex items-center gap-4">
                                            <img src="/tokens.svg" alt="Tokens" className="w-16 h-16 object-contain" />
                                            <div className="flex-1">
                                                <h3 className="text-[16px] font-bold text-white mb-1">Tokens</h3>
                                                <p className="text-text-secondary text-[16px] font-medium mb-2">You have <span className="font-bold text-white">{user?.tokens || 0}</span> tokens</p>
                                                <Link to="/store" onClick={() => setActiveMenu(null)} className="text-blue-light font-bold text-[12px] hover:text-white transition-colors uppercase tracking-wider">Go to store</Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleMenu('energy')}
                                    className={`flex items-center justify-center gap-2 px-3 rounded-xl transition-colors h-10 ${activeMenu === 'energy' ? 'bg-grey' : ''}`}
                                >
                                    <span className="text-blue">{user?.energy ?? 5}</span>
                                    <img src="/energy.svg" alt="Energy" className="w-6 h-6" />
                                </button>

                                {activeMenu === 'energy' && (
                                    <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-6 z-50 transition-all duration-200">
                                        <div className="absolute -top-2 right-[25px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                        <EnergyMenuContent user={user} refreshUser={refreshUser} />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                <Outlet />

                {isJourneysPage || isCoursesPage ? null : (
                    <aside className="hidden lg:flex flex-col w-[300px] pt-8 px-8 xl:px-0 gap-6">
                        <div className="flex justify-between gap-2 text-md font-semibold w-full relative">

                            <div className="relative group pb-4 -mb-4">
                                <div className="flex items-center justify-center p-2 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10 min-w-10">
                                    <img src={activeJourneyIcon} alt="Journey" className="w-6 h-6" />
                                </div>
                                <div className="absolute right-0 top-[calc(100%-8px)] w-48 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl py-2 relative">
                                        <div className="absolute -top-1.5 right-4 w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                        <div className="block px-5 py-3 font-semibold text-white">My Journeys</div>
                                        <div className="h-px bg-white/10 my-1 mx-3"></div>
                                        {journeys.map(j => {
                                            const isActive = j === activeJourney;
                                            return (
                                                <Link
                                                    key={j}
                                                    to={`/journeys/${j}`}
                                                    className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors font-semibold ${isActive ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img src={JOURNEY_ICONS[j] || '/no-journey.svg'} className="w-6 h-6" alt="" />
                                                        <span className="capitalize">{j}</span>
                                                    </div>
                                                    {isActive && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-light"></span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                        <Link to="/journeys" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors font-semibold text-text-secondary hover:text-white">
                                            <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center text-xl leading-none pt-0.5">+</div>
                                            <span>Add Journey</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group pb-4 -mb-4">
                                <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                                    <span className={user?.streak ? 'text-orange font-bold' : ''}>{user?.streak ?? 0}</span>
                                    <img src={user?.streak ? "/fire-filled.svg" : "/fire.svg"} alt="Streak" className="w-6 h-6" />
                                </div>
                                <div className="absolute right-1/2 translate-x-[40px] top-[calc(100%-8px)] w-[320px] bg-grey-dark border-2 border-orange rounded-2xl shadow-2xl z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                                    <div className="bg-orange p-5 pb-6 relative z-0">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1.5">{user?.streak ?? 0} day streak</h3>
                                                <p className="text-white/90 text-sm max-w-[200px] leading-tight font-medium">
                                                    {isTodayActive ? "You kept your streak alive today!" : "Complete a lesson today to keep your streak!"}
                                                </p>
                                            </div>
                                            <img src="/fire-white.svg" alt="Streak" className="w-14 h-14 opacity-90 drop-shadow-md" />
                                        </div>
                                        <div className="bg-grey-dark/80 rounded-xl p-4 flex justify-between">
                                            {DAYS_OF_WEEK.map((day, i) => {
                                                const dateStr = weekDates[i];
                                                const isActive = activeDaysArray.includes(dateStr);
                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-2">
                                                        <span className="text-[11px] font-bold text-white/50">{day}</span>
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive
                                                            ? 'bg-orange text-white'
                                                            : (i === currentDayIndex ? 'bg-grey-dark text-orange border-2 border-orange' : 'bg-grey-light/50 text-white/30')
                                                            }`}>
                                                            {isActive ? '✓' : ''}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group pb-4 -mb-4">
                                <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                                    <span className="text-orange">{user?.tokens || 0}</span>
                                    <img src="/token.svg" alt="Tokens" className="w-6 h-6" />
                                </div>
                                <div className="absolute right-1/2 translate-x-[25px] top-[calc(100%-8px)] w-[280px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-5 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="absolute -top-2 right-[30px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                    <div className="flex items-center gap-4">
                                        <img src="/tokens.svg" alt="Tokens" className="w-16 h-16 object-contain" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">Tokens</h3>
                                            <p className="text-text-secondary text-[15px] font-medium mb-3">You have <span className="font-bold text-white">{user?.tokens || 0}</span> tokens</p>
                                            <Link to="/store" className="text-blue-light font-bold text-[13px] hover:text-white transition-colors uppercase tracking-wider">Go to store</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group pb-4 -mb-4">
                                <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                                    <span className="text-blue">{user?.energy ?? 5}</span>
                                    <img src="/energy.svg" alt="Energy" className="w-6 h-6" />
                                </div>
                                <div className="absolute right-0 top-[calc(100%-8px)] w-[320px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-6 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="absolute -top-2 right-[25px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                                    <EnergyMenuContent user={user} refreshUser={refreshUser} />
                                </div>
                            </div>
                        </div>

                        {isLeaderboardPage ? (
                            <div className="bg-grey border-3 border-grey-light rounded-2xl p-5 w-full relative overflow-hidden flex justify-between items-center gap-4">
                                <div className="flex-1 z-10">
                                    <h3 className="text-[20px] font-bold leading-tight mb-2 text-white">Do lessons. Earn XP. Compete.</h3>
                                    <p className="text-text-secondary text-[15px] leading-snug font-medium">Earn XP through coding challenges and quizzes, then compete with Coddy players in a leaderboard.</p>
                                </div>
                                <div className="w-24 h-24 flex-shrink-0 relative -mr-4 mt-2">
                                    <img src="/leaderboard.svg" alt="Trophy" className="w-full h-full object-contain rotate-335 drop-shadow-lg" />
                                </div>
                            </div>
                        ) : isProfilePage ? (
                            <div className="bg-grey border-3 border-grey-light rounded-xl p-4 w-full">
                                <h3 className="text-lg font-bold mb-6 text-white">Actions</h3>
                                <div className="flex flex-col gap-3">
                                    <Link to={`/user/${encodeURIComponent(user?.email ? user.email.split('@')[0] : '')}`} target="_blank" className="flex items-center gap-3">
                                        <img src="/resume-white.svg" alt="" className="w-6 h-6" />
                                        <span>Public profile</span>
                                    </Link>
                                    <Link to="/profile?p=search" className="flex items-center gap-3">
                                        <img src="/search-white.svg" alt="" className="w-6 h-6" />
                                        <span>Search friends</span>
                                    </Link>
                                </div>
                            </div>
                        ) : isGoalsPage ? (
                            <div className="bg-grey border-3 border-grey-light rounded-2xl p-5 w-full relative overflow-hidden flex justify-between items-center gap-4">
                                <div className="flex-1 z-10">
                                    <h3 className="text-[20px] font-bold leading-tight mb-2 text-white">Conquer<br />them all</h3>
                                    <p className="text-text-secondary text-[15px] leading-snug font-medium">Complete goals to earn rewards! Goals refresh every day.</p>
                                </div>
                                <div className="w-24 h-24 flex-shrink-0 relative -mr-4 mt-2">
                                    <img src="/daily-challenges.svg" alt="Flag" className="w-full h-full object-contain drop-shadow-lg rotate-335" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-grey border-3 border-grey-light rounded-2xl p-4 w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[18px] font-bold text-white">Leaderboard</h3>
                                        <Link to="/leaderboard" className="text-blue-light text-[16px] font-bold hover:text-white transition-colors">View</Link>
                                    </div>
                                    {user && user.xp >= 100 ? (
                                        <div className="rounded-xl flex items-center gap-4">
                                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                                <img
                                                    src={leaderboardStatus ? `/league_${leaderboardStatus.league}.svg` : '/leaderboard.svg'}
                                                    alt="League"
                                                    className="w-full h-full drop-shadow-md"
                                                />
                                            </div>
                                            <div className="flex flex-col text-sm font-medium">
                                                <p className="font-bold text-white capitalize leading-tight mb-1">
                                                    {leaderboardStatus ? `${leaderboardStatus.league} League` : 'Leaderboard'}
                                                </p>
                                                <p className="text-text-secondary text-xs mb-0.5">
                                                    Rank: <span className="text-white font-bold">#{leaderboardStatus?.rank ?? '-'}</span>
                                                </p>
                                                <p className="text-text-secondary text-xs">
                                                    XP: <span className="text-blue-light font-bold">{user.xp} XP</span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl flex items-center gap-4">
                                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                                <img src="/locked.svg" alt="Locked" className="w-full h-full grayscale" />
                                            </div>
                                            <p className="text-[16px] font-medium text-white leading-snug">Reach 100 XP to unlock leaderboards!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-grey border-3 border-grey-light rounded-2xl p-4 w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[18px] font-bold text-white">Daily Goals</h3>
                                        <Link to="/goals" className="text-blue-light text-[16px] font-bold hover:text-white transition-colors">View</Link>
                                    </div>
                                    <div className="flex flex-col">
                                        {goals.map((goal, index) => {
                                            const isCompleted = goal.current >= goal.total;
                                            return (
                                                <div key={index} className="flex justify-between items-center py-3 border-b border-grey-light/20 last:border-0 last:pb-0">
                                                    <div className="flex-1 pr-3">
                                                        <h4 className={`text-[15px] mb-2 font-medium ${isCompleted ? 'text-green' : 'text-white'}`}>{goal.title}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-1.5 bg-grey-light rounded-full overflow-hidden">
                                                                <div className="h-full rounded-full transition-all duration-300 bg-orange" style={{ width: `${Math.min(100, (goal.current / goal.total) * 100)}%` }}></div>
                                                            </div>
                                                            <span className="text-[11px] font-bold text-text-secondary min-w-[20px] text-right">
                                                                {goal.current}/{goal.total}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-8 h-8 flex-shrink-0 drop-shadow-md ${isCompleted ? 'brightness-110 scale-105' : 'opacity-80'}`}>
                                                        <img src={isCompleted ? "/chest-opened.svg" : "/chest-common.svg"} alt="Reward Chest" className="w-full h-full object-contain" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="text-sm text-text-secondary flex flex-wrap gap-x-4 gap-y-2 px-2">
                            <Link to="/about" className="hover:text-text-secondary">About</Link>
                            <Link to="/contact" className="hover:text-text-secondary">Contact Us</Link>
                            <Link to="/faqs" className="hover:text-text-secondary">FAQs</Link>
                            <Link to="/ai_assistant" className="hover:text-text-secondary">AI Assistant</Link>
                        </div>
                    </aside>
                )}
            </div>

            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-grey-dark border-t-3 border-grey-light flex items-center justify-around gap-2 px-2 py-1 z-40">
                {NAV_ITEMS.slice(0, 6).map((item) => {
                    const path = item.name === "Journey" && activeJourney ? `/journeys/${activeJourney}` : item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center p-1 rounded-xl transition-all ${isActive || (item.name === "Journey" && isJourneysPage) ? "bg-white/10" : "opacity-60"}`
                            }
                        >
                            <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain" />
                        </NavLink>
                    )
                })}
            </nav>
        </div>
    );
};