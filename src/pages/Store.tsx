import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface StoreItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    actionText: string;
    actionValue: number | null;
    actionDisabled: boolean;
    badge?: string;
}

const BOOSTERS: StoreItem[] = [
    {
        id: 'free-chest',
        name: 'Free Chest',
        description: 'Open once a day to earn up to 10 tokens for free.',
        icon: '/chest-free.svg',
        actionText: 'OPEN',
        actionValue: null,
        actionDisabled: false,
    },
    {
        id: 'streak-freeze',
        name: 'Streak Freeze',
        description: 'Streak Freeze ensures that your streak remains unaffected even in case of a full day of inactivity.',
        icon: '/streak_freeze.svg',
        actionText: '20',
        actionValue: 20,
        actionDisabled: true,
    },
    {
        id: 'double-or-nothing',
        name: 'Double or Nothing',
        description: 'Double your 10 tokens wager by maintaining a 7 day streak.',
        icon: '/double_or_nothing.svg',
        actionText: '30',
        actionValue: 30,
        actionDisabled: true,
    },
    {
        id: 'xp-surge',
        name: 'XP Surge',
        description: 'Double your XP for the next 30 minutes.',
        icon: '/booster_xp_surge.svg',
        actionText: '25',
        actionValue: 25,
        actionDisabled: true,
    },
    {
        id: 'refill-energy',
        name: 'Refill Energy',
        description: 'Get full energy and get back to learning instantly.',
        icon: '/energy-refill.svg',
        actionText: '10',
        actionValue: 10,
        actionDisabled: true,
    }
];

const TITLES: StoreItem[] = [
    {
        id: 'title-box',
        name: 'Title Box',
        description: 'Open to receive a random locked title.',
        icon: '/title-book.svg',
        actionText: '50',
        actionValue: 50,
        actionDisabled: true,
    },
    {
        id: 'byte-master',
        name: 'Byte Master',
        description: 'Precision and control are your strengths. As a Byte Master, you command the smallest units of data to create something remarkable.',
        icon: '/title_byte_master.svg',
        actionText: '20',
        actionValue: 20,
        actionDisabled: true,
    },
    {
        id: 'algorithm-architect',
        name: 'Algorithm Architect',
        description: 'Master of structure and logic. Your ability to design and build efficient algorithms sets you apart as a true architect of code.',
        icon: '/title_algorithm_architect.svg',
        actionText: '20',
        actionValue: 20,
        actionDisabled: true,
    },
    {
        id: 'coddy-innovator',
        name: 'Coddy Innovator',
        description: "Showcase your creativity and innovation. You're constantly pushing boundaries, finding new solutions, and leading the way in the world of code.",
        icon: '/title_koddy_innovator.svg',
        actionText: '20',
        actionValue: 20,
        actionDisabled: true,
    },
    {
        id: 'code-oracle',
        name: 'Code Oracle',
        description: 'Your innovative spirit and forward-thinking solutions set you apart as a true leader, pushing the boundaries of technology.',
        icon: '/title_code_oracle.svg',
        actionText: '40',
        actionValue: 40,
        actionDisabled: true,
    },
    {
        id: 'quantum-coder',
        name: 'Quantum Coder',
        description: "You've entered the realm of the extraordinary. Your coding skills operate at a higher level, as if you're coding in another dimension.",
        icon: '/title_quantum_coder.svg',
        actionText: '40',
        actionValue: 40,
        actionDisabled: true,
    }
];

