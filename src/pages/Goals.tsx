import { useEffect, useState } from 'react';
import programmingQuotes from '../data/quotes.json';
import toast from 'react-hot-toast';

interface Goal {
    title: string;
    current: number;
    total: number;
    claimed: boolean;
}

export const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [quote, setQuote] = useState<string>("No quote today ( Sry");
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        document.title = "Goals - Koddy";
        fetchGoals();

        if (programmingQuotes && programmingQuotes.length > 0) {
            const currentDayTimestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            const quoteIndex = currentDayTimestamp % programmingQuotes.length;
            const todayQuote = programmingQuotes[quoteIndex];
            setQuote(`${todayQuote.en}`);
        }

        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/goals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setGoals(data.goals || []);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load daily goals");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px] animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-[20px] font-bold text-white">Daily Goals</h1>
                <div className="flex items-center px-4 py-1.5 rounded-full border-2 border-blue-light bg-transparent">
                    <span className="text-[14px] font-bold text-blue-light">Time left: {timeLeft}</span>
                </div>
            </div>

            <div className="flex flex-col mb-8">
                {loading ? (
                    <p className="text-text-secondary py-4 text-center">Loading goals...</p>
                ) : goals.length === 0 ? (
                    <p className="text-text-secondary py-4 text-center">No goals for today.</p>
                ) : (
                    goals.map((goal, index) => {
                        const progressPercent = Math.min(100, (goal.current / goal.total) * 100);
                        const isCompleted = goal.current >= goal.total;

                        return (
                            <div key={index} className="flex justify-between items-center py-5 border-b-2 border-grey/80 last:border-0">
                                <div className="flex-1 pr-6">
                                    <h4 className={`text-[15px] font-semibold mb-3 ${isCompleted ? 'text-green' : 'text-white/90'}`}>
                                        {goal.title} {isCompleted && '✓'}
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-grey-light rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500 bg-orange"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[13px] text-text-secondary min-w-[24px] text-right font-bold">
                                            {goal.current}/{goal.total}
                                        </span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 flex-shrink-0 drop-shadow-md transition-all duration-300 ${isCompleted ? 'scale-110 brightness-110' : 'opacity-80'}`}>
                                    <img
                                        src={isCompleted ? "/chest-opened.svg" : "/chest-common.svg"}
                                        alt="Reward Chest"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-6 border-2 border-dashed border-grey-light rounded-2xl p-5 bg-grey relative">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-[16px] font-bold text-white/90 mb-1">Daily Quote</h3>
                    </div>
                </div>

                <p className="text-[15px] font-medium text-white/90 italic mb-3 leading-relaxed">
                    "{quote}"
                </p>

                <div className="flex justify-end items-center">
                    <div className="flex items-center gap-2 text-blue-light cursor-pointer hover:opacity-80 transition-opacity">
                        <img src="/ai-main.svg" alt="AI Assistant" className="w-5 h-5 mb-1" />
                        <span className="text-[13px] font-bold">Coddy's AI Assistant</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
