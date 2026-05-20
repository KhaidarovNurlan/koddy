import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function User() {
    const { username } = useParams();

    useEffect(() => {
        document.title = `${username}'s Profile - Koddy`;
    }, [username]);

    return (
        <div className="mb-8 bg-grey-dark py-12 px-6 flex items-center justify-center">
            <div className="flex-1 p-8 max-w-[700px] overflow-y-auto">
                <div className="bg-avatar-bg-default h-72 rounded-2xl relative">
                    {/* There will be a div with title image */}
                    {/* <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/50 rounded-xl flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                        <img src="/no-journey.svg" alt="Add Title" className="w-8 h-8 opacity-80" />
                    </div> */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-avatar-bg-default rounded-[40px] flex items-center justify-center">
                        <img
                            src="/avatar_placeholder.png"
                            alt="Avatar Placeholder"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="bg-grey-dark rounded-b-2xl pt-8 pb-6 px-8 mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Username</h2>
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
                                <span className="font-bold text-md text-white">0</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
