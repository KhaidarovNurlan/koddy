import { useEffect } from 'react';

export const Projects = () => {
    useEffect(() => {
        document.title = "My Projects - Koddy";
    }, []);

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <div className="mb-8">
                <h1 className="text-[20px] font-bold text-white mb-1">My Projects</h1>
                <p className="text-text-secondary text-[15px] font-medium">Build, experiment, and bring your ideas to code</p>
            </div>

            <div className="bg-grey border-3 border-grey-light rounded-xl p-4 relative overflow-hidden flex items-start min-h-[140px]">
                <div className="flex-1 z-10 relative">
                    <h3 className="text-[18px] font-bold text-white mb-1">Projects are locked</h3>
                    <p className="text-text-secondary text-[16px] font-medium">Earn 300 XP to unlock Projects!</p>
                </div>

                <div className="absolute right-6 -bottom-6 w-24 h-24 z-0">
                    <img
                        src="/projects.svg"
                        alt="Projects locked"
                        className="w-full h-full object-contain drop-shadow-lg opacity-90"
                    />
                </div>
            </div>
        </div>
    );
};