export const Store = () => {
    const [activeTab, setActiveTab] = useState<'boosters' | 'titles'>('boosters');
    const { user, refreshUser } = useAuth();
    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        document.title = "Store - Koddy";
    }, []);

    const items = activeTab === 'boosters' ? BOOSTERS : TITLES;

    const userTitles = user?.titles ? JSON.parse(user.titles) : [];
    
    const dynamicItems = items.map(item => {
        let actionDisabled = item.actionDisabled;
        let actionText = item.actionText;
        let actionValue = item.actionValue;
        
        if (item.id === 'free-chest') {
            const available = !user?.freeChestLastOpened || (Date.now() - new Date(user.freeChestLastOpened).getTime() >= 24 * 60 * 60 * 1000);
            actionDisabled = !available;
            if (!available) actionText = 'OPENED';
        } else if (item.actionValue !== null) {
            actionDisabled = (user?.tokens || 0) < item.actionValue;
        }
        
        if (item.id === 'double-or-nothing') {
            if (user?.doubleOrNothingStart) {
                actionDisabled = true;
                actionText = 'ACTIVE';
                actionValue = null;
            }
        } else if (item.id === 'xp-surge') {
            if (user?.xpDoublerUntil && new Date(user.xpDoublerUntil) > new Date()) {
                actionDisabled = true;
                actionText = 'ACTIVE';
                actionValue = null;
            }
        } else if (item.id === 'refill-energy') {
            if ((user?.energy || 0) >= 5) {
                actionDisabled = true;
                actionText = 'FULL';
                actionValue = null;
            }
        } else if (item.id === 'title-box') {
             const allTitles = ['byte-master', 'algorithm-architect', 'coddy-innovator', 'code-oracle', 'quantum-coder'];
             const available = allTitles.filter(t => !userTitles.includes(t));
             if (available.length === 0) {
                 actionDisabled = true;
                 actionText = 'SOLD OUT';
                 actionValue = null;
             }
        } else if (TITLES.find(t => t.id === item.id) && item.id !== 'title-box') {
             if (userTitles.includes(item.id)) {
                 if (user?.activeTitle === item.id) {
                     actionDisabled = true;
                     actionText = 'EQUIPPED';
                     actionValue = null;
                 } else {
                     actionDisabled = false;
                     actionText = 'EQUIP';
                     actionValue = null;
                 }
             }
        }
        
        return { ...item, actionDisabled, actionText, actionValue };
    });

    const handleAction = async (itemId: string, itemObj: any) => {
        if (claiming) return;
        setClaiming(true);
        try {
            const token = localStorage.getItem('token');
            if (itemId === 'free-chest') {
                const res = await fetch('/api/user/store/free-chest', { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    toast.success(`You found ${data.rewardTokens} tokens!`);
                    await refreshUser();
                } else {
                    toast.error('Already opened today');
                }
            } else if (TITLES.find(t => t.id === itemId) && itemId !== 'title-box' && userTitles.includes(itemId)) {
                const res = await fetch('/api/user/set-title', { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ titleId: itemId })
                });
                if (res.ok) {
                    toast.success('Title equipped!');
                    await refreshUser();
                }
            } else {
                const res = await fetch('/api/user/store/buy', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId, price: itemObj.actionValue })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.title) {
                        const titleObj = TITLES.find(t => t.id === data.title);
                        toast.success(`Unlocked title: ${titleObj?.name || data.title}`);
                    } else {
                        toast.success('Purchase successful!');
                    }
                    await refreshUser();
                } else {
                    const err = await res.json();
                    toast.error(err.error || 'Failed to purchase');
                }
            }
        } catch (e) {
            console.error(e);
            toast.error('An error occurred');
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <div className="flex border-b-3 border-grey-light mb-4">
                <button
                    onClick={() => setActiveTab('boosters')}
                    className={`pb-4 px-2 mr-6 text-[20px] font-bold border-b-2 transition-colors ${activeTab === 'boosters' ? 'border-blue-light text-blue-light' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Boosters
                </button>
                <button
                    onClick={() => setActiveTab('titles')}
                    className={`pb-4 px-2 mr-6 text-[20px] font-bold border-b-2 transition-colors ${activeTab === 'titles' ? 'border-blue-light text-blue-light' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Titles
                </button>
            </div>

            <div className="flex flex-col">
                {dynamicItems.map((item) => (
                    <div key={item.id} className="flex flex-col py-6 gap-3 border-b-3 border-grey-light last:border-0">
                        <div className="flex flex-row justify-between flex-1 w-full">
                            <div className="flex flex-row gap-3 items-center">
                                <img src={item.icon} alt={item.name} className="w-[42px] h-[42px] object-contain drop-shadow-md flex-shrink-0" />
                                <h3 className="text-[14px] lg:text-[18px] font-medium text-white justify-center">{item.name}</h3>
                            </div>
                            <button
                                onClick={() => handleAction(item.id, item)}
                                disabled={item.actionDisabled || claiming}
                                className={`inline-flex items-center justify-center px-3 lg:px-5 py-2.5 bg-grey text-blue-light font-semibold text-[12px] lg:text-[16px] rounded-xl transition-all border-2 border-grey-light
                                    ${(item.actionDisabled || claiming)
                                        ? 'shadow-[0_2px_0_0_#494D50] text-text-secondary cursor-not-allowed opacity-80'
                                        : 'shadow-[0_5px_0_0_#494D50] hover:shadow-[0_0px_0_0_#494D50] hover:translate-y-[3px] cursor-pointer'
                                    }
                                `}
                            >
                                <span>{item.actionText}</span>
                                {item.actionValue && <img src="/token.svg" alt="Tokens" className="w-4 h-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />}
                            </button>
                        </div>
                        <div className="flex flex-row gap-3 items-center">
                            <p className="text-[12px] lg:text-[16px] text-text-secondary">{item.description}</p>
                            {item.badge && (
                                <div className="inline-flex items-center justify-center gap-1 bg-orange px-2 py-1 rounded-xl text-[12px] font-bold w-fit">
                                    {item.badge.split(' ')[0]} <img src="/fire-filled-white.svg" className="w-3.5 h-3.5" alt="Fire" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
