import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';

function MyProfile() {
    const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
    const { user } = useAuth();

    return (
        <>
            <div className="flex-1 p-8 w-full max-w-[700px]">
                <div className="bg-avatar-bg-default h-72 rounded-2xl relative">
                    <button
                        onClick={() => setIsTitleModalOpen(true)}
                        className="cursor-pointer absolute top-4 left-4 w-16 h-16 border-2 border-dashed border-white/50 rounded-xl flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors z-10"
                    >
                        <img src="/plus-white.svg" alt="Add Title" className="w-8 h-8" />
                    </button>

                    <button className="cursor-pointer absolute bottom-4 right-4 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors z-10">
                        <img src="/edit-white.svg" alt="Edit" className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 flex items-center justify-center z-0">
                        <img
                            src="/avatar_placeholder.png"
                            alt="Avatar Placeholder"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="bg-grey-dark rounded-b-2xl pt-8 pb-6 px-8 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{user?.email ? user.email.split('@')[0] : 'Username'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src="/fire.svg" alt="Streak" className="w-8 h-8 mb-1" />
                                <span className="font-bold text-md text-white">0</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Streak</span>
                        </div>
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src="/xp-dark.svg" alt="Streak" className="w-8 h-8 mb-1" />
                                <span className="font-bold text-md text-white">{user?.xp || 0}</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Total XP</span>
                        </div>
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src="/locked.svg" alt="League" className="w-7 h-7 mb-1" />
                                <span className="font-bold text-md text-white">-</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Current league</span>
                        </div>
                    </div>
                </div>

                <div className="bg-grey border-3 border-grey-light rounded-2xl p-4">
                    <h3 className="font-bold text-lg text-white">Badges</h3>
                    <div className="h-1 bg-grey-light my-4" />
                    <div className="flex flex-col gap-4 h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Basic Profile</h4>
                                    <p className="text-sm text-text-secondary">Added title to profile</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">The Start</h4>
                                    <p className="text-sm text-text-secondary">Solved 3 coding problems</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Daily Coder</h4>
                                    <p className="text-sm text-text-secondary">Maintained a 3-day streak</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Nicely Done</h4>
                                    <p className="text-sm text-text-secondary">Finished first course</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Noobie Portfolio</h4>
                                    <p className="text-sm text-text-secondary">Finished first project</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Happy User</h4>
                                    <p className="text-sm text-text-secondary">Use Koddy for 5 days</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Koddy Store</h4>
                                    <p className="text-sm text-text-secondary">Purchased one product from Koddy store</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Starter Achiever</h4>
                                    <p className="text-sm text-text-secondary">Claim 5 daily goals reward</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Novice Challenger</h4>
                                    <p className="text-sm text-text-secondary">Solve 5 challenges on the first try</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Experience Beginner</h4>
                                    <p className="text-sm text-text-secondary">Achieved 100 XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isTitleModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                    <div className="bg-grey-dark border-3 border-grey-light rounded-2xl w-full max-w-[400px] flex flex-col max-h-[80vh] shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b-3 border-grey-light shrink-0">
                            <button onClick={() => setIsTitleModalOpen(false)} className="hover:opacity-80 transition-opacity w-6 h-6 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <button className="text-blue-light font-bold text-sm hover:text-white transition-colors uppercase tracking-widest">
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 max-h-[285px] overflow-y-auto py-3.5 custom-scrollbar">
                            <div className="flex flex-col">
                                <button className="flex items-center gap-3 p-3.5 border-b border-grey-light hover:bg-white/5 transition-colors w-full text-left">
                                    <img src="/title_bit_apprentice.svg" alt="" className="w-6 h-6" />
                                    <span className="text-[15px]">Bit Antroid's Apprentice</span>
                                </button>
                                <button className="flex items-center gap-3 p-3.5 border-y border-grey-light hover:bg-white/5 transition-colors w-full text-left">
                                    <img src="/title_code_crusader.svg" alt="" className="w-6 h-6" />
                                    <span className="ftext-[15px]">Code Crusader</span>
                                </button>
                                <button className="flex items-center gap-3 p-3.5 border-y border-grey-light hover:bg-white/5 transition-colors w-full text-left">
                                    <img src="/title_loop_legend.svg" alt="" className="w-6 h-6" />
                                    <span className="text-[15px]">Loop Legend</span>
                                </button>

                                {[
                                    { name: "Motivator", icon: "/fire-filled.svg" },
                                    { name: "Byte Master", icon: "/title_byte_master.svg" },
                                    { name: "Algorithm Architect", icon: "/title_algorithm_architect.svg" },
                                    { name: "Koddy Innovator", icon: "/title_koddy_innovator.svg" },
                                    { name: "Code Oracle", icon: "/title_code_oracle.svg" },
                                    { name: "Quantum Coder", icon: "/title_quantum_coder.svg" },
                                    { name: "Lucky Coder", icon: "/title_lucky_coder.svg" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center p-3.5 opacity-40 cursor-not-allowed border-y border-grey-light">
                                        <div className="flex items-center gap-3">
                                            <img src={item.icon} alt="" className="w-6 h-6" />
                                            <span className="text-[15px]">{item.name}</span>
                                        </div>
                                        <img src="/lock-white.svg" alt="Locked" className="w-4 h-4 opacity-50" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SearchFriends() {
    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <Link to="/profile" className="hidden lg:flex items-center gap-2 text-white text-lg mb-6 hover:opacity-80">
                <img src="/left-white.svg" alt="Back" className="w-6 h-6" />
                Back
            </Link>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full bg-grey border-3 border-grey-light rounded-xl py-3 px-4 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors"
                />
                <img src="/search-white.svg" alt="Search" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-75" />
            </div>
            {/* There will be all relevant users */}
            {/* <div className="flex flex-col gap-3">
                    {users.map((user, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#242627] border border-[#3b3d3f] rounded-xl hover:border-blue/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <Link to={`/user/${user.name}`} className="w-12 h-12 rounded-full overflow-hidden bg-grey-light border-2 border-[#1b1c1d] shrink-0 hover:opacity-80 transition-opacity">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </Link>
                                <div>
                                    <Link to={`/user/${user.name}`} className="font-bold text-white text-[15px] hover:underline">{user.name}</Link>
                                    <p className="text-sm text-text-secondary">{user.handle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
        </div>
    );
}

export function Profile() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get('p');

    useEffect(() => {
        document.title = "My Profile - Koddy";
    }, []);

    if (page === 'search') {
        return <SearchFriends />;
    }

    return <MyProfile />;
}
