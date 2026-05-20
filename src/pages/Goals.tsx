import { useEffect, useState } from 'react';
import programmingQuotes from './quotes.json';

const GOALS = [
    { title: "Get 2 perfect completions", current: 0, total: 2 },
    { title: "Complete 5 exercises", current: 0, total: 5 },
    { title: "Earn 70 XP", current: 0, total: 70 },
];

export const Goals = () => {
    const [quote, setQuote] = useState<string>("No quote today ( Sry");

    useEffect(() => {
        document.title = "Goals - Koddy";

        if (programmingQuotes && programmingQuotes.length > 0) {
            const currentDayTimestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            const quoteIndex = currentDayTimestamp % programmingQuotes.length;

            const todayQuote = programmingQuotes[quoteIndex];

            setQuote(`${todayQuote.en}`);
        }
    }, []);

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-[20px] font-bold text-white">Daily Goals</h1>
                <div className="flex items-center px-4 py-1.5 rounded-full border-2 border-blue-light bg-transparent">
                    <span className="text-[16px] font-bold text-blue-light">Time left: 24 hours</span>
                </div>
            </div>

            <div className="flex flex-col mb-8">
                {GOALS.map((goal, index) => (
                    <div key={index} className="flex justify-between items-center py-5 border-b-2 border-grey/80 last:border-0">
                        <div className="flex-1 pr-6">
                            <h4 className="text-[15px] text-white/90 mb-3">{goal.title}</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-grey-light rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange rounded-full"
                                        style={{ width: `${(goal.current / goal.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[13px] text-text-secondary min-w-[24px] text-right">
                                    {goal.current}/{goal.total}
                                </span>
                            </div>
                        </div>
                        <div className="w-12 h-12 flex-shrink-0 drop-shadow-md">
                            <img src="/chest-common.svg" alt="Reward Chest" className="w-full h-full object-contain" />
                        </div>
                    </div>
                ))}
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
