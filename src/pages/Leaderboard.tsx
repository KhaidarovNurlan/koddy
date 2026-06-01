import { useState, useEffect } from 'react';
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

export const Leaderboard = () => {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Leaderboard - Koddy";
    }, []);

    useEffect(() => {
        if (user && user.xp >= 100) {
            fetchLeaderboard();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/leaderboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeaderboardData(data);
            }
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center h-full">
            <span className="text-white/50">Loading...</span>
        </div>;
    }

    if (!user || user.xp < 100) {
        return (
            <div className="flex-1 p-8 w-full max-w-[700px] flex flex-col items-center pt-24">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img src="/locked.svg" alt="Locked" className="w-12 h-12" />
                    <img src="/locked.svg" alt="Locked" className="w-16 h-16" />
                    <img src="/locked.svg" alt="Locked" className="w-20 h-20" />
                    <img src="/locked.svg" alt="Locked" className="w-16 h-16" />
                    <img src="/locked.svg" alt="Locked" className="w-12 h-12" />
                </div>
                <h2 className="text-text-secondary text-[20px] font-semibold mb-20 text-center">
                    Reach 100 XP to unlock leaderboards!
                </h2>

                <div className="w-full max-w-[500px] flex flex-col gap-4 opacity-30 pointer-events-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-5 bg-grey/50 rounded-2xl p-4 px-6">
                            <div className="w-4 text-center text-text-secondary font-bold">-</div>
                            <div className="w-10 h-10 rounded-full bg-grey-light/20"></div>
                            <div className="h-4 bg-grey-light/20 rounded w-24 flex-1"></div>
                            <div className="h-4 bg-grey-light/20 rounded w-12"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const leagueNames = {
        'starter': 'Starter League',
        'explorer': 'Explorer League',
        'rookie': 'Rookie League',
        'apprentice': 'Apprentice League',
        'challenger': 'Challenger League',
        'master': 'Master League'
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '/first.svg';
        if (rank === 2) return '/second.svg';
        if (rank === 3) return '/third.svg';
        return null;
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            {leaderboardData && (
                <>
                    <div className="flex flex-col items-center justify-center mb-10">
                        <img
                            src={`/league_${leaderboardData.league}.svg`}
                            alt={leaderboardData.league}
                            className="w-32 h-32 drop-shadow-2xl mb-4"
                        />
                        <h1 className="text-2xl font-bold text-white capitalize mb-1">
                            {leagueNames[leaderboardData.league as keyof typeof leagueNames] || `${leaderboardData.league} League`}
                        </h1>
                        <p className="text-text-secondary font-medium">
                            Your rank: <span className="text-blue-light font-bold">#{leaderboardData.rank}</span>
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-[600px] flex flex-col gap-2">
                        {leaderboardData.leaderboard.map((u: any) => {
                            const isMe = u.id === user.id;
                            const rankIcon = getRankIcon(u.rank);
                            const titleObj = ALL_TITLES.find(t => t.id === u.activeTitle);

                            return (
                                <div key={u.id} className={`flex items-center gap-4 rounded-2xl p-4 px-6 shadow-sm transition-all
                                    ${isMe ? 'bg-grey-light border border-grey-lighter scale-[1.02]' : 'bg-grey hover:bg-grey/80'}
                                `}>
                                    <div className="w-8 flex justify-center items-center flex-shrink-0">
                                        {rankIcon ? (
                                            <img src={rankIcon} alt={`Rank ${u.rank}`} className="w-8 h-8 drop-shadow-md" />
                                        ) : (
                                            <span className={`font-bold text-lg ${isMe ? 'text-white' : 'text-text-secondary'}`}>
                                                {u.rank}
                                            </span>
                                        )}
                                    </div>

                                    <UserAvatar avatarConfig={u.avatar} className="w-10 h-10 rounded-full border border-grey-light flex-shrink-0" alt="Avatar" />

                                    <div className={`font-semibold text-[15px] flex-1 truncate ${isMe ? 'text-white' : 'text-white/90'}`}>
                                        <div className="flex items-center gap-2">
                                            {u.username} {isMe && <span className="text-text-secondary text-xs font-normal">(You)</span>}
                                        </div>
                                        {titleObj && (
                                            <div className="flex items-center gap-1 mt-1 opacity-80 bg-blue-light/10 text-blue-light w-fit px-2 py-0.5 rounded-full border border-blue-light/20 text-xs">
                                                <img src={titleObj.icon} className="w-3.5 h-3.5" alt="" />
                                                <span className="font-bold">{titleObj.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`font-bold text-[15px] ${isMe ? 'text-blue-light' : 'text-white/80'}`}>
                                        {u.xp} XP
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};
