import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
    { name: "Journey", icon: "/journey.svg", path: "/journeys" },
    { name: "Practice", icon: "/practice.svg", path: "/" },
    { name: "Projects", icon: "/projects.svg", path: "/" },
    { name: "Goals", icon: "/daily-challenges.svg", path: "/" },
    { name: "Leaderboard", icon: "/leaderboard.svg", path: "/" },
    { name: "Store", icon: "/store.svg", path: "/" },
    { name: "Profile", icon: "/profile.svg", path: "/" },
];

export const GameLayout = () => {
    const [moreOpen, setMoreOpen] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="hidden md:flex flex-col w-[260px] bg-grey-dark shrink-0 relative z-20 border-r-3 border-grey-light">
                <div className="px-6 py-8">
                    <Link to="/journeys">
                        <img src="/logo-text.svg" alt="Koddy" className="h-8 object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 px-4 pb-4 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${isActive
                                    ? "font-semibold bg-grey-light"
                                    : "hover:bg-grey-light/50"
                                }`
                            }
                        >
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain" />
                            <span className="text-[18px]">{item.name}</span>
                        </NavLink>
                    ))}

                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setMoreOpen(!moreOpen)}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors hover:bg-grey/60"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <img src="/more.svg" alt="More" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-[18px] flex-1 text-left">More</span>
                        </button>

                        {moreOpen && (
                            <div className="absolute left-full -bottom-16 mr-8 w-56 bg-grey-dark border-3 border-grey-light rounded-2xl shadow-2xl py-2 z-50">
                                <Link to="/" className="flex items-center gap-3 px-5 py-2 hover:bg-white/5" onClick={() => setMoreOpen(false)}>
                                    <img src="/notification-white.svg" alt="" className="w-6 h-6" />
                                    <span>Notifications</span>
                                </Link>
                                <Link to="/" className="flex items-center gap-3 px-5 py-2 hover:bg-white/5" onClick={() => setMoreOpen(false)}>
                                    <img src="/challenge-white.svg" alt="" className="w-6 h-6" />
                                    <span>Challenges</span>
                                </Link>
                                <Link to="/" className="flex items-center justify-between px-5 py-2 hover:bg-white/5" onClick={() => setMoreOpen(false)}>
                                    <div className="flex items-center gap-3">
                                        <img src="/course-white.svg" alt="" className="w-6 h-6" />
                                        <span>Courses</span>
                                    </div>
                                    <img src="/open-in-new-tab-white.svg" alt="" className="w-4 h-4" />
                                </Link>
                                <div className="h-px bg-white/25 my-1 mx-3"></div>
                                <Link to="/settings" className="block px-5 py-2 hover:bg-white/5" onClick={() => setMoreOpen(false)}>Settings</Link>
                                <button className="w-full text-left px-5 py-2 hover:bg-white/5" onClick={() => setMoreOpen(false)}>Logout</button>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                <Outlet />
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-grey-dark border-t-3 border-grey-light flex items-center justify-around px-2 z-40 pb-safe">
                {NAV_ITEMS.map((item, index) => {
                    if (index > 5) return null;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isActive ? "bg-white/10" : "opacity-60"
                                }`
                            }
                        >
                            <img src={item.icon} alt={item.name} className="w-7 h-7 object-contain" />
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};
