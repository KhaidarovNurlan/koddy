import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/UserAvatar';

const ALL_TITLES = [
    { id: 'bit-apprentice', name: "Bit Antroid's Apprentice", icon: '/title_bit_apprentice.svg' },
    { id: 'code-crusader', name: 'Code Crusader', icon: '/title_code_crusader.svg' },
    { id: 'loop-legend', name: 'Loop Legend', icon: '/title_loop_legend.svg' },
    { id: 'byte-master', name: 'Byte Master', icon: '/title_byte_master.svg' },
    { id: 'algorithm-architect', name: 'Algorithm Architect', icon: '/title_algorithm_architect.svg' },
    { id: 'coddy-innovator', name: 'Coddy Innovator', icon: '/title_koddy_innovator.svg' },
    { id: 'code-oracle', name: 'Code Oracle', icon: '/title_code_oracle.svg' },
    { id: 'quantum-coder', name: 'Quantum Coder', icon: '/title_quantum_coder.svg' },
];

function MyProfile() {
    const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
    const { user, refreshUser } = useAuth();

    const [adminUsername, setAdminUsername] = useState('');
    const [adminAmount, setAdminAmount] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    const userTitles = user?.titles ? JSON.parse(user.titles) : [];
    const freeTitles = ['bit-apprentice', 'code-crusader', 'loop-legend'];
    freeTitles.forEach(t => {
        if (!userTitles.includes(t)) userTitles.push(t);
    });

    const activeTitleObj = ALL_TITLES.find(t => t.id === user?.activeTitle);

    const handleSetTitle = async (titleId: string | null) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/set-title', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ titleId })
            });
            if (res.ok) {
                await refreshUser();
                setIsTitleModalOpen(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAdminAward = async (type: 'xp' | 'tokens') => {
        if (!adminUsername || !adminAmount) return;
        setAdminLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/award', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: adminUsername, type, amount: parseInt(adminAmount) })
            });
            if (res.ok) {
                toast.success(`Successfully awarded ${adminAmount} ${type} to ${adminUsername}`);
                setAdminUsername('');
                setAdminAmount('');
                await refreshUser();
            } else {
                const data = await res.json();
                toast.error(`Error: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            toast.error('An error occurred');
        } finally {
            setAdminLoading(false);
        }
    };

    let avatarBgColor = '#2087B3';
    if (user?.avatar) {
        try {
            const parsed = JSON.parse(user.avatar);
            if (parsed.bgColor) {
                avatarBgColor = parsed.bgColor;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <div className="flex-1 p-8 w-full max-w-[700px]">
                <div className="h-72 rounded-2xl relative transition-colors duration-300" style={{ backgroundColor: avatarBgColor }}>
                    <button
                        onClick={() => setIsTitleModalOpen(true)}
                        className={`cursor-pointer absolute top-4 left-4 w-16 h-16 rounded-xl flex items-center justify-center transition-colors z-10 ${activeTitleObj
                            ? 'bg-black/20 hover:bg-black/40 border border-white/20'
                            : 'border-2 border-dashed border-white/50 bg-black/10 hover:bg-black/20'
                            }`}
                    >
                        {activeTitleObj ? (
                            <img src={activeTitleObj.icon} alt={activeTitleObj.name} className="w-12 h-12" title={activeTitleObj.name} />
                        ) : (
                            <img src="/plus-white.svg" alt="Add Title" className="w-8 h-8" />
                        )}
                    </button>

                    <Link to="/avatar" className="cursor-pointer absolute bottom-4 right-4 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors z-10">
                        <img src="/edit-white.svg" alt="Edit" className="w-6 h-6" />
                    </Link>

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 flex items-center justify-center z-0">
                        <div className="w-56 h-56 shadow-2xl rounded-full bg-white/10 backdrop-blur-sm p-3.5 flex items-center justify-center">
                            <UserAvatar avatarConfig={user?.avatar} className="w-full h-full" alt="User Avatar" />
                        </div>
                    </div>
                </div>
                <div className="bg-grey-dark rounded-b-2xl pt-8 pb-6 px-8 mb-6">
                    <h2 className={`text-2xl font-bold text-white mb-6`}>
                        {user?.email ? user.email.split('@')[0] : 'Username'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src={user?.streak ? "/fire-filled.svg" : "/fire.svg"} alt="Streak" className="w-8 h-8 mb-1" />
                                <span className="font-bold text-md text-white">{user?.streak ?? 0}</span>
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
                                <img src={user && user.xp >= 100 && (user as any).league ? `/league_${(user as any).league}.svg` : '/locked.svg'} alt="League" className="w-7 h-7 mb-1" />
                                <span className="font-bold text-md text-white capitalize">{user && user.xp >= 100 && (user as any).league ? (user as any).league : '-'}</span>
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
                                    <p className="text-sm text-text-secondary">Created first project</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src="/unknown_badge.svg" alt="Badge" className="w-16 h-16 opacity-50" />
                                <div>
                                    <h4 className="font-bold text-white text-[15px]">Happy User</h4>
                                    <p className="text-sm text-text-secondary">Achieved 10 Tokens</p>
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
                                    <h4 className="font-bold text-white text-[15px]">Experience Beginner</h4>
                                    <p className="text-sm text-text-secondary">Achieved 100 XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {user?.email === 'nurlankh888@gmail.com' && (
                    <div className="bg-grey border-3 border-grey-light rounded-2xl p-4 mt-6">
                        <h3 className="font-bold text-lg text-white">Admin Panel</h3>
                        <div className="h-1 bg-grey-light my-4" />
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Username (e.g. user)"
                                value={adminUsername}
                                onChange={e => setAdminUsername(e.target.value)}
                                className="bg-grey-dark border border-grey-light rounded p-2 text-white outline-none focus:border-blue-light"
                            />
                            <input
                                type="number"
                                placeholder="Amount (e.g. 50)"
                                value={adminAmount}
                                onChange={e => setAdminAmount(e.target.value)}
                                className="bg-grey-dark border border-grey-light rounded p-2 text-white outline-none focus:border-blue-light"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAdminAward('xp')}
                                    disabled={adminLoading}
                                    className="flex-1 bg-blue text-white py-2 rounded font-bold hover:brightness-110 disabled:opacity-50"
                                >
                                    Award XP
                                </button>
                                <button
                                    onClick={() => handleAdminAward('tokens')}
                                    disabled={adminLoading}
                                    className="flex-1 bg-orange text-white py-2 rounded font-bold hover:brightness-110 disabled:opacity-50"
                                >
                                    Award Tokens
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
                            <button onClick={() => handleSetTitle(null)} className="text-blue-light font-bold text-sm hover:text-white transition-colors uppercase tracking-widest">
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 max-h-[285px] overflow-y-auto py-3.5 custom-scrollbar">
                            <div className="flex flex-col">
                                {ALL_TITLES.map((item) => {
                                    const isOwned = userTitles.includes(item.id);
                                    if (isOwned) {
                                        const isEquipped = user?.activeTitle === item.id;
                                        return (
                                            <button key={item.id} onClick={() => handleSetTitle(item.id)} className={`flex items-center justify-between p-3.5 border-b border-grey-light hover:bg-white/5 transition-colors w-full text-left ${isEquipped ? 'bg-white/5' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <img src={item.icon} alt="" className="w-6 h-6" />
                                                    <span className={`text-[15px] ${isEquipped ? 'text-blue-light font-bold' : 'text-white'}`}>{item.name}</span>
                                                </div>
                                                {isEquipped && <img src="/check-blue.svg" alt="Equipped" className="w-5 h-5" />}
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <div key={item.id} className="flex items-center justify-between p-3.5 opacity-40 cursor-not-allowed border-b border-grey-light">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.icon} alt="" className="w-6 h-6 grayscale" />
                                                    <span className="text-[15px] text-white">{item.name}</span>
                                                </div>
                                                <img src="/lock-white.svg" alt="Locked" className="w-4 h-4 opacity-50" />
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SearchFriends() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) {
                setUsers([]);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/user/search?q=${encodeURIComponent(searchQuery)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users || []);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const timer = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <Link to="/profile" className="hidden lg:flex items-center gap-2 text-white text-lg mb-6 hover:opacity-80">
                <img src="/left-white.svg" alt="Back" className="w-6 h-6" />
                Back
            </Link>

            <div className="relative mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full bg-grey border-3 border-grey-light rounded-xl py-3 px-4 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors"
                />
                <img src="/search-white.svg" alt="Search" className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-75" />
            </div>

            <div className="flex flex-col gap-3">
                {users.map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#242627] border-3 border-grey-light rounded-xl hover:border-blue-light/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <Link to={`/user/${user.username}`} className="w-12 h-12 rounded-full overflow-hidden shrink-0 hover:opacity-80 transition-opacity flex items-center justify-center">
                                <UserAvatar avatarConfig={user.avatar} className="w-12 h-12 rounded-full" alt={user.username} />
                            </Link>
                            <div>
                                <Link to={`/user/${user.username}`} className="font-bold text-white text-[15px] hover:underline flex items-center gap-2">
                                    {user.username}
                                    {user.activeTitle && ALL_TITLES.find(t => t.id === user.activeTitle) && (
                                        <div className="flex items-center gap-1 bg-blue-light/10 text-blue-light px-2 py-0.5 rounded-full text-xs font-bold border border-blue-light/20">
                                            <img src={ALL_TITLES.find(t => t.id === user.activeTitle)?.icon} className="w-3.5 h-3.5" alt="" />
                                            {ALL_TITLES.find(t => t.id === user.activeTitle)?.name}
                                        </div>
                                    )}
                                </Link>
                                <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <img src="/xp-dark.svg" className="w-4 h-4" alt="" />
                                        {user.xp} XP
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <img src={user.streak ? "/fire-filled.svg" : "/fire.svg"} className="w-4 h-4" alt="" />
                                        {user.streak} days
                                    </span>
                                    {user.xp >= 100 && (
                                        <span className="flex items-center gap-1 capitalize">
                                            <img src={`/league_${user.league}.svg`} className="w-4 h-4" alt="" />
                                            {user.league}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {searchQuery && users.length === 0 && (
                    <p className="text-text-secondary text-center text-sm py-4">No users found matching "{searchQuery}"</p>
                )}
            </div>
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
