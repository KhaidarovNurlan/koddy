import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

export function User() {
    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = `${username}'s Profile - Koddy`;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/user/profile/${encodeURIComponent(username || '')}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                } else {
                    setError('User not found');
                }
            } catch (e) {
                console.error(e);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="mb-8 bg-grey-dark py-12 px-6 flex items-center justify-center min-h-[400px]">
                <p className="text-text-secondary">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="mb-8 bg-grey-dark py-12 px-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red font-bold">{error || 'User not found'}</p>
                <Link to="/profile?p=search" className="text-blue-light hover:underline font-bold">Search other friends</Link>
            </div>
        );
    }

    const titleObj = ALL_TITLES.find(t => t.id === profile?.activeTitle);
    let avatarBgColor = '#2087B3';
    if (profile?.avatar) {
        try {
            const parsed = JSON.parse(profile.avatar);
            if (parsed.bgColor) {
                avatarBgColor = parsed.bgColor;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="mb-8 bg-grey-dark py-12 px-6 flex items-center justify-center">
            <div className="flex-1 p-8 max-w-[700px] overflow-y-auto">
                <div className="h-72 rounded-2xl relative transition-colors duration-300" style={{ backgroundColor: avatarBgColor }}>
                    {titleObj && (
                        <div className="absolute top-4 left-4 w-16 h-16 rounded-xl flex items-center justify-center bg-black/20 border border-white/20 z-10">
                            <img src={titleObj.icon} alt={titleObj.name} className="w-12 h-12" title={titleObj.name} />
                        </div>
                    )}

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 flex items-center justify-center z-0">
                        <div className="w-56 h-56 shadow-2xl rounded-full bg-white/10 backdrop-blur-sm p-3.5 flex items-center justify-center">
                            <UserAvatar avatarConfig={profile.avatar} className="w-full h-full" alt="User Avatar" />
                        </div>
                    </div>
                </div>
                <div className="bg-grey-dark rounded-b-2xl pt-8 pb-6 px-8 mb-6">
                    <h2 className={`text-2xl font-bold text-white capitalize mb-6`}>{profile.username}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src={profile.streak ? "/fire-filled.svg" : "/fire.svg"} alt="Streak" className="w-8 h-8 mb-1" />
                                <span className="font-bold text-md text-white">{profile.streak}</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Streak</span>
                        </div>
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src="/xp-dark.svg" alt="XP" className="w-8 h-8 mb-1" />
                                <span className="font-bold text-md text-white">{profile.xp}</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Total XP</span>
                        </div>
                        <div className="bg-grey border border-grey-light border-3 rounded-xl p-4 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2">
                                <img src={profile.xp >= 100 ? `/league_${profile.league}.svg` : '/locked.svg'} alt="League" className="w-7 h-7 mb-1" />
                                <span className="font-bold text-md text-white capitalize">{profile.xp >= 100 ? profile.league : '-'}</span>
                            </div>
                            <span className="text-md text-text-secondary font-medium">Current league</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
