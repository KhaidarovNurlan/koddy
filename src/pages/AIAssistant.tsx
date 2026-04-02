import { useEffect } from 'react';

export function AIAssistant() {
    useEffect(() => {
        document.title = "AI Assistant - Koddy";
    }, []);

    const features = [
        {
            title: "Immediate Feedback",
            description: "Provides immediate feedback and support to help you overcome coding challenges."
        },
        {
            title: "Personalized Insights",
            description: "Personalized insights based on your code attempts and learning history."
        },
        {
            title: "Time-saving Tool",
            description: "Saves time and frustration by quickly pinpointing errors and providing helpful hints."
        },
        {
            title: "Faster Learning",
            description: "Helps you master coding concepts faster and more efficiently."
        },
        {
            title: "24/7 Availability",
            description: "Available 24/7 so you can get assistance whenever you need it."
        },
        {
            title: "Game-changing Innovation",
            description: "The first of its kind in the online coding learning area, giving you a unique advantage in your coding education."
        },
        {
            title: "Complementary Support",
            description: "Complements the existing support provided by Koddy's human experts, ensuring that you always have access to the help you need."
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-transparent">
            <section className="py-12 md:py-24 flex flex-col items-center px-4">
                <h1 className="text-[36px] sm:text-[46px] md:text-[56px] font-bold text-white mb-4 tracking-tight leading-tight">
                    Koddy's <span className="relative inline-block px-6 py-2 text-white whitespace-nowrap z-10">
                        <img src="/bold-special-dark.svg" className="absolute inset-0 w-full h-full object-fill -z-10 pointer-events-none" alt="" />
                        AI Assistant
                    </span>
                </h1>
                <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-white mb-20 tracking-tight leading-tight">
                    Your <span className="border-b-[3px] border-dotted border-gray-400 pb-1">Personalized</span> learning companion.
                </h2>
            </section>

            <section className="bg-[#1e1e1e] w-full py-16 md:py-24 px-4 flex flex-col items-center">
                <div className="max-w-2xl mx-auto mb-10 text-center md:text-left w-full">
                    <p className="text-gray-200 text-base md:text-[20px] leading-relaxed text-center">
                        Our AI assistant provides <strong className="font-semibold text-white">personalized</strong> and <strong className="font-semibold text-white">real-time</strong> assistance<br className="hidden sm:block" />
                        to help you overcome any coding challenge.
                    </p>
                </div>

                <div className="mb-10 relative flex justify-center">
                    <img
                        src="/ask-ai-button.png"
                        alt="Ask AI Button"
                        className="w-[220px] md:w-[240px] hover:scale-105 transition-transform cursor-pointer relative z-10"
                    />
                </div>

                <div className="max-w-xl mx-auto mb-20 md:mb-28 text-center w-full">
                    <p className="text-gray-200 text-[18px] sm:text-[20px] leading-relaxed">
                        <strong className="font-semibold text-white">With just a click of a button</strong>, you can ask for help and get<br className="hidden sm:block" />
                        immediate insights on how to solve your problem.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-0 max-w-4xl mx-auto mb-8 md:mb-16 w-full">
                    <div className="flex flex-col items-center text-center max-w-[240px] w-full">
                        <div className="h-24 md:h-28 w-full flex items-center justify-center mb-4 md:mb-6">
                            <img src="/ai-analyze.svg" className="w-[100px] h-[100px] object-contain" alt="Analyze code attempt" />
                        </div>
                        <p className="text-[12px] md:text-[14px] text-text-secondary leading-relaxed px-2">
                            Analyzes your latest code attempt and the context of the lesson and challenge.
                        </p>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-start pt-14 w-20 lg:w-32 flex-shrink-0">
                        <div className="w-full relative flex items-center">
                            <div className="w-full border-t border-dashed border-[#4B4E53]"></div>
                            <div className="w-2 h-2 border-t border-r border-[#4B4E53] transform rotate-45 absolute right-0"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center max-w-[240px] w-full mt-6 md:mt-0">
                        <div className="h-24 md:h-28 w-full flex items-center justify-center mb-4 md:mb-6">
                            <img src="/ai-assistant.svg" className="w-[180px] h-[180px] object-contain" alt="AI Assistant" />
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-start pt-14 w-20 lg:w-32 flex-shrink-0">
                        <div className="w-full relative flex items-center">
                            <div className="w-full border-t border-dashed border-[#4B4E53]"></div>
                            <div className="w-2 h-2 border-t border-r border-[#4B4E53] transform rotate-45 absolute right-0"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center max-w-[240px] w-full mt-6 md:mt-0">
                        <div className="h-24 md:h-28 w-full flex items-center justify-center mb-4 md:mb-6">
                            <img src="/ai-provide-feedback.svg" className="w-[100px] h-[100px] object-contain" alt="Provide Feedback" />
                        </div>
                        <p className="text-[12px] md:text-[14px] text-text-secondary leading-relaxed px-2">
                            Provides personalized feedback and insights to help you overcome coding challenges.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mb-12 md:mb-16 w-full">
                    <p className="text-white text-center text-[18px] md:text-[20px] leading-relaxed">
                        Whether you're a beginner or an experienced coder, the Koddy<br className="hidden md:block" />
                        AI Assistant is a game-changer that can help you master<br className="hidden md:block" />
                        coding concepts faster and more efficiently.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto w-full mb-10">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-[#2B2D2F] border border-[#3C3E42] rounded-xl p-6 md:p-8 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)] text-center flex flex-col items-center justify-start transition-colors hover:bg-[#323438]"
                            >
                                <h3 className="text-white font-bold text-[16px] md:text-[18px] mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-[13px] md:text-[14px] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
