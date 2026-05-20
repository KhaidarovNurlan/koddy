import { Link, Outlet } from 'react-router-dom';

export const GameStatsLayout = () => {
    const currentDayIndex = new Date().getDay();

    return (
        <div className="flex flex-col lg:flex-row justify-center h-full w-full max-w-full">
            <Outlet />
            <aside className="hidden lg:flex flex-col w-[300px] pt-8 px-8 xl:px-0 gap-6">
                <div className="flex justify-between gap-2 text-md font-semibold w-full relative">
                    <div className="relative group pb-4 -mb-4">
                        <div className="flex items-center justify-center p-2 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10 min-w-10">
                            <img src="/no-journey.svg" alt="Journey" className="w-6 h-6" />
                        </div>

                        <div className="absolute right-0 top-[calc(100%-8px)] w-48 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl py-2 relative">
                                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>

                                <div className="block px-5 py-3 font-semibold text-white">My Journeys</div>
                                <div className="h-px bg-white/10 my-1 mx-3"></div>

                                <Link to="/journeys" className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors font-semibold text-text-secondary hover:text-white">
                                    <div className="w-6 h-6 rounded-md border-2 border-current flex items-center justify-center text-xl leading-none pt-0.5">+</div>
                                    <span>Add Journey</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative group pb-4 -mb-4">
                        <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                            <span>0</span>
                            <img src="/fire.svg" alt="Streak" className="w-6 h-6" />
                        </div>
                        <div className="absolute right-1/2 translate-x-[40px] top-full top-[calc(100%-8px)] w-[320px] bg-grey-dark border-2 border-orange rounded-2xl shadow-2xl z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                            <div className="bg-orange p-5 pb-6 relative z-0">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1.5">0 day streak</h3>
                                        <p className="text-white/90 text-sm max-w-[200px] leading-tight font-medium">Do a lesson today to start a new streak!</p>
                                    </div>
                                    <img src="/fire-white.svg" alt="Streak" className="w-14 h-14 opacity-90 drop-shadow-md" />
                                </div>
                                <div className="bg-grey-dark/80 rounded-xl p-4 flex justify-between">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                                        const isToday = i === currentDayIndex;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-2">
                                                <span className="text-[11px] font-bold text-white/50">{day}</span>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isToday ? 'bg-grey-dark transition-colors border-2 border-orange' : 'bg-grey-light/50'}`}></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group pb-4 -mb-4">
                        <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                            <span className="text-orange">0</span>
                            <img src="/token.svg" alt="Tokens" className="w-6 h-6" />
                        </div>
                        <div className="absolute right-1/2 translate-x-[25px] top-full top-[calc(100%-8px)] w-[280px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-5 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="absolute -top-2 right-[30px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                            <div className="flex items-center gap-4">
                                <img src="/tokens.svg" alt="Tokens" className="w-16 h-16 object-contain" />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">Tokens</h3>
                                    <p className="text-text-secondary text-[15px] font-medium mb-3">You have <span className="font-bold text-white">0</span> tokens</p>
                                    <Link to="/store" className="text-blue-light font-bold text-[13px] hover:text-white transition-colors uppercase tracking-wider">Go to store</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group pb-4 -mb-4">
                        <div className="flex items-center justify-center gap-2 px-3 rounded-xl group-hover:bg-grey transition-colors cursor-pointer h-10">
                            <span className="text-blue">5</span>
                            <img src="/energy.svg" alt="Energy" className="w-6 h-6" />
                        </div>
                        <div className="absolute right-0 top-full top-[calc(100%-8px)] w-[320px] bg-grey-dark border-2 border-grey-light rounded-2xl shadow-2xl p-6 z-50 pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="absolute -top-2 right-[25px] w-3 h-3 bg-grey-dark border-t-2 border-l-2 border-grey-light rotate-45"></div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-xl font-bold text-white mb-4">Energy</h3>
                                <div className="flex gap-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <img key={i} src="/energy.svg" alt="Energy" className="w-6 h-6" />
                                    ))}
                                </div>
                                <p className="text-white font-bold text-[15px] mb-2">You have full energy</p>
                                <p className="text-text-secondary font-medium text-sm mb-6 text-center">Each energy equals one completed lesson</p>

                                <button className="cursor-pointer w-full flex items-center justify-between bg-grey p-2.5 bg-grey text-blue-light font-semibold rounded-xlpy-2.5 text-blue-light font-semibold rounded-xl transition-all border-2 border-grey-light shadow-[0_5px_0_0_#494D50] hover:shadow-[0_0px_0_0_#494D50] hover:translate-y-[3px]">
                                    <div className="flex items-center gap-3">
                                        <img src="/energy-refill.svg" className="w-6 h-6" />
                                        <span>REFILL ENERGY</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/50">
                                        <span>25</span>
                                        <img src="/token.svg" alt="Token" className="w-3.5 h-3.5 grayscale" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-grey border-3 border-grey-light rounded-xl p-4 w-full">
                    <h3 className="text-lg font-bold mb-6 text-white">Actions</h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/user/nurlan" target="_blank" className="flex items-center gap-3">
                            <img src="/resume-white.svg" alt="" className="w-6 h-6" />
                            <span>Public profile</span>
                        </Link>
                        <Link to="/profile?p=search" className="flex items-center gap-3">
                            <img src="/search-white.svg" alt="" className="w-6 h-6" />
                            <span>Search friends</span>
                        </Link>
                    </div>
                </div>

                <div className="text-sm text-text-secondary flex flex-wrap gap-x-4 gap-y-2 px-2">
                    <Link to="/about" className="hover:text-text-secondary">About</Link>
                    <Link to="/contact" className="hover:text-text-secondary">Contact Us</Link>
                    <Link to="/faqs" className="hover:text-text-secondary">FAQs</Link>
                    <Link to="/ai_assistant" className="hover:text-text-secondary">AI Assistant</Link>
                </div>
            </aside>
        </div>
    );
};
