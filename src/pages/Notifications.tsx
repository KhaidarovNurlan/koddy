import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    reward: string | null;
    createdAt: string;
}

export const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Notifications - Koddy";
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px] animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-[20px] font-bold text-white">Notifications</h1>
                {notifications.length > 0 && (
                    <span className="text-[13px] text-text-secondary font-bold">
                        {notifications.length} message{notifications.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <p className="text-text-secondary text-center py-8">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-grey-light rounded-2xl bg-grey/30">
                        <img src="/logo-icon.svg" alt="Koddy" className="w-16 h-16 opacity-30 mb-4" />
                        <h2 className="text-[18px] font-bold text-white/40">
                            No notifications to show
                        </h2>
                        <p className="text-[14px] text-text-secondary mt-1">
                            Complete daily goals to earn rewards!
                        </p>
                    </div>
                ) : (
                    notifications.map((item) => {
                        const date = new Date(item.createdAt);
                        const dateStr = date.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div 
                                key={item.id} 
                                className="flex items-start gap-4 p-5 rounded-2xl bg-grey border-2 border-grey-light hover:border-blue-light/30 transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0 text-orange">
                                    <img src="/daily-challenges.svg" alt="" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-[16px] font-bold text-white pr-2 truncate">
                                            {item.title}
                                        </h4>
                                        <span className="text-[12px] text-text-secondary whitespace-nowrap">
                                            {dateStr}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-white/80 mb-2 leading-relaxed">
                                        {item.message}
                                    </p>
                                    {item.reward && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green/10 text-green text-[13px] font-bold">
                                            <img src="/token.svg" alt="" className="w-4 h-4 object-contain" />
                                            Reward: {item.reward}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
