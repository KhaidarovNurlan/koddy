import { useEffect } from 'react';

export const Leaderboard = () => {
    useEffect(() => {
        document.title = "Leaderboard - Koddy";
    }, []);

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <div className="flex items-center justify-center gap-3 mb-8">
                <img src="/locked.svg" alt="Locked" className="w-12 h-12 grayscale" />
                <img src="/locked.svg" alt="Locked" className="w-16 h-16 grayscale" />
                <img src="/locked.svg" alt="Locked" className="w-20 h-20" />
                <img src="/locked.svg" alt="Locked" className="w-16 h-16 grayscale" />
                <img src="/locked.svg" alt="Locked" className="w-12 h-12 grayscale" />
            </div>

            <h2 className="text-text-secondary text-[20px] font-semibold mb-20 text-center">
                Reach 100 XP to unlock leaderboards!
            </h2>

            <div className="mx-auto w-full max-w-[500px] flex flex-col gap-6">
                <div className="flex items-center gap-5 px-6">
                    <div className="w-2 h-2 rounded-full bg-grey-light/20 flex-shrink-0"></div>
                    <div className="w-10 h-10 rounded-full bg-grey-light/20 flex-shrink-0"></div>
                    <div className="h-3.5 bg-grey-light/20 rounded-full w-28"></div>
                    <div className="flex-1"></div>
                    <div className="h-3.5 bg-grey-light/20 rounded-full w-12"></div>
                </div>
                <div className="flex items-center gap-5 px-6">
                    <div className="w-2 h-2 rounded-full bg-grey-light/35 flex-shrink-0"></div>
                    <div className="w-10 h-10 rounded-full bg-grey-light/35 flex-shrink-0"></div>
                    <div className="h-3.5 bg-grey-light/35 rounded-full w-16"></div>
                    <div className="flex-1"></div>
                    <div className="h-3.5 bg-grey-light/35 rounded-full w-12"></div>
                </div>
                <div className="flex items-center gap-5 px-6">
                    <div className="w-2 h-2 rounded-full bg-grey-light/75 flex-shrink-0"></div>
                    <div className="w-10 h-10 rounded-full bg-grey-light/50 flex-shrink-0"></div>
                    <div className="h-3.5 bg-grey-light/50 rounded-full w-20"></div>
                    <div className="flex-1"></div>
                    <div className="h-3.5 bg-grey-light/50 rounded-full w-12"></div>
                </div>
                <div className="flex items-center gap-5 px-6">
                    <div className="w-2 h-2 rounded-full bg-grey-light/75 flex-shrink-0"></div>
                    <div className="w-10 h-10 rounded-full bg-grey-light/75 flex-shrink-0"></div>
                    <div className="h-3.5 bg-grey-light/75 rounded-full w-24"></div>
                    <div className="flex-1"></div>
                    <div className="h-3.5 bg-grey-light/75 rounded-full w-12"></div>
                </div>
                <div className="flex items-center gap-5 px-6">
                    <div className="w-2 h-2 rounded-full bg-grey-light/90 flex-shrink-0"></div>
                    <div className="w-10 h-10 rounded-full bg-grey-light/90 flex-shrink-0"></div>
                    <div className="h-3.5 bg-grey-light/90 rounded-full w-22"></div>
                    <div className="flex-1"></div>
                    <div className="h-3.5 bg-grey-light/90 rounded-full w-12"></div>
                </div>

                <div className="flex items-center gap-5 bg-grey rounded-2xl p-4 mt-2 px-6 shadow-sm">
                    <div className="text-text-secondary font-bold text-base w-2 text-center flex-shrink-0 flex justify-center">-</div>
                    <img src="/avatar_placeholder.png" alt="User Avatar" className="w-10 h-10 rounded-full bg-avatar-bg-default object-cover flex-shrink-0" />
                    <div className="text-white/90 font-medium text-[15px] flex-1">Username</div>
                    <div className="text-blue-light font-bold text-[15px]">0 XP</div>
                </div>
            </div>
        </div>
    );
};
